# -*- coding: utf-8 -*-
"""
客户询价单"公制换算 + 按产品分类重排"副本（原表格式完全不变）：
  * 底稿＝客户原表 Sheet2，版式 100% 保留：工作表名、32 列结构、合并单元格、
    行高列宽、边框、内嵌图片 36 张（图片随产品行一起移动）。
  * 不新增列、不改原有文字：只在含英寸/英尺的原文行下面紧跟一行公制版（mm/cm/m）。
  * 按产品用途分类，把同类产品排在一起（同组内保持客户原表顺序）；
    每组首行的 C 单元格顶部加一行【分类】标签，便于识别分组，不影响任何原文。
  * 型号、年销量、目标价、包装方式、温度等客户数据一律原样。

输出：客户业务/报价/Roofing-Shootout/客户询价单-公制版副本_Roofing-Shootout_260922.xlsx
    Sheet2            —— 原表格式 + 公制换算 + 按分类重排
    产品分类对照       —— 分类定义与分组清单
    英制-公制换算表    —— 全部长度尺寸逐项换算明细
"""

import hashlib
import os
import re
import sys
from copy import copy
from datetime import date
from decimal import Decimal, ROUND_HALF_UP
from fractions import Fraction

import openpyxl
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side

SRC_DEFAULT = "/Users/chengzhi/workspace/mingze/客户业务/报价/Roofing-Shootout/Roofing Shootout Quotation Sheet 260922.xlsx"
WORKSPACE = "/Users/chengzhi/workspace/mingze"
OUT_DIR = os.path.join(WORKSPACE, "客户业务/报价/Roofing-Shootout")
OUT_NAME = "客户询价单-公制版副本_Roofing-Shootout_260922.xlsx"

SRC_SHEET = "Sheet2"
DATA_FIRST, DATA_LAST = 8, 25

# ---- 分类方案（按产品用途；组内保持客户原表顺序）----
CATEGORIES = [
    ("① 露台 / 搁栅结构泛水带", [8, 11, 12, 14]),
    ("② 门窗泛水胶带", [9, 10, 15, 16, 25]),
    ("③ 屋顶 / 檐槽修补胶带与修补片", [17, 20, 21, 22, 23]),
    ("④ EPDM 修补胶带", [18, 19]),
    ("⑤ 丁基胶带与密封条", [13, 24]),
]
ORDER = [r for _, rows in CATEGORIES for r in rows]          # 新行顺序（原表行号）
CAT_OF = {r: name for name, rows in CATEGORIES for r in rows}
CAT_DESC = {
    "① 露台 / 搁栅结构泛水带": "用于木/复合露台搁栅、横梁板、立柱的结构泛水（Deck Joist / Ledger Board & Post Flashing），丁基胶系，含 1551417 客户重复行。",
    "② 门窗泛水胶带": "门窗洞口泛水（Window & Door Flashing Tape），丁基类与橡胶化沥青类，含柔性沥青可贴拱形门窗款。",
    "③ 屋顶 / 檐槽修补胶带与修补片": "屋面与檐槽破损修补（Roof & Gutter Repair），TPO 面黑/白、铝面、透明膜、檐槽密封修补片。",
    "④ EPDM 修补胶带": "全硫化 EPDM 橡胶膜 + 丁基胶的白色/黑色修补胶带（材料体系与前一类不同，故单列）。",
    "⑤ 丁基胶带与密封条": "通用丁基胶带（宽×厚×长）与自粘泡沫门槛密封条，属辅材类，不属于成卷泛水/修补胶带。",
}

DIM_RE = re.compile(
    r"(?:(\d+)\s+(\d+)/(\d+)|(\d+)-(\d+)/(\d+)|(\d+)/(\d+)|(\d+\.\d+)|(\d+))"
    r"\s*(?:\"|”|″|英寸|'|’|′|英尺)"
)
CJK_RE = re.compile(r"[\u4e00-\u9fff]")
FOOT_UNITS = ("'", "’", "′", "英尺")
UNIT_CN = {"mm": "毫米", "cm": "厘米", "m": "米"}

F_BASE = Font(name="Arial", size=10)
F_BOLD = Font(name="Arial", size=10, bold=True)
A_WRAP = Alignment(horizontal="center", vertical="center", wrap_text=True)
THIN = Side(style="thin", color="000000")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)

HDR_ADD = {                       # 第 6 行：原表写 in Inches，下面补公制单位说明
    10: "\n主箱包装信息（单位：厘米 cm）",
    15: "\n内盒包装信息（单位：厘米 cm）",
    20: "\n零售包装信息（单位：厘米 cm）",
    26: "\n托盘或滑托板信息（单位：厘米 cm）",
}
FIELD_ADD = {}
for _g in (10, 15, 20, 26):       # 第 7 行：Height / Width / Depth 补公制单位
    FIELD_ADD[_g] = "\n高度（厘米）"
    FIELD_ADD[_g + 1] = "\n宽度（厘米）"
    FIELD_ADD[_g + 2] = "\n深度 / 厚度（厘米）"


# ---------------- 换算 ----------------
def parse_token(m):
    g = m.groups()
    if g[0] is not None:
        return Fraction(int(g[0])) + Fraction(int(g[1]), int(g[2]))
    if g[3] is not None:
        return Fraction(int(g[3])) + Fraction(int(g[4]), int(g[5]))
    if g[6] is not None:
        return Fraction(int(g[6]), int(g[7]))
    if g[8] is not None:
        return Fraction(g[8])
    return Fraction(int(g[9]))


def is_foot(raw):
    return any(u in raw for u in FOOT_UNITS)


def _dec(fr):
    return Decimal(fr.numerator) / Decimal(fr.denominator)


def fmt(x, nd=2):
    d = x if isinstance(x, Decimal) else Decimal(str(x))
    q = d.quantize(Decimal(1).scaleb(-nd), rounding=ROUND_HALF_UP)
    s = f"{q:.{nd}f}".rstrip("0").rstrip(".")
    return s or "0"


def metric(v, foot):
    if foot:
        return fmt(_dec(v) * Decimal("30.48") / 100, 2), "m"
    cm = _dec(v) * Decimal("2.54")
    if cm < 1:
        return fmt(_dec(v) * Decimal("25.4"), 2), "mm"
    return fmt(cm, 2), "cm"


def _parts(text):
    out = []
    for m in DIM_RE.finditer(text):
        val, sym = metric(parse_token(m), is_foot(m.group(0)))
        tail = text[m.end(): m.end() + 2]
        label = tail[0].upper() if tail and tail[0] in "WHLwhl" else ""
        out.append((f"{val} {sym}" + (f" ({label})" if label else ""), m, label))
    return out


def size_metric(text):
    """只取尺寸部分的公制表达式，如 '10.16 cm × 10.06 m'。"""
    return " × ".join(p[0] for p in _parts(text))


def convert_en(text):
    ps = _parts(text)
    if not ps:
        return text, 0
    ms = [p[1] for p in ps]
    end = ms[-1].end()
    last_label = ps[-1][2]
    if last_label and text[ms[-1].end(): ms[-1].end() + 1].upper() == last_label:
        end = ms[-1].end() + 1
    return text[: ms[0].start()] + " × ".join(p[0] for p in ps) + text[end:], len(ps)


def convert_cn(text):
    n = 0

    def repl(m):
        nonlocal n
        n += 1
        val, sym = metric(parse_token(m), is_foot(m.group(0)))
        return f"{val}{UNIT_CN[sym]}"

    return DIM_RE.sub(repl, text), n


def convert_line(line):
    if not DIM_RE.search(line):
        return line, 0
    return convert_cn(line) if CJK_RE.search(line) else convert_en(line)


def convert_cell(value):
    """原内容逐行保留；含英寸/英尺的行，其下紧跟该行的公制版。"""
    out, added = [], 0
    for ln in (value or "").split("\n"):
        out.append(ln)
        conv, n = convert_line(ln)
        if n:
            out.append(conv)
            added += n
    return "\n".join(out), added


def build(src=SRC_DEFAULT):
    with open(src, "rb") as fh:
        src_sha = hashlib.sha256(fh.read()).hexdigest()

    wb = openpyxl.load_workbook(src, data_only=True)   # 直接改副本 → 版式/图片全保留
    assert wb.sheetnames == [SRC_SHEET], wb.sheetnames
    ws = wb[SRC_SHEET]

    # ---------- 1) 表头补公制单位说明（原文保留） ----------
    for col, add in HDR_ADD.items():
        ws.cell(6, col).value = (ws.cell(6, col).value or "") + add
    for col, add in FIELD_ADD.items():
        ws.cell(7, col).value = (ws.cell(7, col).value or "") + add

    # ---------- 2) 原文行下面追加公制行 ----------
    orig_c, orig_d = {}, {}
    for r in range(DATA_FIRST, DATA_LAST + 1):
        for col in (3, 4):
            old = ws.cell(r, col).value
            (orig_c if col == 3 else orig_d)[r] = old or ""
            if old and DIM_RE.search(old):
                ws.cell(r, col).value = convert_cell(old)[0]

    # ---------- 3) 按分类重排数据行（值/样式/行高/图片整体搬移）----------
    snap = {}
    for s in ORDER:
        snap[s] = {
            "vals": [ws.cell(s, c).value for c in range(1, ws.max_column + 1)],
            "styles": [copy(ws.cell(s, c)._style) for c in range(1, ws.max_column + 1)],
            "height": ws.row_dimensions[s].height,
        }
    img_by_row = {}
    for im in ws._images:
        img_by_row.setdefault(im.anchor._from.row + 1, []).append(im)

    for i, s in enumerate(ORDER):
        t = DATA_FIRST + i
        for c in range(1, ws.max_column + 1):
            cell = ws.cell(t, c)
            cell.value = snap[s]["vals"][c - 1]
            cell._style = snap[s]["styles"][c - 1]
        ws.row_dimensions[t].height = snap[s]["height"]
        for im in img_by_row.get(s, []):
            im.anchor._from.row = t - 1      # 图片随产品行一起移动

    # ---------- 4) 每组首行 C 单元格顶部加【分类】标签（仅新增一行，原文不动）----------
    for name, rows in CATEGORIES:
        t = DATA_FIRST + ORDER.index(rows[0])
        c = ws.cell(t, 3)
        c.value = f"【分类】{name}\n{c.value}"
        c.alignment = Alignment(horizontal="left", vertical="top", wrap_text=True)

    # ---------- 5) 附表一：产品分类对照 ----------
    ws1 = wb.create_sheet("产品分类对照")
    ws1["A1"] = "按产品分类重排说明（主表 Sheet2 行 8–25）"
    ws1["A1"].font = Font(name="Arial", size=12, bold=True)
    ws1["A2"] = ("分类依据＝产品用途/功能；同一分类内保持客户原表原有顺序；只调整行序，未改动客户任何数据。"
                 "　客户询价单表头要求「按价格升序」，本次未按价格重排，如需价格升序版可另出。")
    ws1["A2"].font = Font(name="Arial", size=10, italic=True)
    ws1.merge_cells("A2:H2")
    ws1.row_dimensions[2].height = 30
    r = 4
    ws1.cell(r, 1, "分类").font = F_BOLD
    ws1.cell(r, 2, "分组说明").font = F_BOLD
    ws1.cell(r, 3, "行数").font = F_BOLD
    r += 1
    for name, rows in CATEGORIES:
        ws1.cell(r, 1, name).font = F_BASE
        ws1.cell(r, 2, CAT_DESC[name]).font = F_BASE
        ws1.cell(r, 3, len(rows)).font = F_BASE
        for cc in (1, 2, 3):
            ws1.cell(r, cc).alignment = Alignment(vertical="top", wrap_text=True)
            ws1.cell(r, cc).border = BORDER
        ws1.row_dimensions[r].height = 46
        r += 1
    r += 1
    hdr = ["新行号", "分类", "原表行", "Model #/SKU", "产品名称（中文）",
           "公制尺寸", "预计年销量", "客户目标价 USD"]
    for i, h in enumerate(hdr, start=1):
        c = ws1.cell(r, i, h)
        c.font = F_BOLD
        c.alignment = A_WRAP
        c.border = BORDER
        c.fill = PatternFill("solid", fgColor="F2F2F2")
    hdr_row = r
    r += 1
    for i, s in enumerate(ORDER):
        t = DATA_FIRST + i
        cn_name = next((l.strip() for l in orig_c[s].split("\n") if CJK_RE.search(l)), "")
        qty = orig_d.get(s) and None
        q = ws.cell(t, 6).value
        qty = str(q).split("\n")[0] if q is not None else ""
        en_line = next((l for l in orig_c[s].split("\n") if not CJK_RE.search(l)), "")
        vals = [t, CAT_OF[s], s, ws.cell(t, 2).value, cn_name,
                size_metric(en_line), qty, ws.cell(t, 7).value]
        for ci, v in enumerate(vals, start=1):
            c = ws1.cell(r, ci, v)
            c.font = F_BASE
            c.alignment = A_WRAP
            c.border = BORDER
        ws1.cell(r, 8).number_format = '"$"#,##0.00'
        ws1.row_dimensions[r].height = 30
        r += 1
    for col, w in {"A": 8, "B": 30, "C": 8, "D": 13, "E": 42, "F": 24, "G": 14, "H": 14}.items():
        ws1.column_dimensions[col].width = w
    ws1.freeze_panes = f"A{hdr_row + 1}"

    # ---------- 6) 附表二：英制 → 公制换算明细 ----------
    ws2 = wb.create_sheet("英制-公制换算表")
    ws2["A1"] = "客户原表全部长度尺寸：英制 → 公制 换算明细"
    ws2["A1"].font = Font(name="Arial", size=12, bold=True)
    ws2["A2"] = ("换算基准：1 in = 2.54 cm = 25.4 mm（精确值）；1 ft = 12 in = 30.48 cm = 0.3048 m。"
                 "　单位选取：原值 < 1 cm 用毫米，其余英寸用厘米，英尺统一用米；未做任何取整或公差。")
    ws2["A2"].font = Font(name="Arial", size=10, italic=True)
    ws2.merge_cells("A2:K2")
    ws2.row_dimensions[2].height = 18
    hdr2 = ["新行号", "原表行", "Model #/SKU", "原值", "原单位", "公制值",
            "公制单位", "厘米 cm", "毫米 mm", "米 m", "换算过程"]
    ws2.append([])
    ws2.append(hdr2)
    rows = []
    for i, s in enumerate(ORDER):
        t = DATA_FIRST + i
        for line in orig_c[s].split("\n"):
            if CJK_RE.search(line):
                continue
            for m in DIM_RE.finditer(line):
                raw = m.group(0).strip()
                v = parse_token(m)
                foot = is_foot(raw)
                cm = _dec(v * 12 if foot else v) * Decimal("2.54")
                val, sym = metric(v, foot)
                rows.append([t, s, ws.cell(t, 2).value, raw, "ft" if foot else "in",
                             val, sym, fmt(cm), fmt(cm * 10, 3), fmt(cm / 100, 4),
                             (f"{fmt(_dec(v), 4)} ft × 30.48 = {fmt(cm)} cm" if foot
                              else f"{fmt(_dec(v), 4)} in × 2.54 = {fmt(cm)} cm")])
    for row in rows:
        ws2.append(row)
    for i in range(1, len(hdr2) + 1):
        c = ws2.cell(4, i)
        c.font = F_BOLD
        c.alignment = A_WRAP
        c.border = BORDER
        c.fill = PatternFill("solid", fgColor="F2F2F2")
    for row in ws2.iter_rows(min_row=5, max_row=4 + len(rows), max_col=len(hdr2)):
        for c in row:
            c.font = F_BASE
            c.alignment = A_WRAP
            c.border = BORDER
    for col, w in {"A": 8, "B": 8, "C": 13, "D": 18, "E": 9, "F": 10,
                   "G": 10, "H": 11, "I": 11, "J": 12, "K": 32}.items():
        ws2.column_dimensions[col].width = w
    ws2.freeze_panes = "A5"
    n = 4 + len(rows)
    notes = [
        "说明：",
        "1) 主表 Sheet2 保持客户原表格式不变（工作表名、列位、合并单元格、行高列宽、边框、36 张图片位置全部未动），不新增列、不改原有文字。",
        "2) 主表仅在含英寸/英尺的原文行下面追加一行该行的公制版；另按产品分类把同类产品排在一起（见「产品分类对照」）。",
        "3) 型号 SKU、包装方式、年销量、目标价、装运港、报价等客户数据一律原样未改。",
        "4) 华氏温度为温度而非尺寸，未换算（原表已自带 °C，复核正确）。",
        "5) 客户原表 J–AD 列（主箱/内盒/零售/托盘 尺寸）本来就是空的，无英寸数值可换算，保持留空；表头已补注「单位：厘米」。",
        "6) 原文件 SHA-256：%s；生成日期 %s；原文件未被修改。" % (src_sha, date.today().isoformat()),
    ]
    for i, t in enumerate(notes):
        c = ws2.cell(n + 2 + i, 1, t)
        c.font = F_BOLD if i == 0 else F_BASE
        c.alignment = Alignment(vertical="top", wrap_text=True)
        ws2.merge_cells(start_row=n + 2 + i, start_column=1, end_row=n + 2 + i, end_column=11)

    out = os.path.join(OUT_DIR, OUT_NAME)
    wb.save(out)
    return out, len(rows)


if __name__ == "__main__":
    src = sys.argv[1] if len(sys.argv) > 1 else SRC_DEFAULT
    out, n = build(src)
    print("written:", out)
    print("换算明细:", n, "条")
    for i, s in enumerate(ORDER):
        print(f"  新行 {DATA_FIRST + i:2d} ← 原表行 {s:2d} | {CAT_OF[s]}")

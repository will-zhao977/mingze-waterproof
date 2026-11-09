# -*- coding: utf-8 -*-
"""
客户询价单"文字版・中英文对照"（无图片）：
  * 数据全部来自客户原表：Roofing Shootout Quotation Sheet 260922.xlsx / Sheet2（数据行 8–25）。
  * 去掉全部图片（产品图 18 张 + 特性图 18 张）。
  * 原表中英文 Features 只存在于特性图里，已按原图逐条转录为文字，与中文特点并列，形成中英对照。
  * 英寸/英尺 → 公制（mm/cm/m）换算保留（1 in = 2.54 cm 精确）。
  * 按产品分类分组排列（同类相邻）。

输出：客户业务/报价/Roofing-Shootout/客户询价单-文字版中英文_Roofing-Shootout_260922.xlsx（单工作表，纯文字）
"""

import hashlib
import os
import re
import sys
from decimal import Decimal, ROUND_HALF_UP
from fractions import Fraction

import openpyxl
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side

SRC_DEFAULT = "/Users/chengzhi/workspace/mingze/客户业务/报价/Roofing-Shootout/Roofing Shootout Quotation Sheet 260922.xlsx"
WORKSPACE = "/Users/chengzhi/workspace/mingze"
OUT_DIR = os.path.join(WORKSPACE, "客户业务/报价/Roofing-Shootout")
OUT_NAME = "客户询价单-文字版中英文_Roofing-Shootout_260922.xlsx"
SRC_SHEET = "Sheet2"
DATA_FIRST, DATA_LAST = 8, 25

CATEGORIES = [
    ("① 露台 / 搁栅结构泛水带", "Deck Joist / Ledger Board & Post Flashing", [8, 11, 12, 14]),
    ("② 门窗泛水胶带", "Window & Door Flashing Tape", [9, 10, 15, 16, 25]),
    ("③ 屋顶 / 檐槽修补胶带与修补片", "Roof & Gutter Repair Tape & Patches", [17, 20, 21, 22, 23]),
    ("④ EPDM 修补胶带", "EPDM Repair Tape", [18, 19]),
    ("⑤ 丁基胶带与密封条", "Butyl Tape & Sealers", [13, 24]),
]
ORDER = [r for _, _, rows in CATEGORIES for r in rows]

# 原表特性图（英文 Features）逐条转录；同一张图被两行复用的，内容相同
DECK_BASIC = [
    "Quick and easy self-stick installation",
    "Keeps out moisture",
    "Seals around screws and nails",
    "Super aggressive adhesive",
    "Slip resistant",
    "Can be used with all types of lumber",
    "Use on new construction or existing substructure",
]
ASPHALT_BASIC = [
    "Provides protection against structural damage caused by moisture infiltration",
    "Seals 2 average-sized windows",
    "Can be applied in temperatures above 35 degrees Fahrenheit",
    "Polyester film and rubberized asphalt adhesive",
]
TPO_REPAIR = [
    "Self-adhesive for easy application",
    "Has a remarkable bonding property with new Steel-Loc adhesive",
    "Permanently repairs: EPDM, TPO, Metal, Modified Asphalt, Vinyl, Fiberglass, "
    "Aged & Rigid PVC, OSB, Rigid Extruded Polystyrene, Wood and Tile.",
    "Prevent or stop water damage",
    "100% UV Stable",
    "Guaranteed not to crack, harden or shrink",
    "Can be installed to temperatures as low as 25 degrees F without the need for primer",
]
EPDM_REPAIR = [
    "Fully cured EPDM rubber membrane",
    "Easy peel & stick application",
    "Lasts for years",
    "Made in the USA",
]
FEATURES_EN = {
    8: DECK_BASIC + ['1-5/8" x 50\''],
    11: DECK_BASIC + ['1-5/8" x 50\''],
    12: DECK_BASIC + ['4" x 75 ft.'],
    14: DECK_BASIC + ['12" x 25 ft.'],
    9: [
        "Can be applied down to -20° F and aggressively adheres to wood, OSB, aluminum, vinyl, "
        "house-wrap, steel, drywall, and more",
        "Eliminates drafts and keeps out moisture",
        "Can be installed on damp surfaces",
        "Steel-Loc® ultra butyl adhesive laminated to a polyethylene film",
    ],
    10: ASPHALT_BASIC,
    15: ASPHALT_BASIC,
    16: [
        "Can conform to the shape of arched windows and doors",
        "Provides protection against structural damage caused by moisture infiltration",
        "Can be applied in temperatures above 35 degrees Farenheit",
        "Creped surface and rubberized asphalt adhesive",
    ],
    25: [
        "Provides protection against structural damage caused by moisture infiltration",
        "Can conform to the shape of arched windows and doors",
        "Can be applied in temperatures above 35 degrees Fahreheit",
        "Creped surface and rubberized asphalt",
    ],
    17: ["Black TPO Surface"] + TPO_REPAIR,
    20: ["White TPO Surface"] + TPO_REPAIR,
    18: [
        "Fully cured EPDM rubber membrane",
        "Super strong white butyl adhesive",
        "Easy peel & stick application",
        "Stops leaks in EPDM rubber, TPO, Hypalon, Modified Asphalt and Metal surfaces",
        "Lasts for years",
        "Made in the USA",
    ],
    19: [
        "Fully cured EPDM rubber membrane",
        "Super strong black butyl adhesive",
        "Easy peel & stick application",
        "Stops leaks in EPDM Rubber, TPO, Hypalon, Modified Asphalt and Metal surfaces",
        "Lasts for years",
        "Made in the USA",
    ],
    21: [
        "Self-adhesive for easy application",
        "100% UV Stable",
        "Super reinforced",
        "Puncture resistant",
        "Prevent or stop water damage",
        "Self-seals around screws and fasteners",
    ],
    22: [
        "Self-adhesive for easy application",
        "Stops leaks and covers holes",
        "Super reinforced white aluminum surface",
        "Easily painted to match other colors",
        "Lasts for years",
    ],
    13: [
        "3/8-in wide x 3/32-in thick x 45-ft long",
        "Seals out air and moisture in metal structures",
        "Use on steel panels, trim, flashing, and around windows or doors",
        "Non-drying; will not stain",
        "For best results, ensure surface is clean, dry and free of glue. "
        "Ideal application temperature is -4 degrees F to 113 degrees F.",
        "Manufacturer may vary",
    ],
    23: [
        "Clear Patches for almost invisible repairs",
        "Stops Leaks Instantly",
        "Super strong adhesive",
        "Sticks to almost everything",
        "Made in the USA",
    ],
    24: [
        "Provides protection against structural damage caused by moisture infiltration",
        "For use on wood, metal, or concrete",
        "Keeps out drafts, moisture, and wind-driven rain",
        "Rubberized asphalt adhesive",
    ],
}

# 包装方式中英对照（原表 E 列只有英文，中文为对照译文）
PACK_CN = {
    "Packaging: color label + PDQ cut case": "包装：彩标 + PDQ 零售展示切箱",
    "PVC packaged": "PVC 包装",
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
F_TITLE = Font(name="Arial", size=14, bold=True)
F_SUB = Font(name="Arial", size=9, italic=True)
A_WRAP = Alignment(horizontal="left", vertical="top", wrap_text=True)
A_CTR = Alignment(horizontal="center", vertical="center", wrap_text=True)
THIN = Side(style="thin", color="000000")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
BAND = PatternFill("solid", fgColor="D9D9D9")
HEAD = PatternFill("solid", fgColor="F2F2F2")


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


def size_parts(text):
    """返回 [(显示文本, 匹配对象, 标签)]。"""
    out = []
    for m in DIM_RE.finditer(text):
        val, sym = metric(parse_token(m), is_foot(m.group(0)))
        tail = text[m.end(): m.end() + 2]
        label = tail[0].upper() if tail and tail[0] in "WHLwhl" else ""
        out.append((f"{val} {sym}" + (f" ({label})" if label else ""), m, label))
    return out


def split_en_cn(desc):
    lines = [ln.strip() for ln in (desc or "").split("\n") if ln.strip()]
    en, cn, start = "", "", None
    for i, ln in enumerate(lines):
        if CJK_RE.search(ln):
            start = i
            break
        en = (en + " " + ln).strip()
    if start is not None:
        cn = " ".join(lines[start:])
    return en, cn


def est_lines(text, width):
    if text in (None, ""):
        return 1
    total = 0
    for para in str(text).split("\n"):
        eff = sum(2 if ord(ch) > 0x2E80 else 1 for ch in para)
        total += max(1, -(-eff // max(1, int(width))))
    return total


def build(src=SRC_DEFAULT):
    with open(src, "rb") as fh:
        src_sha = hashlib.sha256(fh.read()).hexdigest()
    sws = openpyxl.load_workbook(src, data_only=True)[SRC_SHEET]

    rows_data = []
    for s in ORDER:
        desc = sws.cell(s, 3).value or ""
        en, cn = split_en_cn(desc)
        parts = size_parts(en)
        size_src = en[parts[0][1].start(): parts[-1][1].end()].strip() if parts else ""
        # 末尾若带 W/H/L 后缀，一并纳入原值显示
        if parts and parts[-1][2] and en[parts[-1][1].end(): parts[-1][1].end() + 1].upper() == parts[-1][2]:
            size_src = en[parts[0][1].start(): parts[-1][1].end() + 1].strip()
        spec_cn = "\n".join(ln.strip() for ln in (sws.cell(s, 4).value or "").split("\n") if ln.strip())
        q = sws.cell(s, 6).value
        qtxt = str(q).split("\n")[0].strip() if q is not None else ""
        qnote = " ".join(str(q).split("\n")[1:]).strip() if q is not None and "\n" in str(q) else ""
        remark = [f"原表第 {s} 行"]
        if s in (8, 11):
            other = 11 if s == 8 else 8
            remark.append(f"与本表第 {ORDER.index(other) + 1} 项同 SKU 1551417（客户原表第 {other} 行为同一产品的重复行），建议与客户确认是否合并")
        if qnote:
            remark.append(f"客户 F 列备注：{qnote}")
        en_bullets = FEATURES_EN[s]
        cn_bullets = [ln for ln in spec_cn.split("\n") if ln.strip()]
        pairs = []
        for i, b in enumerate(en_bullets):
            pairs.append("• " + b)
            if i < len(cn_bullets):
                pairs.append("    · " + cn_bullets[i])
        for extra in cn_bullets[len(en_bullets):]:
            pairs.append("    · " + extra)
        pack_en = (sws.cell(s, 5).value or "").strip()
        pack_pair = pack_en + ("\n" + PACK_CN[pack_en] if pack_en in PACK_CN else "")
        rows_data.append(dict(
            src=s, sku=sws.cell(s, 2).value, en=en, cn=cn, size_src=size_src,
            size_metric=" × ".join(p[0] for p in parts),
            name_pair=en + ("\n" + cn if cn else ""),
            size_pair=size_src + ("\n" + " × ".join(p[0] for p in parts) if parts else ""),
            feat_pair="\n".join(pairs) if pairs else "",
            pack_pair=pack_pair, pack=pack_en, qty=qtxt,
            target=sws.cell(s, 7).value, remark="；".join(remark),
        ))

    # ---------------- 写工作簿 ----------------
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "询价单（无图·中英文）"
    ws.sheet_view.showGridLines = False

    widths = [6, 12, 46, 30, 96, 26, 16, 14, 14, 40]
    for i, w in enumerate(widths, start=1):
        ws.column_dimensions[openpyxl.utils.get_column_letter(i)].width = w
    LAST = len(widths)

    ws["A1"] = "客户询价单（文字版・中英文对照）  Customer RFQ — Text Only (Bilingual)"
    ws["A1"].font = F_TITLE
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=LAST)
    ws.row_dimensions[1].height = 24

    notes_top = [
        "来源：Roofing Shootout Quotation Sheet 260922.xlsx（原表 Sheet2，数据行 8–25，共 18 个询价行）｜本次已移除全部图片（产品图 18 张 + 特性图 18 张），只保留文字。",
        "英文特点 Features：原表中英文特点只存在于特性图片内，本表已按原图逐条转录为文字（保留原图原有拼写），与中文特点并列，供中英对照；如与客户原图有出入，以原图为准。",
        "单位换算：1 in = 2.54 cm = 25.4 mm（精确）；1 ft = 12 in = 30.48 cm = 0.3048 m。原值 < 1 cm 用毫米，其余英寸用厘米，英尺用米；未取整。",
        "分类：按产品用途分组，同类相邻；组内保持客户原表顺序。型号、年销量、目标价等客户数据一律原样未改。",
        "排版：产品名称、规格尺寸、产品特点、包装方式 4 项的对照内容各放在一个单元格内（英文/原文在上，中文/公制在下；特点逐条对照：• 英文、    · 中文），同一项目各占一列。",
        "缺口：原表 B1:B5 表头字段、H 列装运港、I 列报价、J–AD 列包装尺寸客户均留空；本表「供方报价」列为待填。",
    ]
    r = 2
    for t in notes_top:
        c = ws.cell(r, 1, t)
        c.font = F_SUB
        c.alignment = A_WRAP
        ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=LAST)
        ws.row_dimensions[r].height = 15 * max(1, est_lines(t, sum(widths)))
        r += 1

    r += 1
    ws.cell(r, 1, "客户表单头字段（原表 B1:B5，客户留空，由供方填写）Customer header fields")
    ws.cell(r, 1).font = F_BOLD
    ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=LAST)
    r += 1
    hdr_fields = ("Vendor Name 供应商名称＝待填　｜　Payment Terms 付款条件＝待填　｜　"
                  "Lead Time 交货期＝待填　｜　Country of Origin 原产国＝待填　｜　Brand 品牌＝待填")
    ws.cell(r, 1, hdr_fields).font = F_BASE
    ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=LAST)
    r += 2

    headers = [
        "序号\nNo.", "Model # / SKU\n型号 / 货号",
        "产品名称（中英对照）\nProduct Name\n英文在上 / 中文在下",
        "规格尺寸（原文 / 公制）\nSize\n原始 in·ft 在上 / 公制 cm·m 在下",
        "产品特点（中英对照）\nFeatures\n• 英文 / · 中文，逐条对照",
        "包装方式（中英对照）\nPackaging\n英文在上 / 中文在下",
        "预计年销量\nEst. Yearly Units", "客户目标价\nTarget Price USD",
        "供方报价\nSupplier Price USD",
        "备注\nRemarks",
    ]
    hdr_row = r
    for i, h in enumerate(headers, start=1):
        c = ws.cell(hdr_row, i, h)
        c.font = F_BOLD
        c.alignment = A_CTR
        c.border = BORDER
        c.fill = HEAD
    ws.row_dimensions[hdr_row].height = 34
    r += 1

    idx = 0
    for cat_cn, cat_en, srcs in CATEGORIES:
        band = ws.cell(r, 1, f"{cat_cn}　·　{cat_en}　（{len(srcs)} 项 / items）")
        band.font = F_BOLD
        band.alignment = Alignment(horizontal="left", vertical="center")
        band.fill = BAND
        band.border = BORDER
        for c in range(2, LAST + 1):
            ws.cell(r, c).fill = BAND
            ws.cell(r, c).border = BORDER
        ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=LAST)
        ws.row_dimensions[r].height = 20
        r += 1
        for s in srcs:
            idx += 1
            d = next(x for x in rows_data if x["src"] == s)
            vals = [idx, d["sku"], d["name_pair"], d["size_pair"], d["feat_pair"],
                    d["pack_pair"], d["qty"], d["target"], None, d["remark"]]
            for i, v in enumerate(vals, start=1):
                c = ws.cell(r, i, v)
                c.font = F_BASE
                c.border = BORDER
                c.alignment = A_CTR if i in (1, 2, 7, 8, 9) else A_WRAP
            ws.cell(r, 8).number_format = '"$"#,##0.00'
            ws.cell(r, 9).number_format = '"$"#,##0.00'
            need = max(est_lines(v, widths[i - 1]) for i, v in enumerate(vals, start=1))
            ws.row_dimensions[r].height = min(420, max(30, need * 13 + 6))
            r += 1

    r += 1
    ws.cell(r, 1, "整理说明 Notes").font = F_BOLD
    r += 1
    tail_notes = [
        "1) 本表为询价单整理件（文字版），不是报价单；对外报价请按 公共模板/报价/ 下的权威报价模板（FOB / CIF / DDP 等）另行开单。",
        "2) 客户原表 18 行中 SKU 1551417 重复两行（第 8 行 100,000 卷标注 Shootout QTY；原表第 11 行 160,000 卷标注 In line item），目标价同为 $6.66，两行均保留未合并。",
        "3) 原表 J–AD 列（主箱 / 内盒 / 零售 / 托盘 的 Height·Width·Depth·Weight·Quantity，单位为英寸）在 18 行里全部为空，无英寸数值可换算；如需填报请按 1 in = 2.54 cm 换算。",
        "4) 原表 D 列中文里的华氏度换算（°F→°C）经复核正确，原文照录未改。",
        "5) 英文特点与中文特点条数不一致的有 4 项（EPDM 白/黑、透明修补带的中文漏译 Made in the USA；丁基胶带中文漏译 Manufacturer may vary），两侧均按各自原文照录，未作增删，报价前请与客户确认以哪一版为准。",
        f"6) 原文件 SHA-256：{src_sha}；生成日期：{__import__('datetime').date.today().isoformat()}；原文件未被修改。",
    ]
    for t in tail_notes:
        c = ws.cell(r, 1, t)
        c.font = F_BASE
        c.alignment = A_WRAP
        ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=LAST)
        ws.row_dimensions[r].height = 15 * max(1, est_lines(t, sum(widths)))
        r += 1

    ws.freeze_panes = f"A{hdr_row + 1}"
    out = os.path.join(OUT_DIR, OUT_NAME)
    wb.save(out)
    return out, rows_data


if __name__ == "__main__":
    src = sys.argv[1] if len(sys.argv) > 1 else SRC_DEFAULT
    out, rows_data = build(src)
    print("written:", out)
    print("询价行数:", len(rows_data))
    for i, s in enumerate(ORDER):
        cat = next(c for c, e, rows in CATEGORIES if s in rows)
        print(f"  {i+1:2d}. [原表{s:2d}] {cat} | SKU {rows_data[i]['sku']} | {rows_data[i]['size_src']} → {rows_data[i]['size_metric']}")

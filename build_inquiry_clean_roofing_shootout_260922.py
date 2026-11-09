# -*- coding: utf-8 -*-
"""
整理客户询价单 "Roofing Shootout Quotation Sheet 260922.xlsx" 并把规格中的
英寸/英尺换算成厘米/米。

输入（只读，不改动原文件）：
  /Users/chengzhi/workspace/mingze/客户业务/报价/Roofing-Shootout/Roofing Shootout Quotation Sheet 260922.xlsx
  可用 argv[1] 覆盖。

输出：
  客户业务/报价/Roofing-Shootout/客户询价单-整理_Roofing-Shootout_260922.xlsx

原则：
  * 不修改、不臆造任何客户数据：所有原值原样保留（另附"原表-值备份"工作表）。
  * 只做三件事：结构整理、单位换算（1 in = 2.54 cm 精确值）、缺口/异常标注。
  * 图片取原表内嵌图片并等比缩略，仅作识别用。
"""

import hashlib
import os
import re
import shutil
import sys
import tempfile
import zipfile
from datetime import date

import openpyxl
from openpyxl.drawing.image import Image as XLImage
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from PIL import Image as PILImage

SRC_DEFAULT = "/Users/chengzhi/workspace/mingze/客户业务/报价/Roofing-Shootout/Roofing Shootout Quotation Sheet 260922.xlsx"
WORKSPACE = "/Users/chengzhi/workspace/mingze"
OUT_DIR = os.path.join(WORKSPACE, "客户业务/报价/Roofing-Shootout")
OUT_NAME = "客户询价单-整理_Roofing-Shootout_260922.xlsx"

DATA_FIRST_ROW = 8
DATA_LAST_ROW = 25
SHEET_NAME = "Sheet2"

# 1 in = 2.54 cm（国际英寸定义，精确值）；1 ft = 12 in = 30.48 cm
IN_TO_CM = 2.54
FT_TO_CM = 30.48

TOKEN_RE = re.compile(
    r"(?:(\d+)\s+(\d+)/(\d+)|(\d+)-(\d+)/(\d+)|(\d+)/(\d+)|(\d+\.\d+)|(\d+))"
    r"\s*(?:\"|”|″|英寸|'|’|′|英尺)"
)
CJK_RE = re.compile(r"[\u4e00-\u9fff]")
UNIT_INCH = ('"', "”", "″", "英寸")
UNIT_FOOT = ("'", "’", "′", "英尺")

THIN = Side(style="thin", color="000000")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
F_BASE = Font(name="Arial", size=10)
F_BOLD = Font(name="Arial", size=10, bold=True)
F_TITLE = Font(name="Arial", size=14, bold=True)
F_SUB = Font(name="Arial", size=10, italic=True)
F_LABEL = Font(name="Arial", size=10, bold=True)
A_WRAP = Alignment(horizontal="left", vertical="top", wrap_text=True)
A_CTR = Alignment(horizontal="center", vertical="center", wrap_text=True)
A_HDR = Alignment(horizontal="center", vertical="center", wrap_text=True)


def token_value(m):
    g = m.groups()
    if g[0] is not None:
        return int(g[0]) + int(g[1]) / int(g[2])
    if g[3] is not None:
        return int(g[3]) + int(g[4]) / int(g[5])
    if g[6] is not None:
        return int(g[6]) / int(g[7])
    if g[8] is not None:
        return float(g[8])
    return float(g[9])


def token_unit(raw):
    return "ft" if any(u in raw for u in UNIT_FOOT) else "in"


def fmt(x, nd=2):
    """去掉多余尾零的小数显示。"""
    s = f"{x:.{nd}f}".rstrip("0").rstrip(".")
    return s if s else "0"


def dims_of(text):
    """返回 [(原文, 数值, 单位, 后置字母标签)]，单位 in/ft。"""
    out = []
    for m in TOKEN_RE.finditer(text):
        raw = m.group(0).strip()
        tail = text[m.end(): m.end() + 2]
        label = tail[0] if tail and tail[0] in "WHLwhl" else ""
        out.append((raw, token_value(m), token_unit(raw), label.upper()))
    return out


def dims_cm_expr(text):
    """把尺寸串里的英寸/英尺替换成 cm/m 显示，如 '10.16 cm × 10.06 m'。"""
    parts = []
    for raw, v, unit, label in dims_of(text):
        if unit == "ft":
            shown = f"{fmt(v * FT_TO_CM)} cm（{fmt(v * 0.3048, 3)} m）"
        else:
            shown = f"{fmt(v * IN_TO_CM)} cm"
        if label:
            shown += f" [{label}]"
        parts.append(shown)
    return " × ".join(parts)


def dims_detail(text):
    """逐项精确换算明细。"""
    parts = []
    for raw, v, unit, label in dims_of(text):
        tag = f"[{label}] " if label else ""
        if unit == "ft":
            parts.append(
                f"{tag}{raw} = {v:g} ft = {v * 12:g} in = "
                f"{fmt(v * FT_TO_CM)} cm = {fmt(v * 0.3048, 4)} m"
            )
        else:
            parts.append(
                f"{tag}{raw} = {v:g} in = {fmt(v * IN_TO_CM)} cm = {fmt(v * 25.4, 3)} mm"
            )
    return "；".join(parts)


def split_en_cn(desc):
    lines = [ln.strip() for ln in (desc or "").split("\n") if ln.strip()]
    en, cn = "", ""
    for i, ln in enumerate(lines):
        if CJK_RE.search(ln):
            cn = " ".join(lines[i:])
            break
        en = (en + " " + ln).strip()
    return en, cn


def parse_qty(val):
    """返回 (数量文本, 备注)。原值可能是数字或 '100,000\\nShootout QTY'。"""
    if val is None:
        return "", ""
    if isinstance(val, (int, float)):
        return f"{val:,}", ""
    lines = [ln.strip() for ln in str(val).split("\n") if ln.strip()]
    return lines[0], " ".join(lines[1:])


def extract_images(src_xlsx):
    """返回 {(row, col0): 缩略图路径}，col0 为 0 基列号。"""
    tmp = tempfile.mkdtemp(prefix="rfq_media_")
    with zipfile.ZipFile(src_xlsx) as z:
        z.extractall(tmp)
    wb = openpyxl.load_workbook(src_xlsx)
    ws = wb[SHEET_NAME]
    mapping = {}
    for im in ws._images:
        row = im.anchor._from.row + 1
        col = im.anchor._from.col
        data = im._data()
        ext = (im.format or "png").lower()
        pil = PILImage.open(__import__("io").BytesIO(data)).convert("RGB")
        w = 108 if col == 0 else 132
        h = int(pil.height * w / pil.width)
        if h > 96:
            h = 96
            w = int(pil.width * h / pil.height)
        pil = pil.resize((w, h))
        path = os.path.join(tmp, f"r{row}_c{col}.png")
        pil.save(path, "PNG")
        mapping[(row, col)] = path
    shutil.rmtree(os.path.join(tmp, "xl"), ignore_errors=True)
    return mapping, tmp


def style_grid(ws, r1, r2, c1, c2, font=F_BASE, align=A_WRAP):
    for r in range(r1, r2 + 1):
        for c in range(c1, c2 + 1):
            cell = ws.cell(r, c)
            cell.font = font
            cell.alignment = align
            cell.border = BORDER


def build(src=SRC_DEFAULT):
    with open(src, "rb") as fh:
        src_sha256 = hashlib.sha256(fh.read()).hexdigest()
    src_wb = openpyxl.load_workbook(src, data_only=True)
    src_ws = src_wb[SHEET_NAME]

    products = []
    for r in range(DATA_FIRST_ROW, DATA_LAST_ROW + 1):
        desc = src_ws.cell(r, 3).value or ""
        en, cn = split_en_cn(desc)
        dim_src = ""
        dms = dims_of(en)
        if dms:
            first = TOKEN_RE.search(en)
            last = None
            for last in TOKEN_RE.finditer(en):
                pass
            dim_src = en[first.start(): last.end()].strip()
        qty, qty_note = parse_qty(src_ws.cell(r, 6).value)
        spec_cn = "\n".join(
            ln.strip() for ln in (src_ws.cell(r, 4).value or "").split("\n") if ln.strip()
        )
        products.append(
            dict(
                row=r,
                sku=src_ws.cell(r, 2).value,
                en=en,
                cn=cn,
                dim_src=dim_src,
                dim_cm=dims_cm_expr(dim_src) if dim_src else "",
                dim_detail=dims_detail(dim_src) if dim_src else "",
                spec=spec_cn,
                pack=(src_ws.cell(r, 5).value or "").strip(),
                qty=qty,
                qty_note=qty_note,
                target=src_ws.cell(r, 7).value,
            )
        )

    # ---- 重复/异常标注（只依据事实）----
    seen = {}
    for p in products:
        seen.setdefault(p["sku"], []).append(p["row"])
    dup_rows = {r for rows in seen.values() if len(rows) > 1 for r in rows}

    img_map, tmpdir = extract_images(src)

    wb = openpyxl.Workbook()

    # ================= 工作表 1：询价单整理 =================
    ws = wb.active
    ws.title = "询价单整理"
    ws.sheet_view.showGridLines = False

    widths = {
        "A": 5, "B": 16, "C": 19, "D": 12, "E": 44, "F": 34, "G": 20, "H": 26,
        "I": 46, "J": 52, "K": 26, "L": 17, "M": 15, "N": 15, "O": 40,
    }
    for col, w in widths.items():
        ws.column_dimensions[col].width = w

    ws["A1"] = "客户询价单整理 — Roofing Shootout Quotation Sheet 260922"
    ws["A1"].font = F_TITLE
    ws.merge_cells("A1:O1")
    ws.row_dimensions[1].height = 22

    ws["A2"] = (
        f"来源：Roofing Shootout Quotation Sheet 260922.xlsx（原表工作表 {SHEET_NAME}，"
        f"数据行 8–25，共 {len(products)} 个询价行）｜整理日期：{date.today().isoformat()}｜"
        "单位换算：1 in = 2.54 cm = 25.4 mm（精确）；1 ft = 12 in = 30.48 cm = 0.3048 m"
    )
    ws["A2"].font = F_SUB
    ws["A2"].alignment = A_WRAP
    ws.merge_cells("A2:O2")
    ws.row_dimensions[2].height = 30

    ws["A4"] = "客户原表表头字段（原表 B1:B5，客户均留空，由供方填写）："
    ws["A4"].font = F_LABEL
    ws.merge_cells("A4:O4")
    ws["A5"] = (
        "Vendor Name（供应商名称）＝待填　｜　Payment Terms（付款条件）＝待填　｜　"
        "Lead Time（交货期）＝待填　｜　Country of Origin（原产国）＝待填　｜　Brand（品牌）＝待填"
    )
    ws["A5"].font = F_BASE
    ws.merge_cells("A5:O5")

    ws["A6"] = (
        "提示：原表 J–AD 列（Master Pack / Inner Pack / Retail Pack / Pallet 的 Height·Width·Depth·"
        "Weight·Quantity，单位英寸）客户全部留空，无英寸数值可换算；原表 H 列 SHIPPING PORT、"
        "I 列 Price 亦留空。本表把产品规格尺寸中的英寸/英尺换算为厘米/米，原值全部保留在 G 列。"
    )
    ws["A6"].font = F_SUB
    ws["A6"].alignment = A_WRAP
    ws.merge_cells("A6:O6")
    ws.row_dimensions[6].height = 32

    headers = [
        "序号", "产品图片", "规格/特性图\n（原表D列图片）", "Model # / SKU",
        "产品名称（英文，原文）", "产品名称（中文）", "规格尺寸（原表原文 in/ft）",
        "规格尺寸（换算 cm/m）", "尺寸换算明细（精确）", "产品特点 / 规格（中文，原表D列）",
        "包装方式\n（原表E列）", "预计年销量\n（原表F列）", "客户目标价 USD\n（原表G列）",
        "供方报价 USD\n（原表I列，待填）", "备注 / 整理提示",
    ]
    HDR = 8
    for i, h in enumerate(headers, start=1):
        c = ws.cell(HDR, i, h)
        c.font = F_BOLD
        c.alignment = A_HDR
        c.border = BORDER
        c.fill = PatternFill("solid", fgColor="F2F2F2")
    ws.row_dimensions[HDR].height = 42

    r = HDR + 1
    for idx, p in enumerate(products, start=1):
        note = []
        if p["row"] in dup_rows:
            others = [x for x in seen[p["sku"]] if x != p["row"]]
            note.append(
                f"重复行：与原表第 {', '.join(str(o) for o in others)} 行 SKU 相同（{p['sku']}），"
                "同一产品在客户表中出现两次，需与客户确认是否合并。"
            )
        if p["qty_note"]:
            note.append(f"客户原表 F 列备注：{p['qty_note']}")
        note.append("包装尺寸/装运港客户未提供；供方报价位待填。")

        vals = [
            idx, None, None, p["sku"], p["en"], p["cn"], p["dim_src"], p["dim_cm"],
            p["dim_detail"], p["spec"], p["pack"], p["qty"], p["target"], None,
            " ".join(note),
        ]
        for ci, v in enumerate(vals, start=1):
            cell = ws.cell(r, ci, v)
            cell.font = F_BASE
            cell.border = BORDER
            if ci in (1, 4):
                cell.alignment = A_CTR
            elif ci in (12, 13, 14):
                cell.alignment = Alignment(horizontal="center", vertical="top", wrap_text=True)
            else:
                cell.alignment = A_WRAP
        ws.cell(r, 13).number_format = '"$"#,##0.00'
        ws.cell(r, 14).number_format = '"$"#,##0.00'
        ws.row_dimensions[r].height = 74

        # 原表图片列(0基)：0 = A 列产品图，3 = D 列规格/特性图
        for src_col, dst_col in ((0, "B"), (3, "C")):
            path = img_map.get((p["row"], src_col))
            if path:
                im = XLImage(path)
                ws.add_image(im, f"{dst_col}{r}")
        r += 1

    last = r - 1
    ws.freeze_panes = f"A{HDR + 1}"
    ws.auto_filter.ref = f"A{HDR}:O{last}"
    ws.print_title_rows = f"{HDR}:{HDR}"

    # ================= 工作表 2：英寸→厘米换算表 =================
    ws2 = wb.create_sheet("英寸-厘米换算表")
    hdr2 = [
        "原表行", "Model # / SKU", "换算对象（原文）", "数值", "原单位",
        "英寸 in", "厘米 cm", "毫米 mm", "米 m", "换算公式",
    ]
    ws2.append(hdr2)
    for i in range(1, len(hdr2) + 1):
        c = ws2.cell(1, i)
        c.font = F_BOLD
        c.alignment = A_HDR
        c.border = BORDER
        c.fill = PatternFill("solid", fgColor="F2F2F2")
    ws2.row_dimensions[1].height = 30
    rr = 2
    for p in products:
        for raw, v, unit, label in dims_of(p["dim_src"]):
            tag = f"[{label}] " if label else ""
            if unit == "ft":
                row = [p["row"], p["sku"], f"{tag}{raw}", f"{v:g}", "ft",
                       f"{v * 12:g}", fmt(v * FT_TO_CM), fmt(v * 25.4 * 12, 3),
                       fmt(v * 0.3048, 4), f"{v:g} ft × 30.48 = {fmt(v * FT_TO_CM)} cm"]
            else:
                row = [p["row"], p["sku"], f"{tag}{raw}", f"{v:g}", "in",
                       f"{v:g}", fmt(v * IN_TO_CM), fmt(v * 25.4, 3),
                       fmt(v * 2.54 / 100, 5), f"{v:g} in × 2.54 = {fmt(v * IN_TO_CM)} cm"]
            ws2.append(row)
            rr += 1
    for row in ws2.iter_rows(min_row=2, max_row=rr - 1, max_col=len(hdr2)):
        for c in row:
            c.font = F_BASE
            c.border = BORDER
            c.alignment = A_CTR if c.column in (1, 2, 4, 5, 6, 7, 8, 9) else A_WRAP
    widths2 = {"A": 8, "B": 13, "C": 18, "D": 10, "E": 8, "F": 10, "G": 11, "H": 11, "I": 12, "J": 34}
    for col, w in widths2.items():
        ws2.column_dimensions[col].width = w
    ws2.freeze_panes = "A2"
    ws2["L1"] = "换算基准：1 in = 2.54 cm = 25.4 mm（国际英寸定义，精确值）；1 ft = 12 in = 30.48 cm = 0.3048 m"
    ws2["L1"].font = F_SUB
    ws2["L2"] = "本表逐项列出原表产品规格中出现的每一个英寸/英尺数值，cm 为精确换算值（未按包装尺寸取整）。"
    ws2["L2"].font = F_SUB
    ws2.column_dimensions["L"].width = 60

    # ================= 工作表 3：原表-值备份 =================
    ws3 = wb.create_sheet("原表-值备份")
    ws3["A1"] = (
        "原表逐格原值备份（不含图片；行列位置与原表一致，便于对照）。\n"
        "原表内嵌图片 36 张（产品图 18 张 + 特性图 18 张）已放入'询价单整理'表。"
    )
    ws3["A1"].font = F_SUB
    ws3["A1"].alignment = A_WRAP
    ws3.merge_cells("A1:AG1")
    ws3.row_dimensions[1].height = 30
    letter_row = 3
    ws3.cell(letter_row, 1, "原表行").font = F_BOLD
    ws3.cell(letter_row, 1).border = BORDER
    for ci in range(1, 33):
        c = ws3.cell(letter_row, ci + 1, get_column_letter(ci))
        c.font = F_BOLD
        c.alignment = A_CTR
        c.border = BORDER
    for r0 in range(1, 26):
        c = ws3.cell(letter_row + r0, 1, r0)
        c.font = F_BOLD
        c.alignment = A_CTR
        c.border = BORDER
        for ci in range(1, 33):
            v = src_ws.cell(r0, ci).value
            cell = ws3.cell(letter_row + r0, ci + 1, v)
            cell.font = F_BASE
            cell.alignment = A_WRAP
            cell.border = BORDER
    ws3.column_dimensions["A"].width = 7
    for ci in range(1, 33):
        ws3.column_dimensions[get_column_letter(ci + 1)].width = 16
    ws3.freeze_panes = "B4"

    # ================= 工作表 4：整理说明 =================
    ws4 = wb.create_sheet("整理说明")
    dim_count = sum(len(dims_of(p["dim_src"])) for p in products)
    notes = [
        ("一、整理对象", None),
        ("", "客户原文件：Roofing Shootout Quotation Sheet 260922.xlsx（单工作表 Sheet2，数据行 8–25，共 18 个询价行）。"),
        ("", "本工作簿由脚本 code/build_inquiry_clean_roofing_shootout_260922.py 生成，原文件未被修改。"),
        ("", f"原文件 SHA-256：{src_sha256}（整理所依据的原稿版本校验值）。"),
        ("二、本次做的整理（只整理结构，不改动任何原值）", None),
        ("", "1) 把原表 32 列（A–AF）的横表按'一行一个产品'整理为 15 列可读表：序号、产品图、特性图、SKU、中英文品名、尺寸、特点、包装、年销量、客户目标价、供方报价位、备注。"),
        ("", "2) 中英文品名拆分：原表 C 列把英文名与中文名放在同一单元格，已拆为两列；原表 D 列中文特点是图片（英文 Features 图）的译文，已完整保留。"),
        ("", "3) 内嵌图片保留：产品图 18 张、规格/特性图 18 张，均等比缩略后放入表格，便于识别（不含任何客户未提供的图片）。"),
        ("", "4) 单位换算：产品规格中的英寸换算为厘米、英尺换算为厘米与米，见 G/H/I 列与'英寸-厘米换算表'。"),
        ("", "5) 加空列'供方报价 USD（原表 I 列 Price）'，供报价填写；表格已冻结表头并加筛选。"),
        ("", "6) 重复行与缺口已标注（见备注列与第五节），未擅自删除、未擅自合并数量。"),
        ("三、单位换算规则（精确值）", None),
        ("", "1 in = 2.54 cm = 25.4 mm（国际英寸定义，精确）；1 ft = 12 in = 30.48 cm = 0.3048 m。"),
        ("", "换算仅针对数值本身，未按包装/装箱习惯取整，也未加入任何公差或允许偏差；如需整数化请在 G/H/I 列基础上自行取整。"),
        ("", "长度较长的卷材（25–75 ft）在 H 列同时给出米与厘米，实际选型请以 I 列精确值为准。"),
        ("四、换算覆盖范围说明（重要）", None),
        ("", "原表 J–AD 列是客户要求的 Master Pack / Inner Pack / Retail Pack / Pallet 尺寸（Height、Width、Depth、Weight、Quantity，表头写明单位为英寸），这 4 组共 20 列（每组 Height/Width/Depth/Weight/Quantity 共 5 项）在 18 行中全部为空。"),
        ("", "因此本表可换算的英寸/英尺数值只来自产品规格（如 4\" × 33'、3/8\"W、5.5\" × 42\"），共 %d 个，已全部列出。" % dim_count),
        ("", "若客户后续补填包装尺寸，请用同一规则换算，或直接在'原表-值备份'表对应单元格补齐后重新换算。"),
        ("五、数据缺口与异常（仅陈述事实，未做任何推测填补）", None),
        ("", "1) 原表 B1:B5 表头字段（Vendor Name、Payment Terms、Lead Time、Country of Origin、Brand）全部为空，需供方填写。"),
        ("", "2) 原表 H 列 SHIPPING PORT、I 列 Price 全为空；J–AD 列包装尺寸全为空。"),
        ("", "3) 原表 C7 表头注明'enter products in this spreadsheet price ASCENDING'（按价格升序录入），但实际 G 列目标价顺序不是升序。本表保持客户原始顺序以便逐行对照，未重排。"),
        ("", "4) SKU 1551417（1-5/8\" × 50' Deck Joist Flashing）在原表第 8 行与第 11 行重复出现：第 8 行年销量标注 100,000 'Shootout QTY'，第 11 行标注 160,000 'In line item. Same item as the shootout'，目标价同为 $6.66。两行均保留，未合并、未相加，需与客户确认。"),
        ("", "5) 其余 16 行 SKU 均唯一，未发现其他重复项；EPDM 白/黑（1519440 / 1519441）与屋顶修补胶带黑/白（1574154 / 1574152）是成对的不同产品，不是重复行。"),
        ("", "6) 原表 D 列中文里已有的华氏度换算（°F→°C）经复核正确，未改动。"),
        ("六、本次没有做的事", None),
        ("", "1) 未填写任何价格、包装、装运港、贸易术语、有效期数据（无客户或供方依据，一律留空待填）。"),
        ("", "2) 未修改原表任何一个单元格的值，也未删除任何产品行。"),
        ("", "3) 未对原表图片作任何美化或替换，仅做等比缩略。"),
        ("七、建议的下一步", None),
        ("", "1) 先与客户确认 SKU 1551417 的重复行如何处理，以及是否需要按升序重排。"),
        ("", "2) 客户未提供包装尺寸与装运港，报价前需内部补齐 Master/Inner/Retail Pack 的 cm 数据。"),
        ("", "3) 对外报价请按 公共模板/报价/ 下的权威报价模板（FOB/CIF/DDP 等）另行开单，本表仅为询价单整理件，不是报价单。"),
    ]
    ws4.column_dimensions["A"].width = 34
    ws4.column_dimensions["B"].width = 110
    rr = 1
    for head, body in notes:
        if body is None:
            c = ws4.cell(rr, 1, head)
            c.font = Font(name="Arial", size=11, bold=True)
            ws4.merge_cells(start_row=rr, start_column=1, end_row=rr, end_column=2)
        else:
            a = ws4.cell(rr, 1, head)
            a.font = F_BASE
            a.alignment = Alignment(vertical="top", wrap_text=True)
            b = ws4.cell(rr, 2, body)
            b.font = F_BASE
            b.alignment = Alignment(vertical="top", wrap_text=True)
        ws4.row_dimensions[rr].height = max(15, 15 * (1 + len(str(body or head)) // 60))
        rr += 1

    out = os.path.join(OUT_DIR, OUT_NAME)
    wb.save(out)
    shutil.rmtree(tmpdir, ignore_errors=True)
    return out, products


if __name__ == "__main__":
    src = sys.argv[1] if len(sys.argv) > 1 else SRC_DEFAULT
    out, products = build(src)
    print("written:", out)
    print("products:", len(products))

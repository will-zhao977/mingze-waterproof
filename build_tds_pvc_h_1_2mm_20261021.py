# -*- coding: utf-8 -*-
"""PVC (H, homogeneous) waterproofing membrane 1.20 mm TDS — bilingual EN/CN.

Data source: Test Report No. J050029-2025 (检验报告 J050029-2025), 5 pages,
fill-in date 2025-05-19. Pages 2-5 of the report are the supplied evidence and
every numeric result below is copied verbatim from those pages; nothing is
invented. Page 1 (cover / sampling information) was not supplied, so the test
body and sampling details are omitted rather than guessed.

Standard: GB 12952-2011《聚氯乙烯（PVC）防水卷材》. The 12 test items and their
requirement values in report J050029-2025 (size deviation 99.5%, tensile
>=10 MPa / break elongation >=200%, heat-treatment dimensional change <=2.0%,
low-temp flexibility -25 C, watertightness 0.3 MPa/2 h, impact 0.5 kg.m,
joint peel >=4.0 N/mm or membrane failure, right-angle tear >=50 N/mm,
water absorption, chemical resistance, heat aging 80 C/672 h) match the items
of GB 12952-2011 for homogeneous (H) membrane; the standard name is therefore
stated, while page 1 remains to be verified by the user.

Thickness note: the report's "min. single value" cell reads
"1.19, 1.20, , 1.19" (an extra comma in the report). The TDS prints the three
recorded values as 1.19 / 1.20 / 1.19.

Installation / storage / safety wording is generic manufacturer guidance (no
specific weld parameters, temperatures or consumptions are stated, because the
report does not contain them). Layout follows the Mingze TDS family, in
particular code/build_tds_sbs_4mm_20260908.py.

Builds the deliverable .docx (Microsoft YaHei for Windows/Word) plus a temp
PingFang SC copy used only to render the .pdf via LibreOffice on macOS.
"""
import sys
from docx import Document
from docx.shared import Pt, Twips, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

NAVY = RGBColor(0x1B, 0x36, 0x5D)
BODY = RGBColor(0x33, 0x33, 0x33)
GREY = RGBColor(0x66, 0x66, 0x66)
HEADER_FILL = "F0F4F8"
GROUP_FILL = "F7F9FB"
CJK = sys.argv[1] if len(sys.argv) > 1 else "Microsoft YaHei"
OUT = sys.argv[2] if len(sys.argv) > 2 else \
    "/Users/chengzhi/workspace/mingze/materials/产品资料/PVC防水卷材/TDS_PVC_H_1.20_Mingze.docx"

ARROW = "\u2192"  # not used for data; kept for text only

doc = Document()
section = doc.sections[0]
section.page_width = Twips(11906)
section.page_height = Twips(16838)
for attr in ("top_margin", "bottom_margin", "left_margin", "right_margin"):
    setattr(section, attr, Twips(1134))

style = doc.styles["Normal"]
style.font.name = "Arial"
style.font.size = Pt(9.5)
style.font.color.rgb = BODY
style.element.get_or_add_rPr().get_or_add_rFonts().set(qn("w:eastAsia"), CJK)


def set_run(run, size=9.5, bold=False, color=BODY):
    run.font.name = "Arial"
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = color
    run.element.get_or_add_rPr().get_or_add_rFonts().set(qn("w:eastAsia"), CJK)
    return run


def para(text, size=9.5, bold=False, color=BODY, align=None, before=6, after=4):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(before)
    p.paragraph_format.space_after = Pt(after)
    if align:
        p.alignment = align
    set_run(p.add_run(text), size, bold, color)
    return p


def heading(text):
    return para(text, size=11, bold=True, color=NAVY, before=5, after=3)


def shade(cell, fill):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:fill"), fill)
    tcPr.append(shd)


def style_table(table, widths):
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    tbl = table._tbl
    tblPr = tbl.tblPr
    tw = OxmlElement("w:tblW")
    tw.set(qn("w:w"), str(sum(widths)))
    tw.set(qn("w:type"), "dxa")
    tblPr.append(tw)
    layout = OxmlElement("w:tblLayout")
    layout.set(qn("w:type"), "fixed")
    tblPr.append(layout)
    ind = OxmlElement("w:tblInd")
    ind.set(qn("w:w"), "0")
    ind.set(qn("w:type"), "dxa")
    tblPr.append(ind)
    mar = OxmlElement("w:tblCellMar")
    for side, w in (("top", "20"), ("left", "80"), ("bottom", "20"), ("right", "80")):
        el = OxmlElement(f"w:{side}")
        el.set(qn("w:w"), w)
        el.set(qn("w:type"), "dxa")
        mar.append(el)
    tblPr.append(mar)
    borders = OxmlElement("w:tblBorders")
    for edge, sz, color in (
        ("top", "6", "C8C8C8"), ("left", "6", "C8C8C8"),
        ("bottom", "6", "C8C8C8"), ("right", "6", "C8C8C8"),
        ("insideH", "4", "E0E0E0"), ("insideV", "4", "E0E0E0"),
    ):
        el = OxmlElement(f"w:{edge}")
        el.set(qn("w:val"), "single")
        el.set(qn("w:sz"), sz)
        el.set(qn("w:space"), "0")
        el.set(qn("w:color"), color)
        borders.append(el)
    tblPr.append(borders)
    grid = tbl.find(qn("w:tblGrid"))
    if grid is None:
        grid = OxmlElement("w:tblGrid")
        tblPr.addnext(grid)
    for child in list(grid):
        grid.remove(child)
    for w in widths:
        gc = OxmlElement("w:gridCol")
        gc.set(qn("w:w"), str(w))
        grid.append(gc)
    for row in table.rows:
        for i, cell in enumerate(row.cells):
            cell.width = Twips(widths[i])
            for p in cell.paragraphs:
                p.paragraph_format.space_before = Pt(0)
                p.paragraph_format.space_after = Pt(0)
                for r in p.runs:
                    set_run(r, 9)


def fill_cell(cell, text, bold=False, color=BODY, fill=None):
    cell.paragraphs[0].text = ""
    set_run(cell.paragraphs[0].add_run(text), 9, bold, color)
    if fill:
        shade(cell, fill)


def fill_cell_sub(cell, main, sub="", bold=False, fill=None):
    """Main line at 9 pt; indented grey sub-line at 8 pt.

    When `main` is empty (continuation row inside a test group), the sub-line
    becomes the (indented) cell text so the group name is not repeated.
    """
    cell.paragraphs[0].text = ""
    if main:
        set_run(cell.paragraphs[0].add_run(main), 9, bold, BODY)
        if sub:
            p2 = cell.add_paragraph()
            p2.paragraph_format.space_before = Pt(0)
            p2.paragraph_format.space_after = Pt(1)
            p2.paragraph_format.left_indent = Pt(6)
            set_run(p2.add_run(sub), 8, False, GREY)
    elif sub:
        p = cell.paragraphs[0]
        p.paragraph_format.left_indent = Pt(6)
        set_run(p.add_run(sub), 8.5, bold, BODY)
    if fill:
        shade(cell, fill)



def repeat_header(table, count=1):
    for row in table.rows[:count]:
        trPr = row._tr.get_or_add_trPr()
        el = OxmlElement("w:tblHeader")
        el.set(qn("w:val"), "true")
        trPr.append(el)


def no_row_split(table):
    for row in table.rows:
        trPr = row._tr.get_or_add_trPr()
        trPr.append(OxmlElement("w:cantSplit"))

# ---------------------------------------------------------------- header
para("WEIFANG MINGZE WATERPROOF MATERIAL CO., LTD.",
     size=14, bold=True, color=NAVY, align=WD_ALIGN_PARAGRAPH.CENTER, before=4, after=1)
para("潍坊市明泽防水材料有限公司",
     size=11, bold=True, color=NAVY, align=WD_ALIGN_PARAGRAPH.CENTER, before=0, after=6)
para("TECHNICAL DATA SHEET (TDS) / 技术数据表",
     size=12, bold=True, color=NAVY, align=WD_ALIGN_PARAGRAPH.CENTER, before=3, after=3)
para("Document Ref / 文件编号: MZ-TDS-PVC-H-1.2MM-202610  |  "
     "Date / 日期: October 21, 2026 / 2026年10月21日",
     size=9, color=GREY, align=WD_ALIGN_PARAGRAPH.CENTER, before=2, after=1)
para("Standard / 执行标准: GB 12952-2011",
     size=9, color=GREY, align=WD_ALIGN_PARAGRAPH.CENTER, before=0, after=3)

# -------------------------------------------- 1. product identification
heading("1. Product Identification & Overview / 产品概况")
rows1 = [
    ("Product Name / 产品名称",
     "Polyvinyl chloride (PVC) waterproofing membrane / 聚氯乙烯（PVC）防水卷材"),
    ("Model / Specification / 型号规格", "PVC H 1.20 (H = homogeneous / 均质型)"),
    ("Classification / 产品分类",
     "Homogeneous membrane, type H / 均质卷材（H 类）"),
    ("Execution Standard / 执行标准", "GB 12952-2011《聚氯乙烯（PVC）防水卷材》"),
    ("Brand / 商标", "Mingze / 明泽"),
    ("Test Report No. / 检验报告编号", "J050029-2025"),
    ("Report Date (fill-in) / 报告填写日期", "2025-05-19 (5 pages / 共 5 页)"),
    ("Manufacturer / 生产单位",
     "Weifang Mingze Waterproof Material Co., Ltd. / 潍坊市明泽防水材料有限公司"),
    ("Plant Address / 厂址",
     "Caoxinzhuang Village, Yangkou Town, Shouguang City, Weifang, Shandong, China / "
     "山东省寿光市羊口镇曹辛庄村"),
]
t1 = doc.add_table(rows=len(rows1), cols=2)
for i, (k, v) in enumerate(rows1):
    fill_cell(t1.rows[i].cells[0], k, bold=True, fill=HEADER_FILL)
    fill_cell(t1.rows[i].cells[1], v)
style_table(t1, (3600, 6038))
no_row_split(t1)

# ------------------------------------------- 2. dimensions & supply
heading("2. Physical Dimensions & Supply / 规格尺寸与供货")
rows2 = [
    ("Item / 项目", "Value / 内容", "Note (Report No. J050029-2025 / 检验报告) / 备注"),
    ("Nominal Thickness / 公称厚度", "1.20 mm",
     "Tested min. single value 1.19 / 1.20 / 1.19 mm (req. min. single 1.05 mm); "
     "thickness deviation 0 / 2 / 0 % (req. -5 ~ +10 %) / "
     "实测最小单值 1.19 / 1.20 / 1.19 mm（要求最小单值 1.05 mm）；厚度偏差 0 / 2 / 0 %（要求 -5 ~ +10 %）"),
    ("Structure / 结构",
     "Homogeneous single-ply membrane; no reinforcement or backing / "
     "均质单层卷材，无增强层、无背衬", "PVC membrane, type H / PVC 卷材 H 类"),
    ("Roll Size / 卷材规格",
     "Width 1.0 m or 2.0 m; 20 m per roll / 宽 1.0 m 或 2.0 m；20 m/卷",
     "Standard supply options; per order confirmation / 标准供货规格，以订单确认为准"),
    ("Colour / 颜色", "White standard; other colours on request / 标准白色，可定制其他颜色",
     "Custom colour per order / 定制颜色按订单约定"),
]
t2 = doc.add_table(rows=len(rows2), cols=3)
for j, text in enumerate(rows2[0]):
    fill_cell(t2.rows[0].cells[j], text, bold=True, fill=HEADER_FILL)
for i, row in enumerate(rows2[1:], start=1):
    for j, text in enumerate(row):
        fill_cell(t2.rows[i].cells[j], text)
style_table(t2, (2100, 2900, 4638))
repeat_header(t2)
no_row_split(t2)

# ------------------------------------------- 3. technical performance
h3 = heading("3. Technical Performance & Test Results / 技术性能与检验结果  "
             "(Report No. J050029-2025 / 检验报告 J050029-2025, GB 12952-2011)")
h3.paragraph_format.page_break_before = True
hdr = ("Test Property / 检验项目", "Standard Req. / 标准规定",
       "Actual Test Result / 检验结果", "Verdict / 单项评定")
P = "Pass / 合格"

# (main, sub, requirement, result); main="" continues the previous group.
rows3 = [
    # 1 dimensions deviation
    ("1 Dimensions deviation / 尺寸偏差", "Length / 长度 (%)",
     "Not less than 99.5% of nominal / 不小于规定值的 99.5",
     "100.1, 100.2, 100.1"),
    ("", "Width / 宽度 (%)",
     "Not less than 99.5% of nominal / 不小于规定值的 99.5",
     "100.1, 100.1, 100.1"),
    ("", "Thickness deviation / 厚度偏差 (%)", "-5 ~ +10", "0, 2, 0"),
    ("", "Thickness, min. single value / 厚度最小值 (mm)",
     "Min. single value 1.05 / 最小单值 1.05", "1.19, 1.20, 1.19"),
    # 2 appearance
    ("2 Appearance / 外观", "Joints / 接头",
     "Not more than one joint per roll; shorter segment not less than 1.5 m; "
     "cut neatly and lengthened by 150 mm / "
     "卷材的接头不应多于一处，较短的一段长度不应小于 1.5 m，接头应剪切整齐，并应加长 150 mm",
     "No joints / 无接头"),
    ("", "Sheet surface / 卷材表面",
     "Even surface, neat edges; no cracks, holes, adhesion, blisters or scars / "
     "卷材表面应平整、边缘整齐，无裂纹、孔洞、黏结、气泡和疤痕",
     "Even surface, neat edges; no cracks, holes, adhesion, blisters or scars / "
     "卷材表面平整、边缘整齐，无裂纹、孔洞、粘结、气泡和疤痕"),
    # 3 tensile properties
    ("3 Tensile properties / 拉伸性能", "Tensile strength, longitudinal / 拉伸强度（纵向）(MPa)",
     "≥ 10", "11"),
    ("", "Tensile strength, transverse / 拉伸强度（横向）(MPa)", "≥ 10", "18"),
    ("", "Elongation at break, longitudinal / 断裂延伸率（纵向）(%)", "≥ 200", "216"),
    ("", "Elongation at break, transverse / 断裂延伸率（横向）(%)", "≥ 200", "227"),
    # 4 heat treatment dimensional change
    ("4 Dimensional change after heat treatment / 热处理尺寸变化率 (%)",
     "Longitudinal / 纵向", "≤ 2.0", "1.3"),
    ("", "Transverse / 横向", "≤ 2.0", "0"),
    # 5 low temp flexibility
    ("5 Low temperature flexibility / 低温弯折性", "",
     "-25 ℃, no cracks / -25 ℃ 无裂纹", "No cracks / 无裂纹"),
    # 6 watertightness
    ("6 Watertightness / 不透水性", "",
     "0.3 MPa, 2 h, impermeable / 0.3 MPa，2 h 不透水",
     "Impermeable / 不透水"),
    # 7 impact resistance
    ("7 Impact resistance / 抗冲击性能", "",
     "0.5 kg·m, no water penetration / 0.5 kg·m，不渗水",
     "No water penetration / 不渗水"),
    # 8 joint peel strength
    ("8 Joint peel strength / 接缝剥离强度 (N/mm)", "",
     "≥ 4.0 or membrane failure / ≥ 4.0 或卷材破坏", "4.6"),
    # 9 right-angle tear strength
    ("9 Right-angle tear strength / 直角撕裂强度 (N/mm)", "Longitudinal / 纵向",
     "≥ 50", "64"),
    ("", "Transverse / 横向", "≥ 50", "85"),
    # 10 water absorption
    ("10 Water absorption (70 ℃, 168 h) / 吸水率 (%)", "After immersion / 浸水后",
     "≤ 4.0", "3.8"),
    ("", "After airing / 晾置后", "≥ -0.40", "2.31"),
    # 11 chemical resistance - salt
    ("11 Chemical resistance / 耐化学性", "Salt treatment — appearance / 盐处理—外观",
     "No blisters, cracks, delamination, adhesion or pinholes / 无起泡、裂纹、分层、粘结和孔洞",
     "No blisters, cracks, delamination, adhesion or pinholes / 无起泡、裂纹、分层、粘结和孔洞"),
    ("", "Salt — tensile strength retention, long. / 盐处理—拉伸强度保持率（纵向）(%)",
     "≥ 85", "107"),
    ("", "Salt — tensile strength retention, trans. / 盐处理—拉伸强度保持率（横向）(%)",
     "≥ 85", "97"),
    ("", "Salt — elongation retention, long. / 盐处理—断裂伸长率保持率（纵向）(%)",
     "≥ 80", "91"),
    ("", "Salt — elongation retention, trans. / 盐处理—断裂伸长率保持率（横向）(%)",
     "≥ 80", "101"),
    ("", "Salt — low temperature flexibility / 盐处理—低温弯折性",
     "-20 ℃, no cracks / -20 ℃ 无裂纹", "No cracks / 无裂纹"),
    # 11 chemical resistance - alkali
    ("", "Alkali treatment — appearance / 碱处理—外观",
     "No blisters, cracks, delamination, adhesion or pinholes / 无起泡、裂纹、分层、粘结和孔洞",
     "No blisters, cracks, delamination, adhesion or pinholes / 无起泡、裂纹、分层、粘结和孔洞"),
    ("", "Alkali — tensile strength retention, long. / 碱处理—拉伸强度保持率（纵向）(%)",
     "≥ 85", "105"),
    ("", "Alkali — tensile strength retention, trans. / 碱处理—拉伸强度保持率（横向）(%)",
     "≥ 85", "92"),
    ("", "Alkali — elongation retention, long. / 碱处理—断裂伸长率保持率（纵向）(%)",
     "≥ 80", "94"),
    ("", "Alkali — elongation retention, trans. / 碱处理—断裂伸长率保持率（横向）(%)",
     "≥ 80", "101"),
    ("", "Alkali — low temperature flexibility / 碱处理—低温弯折性",
     "-20 ℃, no cracks / -20 ℃ 无裂纹", "No cracks / 无裂纹"),
    # 11 chemical resistance - acid
    ("", "Acid treatment — appearance / 酸处理—外观",
     "No blisters, cracks, delamination, adhesion or pinholes / 无起泡、裂纹、分层、粘结和孔洞",
     "No blisters, cracks, delamination, adhesion or pinholes / 无起泡、裂纹、分层、粘结和孔洞"),
    ("", "Acid — tensile strength retention, long. / 酸处理—拉伸强度保持率（纵向）(%)",
     "≥ 85", "86"),
    ("", "Acid — tensile strength retention, trans. / 酸处理—拉伸强度保持率（横向）(%)",
     "≥ 85", "110"),
    ("", "Acid — elongation retention, long. / 酸处理—断裂伸长率保持率（纵向）(%)",
     "≥ 80", "109"),
    ("", "Acid — elongation retention, trans. / 酸处理—断裂伸长率保持率（横向）(%)",
     "≥ 80", "81"),
    ("", "Acid — low temperature flexibility / 酸处理—低温弯折性",
     "-20 ℃, no cracks / -20 ℃ 无裂纹", "No cracks / 无裂纹"),
    # 12 heat aging
    ("12 Heat aging (80 ℃, 672 h) / 热老化", "Appearance / 外观",
     "No blisters, cracks, delamination, adhesion or pinholes / 无起泡、裂纹、分层、粘结和孔洞",
     "No blisters, cracks, delamination, adhesion or pinholes / 无起泡、裂纹、分层、粘结和孔洞"),
    ("Heat aging / 热老化", "Tensile strength retention, long. / 拉伸强度保持率（纵向）(%)", "≥ 85", "102"),
    ("Heat aging / 热老化", "Tensile strength retention, trans. / 拉伸强度保持率（横向）(%)", "≥ 85", "101"),
    ("Heat aging / 热老化", "Elongation retention, long. / 断裂伸长率保持率（纵向）(%)", "≥ 80", "88"),
    ("Heat aging / 热老化", "Elongation retention, trans. / 断裂伸长率保持率（横向）(%)", "≥ 80", "103"),
    ("Heat aging / 热老化", "Low temperature flexibility / 低温弯折性",
     "-20 ℃, no cracks / -20 ℃ 无裂纹", "No cracks / 无裂纹"),
]
t3 = doc.add_table(rows=len(rows3) + 1, cols=4)
for j, text in enumerate(hdr):
    fill_cell(t3.rows[0].cells[j], text, bold=True, fill=HEADER_FILL)
for i, (prop, sub, req, res) in enumerate(rows3, start=1):
    fill_cell_sub(t3.rows[i].cells[0], prop, sub,
                  bold=bool(prop), fill=GROUP_FILL if prop else None)
    fill_cell(t3.rows[i].cells[1], req)
    fill_cell(t3.rows[i].cells[2], res)
    fill_cell(t3.rows[i].cells[3], P)
style_table(t3, (3000, 2750, 2700, 1188))
repeat_header(t3)
no_row_split(t3)

para("All 12 test items listed in Report No. J050029-2025 are rated \"Pass\" (合格); the values above are "
     "those recorded in the report (punctuation and unit notation normalized). / "
     "检验报告 J050029-2025 所列 12 个检验项目全部评定为“合格”；以上数值为报告所载数值（标点与单位写法已规范化）。",
     size=8.5, color=GREY, before=3, after=4)

# --------------------------------- 4. installation, storage & quality notes
heading("4. Installation, Storage & Quality Notes / 施工、储存与质检说明")
rows4 = [
    ("Installation Method / 施工方法",
     "Single-ply PVC membrane system; seams are hot-air welded. Substrate must be sound, dry and clean, "
     "free of oil, dust and loose material; prime as specified. Welding parameters, seam width and "
     "detailing follow the approved installation instructions and the project specification. / "
     "单层 PVC 卷材系统，接缝热风焊接。基层应坚实、干燥、清洁，无油污、浮灰与松散物，按系统要求涂刷"
     "基层处理剂；焊接参数、搭接宽度与节点做法按经批准的施工说明和工程规范执行。"),
    ("Storage & Handling / 储存与搬运",
     "Store rolls upright in a dry, ventilated warehouse, protected from sunlight, rain, moisture and "
     "ignition sources; keep away from oils, solvents and sharp objects. / "
     "立放储存于干燥、通风的仓库，避免日晒、雨淋、受潮与火源；远离油类、溶剂和尖锐物。"),
    ("Health & Safety / 安全说明",
     "Wear gloves and eye protection when handling and welding; ventilate the work area during hot-air "
     "welding. MSDS available on request. / 搬运与焊接时佩戴手套和护目镜；热风焊接时保持作业区通风。"
     "MSDS 可索取。"),
    ("Quality Inspection Note / 质检说明",
     "Report No. J050029-2025 (5 pages, dated 2025-05-19): every test item listed in the report is "
     "rated \"Pass\", and all items comply with GB 12952-2011. Factory test certificates accompany every "
     "delivery. / 检验报告 J050029-2025（共 5 页，2025-05-19）：报告所列检验项目全部评定为“合格”，符合 "
     "GB 12952-2011 要求；每批交货附出厂检验合格证。"),
]
t4 = doc.add_table(rows=len(rows4), cols=2)
for i, (k, v) in enumerate(rows4):
    fill_cell(t4.rows[i].cells[0], k, bold=True, fill=HEADER_FILL)
    fill_cell(t4.rows[i].cells[1], v)
style_table(t4, (2200, 7438))
no_row_split(t4)

# ------------------------------------------------------- 5. disclaimer
heading("5. Disclaimer / 免责声明")
para("Values in this TDS are the test results recorded in Report No. J050029-2025; they are typical "
     "values, not per-batch guarantees. The order-confirmed specification prevails; storage, handling "
     "and installation must follow the installation instructions and the MSDS. / "
     "本 TDS 数值为检验报告 J050029-2025 所载检验结果，属典型值，非逐批保证；以订单确认书约定的规格为准，"
     "储存、搬运与施工应遵循施工说明与 MSDS。",
     size=9, before=2, after=3)

para("Authorized by Quality Assurance & Technical Department / 质量保证与技术部批准",
     size=9, color=GREY, align=WD_ALIGN_PARAGRAPH.CENTER, before=6, after=1)
para("Weifang Mingze Waterproof Material Co., Ltd. 潍坊市明泽防水材料有限公司  |  "
     "Tel: +86 13964642628  |  Email: zisong@mzwaterproof.com",
     size=9, color=GREY, align=WD_ALIGN_PARAGRAPH.CENTER, before=1, after=0)

doc.save(OUT)
print("saved:", OUT, "| CJK font:", CJK)

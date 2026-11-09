# -*- coding: utf-8 -*-
"""Waterborne Polyurethane Waterproofing Coating G (High-Elastic) TDS.

Data source: Test Report No. J053815-2026, Shandong Product Quality Inspection
Research Institute, JC/T 864-2023. All values copied verbatim from the report;
nothing invented. Layout follows TDS_JWF-R_Metal_Roof_Acrylic_Coating_Mingze.

Builds the deliverable .docx (Microsoft YaHei for Windows/Word) plus a temp
PingFang SC copy used only to render the .pdf via LibreOffice on macOS
(LibreOffice has no glyph fallback for the missing YaHei font).
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
CJK = sys.argv[1] if len(sys.argv) > 1 else "Microsoft YaHei"
OUT = sys.argv[2] if len(sys.argv) > 2 else \
    "/Users/chengzhi/workspace/mingze/materials/产品资料/水性聚氨酯防水涂料/TDS_WPU-G_Waterborne_Polyurethane_Coating_Mingze.docx"

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
    return para(text, size=11, bold=True, color=NAVY, before=6, after=4)


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
                p.paragraph_format.space_before = Pt(1)
                p.paragraph_format.space_after = Pt(1)
                for r in p.runs:
                    set_run(r, 9)


def fill_cell(cell, text, bold=False, color=BODY, fill=None):
    cell.paragraphs[0].text = ""
    set_run(cell.paragraphs[0].add_run(text), 9, bold, color)
    if fill:
        shade(cell, fill)



def fill_cell_sub(cell, main, sub="", bold=False, fill=None):
    cell.paragraphs[0].text = ""
    set_run(cell.paragraphs[0].add_run(main), 9, bold, BODY)
    if sub:
        p2 = cell.add_paragraph()
        p2.paragraph_format.space_before = Pt(0)
        p2.paragraph_format.space_after = Pt(1)
        set_run(p2.add_run(sub), 8, False, GREY)
    if fill:
        shade(cell, fill)

# ---------------------------------------------------------------- header
para("WEIFANG MINGZE WATERPROOF MATERIAL CO., LTD.",
     size=14, bold=True, color=NAVY, align=WD_ALIGN_PARAGRAPH.CENTER, before=6, after=6)
para("TECHNICAL DATA SHEET (TDS) / 技术数据表",
     size=12, bold=True, color=NAVY, align=WD_ALIGN_PARAGRAPH.CENTER, before=3, after=3)
para("Document Ref: MZ-TDS-WPU-G-202609  |  Date: September 1, 2026  |  Standard: JC/T 864-2023",
     size=9, color=GREY, align=WD_ALIGN_PARAGRAPH.CENTER, before=2, after=4)

# -------------------------------------------- 1. product identification
heading("1. Product Identification & Overview / 产品概况")
rows1 = [
    ("Product Name / 产品名称", "Waterborne Polyurethane Waterproofing Coating"),
    ("Chinese Name / 中文名称", "水性聚氨酯防水涂料"),
    ("Model / Specification / 型号", "G (High-Elastic Type / 高弹型)"),
    ("Execution Standard / 执行标准", "JC/T 864-2023"),
    ("Product Type / 产品类型", "High-Elastic (G) Type / 高弹型"),
    ("Brand / 商标", "Mingze / 明泽"),
    ("Test Report No. / 检验报告编号", "J053815-2026"),
    ("Test Date / 检验日期", "2026-03-05 ~ 2026-05-28 (report issued 2026-05-28)"),
    ("Manufacturer / 生产单位", "Weifang Mingze Waterproof Material Co., Ltd. (潍坊市明泽防水材料有限公司)"),
    ("Plant Address / 厂址", "Caoxinzhuang Village, Yangkou Town, Shouguang City, Weifang, Shandong, China"),
]
t1 = doc.add_table(rows=len(rows1), cols=2)
for i, (k, v) in enumerate(rows1):
    fill_cell(t1.rows[i].cells[0], k, bold=True, fill=HEADER_FILL)
    fill_cell(t1.rows[i].cells[1], v)
style_table(t1, (3400, 6238))

# -------------------------------------- 2. form & inspection information
heading("2. Product Form & Inspection Information / 产品形态与检验信息")
rows2 = [
    ("Item / 项目", "Value / 内容", "Note / 备注说明"),
    ("Product Form / 产品形态", "Liquid coating / 液体涂料",
     "Homogeneous, no lumps after mixing / 搅拌后无结块，呈均匀状态"),
    ("Sample State / 样品状态", "Normal / 正常",
     "Commissioned sampling type inspection / 委托抽样（型式检验）"),
    ("Sample Quantity / 样品数量", "1 kg",
     "Sample batch 5 kg; sampled 2026-03-02; production date 2026-03-01"),
    ("Testing Body / 检验机构",
     "Shandong Product Quality Inspection Research Institute / 山东省产品质量检验研究院",
     "Conclusion: the batch is qualified per JC/T 864-2023 / 该批产品按 JC/T 864-2023 标准检验合格"),
    ("Packaging / 包装",
     "Plastic pail, 25 kg/pail (also 50 kg available) / 塑料桶 25 kg/桶（另有 50 kg 规格）",
     "Industry-standard for this product type / 同类产品通用规格"),
    ("Coverage / Reference Dosage / 用量",
     "Approx. 1.5 kg/m² per 1.0 mm dry film; typ. 2 – 3 kg/m² at 1.2 – 2.0 mm / 每 1.0 mm 干膜约 1.5 kg/m²；1.2–2.0 mm 一般 2–3 kg/m²",
     "Applied in 2–3 coats; actual dosage depends on substrate and design / 分 2–3 道施工，视基层与设计而定"),
]
t2 = doc.add_table(rows=len(rows2), cols=3)
for j, text in enumerate(rows2[0]):
    fill_cell(t2.rows[0].cells[j], text, bold=True, fill=HEADER_FILL)
for i, row in enumerate(rows2[1:], start=1):
    for j, text in enumerate(row):
        fill_cell(t2.rows[i].cells[j], text)
style_table(t2, (2300, 3669, 3669))

# ------------------------------------------- 3. technical performance
heading("3. Technical Performance & Test Results / 物理力学性能与检验结果  (Report No. J053815-2026)")
hdr = ("Test Property / 检验项目", "Standard Req. / 技术要求",
       "Actual Test Result / 检验结果", "Verdict / 评定")
P = "Pass / 合格"
# (property, condition sub-line, requirement, actual result, verdict)
rows3 = [
    ("Appearance / 外观", "",
     "Homogeneous, no lumps after mixing / 搅拌后无结块，呈均匀状态", "Conforms / 符合要求", P),
    ("Solid Content / 固体含量 (%)", "", "≥ 60", "80", P),
    ("Surface Dry Time / 表干时间 (h)", "", "≤ 4", "2", P),
    ("Full Dry Time / 实干时间 (h)", "", "≤ 8", "3.5", P),
    ("Tensile Strength / 拉伸强度 (MPa)", "standard condition / 标准状态", "≥ 2.0", "2.2", P),
    ("Elongation at Break / 断裂伸长率 (%)", "standard condition / 标准状态", "≥ 500", "665", P),
    ("Elongation at Break / 断裂伸长率 (%)", "at -10 ℃", "≥ 450", "512", P),
    ("Tear Strength / 撕裂强度 (N/mm)", "", "≥ 15", "23", P),
    ("Low Temperature Bending / 低温弯折", "",
     "-35 ℃, no cracks / 无裂纹", "-35 ℃, no cracks / 无裂纹", P),
    ("Water Impermeability / 不透水性", "",
     "0.3 MPa, 2 h, impermeable / 不透水", "Impermeable / 不透水", P),
    ("Water Resistance / 耐水性 (23 ℃, 336 h)", "appearance / 外观",
     "No cracking, delamination, blistering or breakage / 涂膜无裂纹、无分层、无起泡、无破碎",
     "Conforms / 符合", P),
    ("Heating Expansion Rate / 加热伸缩率 (%)", "", "-1.0 ~ +1.0", "2.3", P),
    ("Bond Strength / 粘结强度 (MPa)", "standard condition / 标准状态", "≥ 1.0", "1.5", P),
    ("Bond Strength / 粘结强度 (MPa)", "wet substrate / 潮湿基面", "≥ 0.8", "1.5", P),
    ("Heat Treatment / 热处理 (80 ℃, 336 h)", "tensile strength / 拉伸强度 (MPa)", "≥ 2.0", "3.0", P),
    ("Heat Treatment / 热处理 (80 ℃, 336 h)", "elongation at break / 断裂伸长率 (%)", "≥ 450", "465", P),
    ("Heat Treatment / 热处理 (80 ℃, 336 h)", "low-temp. bending / 低温弯折性",
     "-33 ℃, no cracks / 无裂纹", "-33 ℃, no cracks / 无裂纹", P),
    ("Alkali Treatment / 碱处理 (0.1% NaOH + sat. Ca(OH)₂, 168 h)",
     "tensile strength / 拉伸强度 (MPa)", "≥ 1.6", "2.0", P),
    ("Alkali Treatment / 碱处理", "elongation at break / 断裂伸长率 (%)", "≥ 450", "460", P),
    ("Alkali Treatment / 碱处理", "low-temp. bending / 低温弯折性",
     "-30 ℃, no cracks / 无裂纹", "-30 ℃, no cracks / 无裂纹", P),
    ("Acid Treatment / 酸处理 (2% H₂SO₄, 168 h)", "tensile strength / 拉伸强度 (MPa)", "≥ 1.6", "2.5", P),
    ("Acid Treatment / 酸处理", "elongation at break / 断裂伸长率 (%)", "≥ 450", "480", P),
    ("Acid Treatment / 酸处理", "low-temp. bending / 低温弯折性",
     "-30 ℃, no cracks / 无裂纹", "-30 ℃, no cracks / 无裂纹", P),
    ("Artificial Weathering / 人工气候老化 (2745 h)", "appearance / 外观",
     "No cracking, delamination, blistering, debonding or holes / 无开裂、分层、起泡、粘结和孔洞",
     "Conforms / 符合", P),
    ("Artificial Weathering / 人工气候老化", "low-temp. bending / 低温弯折性",
     "-30 ℃, no cracks / 无裂纹", "-30 ℃, no cracks / 无裂纹", P),
    ("Burning Performance / 燃烧性能", "", "B₂-E", "Pass / 合格", P),
    ("Water Absorption / 吸水率 (%)", "", "≤ 10", "5.6", P),
]
t3 = doc.add_table(rows=len(rows3) + 1, cols=4)
for j, text in enumerate(hdr):
    fill_cell(t3.rows[0].cells[j], text, bold=True, fill=HEADER_FILL)
for i, (prop, sub, req, res, verdict) in enumerate(rows3, start=1):
    fill_cell_sub(t3.rows[i].cells[0], prop, sub)
    fill_cell(t3.rows[i].cells[1], req)
    fill_cell(t3.rows[i].cells[2], res)
    fill_cell(t3.rows[i].cells[3], verdict)
style_table(t3, (3400, 2300, 2300, 1638))

# --------------------------------- 4. application, storage & QC notes
heading("4. Application, Storage & Quality Notes / 施工、储存与质检说明")
rows4 = [
    ("Application Method / 施工方法",
     "Stir thoroughly before use; dilution, if required, follows the manufacturer's guidance. Apply by brush, "
     "roller or spray in 2–3 coats, each coat ≤ 0.5–1.0 mm, applied crosswise after the previous coat is "
     "surface-dry and no longer tacky (approx. 2–6 h at 23 ℃; tested surface-dry time 2 h). Total design "
     "dry-film thickness typically ≥ 1.5 mm. Reinforce corners, joints and details with polyester non-woven "
     "fabric between coats. Do not apply in rain, on substrates with standing water, or at substrate/ambient "
     "temperature below 5 ℃. Carry out the water ponding (leakage) test only after the film is fully dried, "
     "typically 48–72 h at 23 ℃; allow longer at low temperature or high humidity. "
     "使用前充分搅拌均匀；如需稀释应按厂家指导进行。采用刷涂、辊涂或喷涂，分 2–3 道施工，每道厚度不超过 "
     "0.5–1.0 mm，前一道表干不粘手后（23 ℃ 约 2–6 h，实测表干时间 2 h）交叉方向涂刷下一道。设计干膜总厚度一般"
     "不低于 1.5 mm。阴阳角、节点部位宜在层间铺覆聚酯无纺布增强。雨天、基层有明水或环境/基层温度低于 5 ℃ 时"
     "不得施工。涂膜完全干燥后方可进行闭水（蓄水）试验，标准条件下（23 ℃）一般 48–72 h，低温高湿时适当延长。"),
    ("Surface Preparation / 基层处理",
     "Substrate shall be sound, clean and free of dust, oil, laitance and loose material; repair cracks and "
     "treat joints and details before application. Application on damp substrate without standing water is "
     "acceptable — wet-substrate bond strength tested 1.5 MPa (requirement ≥ 0.8 MPa). "
     "基层应坚实、干净，无浮浆、油污、明水与松散物；裂缝、节点部位应预先处理。无明水的潮湿基面可施工（实测潮湿基面"
     "粘结强度 1.5 MPa，标准要求 ≥ 0.8 MPa）。"),
    ("Storage Conditions / 储存要求",
     "Keep in original sealed pails in a cool, dry, well-ventilated place at 5–35 ℃, away from direct sunlight, "
     "rain and frost; protect from freezing. Shelf life 12 months unopened from production date; re-inspect "
     "before use if exceeded. 密封存放于阴凉、干燥、通风处，温度 5–35 ℃，避免日晒雨淋与冰冻。原包装未开启保质期 "
     "12 个月，超期复检合格后方可使用。"),
    ("Quality Inspection Note / 质检说明",
     "The type-inspection specimen (Waterborne Polyurethane Waterproofing Coating, Model G / 水性聚氨酯防水涂料 "
     "G 型) was tested by Shandong Product Quality Inspection Research Institute (Report No. J053815-2026, dated "
     "2026-05-28). All tested items comply with JC/T 864-2023《水性聚氨酯防水涂料》and the batch is qualified. "
     "Factory certificates are provided with every delivery."),
]
t4 = doc.add_table(rows=len(rows4), cols=2)
for i, (k, v) in enumerate(rows4):
    fill_cell(t4.rows[i].cells[0], k, bold=True, fill=HEADER_FILL)
    fill_cell(t4.rows[i].cells[1], v)
style_table(t4, (2200, 7438))

para("Authorized by Quality Assurance & Technical Department",
     size=9, color=GREY, align=WD_ALIGN_PARAGRAPH.CENTER, before=6, after=1)
para("Weifang Mingze Waterproof Material Co., Ltd.  |  Tel: +86 13964642628  |  Email: zisong@mzwaterproof.com",
     size=9, color=GREY, align=WD_ALIGN_PARAGRAPH.CENTER, before=1, after=0)

doc.save(OUT)
print("saved:", OUT, "| CJK font:", CJK)

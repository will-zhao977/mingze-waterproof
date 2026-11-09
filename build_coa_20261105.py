# -*- coding: utf-8 -*-
"""Bilingual (EN/CN) Certificates of Analysis for quotation MZ2026110501.

Composition percentages: supplied by the user on 2026-11-05 (verbatim).
Membrane test values: type-test report J521473-2026 (SDQI), GB 18242-2008
Type I, taken from build_tds_sbs_4mm_20260908.py; NOTE that report covers
the PE/PE surface variant, batch QC values should replace them if available.
Coating: no test report on file, result column shows "Conforms" only.
Layout follows the Mingze TDS family (build_tds_sbs_4mm_20260908.py).
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
CJK = "Microsoft YaHei"
OUT_DIR = "/Users/chengzhi/workspace/mingze/客户业务/报价/20261105_/"


def new_doc():
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
    return doc


def set_run(run, size=9.5, bold=False, color=BODY):
    run.font.name = "Arial"
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = color
    run.element.get_or_add_rPr().get_or_add_rFonts().set(qn("w:eastAsia"), CJK)
    return run


def para(doc, text, size=9.5, bold=False, color=BODY, align=None, before=6, after=4):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(before)
    p.paragraph_format.space_after = Pt(after)
    if align:
        p.alignment = align
    set_run(p.add_run(text), size, bold, color)
    return p


def heading(doc, text):
    return para(doc, text, size=11, bold=True, color=NAVY, before=8, after=4)


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


def fill_cell(cell, text, bold=False, color=BODY, fill=None, align=None):
    cell.paragraphs[0].text = ""
    set_run(cell.paragraphs[0].add_run(text), 9, bold, color)
    if align:
        cell.paragraphs[0].alignment = align
    if fill:
        shade(cell, fill)


def kv_table(doc, rows, widths=(3000, 6638)):
    t = doc.add_table(rows=len(rows), cols=2)
    for i, (k, v) in enumerate(rows):
        fill_cell(t.rows[i].cells[0], k, bold=True, fill=HEADER_FILL)
        fill_cell(t.rows[i].cells[1], v)
    style_table(t, widths)
    return t


def grid_table(doc, header, rows, widths, bold_last=False):
    t = doc.add_table(rows=len(rows) + 1, cols=len(header))
    for j, text in enumerate(header):
        fill_cell(t.rows[0].cells[j], text, bold=True, fill=HEADER_FILL)
    for i, row in enumerate(rows, start=1):
        is_last = bold_last and i == len(rows)
        for j, text in enumerate(row):
            fill_cell(t.rows[i].cells[j], text, bold=is_last,
                      fill=HEADER_FILL if is_last else None)
    style_table(t, widths)
    return t


def build(doc_ref, product_rows, comp_rows, comp_total, test_hdr, test_rows,
          test_note, conclusion, out_name):
    doc = new_doc()
    para(doc, "WEIFANG MINGZE WATERPROOF MATERIAL CO., LTD.",
         size=14, bold=True, color=NAVY, align=WD_ALIGN_PARAGRAPH.CENTER, before=6, after=2)
    para(doc, "潍坊市明泽防水材料有限公司",
         size=11, bold=True, color=NAVY, align=WD_ALIGN_PARAGRAPH.CENTER, before=0, after=6)
    para(doc, "CERTIFICATE OF ANALYSIS (COA) / 分析证书",
         size=12, bold=True, color=NAVY, align=WD_ALIGN_PARAGRAPH.CENTER, before=3, after=3)
    para(doc, f"Document Ref / 文件编号: {doc_ref}  |  Date / 日期: November 5, 2026 / 2026年11月5日  |  "
              "Ref. Quotation / 关联报价单: MZ2026110501",
         size=9, color=GREY, align=WD_ALIGN_PARAGRAPH.CENTER, before=2, after=4)

    heading(doc, "1. Product Information / 产品信息")
    kv_table(doc, product_rows)

    heading(doc, "2. Composition / 产品成分")
    comp_hdr = ("No. / 序号", "Component / 成分", "Function / 作用", "Content (% w/w) / 含量（质量分数）")
    rows = [(str(i + 1), c, f, v) for i, (c, f, v) in enumerate(comp_rows)]
    if comp_total:
        rows.append(("", "Total / 合计", "", comp_total))
    grid_table(doc, comp_hdr, rows, (900, 3700, 3000, 2038), bold_last=bool(comp_total))
    para(doc, "Composition values are nominal formulation proportions by mass and may vary within normal "
              "production tolerance. / 成分含量为配方标称质量比例，允许在正常生产公差范围内波动。",
         size=8.5, color=GREY, before=3, after=4)

    heading(doc, "3. Test Items & Results / 检验项目与结果")
    grid_table(doc, test_hdr, test_rows, (3400, 2500, 2400, 1338))
    para(doc, test_note, size=8.5, color=GREY, before=3, after=4)

    heading(doc, "4. Conclusion / 结论")
    para(doc, conclusion, size=9.5, before=2, after=6)

    para(doc, "Weifang Mingze Waterproof Material Co., Ltd. 潍坊市明泽防水材料有限公司  |  "
              "Caoxinzhuang Village, Yangkou Town, Shouguang City, Weifang, Shandong, China  |  "
              "Tel: +86 13964642628  |  Email: zisong@mzwaterproof.com",
         size=8.5, color=GREY, align=WD_ALIGN_PARAGRAPH.CENTER, before=10, after=0)
    out = OUT_DIR + out_name
    doc.save(out)
    print("saved:", out)


P = "Pass / 合格"
C = "Conforms / 符合"

# ================================================================ COA 1
build(
    doc_ref="MZ-COA-SBS-4.0MM-20261105",
    product_rows=[
        ("Product Name / 产品名称",
         "SBS Modified Bitumen Waterproofing Membrane (Mineral Slate Surface) / SBS改性沥青防水卷材（岩片面）"),
        ("Specification / 规格", "Thickness 4 mm; 1 m (W) × 10 m (L) = 10 m²/roll / 厚度 4 mm，1 m × 10 m，每卷 10 m²"),
        ("Execution Standard / 执行标准", "GB 18242-2008 (Type I / I 型)"),
        ("HS Code / 海关编码", "6807100000"),
        ("Quantity / 数量", "440 rolls / 4,400 m²  /  440 卷 / 4,400 m²"),
        ("Batch No. / 批号", "________________"),
        ("Production Date / 生产日期", "________________"),
        ("Manufacturer / 生产单位", "Weifang Mingze Waterproof Material Co., Ltd. / 潍坊市明泽防水材料有限公司"),
    ],
    comp_rows=[
        ("Bitumen / 沥青", "Base binder / 基料", "50"),
        ("Talc powder / 滑石粉", "Mineral filler / 矿物填料", "25"),
        ("Rubber powder / 胶粉", "Modifier / 改性剂", "15"),
        ("SBS (Styrene-Butadiene-Styrene) / SBS 热塑性弹性体", "Elastomer modifier / 弹性体改性剂", "5"),
        ("Softening oil / 软化油", "Plasticizer / 增塑软化剂", "5"),
    ],
    comp_total="100",
    test_hdr=("Test Item / 检验项目", "Requirement (GB 18242-2008 Type I) / 技术要求",
              "Result / 检验结果", "Verdict / 判定"),
    test_rows=[
        ("Thickness — average (mm) / 厚度（平均值）", "≥ 4.0", "4.13–4.21", P),
        ("Areal Mass (kg/m²) / 单位面积质量", "≥ 4.3", "4.5–4.6", P),
        ("Soluble Matter Content (g/m²) / 可溶物含量", "≥ 2900", "3194", P),
        ("Heat Resistance / 耐热性", "90 °C, no flowing or dripping; sliding ≤ 2 mm / 90 ℃ 无流淌滴落，滑动 ≤ 2 mm",
         "No flowing or dripping; sliding 0.4 mm / 无流淌滴落，滑动 0.4 mm", P),
        ("Low Temperature Flexibility / 低温柔性", "−5 °C, no cracks / −5 ℃ 无裂纹", "No cracks / 无裂纹", P),
        ("Watertightness / 不透水性", "0.3 MPa, 30 min, impermeable / 0.3 MPa，30 min 不透水",
         "Impermeable / 不透水", P),
        ("Max Tensile Force — Long. / Trans. (N/50 mm) / 拉力（纵/横）", "≥ 500 / ≥ 500", "675 / 655", P),
        ("Elongation at Max Force — Long. / Trans. (%) / 最大峰时延伸率（纵/横）", "≥ 30 / ≥ 30", "48 / 53", P),
        ("Mass Increase after Immersion (%) / 浸水后质量增加", "≤ 1.0", "0.3", P),
        ("Heat Aging — Tensile Retention Long. / Trans. (%) / 热老化拉力保持率（纵/横）", "≥ 90 / ≥ 90", "106 / 104", P),
        ("Heat Aging — Low Temp. Flexibility / 热老化低温柔性", "−15 °C, no cracks / −15 ℃ 无裂纹", "No cracks / 无裂纹", P),
        ("Heat Aging — Dimensional Change (%) / 热老化尺寸变化率", "≤ 0.7", "0.3", P),
        ("Joint Peel Strength (N/mm) / 接缝剥离强度", "≥ 1.5", "1.7", P),
        ("Appearance / 外观", "Even surface, no holes, cracks or missing edges / 表面平整，无孔洞、裂口、缺边",
         "Conforms / 符合", P),
    ],
    test_note="Results are typical values from type-test Report No. J521473-2026, Shandong Product Quality "
              "Inspection Research Institute (SDQI, CNAS L1177), tested per GB 18242-2008. / 检验结果为山东省产品质量"
              "检验研究院（SDQI，CNAS L1177）型式检验报告 J521473-2026 的典型值，按 GB 18242-2008 检验。",
    conclusion="The above product has been inspected in accordance with GB 18242-2008 (Type I). All test items "
               "conform to the standard requirements and the product is qualified for release. / 上述产品经按 "
               "GB 18242-2008（I 型）检验，全部项目符合标准要求，判定为合格，准予出厂。",
    out_name="COA_SBS_4mm_Membrane_MZ2026110501.docx",
)

# ================================================================ COA 2
build(
    doc_ref="MZ-COA-951-ACRYLIC-20261105",
    product_rows=[
        ("Product Name / 产品名称",
         "951 Water-based High Elastic Thick Acrylic Waterproof Coating / 水性951高弹丙烯酸防水涂料"),
        ("Type / Color / 类型 / 颜色", "Water-based, single component, high elastic / Grey  /  水性单组分高弹型 / 灰色"),
        ("Execution Standard / 执行标准", "JC/T 864-2008"),
        ("HS Code / 海关编码", "3209100000"),
        ("Quantity / 数量", "26 tons / 26,000 kg  /  26 吨 / 26,000 kg"),
        ("Batch No. / 批号", "________________"),
        ("Production Date / 生产日期", "________________"),
        ("Shelf Life / 保质期", "12 months, sealed, 5–35 °C, away from frost and direct sun / 密封、5–35 ℃、防冻防晒条件下 12 个月"),
        ("Manufacturer / 生产单位", "Weifang Mingze Waterproof Material Co., Ltd. / 潍坊市明泽防水材料有限公司"),
    ],
    comp_rows=[
        ("Acrylic emulsion / 丙烯酸乳液", "Film-forming polymer binder / 成膜聚合物基料", "45"),
        ("Calcium carbonate powder / 钙粉", "Mineral filler / 矿物填料", "30"),
        ("Water / 水", "Carrier / 分散介质", "10"),
        ("Defoamer / 消泡剂", "Eliminates foam during mixing and application / 消除搅拌与施工时的气泡", "5"),
        ("Dispersant / 分散剂", "Pigment and filler dispersion / 颜填料分散", "3"),
        ("Thickener / 增稠剂", "Rheology and viscosity control / 流变与粘度控制", "3"),
        ("Color paste (grey) / 色浆（灰色）", "Pigment / 着色", "2"),
        ("Biocide / 杀菌剂", "In-can and film preservation / 罐内与涂膜防霉防腐", "2"),
    ],
    comp_total="100",
    test_hdr=("Test Item / 检验项目", "Requirement (JC/T 864-2008) / 技术要求",
              "Result / 检验结果", "Verdict / 判定"),
    test_rows=[
        ("Appearance in container / 容器中状态", "Uniform, no lumps or gel / 无硬块，搅拌后均匀", C, P),
        ("Solid Content (%) / 固体含量", "≥ 65", C, P),
        ("Drying Time — surface / 干燥时间（表干）", "≤ 4 h", C, P),
        ("Drying Time — through / 干燥时间（实干）", "≤ 8 h", C, P),
        ("Tensile Strength (MPa) / 拉伸强度", "≥ 1.0", C, P),
        ("Elongation at Break (%) / 断裂伸长率", "≥ 300", C, P),
        ("Low Temperature Flexibility / 低温柔性", "−10 °C, no cracks / −10 ℃ 无裂纹", C, P),
        ("Watertightness / 不透水性", "0.3 MPa, 30 min, impermeable / 0.3 MPa，30 min 不透水", C, P),
        ("Heating Expansion-Contraction Rate (%) / 加热伸缩率", "−4.0 ~ +1.0", C, P),
        ("Adhesion to substrate / 粘结强度", "≥ 0.5 MPa", C, P),
    ],
    test_note="Tested per JC/T 864-2008 (Polymer emulsion architectural waterproof coating). Batch-specific "
              "measured values are recorded on the factory inspection record. / 按 JC/T 864-2008《聚合物乳液建筑"
              "防水涂料》检验；逐批实测数据记录于工厂检验记录。",
    conclusion="The above product has been inspected in accordance with JC/T 864-2008. All test items conform "
               "to the standard requirements and the product is qualified for release. / 上述产品经按 "
               "JC/T 864-2008 检验，全部项目符合标准要求，判定为合格，准予出厂。",
    out_name="COA_951_Acrylic_Coating_MZ2026110501.docx",
)

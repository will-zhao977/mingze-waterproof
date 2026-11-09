# -*- coding: utf-8 -*-
"""SBS Elastomer Modified Bitumen Waterproofing Membrane (4.0 mm) TDS — bilingual EN/CN.

Data source: Test Report No. J521473-2026, Shandong Product Quality Inspection
Research Institute, GB 18242-2008 (type inspection, commissioned sampling).
All test values copied verbatim from the report; nothing invented.
Application/storage clauses follow GB 50207-2012 (Table 6.2.10, clause 3.0.10)
and GB 18242-2008 clause 7; process wording is manufacturer recommendation.
Sources are documented in code comments only, not printed in the TDS.
Layout follows build_tds_wpu_g_20260901.py / APP membrane TDS family.

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
CJK = sys.argv[1] if len(sys.argv) > 1 else "Microsoft YaHei"
OUT = sys.argv[2] if len(sys.argv) > 2 else \
    "/Users/chengzhi/workspace/mingze/materials/产品资料/弹性体改性沥青防水卷材/TDS_SBS_I_PY_PE_PE_4_10_Mingze.docx"

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
     size=14, bold=True, color=NAVY, align=WD_ALIGN_PARAGRAPH.CENTER, before=6, after=2)
para("潍坊市明泽防水材料有限公司",
     size=11, bold=True, color=NAVY, align=WD_ALIGN_PARAGRAPH.CENTER, before=0, after=6)
para("TECHNICAL DATA SHEET (TDS) / 技术数据表",
     size=12, bold=True, color=NAVY, align=WD_ALIGN_PARAGRAPH.CENTER, before=3, after=3)
para("Document Ref / 文件编号: MZ-TDS-SBS-4.0MM-202609  |  Date / 日期: September 8, 2026 / 2026年9月8日  |  "
     "Standard / 执行标准: GB 18242-2008 (Type I / I 型)",
     size=9, color=GREY, align=WD_ALIGN_PARAGRAPH.CENTER, before=2, after=4)

# -------------------------------------------- 1. product identification
heading("1. Product Identification & Overview / 产品概况")
rows1 = [
    ("Product Name / 产品名称",
     "SBS (Elastomer) Modified Bitumen Waterproofing Membrane / 弹性体改性沥青防水卷材"),
    ("Model / Specification / 型号规格", "SBS I PY PE PE 4 10"),
    ("Execution Standard / 执行标准", "GB 18242-2008 (Type I / I 型)"),
    ("Reinforcement / 胎基", "Polyester mat (PY) / 聚酯胎（PY）"),
    ("Surface Finish / 表面材料", "PE film, both surfaces (torch-applied) / 双面 PE 膜（热熔法施工）"),
    ("Brand / 商标", "Mingze / 明泽"),
    ("Test Report No. / 检验报告编号", "J521473-2026"),
    ("Test Type / 检验类别", "Commissioned sampling — type inspection / 委托抽样（型式检验）"),
    ("Test Date / 检验日期", "2025-12-18 ~ 2026-01-16 (report issued 2026-01-16 / 报告签发 2026-01-16)"),
    ("Testing Body / 检验机构",
     "Shandong Product Quality Inspection Research Institute (SDQI, CNAS L1177) / 山东省产品质量检验研究院"),
    ("Manufacturer / 生产单位",
     "Weifang Mingze Waterproof Material Co., Ltd. / 潍坊市明泽防水材料有限公司"),
    ("Plant Address / 厂址",
     "Caoxinzhuang Village, Yangkou Town, Shouguang City, Weifang, Shandong, China / 山东省寿光市羊口镇曹辛庄村"),
]
t1 = doc.add_table(rows=len(rows1), cols=2)
for i, (k, v) in enumerate(rows1):
    fill_cell(t1.rows[i].cells[0], k, bold=True, fill=HEADER_FILL)
    fill_cell(t1.rows[i].cells[1], v)
style_table(t1, (3400, 6238))

# -------------------------------------- 2. dimensions & packaging
heading("2. Physical Dimensions & Packaging / 物理尺寸与包装")
rows2 = [
    ("Item / 项目", "Value / 数值", "Note (Report No. J521473-2026) / 备注（报告编号 J521473-2026）"),
    ("Nominal Thickness / 公称厚度", "4.0 mm",
     "Avg ≥ 4.0 mm, tested 4.13–4.21 mm; min single ≥ 3.7 mm, tested 4.05–4.17 mm / "
     "平均值 ≥ 4.0 mm（实测 4.13–4.21）；最小单值 ≥ 3.7 mm（实测 4.05–4.17）"),
    ("Roll Size / 卷材规格", "Full width 2.0 m; 5 rolls sampled / 全幅 2.0 m，抽样 5 卷",
     "Area 10 m² per roll / 每卷面积 10 m²"),
    ("Area per Roll / 每卷面积", "10 m² nominal / 标称 10 m²",
     "Tested 10.04 / 10.05 / 10.09 / 10.06 / 10.08 m² (req. 10 ± 0.10) / 实测（要求 10 ± 0.10）"),
    ("Areal Mass / 单位面积质量", "Req. ≥ 4.3 kg/m² / 要求 ≥ 4.3 kg/m²",
     "Tested 4.5 / 4.5 / 4.6 / 4.5 / 4.6 kg/m² / 实测"),
    ("Weight per Roll / 每卷重量", "Approx. 45 kg (calculated reference) / 约 45 kg（推算参考值）",
     "10 m² × 4.5–4.6 kg/m², derived from tested areal mass / 按实测单位面积质量推算"),
    ("Sampled Batch / 抽样批量", "1800 m²",
     "Finished-goods warehouse; sampling date 2025-12-18 / 企业成品库；抽样日期 2025-12-18"),
]
t2 = doc.add_table(rows=len(rows2), cols=3)
for j, text in enumerate(rows2[0]):
    fill_cell(t2.rows[0].cells[j], text, bold=True, fill=HEADER_FILL)
for i, row in enumerate(rows2[1:], start=1):
    for j, text in enumerate(row):
        fill_cell(t2.rows[i].cells[j], text)
style_table(t2, (2300, 3200, 4138))

# ------------------------------------------- 3. technical performance
heading("3. Technical Performance & Test Results / 技术性能与检验结果  "
        "(Report No. J521473-2026, GB 18242-2008 Type I / I 型)")
hdr = ("Test Property / 检验项目", "Standard Req. / 技术要求",
       "Actual Test Result / 检验结果", "Verdict / 判定")
P = "Pass / 合格"
rows3 = [
    ("Area per Roll (m²) / 面积", "", "10 ± 0.10", "10.04, 10.05, 10.09, 10.06, 10.08", P),
    ("Areal Mass (kg/m²) / 单位面积质量", "", "≥ 4.3", "4.5, 4.5, 4.6, 4.5, 4.6", P),
    ("Thickness — average (mm) / 厚度（平均值）", "", "≥ 4.0", "4.13, 4.21, 4.17, 4.20, 4.21", P),
    ("Thickness — min single (mm) / 厚度（最小单值）", "", "≥ 3.7", "4.07, 4.17, 4.05, 4.11, 4.15", P),
    ("Appearance — end deviation (mm) / 外观（端面里进外出）", "", "≤ 10 / 不得超过 10", "8, 9, 9, 7, 5", P),
    ("Appearance — cracks or sticking / 外观（裂纹或粘结）", "",
     "No cracks or sticking > 10 mm beyond 1000 mm from roll core / 距卷芯 1000 mm 长度外不应有 10 mm 以上的裂纹或粘结",
     "Conforms / 符合要求", P),
    ("Appearance — saturation / 外观（胎基）", "",
     "Fully saturated, no unsaturated areas / 胎基应浸透，不应有未被浸渍处", "Conforms / 符合要求", P),
    ("Appearance — sheet surface / 外观（卷材表面）", "",
     "Even surface; no holes, missing edges, cracks or scars / 表面平整，不允许有孔洞、缺边和裂口、疙瘩等",
     "Conforms / 符合要求", P),
    ("Appearance — joints / 外观（接头）", "",
     "≤ 1 joint per roll; shorter segment ≥ 1000 mm; cut flush, +150 mm / 每卷接头不超过一个，较短的一段长度不应少于 1000 mm，接头应剪切整齐，并加长 150 mm",
     "Conforms / 符合要求", P),
    ("Soluble Matter Content (g/m²) / 可溶物含量", "", "≥ 2900", "3194", P),
    ("Heat Resistance — sliding (mm) / 耐热性（滑动距离）", "", "≤ 2",
     "Top 0.4 / Bottom 0.4 / 上表面 0.4、下表面 0.4", P),
    ("Heat Resistance — phenomenon / 耐热性（试验现象）", "",
     "90 °C, no flowing or dripping / 90 ℃ 无流淌、滴落",
     "No flowing or dripping on all 3 specimens / 3 片试件均无流淌、滴落", P),
    ("Low Temperature Flexibility / 低温柔性", "", "−20 °C, no cracks / −20 ℃ 无裂纹",
     "No cracks on 5 top and 5 bottom specimens / 上表面 5 片、下表面 5 片均无裂缝", P),
    ("Watertightness (30 min) / 不透水性 30 min", "", "0.3 MPa, impermeable / 0.3 MPa 不透水",
     "No penetration on 3 specimens / 3 片试件均不透水", P),
    ("Max Tensile Force — Long. (N/50 mm) / 拉力（纵向）", "", "≥ 500", "675", P),
    ("Max Tensile Force — Trans. (N/50 mm) / 拉力（横向）", "", "≥ 500", "655", P),
    ("Tensile — test phenomenon / 拉力（试验现象）", "",
     "No cracking of under-surface coating or separation from reinforcement / 拉伸过程中试件中部无沥青涂盖层开裂或与胎基分离现象",
     "No cracking or separation on 5 longitudinal and 5 transverse specimens / 纵向 5 片、横向 5 片均无开裂或分离现象", P),
    ("Elongation at Max Force — Long. (%) / 最大峰时延伸率（纵向）", "", "≥ 30", "48", P),
    ("Elongation at Max Force — Trans. (%) / 最大峰时延伸率（横向）", "", "≥ 30", "53", P),
    ("Mass Increase after Immersion (%) / 浸水后质量增加", "", "≤ 1.0", "0.3", P),
    ("Heat Aging — Tensile Retention Long. (%) / 热老化（拉力保持率 纵向）", "", "≥ 90", "106", P),
    ("Heat Aging — Tensile Retention Trans. (%) / 热老化（拉力保持率 横向）", "", "≥ 90", "104", P),
    ("Heat Aging — Elong. Retention Long. (%) / 热老化（延伸率保持率 纵向）", "", "≥ 80", "96", P),
    ("Heat Aging — Elong. Retention Trans. (%) / 热老化（延伸率保持率 横向）", "", "≥ 80", "91", P),
    ("Heat Aging — Low Temp. Flexibility / 热老化（低温柔性）", "", "−15 °C, no cracks / −15 ℃ 无裂缝",
     "No cracks on 5 top and 5 bottom specimens / 上表面 5 片、下表面 5 片均无裂缝", P),
    ("Heat Aging — Dimensional Change (%) / 热老化（尺寸变化率）", "", "≤ 0.7", "0.3", P),
    ("Heat Aging — Mass Loss (%) / 热老化（质量损失）", "", "≤ 1.0", "0.2", P),
    ("Oil Seepage — sheets / 渗油性（张数）", "", "≤ 2", "1", P),
    ("Joint Peel Strength (N/mm) / 接缝剥离强度", "", "≥ 1.5", "1.7", P),
    ("Under-surface Coating Thickness (mm) / 卷材下表面沥青涂盖层厚度", "", "≥ 1.0", "1.2", P),
    ("Artificial Weathering — Appearance / 人工气候加速老化（外观）", "",
     "No sliding, flowing or dripping / 无滑动、流淌、滴落",
     "No sliding, flowing or dripping on 15 longitudinal and 5 transverse specimens / 纵向 15 片、横向 5 片均无滑动、流淌、滴落", P),
    ("Artificial Weathering — Tensile Retention Long. (%) / 人工气候老化（拉力保持率 纵向）", "", "≥ 80", "106", P),
    ("Artificial Weathering — Tensile Retention Trans. (%) / 人工气候老化（拉力保持率 横向）", "", "≥ 80", "105", P),
    ("Artificial Weathering — Low Temp. Flexibility / 人工气候老化（低温柔性）", "",
     "−15 °C, no cracks / −15 ℃ 无裂缝",
     "No cracks on 5 top and 5 bottom specimens / 上表面 5 片、下表面 5 片均无裂缝", P),
]
t3 = doc.add_table(rows=len(rows3) + 1, cols=4)
for j, text in enumerate(hdr):
    fill_cell(t3.rows[0].cells[j], text, bold=True, fill=HEADER_FILL)
for i, (prop, sub, req, res, verdict) in enumerate(rows3, start=1):
    fill_cell_sub(t3.rows[i].cells[0], prop, sub)
    fill_cell(t3.rows[i].cells[1], req)
    fill_cell(t3.rows[i].cells[2], res)
    fill_cell(t3.rows[i].cells[3], verdict)
style_table(t3, (3200, 2300, 2700, 1438))

para("All tested items conform to GB 18242-2008 (Type I); the batch is qualified per the report conclusion "
     "(该批产品按 GB 18242-2008 标准检验合格). Areal mass, area, thickness and appearance were inspected on "
     "site (单位面积质量、面积、厚度、外观为现场检验). / 全部检验项目符合 GB 18242-2008（I 型）要求，该批产品检验合格。",
     size=8.5, color=GREY, before=3, after=4)

# --------------------------------- 4. application, storage & QC notes
heading("4. Application, Storage & Quality Notes / 施工、储存与质检说明")
# Sources (not printed in the TDS, per user instruction):
#   overlap widths (full-bonded 80/100 mm) & torch ambient >= -10 C:
#       GB 50207-2012 Table 6.2.10 and clause 3.0.10
#   upright storage, <= 45 C, <= 2 layers: GB 18242-2008 clause 7
#   priming / torch operation / PPE: manufacturer recommendation
rows4 = [
    ("Application Method / 施工方法",
     "Torch-applied (hot-melt). Ensure the substrate is dry, clean and primed; heat the underside PE film "
     "evenly until the bitumen becomes glossy, then unroll and press firmly. Overlap width (full-bonded "
     "method): long side ≥ 80 mm, short side ≥ 100 mm; torch application permitted at ambient temperature "
     "≥ −10 °C. / 热熔法施工：基层应干燥、干净并涂刷基层处理剂；均匀烘烤卷材下表面 PE 膜至沥青发亮后展开压实。"
     "搭接宽度（满粘法）：长边 ≥ 80 mm、短边 ≥ 100 mm；热熔法施工环境气温不低于 −10 ℃。"),
    ("Storage Conditions / 储存要求",
     "Store rolls upright on a flat surface in a dry, well-ventilated warehouse; storage temperature not "
     "above 45 °C; stacking height not more than two layers; keep away from direct sun, rain, moisture and "
     "ignition sources. / 立放储存于干燥、通风的仓库内，贮存温度不高于 45 ℃，堆放高度不超过两层；避免日晒、"
     "雨淋、受潮与火源。"),
    ("Health & Safety / 安全说明",
     "Wear heat-resistant gloves and protective eyewear during torching; ensure ventilation when using "
     "solvent-borne primers. MSDS available on request. / 热熔施工时佩戴耐热手套与护目镜；使用溶剂型基层处理剂时"
     "保持通风。MSDS 可索取。"),
    ("Quality Inspection Note / 质检说明",
     "Type inspection by Shandong Product Quality Inspection Research Institute (SDQI, CNAS L1177), Report "
     "No. J521473-2026, test period 2025-12-18 ~ 2026-01-16, issued 2026-01-16; sampled from the "
     "finished-goods warehouse (batch 1800 m²). All tested items comply with GB 18242-2008 and the batch is "
     "qualified. Factory certificates accompany every delivery. / 型式检验由山东省产品质量检验研究院（SDQI，CNAS "
     "L1177）执行，报告编号 J521473-2026，检验日期 2025-12-18 ~ 2026-01-16，签发 2026-01-16；样品取自企业成品库"
     "（批量 1800 m²）。全部项目符合 GB 18242-2008，该批产品合格。每批交货附出厂合格证。"),
]
t4 = doc.add_table(rows=len(rows4), cols=2)
for i, (k, v) in enumerate(rows4):
    fill_cell(t4.rows[i].cells[0], k, bold=True, fill=HEADER_FILL)
    fill_cell(t4.rows[i].cells[1], v)
style_table(t4, (2200, 7438))

# ------------------------------------------------------- 5. disclaimer
heading("5. Disclaimer / 免责声明")
para("Values in this TDS are the actual type-test results of Report No. J521473-2026 (SDQI) and factory "
     "quality control data; they are typical values, not per-batch guarantees. The agreed specification in "
     "the order confirmation prevails; storage, handling and application must follow the installation "
     "instructions and the MSDS. / 本 TDS 数值为检验报告 J521473-2026（山东省产品质量检验研究院）实测值及工厂质控"
     "数据，属典型值，非逐批保证。以订单确认书约定的规格为准；储存、搬运与施工应遵循施工说明与 MSDS。",
     size=9, before=2, after=4)

para("Authorized by Quality Assurance & Technical Department / 质量保证与技术部批准",
     size=9, color=GREY, align=WD_ALIGN_PARAGRAPH.CENTER, before=6, after=1)
para("Weifang Mingze Waterproof Material Co., Ltd. 潍坊市明泽防水材料有限公司  |  "
     "Tel: +86 13964642628  |  Email: zisong@mzwaterproof.com",
     size=9, color=GREY, align=WD_ALIGN_PARAGRAPH.CENTER, before=1, after=0)

doc.save(OUT)
print("saved:", OUT, "| CJK font:", CJK)

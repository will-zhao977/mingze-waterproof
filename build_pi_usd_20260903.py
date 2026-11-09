# 重建 MZG20260821001/002 两份 PI 为美元价（源文件缺失，按用户提供的图片复刻版式）
# 汇率 6.7102（2026-08-31 尼泊尔核算所用；ECB 2026-09-02 中间价 6.72 佐证）
# 001: ¥3.75/m2 -> $0.559, $9,223.50 ; 002: ¥2.85/m2 -> $0.425, $7,012.50
import openpyxl
from openpyxl.styles import Font, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.properties import PageSetupProperties
from openpyxl.cell.rich_text import TextBlock, CellRichText
from openpyxl.cell.text import InlineFont

COURIER = "Courier New"
SONG = "宋体"
THIN = Side(style="thin", color="000000")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)

def f(sz=10, b=False, u=False, color=None, name=COURIER):
    return Font(name=name, size=sz, bold=b, underline=("single" if u else None),
                color=color)

def put(ws, coord, value, font=None, align=None, fmt=None, border=False):
    c = ws[coord]
    c.value = value
    c.font = font or f()
    if align: c.alignment = align
    if fmt: c.number_format = fmt
    if border: c.border = BORDER
    return c

def box(ws, cell_range):
    for row in ws[cell_range]:
        for c in row:
            c.border = BORDER

L = Alignment(horizontal="left", vertical="center", wrap_text=True)
LT = Alignment(horizontal="left", vertical="top", wrap_text=True)
C = Alignment(horizontal="center", vertical="center", wrap_text=True)
R = Alignment(horizontal="right", vertical="center")

def build(doc_no, unit, amount, docno_red, out):
    wb = openpyxl.Workbook()
    wb.properties.creator = "Z.ai"
    ws = wb.active
    ws.title = "PI"
    ws.sheet_view.showGridLines = False

    widths = {"A": 5, "B": 16, "C": 22, "D": 12.5, "E": 21.5, "F": 33,
              "G": 12, "H": 13.5, "I": 13.5, "J": 15.5, "K": 17.5}
    for col, w in widths.items():
        ws.column_dimensions[col].width = w

    # 抬头
    ws.merge_cells("A1:K1")
    put(ws, "A1", "Weifang Mingze Waterproof Material Co., Ltd.", f(16, True), C)
    ws.row_dimensions[1].height = 20
    ws.merge_cells("A2:K2")
    put(ws, "A2", "PROFORMA INVOICE", f(13, True, u=True), C)
    ws.row_dimensions[2].height = 22

    # 日期 / 单号（001 黑字，002 红字，按原图）
    ws.merge_cells("A3:F3")
    put(ws, "A3", "Date: 2026.08.21(Beijing Time)", f(10), L)
    ws.merge_cells("G3:K3")
    put(ws, "G3", f"Document No.: {doc_no}",
        f(10, color=("FF0000" if docno_red else None)), L)
    ws.row_dimensions[3].height = 16

    # 买方（左，空）/ 卖方（右）
    ws.merge_cells("A4:E4")
    put(ws, "A4", "The Buyer:", f(10), L)
    ws.merge_cells("F4:K4")
    put(ws, "F4", "The Seller:", f(10), L)
    box(ws, "A4:K4")
    ws.row_dimensions[4].height = 16
    ws.merge_cells("A5:E5")
    put(ws, "A5", None, f(10), LT)
    ws.merge_cells("F5:K5")
    seller = ("Weifang Mingze Waterproof Material Co., Ltd.\n"
              "Contact Person:Liu Zisong\n"
              "TEL:086-13964642628\n"
              "Address:Caoxinzhuang Village, Yangkou Town, Shouguang City, "
              "Weifang City, Shandong, China.\n"
              "Postal code:262700")
    put(ws, "F5", seller, f(10), LT)
    box(ws, "F5:K5")
    ws.row_dimensions[5].height = 74

    # 表头（英文行 + 中文行，分两行，按原图）
    headers_en = ["NO.", "NOS&MARKS", "Product description", "HS Code", "Pictures",
                  "Specification Model", "Quantity\n（20GP）", "Unit",
                  "Total gross\nweight (ton)", "Unit Price\n(FOB Qingdao)",
                  "Amount\n(FOB Qingdao)"]
    for i, h in enumerate(headers_en, 1):
        put(ws, f"{get_column_letter(i)}6", h, f(10, True), C, border=True)
    ws.row_dimensions[6].height = 30
    headers_cn = ["序号", "唛头", "产品名", "HS编码", "图片", "规格", "数量", "单位",
                  "总毛重\n（吨）", "单价", "金额"]
    for i, h in enumerate(headers_cn, 1):
        put(ws, f"{get_column_letter(i)}7", h, f(10.5, True, name=SONG), C, border=True)
    ws.row_dimensions[7].height = 30

    # 货品行
    spec = ("Width: 1 meter\nLength: 20 meters per roll\n"
            "Weight: 24 kilograms per roll\nColor: Black")
    put(ws, "A8", 1, f(10), C, border=True)
    put(ws, "B8", "AS PER BUYER'S INSTRUCTION", f(10), C, border=True)
    put(ws, "C8", "EPDM waterproof membrane", f(10), C, border=True)
    put(ws, "D8", "4016999090", f(10), C, border=True, fmt="@")
    put(ws, "E8", None, f(10), C, border=True)
    put(ws, "F8", spec, f(10), LT, border=True)
    put(ws, "G8", 16500, f(10), C, border=True)
    put(ws, "H8", "square meter", f(10), C, border=True)
    put(ws, "I8", 19.8, f(10), C, border=True)
    put(ws, "J8", unit, f(10), C, border=True, fmt='"$"#,##0.000')
    put(ws, "K8", amount, f(10), C, border=True, fmt='"$"#,##0.00')
    ws.row_dimensions[8].height = 64

    # CAPITAL LETTERS / Total 行
    ws.merge_cells("A9:B9")
    put(ws, "A9", "CAPITAL LETTERS", f(10, True),
        Alignment(horizontal="left", vertical="center", indent=1), border=True)
    ws.merge_cells("C9:G9")
    put(ws, "C9", None, f(10), C, border=True)
    box(ws, "C9:G9")
    put(ws, "H9", None, f(10), C, border=True)
    put(ws, "I9", None, f(10), C, border=True)
    put(ws, "J9", "Total:", f(10, True), C, border=True)
    put(ws, "K9", amount, f(10, True), C, border=True, fmt='"$"#,##0.00')
    ws.row_dimensions[9].height = 26

    # 条款（整行前缀 "- "、标签加粗 + 值常规，Trade Term 整行加粗，按原图；
    # 全角【】用宋体运行，避免 Courier New 回退成细窄括号）
    ws.merge_cells("A10:K10")
    put(ws, "A10", CellRichText(
        TextBlock(InlineFont(rFont=COURIER, sz=10, b=True), "- Trade Term:"),
        TextBlock(InlineFont(rFont=SONG, sz=10, b=True), "【"),
        TextBlock(InlineFont(rFont=COURIER, sz=10, b=True),
                  "FOB [China Qingdao port], Incoterms® 2020"),
        TextBlock(InlineFont(rFont=SONG, sz=10, b=True), "】")), None, L)
    ws.merge_cells("A11:K11")
    put(ws, "A11", CellRichText(
        TextBlock(InlineFont(rFont=COURIER, sz=10, b=True), "- Terms of Payment:"),
        TextBlock(InlineFont(rFont=COURIER, sz=10),
                  "By T/T 50% deposit, 50% before shipping.")), None, L)
    ws.merge_cells("A12:K12")
    put(ws, "A12", CellRichText(
        TextBlock(InlineFont(rFont=COURIER, sz=10, b=True), "- Time of shipment:"),
        TextBlock(InlineFont(rFont=COURIER, sz=10),
                  "Within 7 working days after receiving your Payment.")), None, L)
    ws.merge_cells("A13:K13")
    put(ws, "A13", CellRichText(
        TextBlock(InlineFont(rFont=COURIER, sz=10, b=True), "- Remarks:"),
        TextBlock(InlineFont(rFont=COURIER, sz=10), "Validity time is 15 days.")),
        None, L)
    for r in range(10, 14):
        ws.row_dimensions[r].height = 16

    # Note（换行位置与原图一致）
    ws.merge_cells("A14:K14")
    put(ws, "A14", "Note:", f(10, True), L)
    ws.row_dimensions[14].height = 15
    ws.merge_cells("A15:K15")
    put(ws, "A15", "1.This Proforma Invoice is only for quotation, buyer's payment "
        "and customs clearance, not for final settlement.\nFormal Commercial Invoice "
        "will be issued after shipment.", f(10), L)
    ws.row_dimensions[15].height = 28
    ws.merge_cells("A16:K16")
    put(ws, "A16", "2.Under FOB term, seller bears all costs and risks before goods "
        "are loaded on board at the port of loading; ocean freight, insurance and\n"
        "destination port charges are borne by buyer.", f(10), L)
    ws.row_dimensions[16].height = 28
    ws.merge_cells("A17:K17")
    put(ws, "A17", "3.Risk will be transferred to buyer after goods loaded on vessel.",
        f(10), L)
    ws.row_dimensions[17].height = 15
    ws.merge_cells("A18:K18")
    put(ws, "A18", "4.Seller shall not be liable for delivery delay caused by force "
        "majeure.", f(10), L)
    ws.row_dimensions[18].height = 15

    # 银行信息（整行加粗，按原图字重）
    ws.merge_cells("A19:K19")
    put(ws, "A19", "BENEFICIARY BANK INFO:", f(10, True), L)
    ws.row_dimensions[19].height = 15
    bank_lines = [
        "Beneficiary Bank: Bank of China",
        "Branch: Shouguang Branch (Business Department)",
        "Bank Address: Shouguang City, Weifang, Shandong Province, China",
        "SWIFT / BIC Code: BKCHCNBJXXX",
        "Beneficiary Name: Weifang Mingze Waterproof Material Co., Ltd.",
        "Account Number: 244252214045",
        "Account Currency: USD",
    ]
    for i, line in enumerate(bank_lines):
        r = 20 + i
        ws.merge_cells(f"A{r}:K{r}")
        put(ws, f"A{r}", line, f(10, True), L)
        ws.row_dimensions[r].height = 15

    # 签署区
    NO_WRAP = Alignment(horizontal="left", vertical="center", wrap_text=False)
    put(ws, "A27", "THE BUYER:", f(10), NO_WRAP)
    put(ws, "G27", "THE SELLER:", f(10), NO_WRAP)
    ws.row_dimensions[27].height = 48

    # 页面设置：A4 横向，单页
    ws.page_setup.orientation = "landscape"
    ws.page_setup.paperSize = 9  # A4
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = 1
    ws.sheet_properties.pageSetUpPr = PageSetupProperties(fitToPage=True)
    ws.print_area = "A1:K27"
    ws.page_margins.left = ws.page_margins.right = 0.3
    ws.page_margins.top = 0.4
    ws.page_margins.bottom = 0.3
    ws.print_options.horizontalCentered = True

    wb.save(out)
    print("saved:", out)

build("MZG20260821001", 0.559, 9223.50, False,
      "/Users/chengzhi/workspace/mingze/客户业务/报价/客户待确认/询盘_MZG20260821001/PI_MZ_20260821-001_EPDM_FOB_USD_v1.xlsx")
build("MZG20260821002", 0.425, 7012.50, True,
      "/Users/chengzhi/workspace/mingze/客户业务/报价/客户待确认/询盘_MZG20260821002/PI_MZ_20260821-002_EPDM_FOB_USD_v1.xlsx")

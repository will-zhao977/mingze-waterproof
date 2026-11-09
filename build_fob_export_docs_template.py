# -*- coding: utf-8 -*-
"""
Build the Mingze FOB export document template workbook (2026-08-28):
  公共模板/出货与报关/明泽防水-FOB出口单证模板.xlsx

Sheets:
  1. 核对清单 Checklist      — all export documents, owner, timing, official channel
  2. 订舱托书 Booking Note   — form sent to the buyer-appointed forwarder
  3. 报关资料 Customs Docs   — customs document checklist + declaration elements form
  4. 提单补料 B/L Instruction (S/I)
  5. 装柜与VGM Loading & VGM — per-container loading record and VGM declaration
  6. 商业发票 Commercial Invoice
  7. 装箱单 Packing List

Style follows the Mingze house standard (same as the 2026-08-22 quotation
templates): pure black & white, Arial, thin black borders, label/value in
separate cells, bilingual EN+ZH inside the same cell separated by a line
break. Variable fields left blank; only company-fixed data filled.
"""

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, Side
from openpyxl.utils import get_column_letter

OUT = "公共模板/出货与报关/明泽防水-FOB出口单证模板.xlsx"

COMPANY = "WEIFANG MINGZE Waterproof Material Co., Ltd."  # displayed upper-case via style
SELLER_BLOCK = (
    "Contact Person: Liu Zisong\n"
    "TEL: 086-13964642628\n"
    "Email: zisong@mzwaterproof.com\n"
    "Address: Caoxinzhuang Village, Yangkou Town, Shouguang City, "
    "Weifang City, Shandong, China.\n"
    "Postal code: 262700"
)

THIN = Side(style="thin", color="000000")

F_COMPANY = Font(name="Arial", size=13, bold=True)
F_TITLE = Font(name="Arial", size=14, bold=True)
F_LABEL = Font(name="Arial", size=10, bold=True)
F_BODY = Font(name="Arial", size=10)
F_TH = Font(name="Arial", size=10, bold=True)
F_NOTE = Font(name="Arial", size=9)

A_C = Alignment(horizontal="center", vertical="center", wrap_text=True)
A_L = Alignment(horizontal="left", vertical="center", wrap_text=True)
A_LT = Alignment(horizontal="left", vertical="top", wrap_text=True)
A_R = Alignment(horizontal="right", vertical="center")


def outline(ws, r1, c1, r2, c2):
    """Draw a thin outline around a rectangular block, preserving inner edges."""
    for r in range(r1, r2 + 1):
        for c in range(c1, c2 + 1):
            cell = ws.cell(row=r, column=c)
            b = cell.border
            cell.border = Border(
                left=THIN if c == c1 else b.left,
                right=THIN if c == c2 else b.right,
                top=THIN if r == r1 else b.top,
                bottom=THIN if r == r2 else b.bottom,
            )


def box(ws, r1, c1, r2, c2):
    """Give every cell in the block a full thin box (fillable grid)."""
    for r in range(r1, r2 + 1):
        for c in range(c1, c2 + 1):
            ws.cell(row=r, column=c).border = Border(
                left=THIN, right=THIN, top=THIN, bottom=THIN
            )


def put(ws, r, c, value, font=F_BODY, align=A_L):
    cell = ws.cell(row=r, column=c, value=value)
    cell.font = font
    cell.alignment = align
    return cell


def widths(ws, spec):
    for col, w in spec.items():
        ws.column_dimensions[col].width = w


def doc_header(ws, last_col, title):
    """Rows 1-2: company banner + document title; returns next free row (3)."""
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=last_col)
    put(ws, 1, 1, COMPANY.upper(), F_COMPANY, A_C)
    ws.row_dimensions[1].height = 24
    ws.merge_cells(start_row=2, start_column=1, end_row=2, end_column=last_col)
    put(ws, 2, 1, title, F_TITLE, A_C)
    ws.row_dimensions[2].height = 26
    return 3


def date_no_row(ws, r, last_col, no_label="Document No. 单据编号"):
    mid = (last_col // 2) or 1
    put(ws, r, 1, "Date 日期:", F_LABEL)
    put(ws, r, 2, "")
    outline(ws, r, 2, r, mid - 1)
    put(ws, r, mid + 1, no_label, F_LABEL)
    put(ws, r, mid + 2, "")
    outline(ws, r, mid + 2, r, last_col)
    return r + 1


def label_value(ws, r, label, value="", label_c1=1, label_c2=3, val_c1=4, val_c2=8,
                val_align=A_L, height=None):
    ws.merge_cells(start_row=r, start_column=label_c1, end_row=r, end_column=label_c2)
    ws.merge_cells(start_row=r, start_column=val_c1, end_row=r, end_column=val_c2)
    put(ws, r, label_c1, label, F_LABEL)
    if value:
        put(ws, r, val_c1, value, F_BODY, val_align)
    outline(ws, r, val_c1, r, val_c2)
    if height:
        ws.row_dimensions[r].height = height
    return r + 1


def note_line(ws, r, text, last_col):
    ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=last_col)
    put(ws, r, 1, text, F_NOTE, A_L)
    return r + 1


def portrait(ws, last_col, last_row):
    ws.page_setup.orientation = "portrait"
    ws.page_setup.paperSize = 9  # A4
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = 0
    ws.sheet_properties.pageSetUpPr.fitToPage = True
    ws.print_area = f"A1:{get_column_letter(last_col)}{last_row}"


wb = Workbook()

# ════════════════════════════════════════════════════════════════════════
# Sheet 1 — 核对清单 Master Checklist
# ════════════════════════════════════════════════════════════════════════
ws = wb.active
ws.title = "核对清单Checklist"
LC = 7
widths(ws, {"A": 11, "B": 25, "C": 15, "D": 15, "E": 19, "F": 30, "G": 8})
r = doc_header(ws, LC, "FOB EXPORT DOCUMENT CHECKLIST  FOB出口单证总核对清单")
r += 1  # spacer

headers = [
    "Stage\n阶段",
    "Document / Item\n单证 / 事项",
    "Prepared by\n准备方",
    "Submit to\n提交给",
    "Timing\n时间节点",
    "Channel / Template\n办理渠道 / 模板",
    "Done ✓\n完成",
]
for i, h in enumerate(headers, start=1):
    put(ws, r, i, h, F_TH, A_C)
ws.row_dimensions[r].height = 30
hdr_row = r
r += 1

ROWS = [
    ("订舱\nBooking", "订舱托书 Booking Note", "发货人\nShipper", "货代\nForwarder",
     "客户指定货代后立即\nASAP after fwdr assigned", "本工作簿 Sheet 2"),
    ("订舱\nBooking", "订舱确认书 Booking Confirmation (S/O)", "货代\nForwarder", "—",
     "订舱后回传\nAfter booking", "留存，抄录各截单时间\nNote all cut-off times"),
    ("装柜\nLoading", "拖车 / 装柜安排 Trucking & Loading", "货代安排\nFwdr arranges", "—",
     "截关前\nBefore customs cut-off", "提供装货地址与时间\nGive loading address & time"),
    ("报关\nCustoms", "电子代理报关委托 E-Declaration POA", "发货人（委托方）\nShipper", "报关行\nCustoms broker",
     "报关前\nBefore declaration", "单一窗口 www.singlewindow.cn\n货物申报→报关代理委托（IC卡登录）"),
    ("报关\nCustoms", "商业发票 Commercial Invoice", "发货人\nShipper", "报关行\nBroker",
     "报关前\nBefore declaration", "本工作簿 Sheet 6"),
    ("报关\nCustoms", "装箱单 Packing List", "发货人\nShipper", "报关行\nBroker",
     "报关前\nBefore declaration", "本工作簿 Sheet 7"),
    ("报关\nCustoms", "申报要素 Declaration Elements", "发货人\nShipper", "报关行\nBroker",
     "报关前\nBefore declaration", "本工作簿 Sheet 3（按HS填写）"),
    ("报关\nCustoms", "出口报关申报 Export declaration filing", "报关行\nBroker", "海关\nCustoms",
     "截关前\nBefore customs cut-off", "海关审核放行\nWait for release"),
    ("提单\nB/L", "提单补料 B/L Instruction (S/I)", "发货人\nShipper", "货代\nForwarder",
     "截补料前\nBefore SI cut-off", "本工作簿 Sheet 4"),
    ("提单\nB/L", "提单确认件核对 Draft B/L confirmation", "发货人核对\nShipper checks", "货代\nForwarder",
     "出单前\nBefore issuance", "逐项核对件数/毛重/体积/目的港/收货人\nCheck pkgs, weights, volume, ports, consignee"),
    ("VGM", "VGM 申报 Verified Gross Mass", "发货人提供数据\nShipper data", "货代\nForwarder",
     "截VGM前\nBefore VGM cut-off", "本工作簿 Sheet 5"),
    ("附加\nExtra", "原产地证 Certificate of Origin（按需 if required）", "发货人申请\nShipper applies", "贸促会/海关\nCCPIT / Customs",
     "开船前申请\nApply before ETD", "co.ccpit.org 网上签证系统\n先产品预审备案，再申报"),
    ("附加\nExtra", "木质包装 IPPC/熏蒸 Wooden pkg fumigation（如用木托 if wood pallets）", "货代/场站\nFwdr / depot", "—",
     "装柜前\nBefore loading", "木托须有IPPC标识\nIPPC mark required"),
    ("开船\nSailing", "提单正本 / 电放 Original B/L / Telex release", "货代签发\nFwdr issues", "发货人\nShipper",
     "开船后1-3天\n1-3 days after ETD", "货款收清后再电放/寄正本\nRelease only after payment received"),
    ("结算\nSettle", "人民币杂费账单 Debit Note 核对与付款", "货代出账\nFwdr bills", "发货人\nShipper",
     "放单前\nBefore release", "逐项核对后再付款\nCheck items before paying"),
    ("收尾\nClose", "寄客户清关单据 Docs to buyer", "发货人\nShipper", "客户\nBuyer",
     "开船后\nAfter ETD", "发票/装箱单/CO/提单副本\nInv, PL, CO, B/L copy"),
    ("收尾\nClose", "出口退税 Export tax rebate", "发货人\nShipper", "税务\nTax bureau",
     "收汇后\nAfter forex received", "报关单退税联 + 增值税专用发票 + 收汇凭证"),
]
first_data = r
for i, row in enumerate(ROWS):
    for j, v in enumerate(row, start=1):
        put(ws, r, j, v, F_BODY, A_C if j == 1 else A_L)
    outline(ws, r, 1, r, LC)
    r += 1

r += 1
r = note_line(ws, r, "Notes 说明:", LC)
r = note_line(ws, r, "1. All cut-off times (SI / VGM / customs / CY) are on the Booking Confirmation — work backwards from them. "
                     "各截单时间见订舱确认书，按时间倒排装柜与报关。", LC)
r = note_line(ws, r, "2. Customs POA is now electronic only (Single Window, IC card login); the paper form is obsolete. "
                     "报关委托以单一窗口电子委托为准，纸质委托书已淘汰。", LC)
r = note_line(ws, r, "3. Keep invoice, packing list, B/L instruction consistent (same pieces / gross weight / volume / description). "
                     "发票、装箱单、提单补料三套资料数据必须一致。", LC)
r = note_line(ws, r, "4. HS code & legal measurement unit: verify at www.hsbianma.com before declaration; 10-digit code without dots. "
                     "HS编码申报前在 hsbianma.com 核对，用不带点的10位码，注意法定计量单位。", LC)
portrait(ws, LC, r)

# ════════════════════════════════════════════════════════════════════════
# Sheet 2 — 订舱托书 Booking Note
# ════════════════════════════════════════════════════════════════════════
ws = wb.create_sheet("订舱托书BookingNote")
LC = 8
widths(ws, {"A": 9, "B": 13, "C": 13, "D": 13, "E": 13, "F": 13, "G": 13, "H": 13})
r = doc_header(ws, LC, "BOOKING NOTE  订舱托书")
r = date_no_row(ws, r, LC, no_label="Booking No. 托书编号")
r += 1

r = label_value(ws, r, "Shipper 发货人", COMPANY.upper() + "\n" + SELLER_BLOCK, height=86)
r = label_value(ws, r, "Consignee 收货人", "", height=30)
r = label_value(ws, r, "Notify Party 通知人", "", height=30)
r = label_value(ws, r, "Port of Loading 起运港", "QINGDAO, CHINA")
r = label_value(ws, r, "Port of Discharge 目的港")
r = label_value(ws, r, "Latest Shipment Date 最晚装期")
r = label_value(ws, r, "Freight Term 运费条款", "FREIGHT COLLECT（FOB，运费到付）")
r = label_value(ws, r, "Container 柜型柜量", "e.g. 1×40'HQ / 2×20'GP")
r += 1

# cargo table
put(ws, r, 1, "CARGO DETAILS 货物信息", F_LABEL)
r += 1
cargo_hdr = ["No.\n序号", "Product (ZH)\n产品名（中文）", "Description (EN)\n品名（英文）",
             "HS Code\nHS编码", "Packages\n件数", "Packing\n包装",
             "G.W. (kg)\n毛重", "Measurement\n体积 (CBM)"]
for i, h in enumerate(cargo_hdr, start=1):
    put(ws, r, i, h, F_TH, A_C)
ws.row_dimensions[r].height = 30
r += 1
for n in range(1, 6):
    put(ws, r, 1, n, F_BODY, A_C)
    outline(ws, r, 1, r, LC)
    r += 1
put(ws, r, 1, "Total 合计", F_LABEL, A_C)
ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=4)
for c in range(5, LC + 1):
    put(ws, r, c, "", F_BODY, A_C)
outline(ws, r, 1, r, LC)
cargo_last = r - 1
# guarded sums for numeric columns (pieces / weight / volume)
ws.cell(row=r, column=5).value = f'=IF(COUNT(E{r-5}:E{cargo_last})=0,"",SUM(E{r-5}:E{cargo_last}))'
ws.cell(row=r, column=7).value = f'=IF(COUNT(G{r-5}:G{cargo_last})=0,"",SUM(G{r-5}:G{cargo_last}))'
ws.cell(row=r, column=8).value = f'=IF(COUNT(H{r-5}:H{cargo_last})=0,"",SUM(H{r-5}:H{cargo_last}))'
r += 2

r = label_value(ws, r, "Loading 装柜方式", "拖车到厂装货 / 送仓 (Trucking to factory / CFS delivery)")
r = label_value(ws, r, "Remarks 备注")
r += 1
r = note_line(ws, r, "Notes 说明:", LC)
r = note_line(ws, r, "1. This booking note is the basis for the B/L and customs declaration; keep it identical with the invoice and packing list. "
                     "本托书为制单与报关依据，须与发票、装箱单一致。", LC)
r = note_line(ws, r, "2. Under FOB the buyer nominates the forwarder; ocean freight is collect. "
                     "FOB 下由买方指定货代，运费到付。", LC)
portrait(ws, LC, r)

# ════════════════════════════════════════════════════════════════════════
# Sheet 3 — 报关资料 Customs Docs
# ════════════════════════════════════════════════════════════════════════
ws = wb.create_sheet("报关资料CustomsDocs")
LC = 8
widths(ws, {"A": 9, "B": 13, "C": 13, "D": 13, "E": 13, "F": 13, "G": 13, "H": 13})
r = doc_header(ws, LC, "CUSTOMS DECLARATION DOCUMENTS  报关资料")
r = date_no_row(ws, r, LC, no_label="S/O No. 订舱编号")
r += 1

put(ws, r, 1, "PART 1  DOCUMENT LIST 报关单证清单", F_LABEL)
r += 1
ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=4)
ws.merge_cells(start_row=r, start_column=6, end_row=r, end_column=8)
put(ws, r, 1, "No.\n序号", F_TH, A_C)
put(ws, r, 2, "Document 单证", F_TH, A_C)
put(ws, r, 5, "Copies\n份数", F_TH, A_C)
put(ws, r, 6, "Source / Remark 来源与说明", F_TH, A_C)
ws.row_dimensions[r].height = 26
r += 1
DOCS = [
    ("电子代理报关委托\nE-POA via Single Window", "—",
     "www.singlewindow.cn 货物申报→报关代理委托（IC卡登录）"),
    ("商业发票 Commercial Invoice", "1", "Sheet 6"),
    ("装箱单 Packing List", "1", "Sheet 7"),
    ("销售合同 / 形式发票\nContract / P/I", "备查", "应海关要求提供"),
    ("申报要素 Declaration elements", "1", "本表 PART 2 按HS填写"),
]
for n, (doc, copies, src) in enumerate(DOCS, start=1):
    put(ws, r, 1, n, F_BODY, A_C)
    ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=4)
    put(ws, r, 2, doc, F_BODY, A_L)
    put(ws, r, 5, copies, F_BODY, A_C)
    ws.merge_cells(start_row=r, start_column=6, end_row=r, end_column=8)
    put(ws, r, 6, src, F_BODY, A_L)
    outline(ws, r, 1, r, LC)
    r += 1
r += 1

put(ws, r, 1, "PART 2  DECLARATION ELEMENTS 申报要素（每种HS编码一行，以报关行提供的要素模板为准）", F_LABEL)
r += 1
elem_hdr = ["HS Code\nHS编码（10位）", "Product 品名", "Brand Type\n品牌类型",
            "Export Prefer.\n出口享惠情况", "Material / Content\n材质成分", "Usage\n用途",
            "Model\n型号", "Others\nGTIN/其他"]
for i, h in enumerate(elem_hdr, start=1):
    put(ws, r, i, h, F_TH, A_C)
ws.row_dimensions[r].height = 30
r += 1
for _ in range(3):
    outline(ws, r, 1, r, LC)
    ws.row_dimensions[r].height = 26
    r += 1
r += 1
r = note_line(ws, r, "Notes 说明:", LC)
r = note_line(ws, r, "1. Brand type: 0 无品牌 / 1 境内自主品牌 / 2 境内非品牌 / 3 境外品牌(贴牌生产) / 4 境外品牌(其他)。"
                     "Mingze products usually use 自主品牌 1.", LC)
r = note_line(ws, r, "2. Verify HS code, validity and legal measurement unit at www.hsbianma.com; use the 10-digit code without dots. "
                     "HS编码、是否有效与法定计量单位在 hsbianma.com 核对，用不带点的10位码。", LC)
r = note_line(ws, r, "3. Elements vary by HS code — the broker's template prevails. 要素因HS而异，以报关行下发的要素确认模板为准。", LC)
portrait(ws, LC, r)

# ════════════════════════════════════════════════════════════════════════
# Sheet 4 — 提单补料 B/L Instruction
# ════════════════════════════════════════════════════════════════════════
ws = wb.create_sheet("提单补料BL-SI")
LC = 8
widths(ws, {"A": 9, "B": 13, "C": 13, "D": 13, "E": 13, "F": 13, "G": 13, "H": 13})
r = doc_header(ws, LC, "B/L INSTRUCTION (S/I)  提单补料")
r = date_no_row(ws, r, LC, no_label="S/O No. 订舱编号")
r += 1

r = label_value(ws, r, "Shipper 发货人", COMPANY.upper() + "\n" + SELLER_BLOCK, height=86)
r = label_value(ws, r, "Consignee 收货人", "", height=30)
r = label_value(ws, r, "Notify Party 通知人", "", height=30)
r = label_value(ws, r, "Place of Receipt 收货地", "QINGDAO, CHINA")
r = label_value(ws, r, "Port of Loading 装货港", "QINGDAO, CHINA")
r = label_value(ws, r, "Port of Discharge 卸货港")
r = label_value(ws, r, "Place of Delivery 交货地")
r += 1

put(ws, r, 1, "CARGO 货物（与报关资料一致）", F_LABEL)
r += 1
si_hdr = ["Marks & Nos.\n唛头", "Description of Goods 货物描述（英文）", "", "",
          "Packages\n件数", "Packing\n包装", "G.W. (kg)\n毛重", "Msrmt\n体积CBM"]
ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=4)
for i, h in enumerate(si_hdr, start=1):
    if h:
        put(ws, r, i, h, F_TH, A_C)
ws.row_dimensions[r].height = 30
r += 1
for n in range(1, 5):
    outline(ws, r, 1, r, LC)
    r += 1
si_first, si_last = r - 4, r - 1
ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=4)
put(ws, r, 1, "TOTAL 合计", F_LABEL, A_C)
for c in range(5, LC + 1):
    col = get_column_letter(c)
    ws.cell(row=r, column=c).value = f'=IF(COUNT({col}{si_first}:{col}{si_last})=0,"",SUM({col}{si_first}:{col}{si_last}))'
outline(ws, r, 1, r, LC)
r += 2

r = label_value(ws, r, "Freight 运费", "FREIGHT COLLECT（到付）")
r = label_value(ws, r, "Originals 正本份数", "3 / 3")
r = label_value(ws, r, "Telex Release 电放", "□ YES 是    □ NO 否（货款收清后电放）")
r = label_value(ws, r, "Issuance 出单要求", "Place of issue 签发地点: QINGDAO；On board date 以实际装船日为准")
r += 1
r = note_line(ws, r, "Confirmed by shipper — any change after confirmation may incur an amendment fee. "
                     "发货人核对确认：Draft B/L 请先回传，确认后更改可能产生改单费。  Sign 签字: ____________  Date: ________", LC)
portrait(ws, LC, r)

# ════════════════════════════════════════════════════════════════════════
# Sheet 5 — 装柜与VGM Loading & VGM
# ════════════════════════════════════════════════════════════════════════
ws = wb.create_sheet("装柜与VGM")
LC = 9
widths(ws, {"A": 13, "B": 11, "C": 9, "D": 9, "E": 12, "F": 11, "G": 12, "H": 13, "I": 13})
r = doc_header(ws, LC, "LOADING RECORD & VGM DECLARATION  装柜记录与VGM申报")
r = date_no_row(ws, r, LC, no_label="S/O No. 订舱编号")
r += 1

vgm_hdr = ["Container No.\n柜号", "Seal No.\n封号", "Type\n柜型", "Packages\n件数",
           "Cargo G.W.\n货重(kg)", "Tare\n皮重(kg)", "VGM (kg)\n核实总重",
           "Method\n称重方法", "Weighing Time\n称重时间"]
for i, h in enumerate(vgm_hdr, start=1):
    put(ws, r, i, h, F_TH, A_C)
ws.row_dimensions[r].height = 30
r += 1
for _ in range(3):
    outline(ws, r, 1, r, LC)
    ws.row_dimensions[r].height = 24
    r += 1
r += 1
r = label_value(ws, r, "Shipper 发货人", COMPANY.upper(), height=18)
r += 1
r = note_line(ws, r, "Notes 说明:", LC)
r = note_line(ws, r, "1. VGM = cargo gross weight + tare weight + dunnage/packing material, required by SOLAS before vessel loading. "
                     "VGM = 货物毛重 + 集装箱皮重 + 加固/包装材料，SOLAS公约要求，开船前必须申报。", LC)
r = note_line(ws, r, "2. Method 1: whole container weighed ( weighscales / weighbridge )；Method 2: sum of all packages + tare. "
                     "方法1：整柜过磅；方法2：逐件累加+皮重。", LC)
r = note_line(ws, r, "3. Data must match the packing list and B/L instruction. 数据须与装箱单、提单补料一致。", LC)
portrait(ws, LC, r)

# ════════════════════════════════════════════════════════════════════════
# Sheet 6 — 商业发票 Commercial Invoice
# ════════════════════════════════════════════════════════════════════════
ws = wb.create_sheet("商业发票Invoice")
LC = 8
widths(ws, {"A": 5, "B": 22, "C": 12, "D": 12, "E": 8, "F": 12, "G": 14, "H": 14})
r = doc_header(ws, LC, "COMMERCIAL INVOICE  商业发票")
r = date_no_row(ws, r, LC, no_label="Invoice No. 发票号")

put(ws, r, 1, "To 致 (The Buyer 收货方):", F_LABEL)
ws.merge_cells(start_row=r, start_column=3, end_row=r, end_column=LC)
outline(ws, r, 3, r, LC)
r += 2

ship_refs = [
    ("From 起运港", "QINGDAO, CHINA"),
    ("To 目的港", ""),
    ("Vessel / Voyage 船名航次", ""),
    ("S/O No. 订舱编号", ""),
    ("B/L No. 提单号", ""),
]
for lbl, val in ship_refs:
    ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=2)
    put(ws, r, 1, lbl, F_LABEL)
    ws.merge_cells(start_row=r, start_column=3, end_row=r, end_column=LC)
    if val:
        put(ws, r, 3, val, F_BODY)
    outline(ws, r, 3, r, LC)
    r += 1
r += 1

inv_hdr = ["No.\n序号", "Product description 产品名", "HS Code\nHS编码", "Specification\n规格",
           "Unit\n单位", "Quantity\n数量", "Unit Price\n单价 (USD)", "Amount\n金额 (USD)", ""]
# use 8 real columns: A..H, keep I out — recompute table on A..H
inv_hdr = inv_hdr[:8]
for i, h in enumerate(inv_hdr, start=1):
    put(ws, r, i, h, F_TH, A_C)
ws.row_dimensions[r].height = 30
r += 1
inv_first = r
for n in range(1, 5):
    put(ws, r, 1, n, F_BODY, A_C)
    ws.cell(row=r, column=8).value = f'=IF(OR(F{r}="",G{r}=""),"",F{r}*G{r})'
    outline(ws, r, 1, r, 8)
    ws.row_dimensions[r].height = 22
    r += 1
inv_last = r - 1
put(ws, r, 1, "TOTAL 合计", F_LABEL, A_C)
ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=7)
ws.cell(row=r, column=8).value = f'=IF(COUNT(H{inv_first}:H{inv_last})=0,"",SUM(H{inv_first}:H{inv_last}))'
outline(ws, r, 1, r, 8)
r += 1
ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=8)
put(ws, r, 1, "SAY TOTAL IN CAPITAL LETTERS 大写金额:", F_LABEL)
outline(ws, r, 1, r, 8)
r += 2

for lbl, val in [
    ("Trade Term 贸易术语", "FOB [China Qingdao port]"),
    ("Terms of Payment 付款方式", "By T/T 30% deposit, 70% balance before shipment."),
]:
    ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=2)
    put(ws, r, 1, lbl, F_LABEL)
    ws.merge_cells(start_row=r, start_column=3, end_row=r, end_column=8)
    put(ws, r, 3, val, F_BODY)
    outline(ws, r, 3, r, 8)
    r += 1
r += 1

ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=8)
put(ws, r, 1, "FOR AND ON BEHALF OF  " + COMPANY.upper() + "  (COMPANY STAMP 盖章)", F_LABEL, A_L)
outline(ws, r, 1, r, 8)
r += 1
r = note_line(ws, r, "This invoice is for customs declaration and buyer's clearance; goods description, quantity and weights "
                     "must match the packing list and B/L. 本发票用于报关与客户清关，品名数量重量须与装箱单、提单一致。", 8)
portrait(ws, 8, r)

# ════════════════════════════════════════════════════════════════════════
# Sheet 7 — 装箱单 Packing List
# ════════════════════════════════════════════════════════════════════════
ws = wb.create_sheet("装箱单PackingList")
LC = 7
widths(ws, {"A": 5, "B": 24, "C": 12, "D": 13, "E": 11, "F": 11, "G": 12})
r = doc_header(ws, LC, "PACKING LIST  装箱单")
r = date_no_row(ws, r, LC, no_label="P/L No. 装箱单号")

ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=2)
put(ws, r, 1, "Invoice No. 对应发票号:", F_LABEL)
ws.merge_cells(start_row=r, start_column=3, end_row=r, end_column=LC)
outline(ws, r, 3, r, LC)
r += 2

for lbl, val in [
    ("From 起运港", "QINGDAO, CHINA"),
    ("To 目的港", ""),
    ("Vessel / Voyage 船名航次", ""),
    ("B/L No. 提单号", ""),
]:
    ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=2)
    put(ws, r, 1, lbl, F_LABEL)
    ws.merge_cells(start_row=r, start_column=3, end_row=r, end_column=LC)
    if val:
        put(ws, r, 3, val, F_BODY)
    outline(ws, r, 3, r, LC)
    r += 1
r += 1

pl_hdr = ["No.\n序号", "Description of Goods 产品名", "Quantity\n数量",
          "Packages\n件数 / 包装", "N.W. (kg)\n净重", "G.W. (kg)\n毛重",
          "Measurement\n体积 (CBM)"]
for i, h in enumerate(pl_hdr, start=1):
    put(ws, r, i, h, F_TH, A_C)
ws.row_dimensions[r].height = 30
r += 1
pl_first = r
for n in range(1, 5):
    put(ws, r, 1, n, F_BODY, A_C)
    outline(ws, r, 1, r, LC)
    ws.row_dimensions[r].height = 22
    r += 1
pl_last = r - 1
put(ws, r, 1, "TOTAL 合计", F_LABEL, A_C)
ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=2)
for c in range(3, LC + 1):
    col = get_column_letter(c)
    ws.cell(row=r, column=c).value = f'=IF(COUNT({col}{pl_first}:{col}{pl_last})=0,"",SUM({col}{pl_first}:{col}{pl_last}))'
outline(ws, r, 1, r, LC)
r += 1
ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=LC)
put(ws, r, 1, "PACKED IN ____ PALLETS / CARTONS  共____托/箱", F_BODY)
outline(ws, r, 1, r, LC)
r += 2

ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=LC)
put(ws, r, 1, "FOR AND ON BEHALF OF  " + COMPANY.upper() + "  (COMPANY STAMP 盖章)", F_LABEL, A_L)
outline(ws, r, 1, r, LC)
r += 1
r = note_line(ws, r, "Net / gross weights and measurement must match the customs declaration, VGM and B/L instruction. "
                     "净毛重与体积须与报关数据、VGM、提单补料一致。", LC)
portrait(ws, LC, r)

wb.properties.creator = "Z.ai"
wb.save(OUT)
print("saved:", OUT, "| sheets:", wb.sheetnames)

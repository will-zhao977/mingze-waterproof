# -*- coding: utf-8 -*-
"""
Build the Mingze sample contract (样品合同) for BEDEM Energy Solutions DOO (Serbia).
Clones the latest sample-quotation workbook (SampleQuotation_MZ_20260818_Junaid-India_v1.xlsx)
so styles, merges, page setup and fonts match the latest quotation template format.

Concise business contract per user request: NO COMMERCIAL NOTES section (it repeated the table);
only a compact PAYMENT & DELIVERY section with the seller bank details and buyer shipping address,
which are not shown in the table.

Content:
  - sample free of charge (FOC), A4 size
  - courier fee: USD 63.50 (payable by Buyer before dispatch)
  - Seller USD wire-transfer bank details (Bank of China, Shouguang)
Source of truth: customer chat record SCR-20260821-igjs.png + user-provided bank/buyer details.
"""

import zipfile, shutil, os

BASE = "客户业务/报价/Junaid-India/SampleQuotation_MZ_20260818_Junaid-India_v1.xlsx"
OUT  = "客户业务/报价/Bedem-Serbia/SampleContract_MZ_20260821_Bedem-Serbia_v1.xlsx"

ns = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def cell(ref, value="", style=None, t="inlineStr", formula=None):
    attrs = f'r="{ref}"'
    if style is not None:
        attrs += f' s="{style}"'
    if formula:
        v = f"<x:v>{value}</x:v>" if value != "" else "<x:v/>"
        return f'<x:c {attrs}><x:f>{esc(formula)}</x:f>{v}</x:c>'
    if value == "":
        if t == "n":
            return f'<x:c {attrs} t="n"/>'
        return f'<x:c {attrs}/>'
    if t == "n":
        return f'<x:c {attrs} t="n"><x:v>{value}</x:v></x:c>'
    return f'<x:c {attrs} t="inlineStr"><x:is><x:t>{esc(value)}</x:t></x:is></x:c>'


def row(r_num, height, cells_xml):
    return f'<x:row r="{r_num}" ht="{height}" customHeight="1">{cells_xml}</x:row>'


def empty_row(r_num, height):
    return f'<x:row r="{r_num}" ht="{height}" customHeight="1"></x:row>'


# style indices copied from the base workbook (verified in its sheet1.xml)
S_CO  = 1    # company header
S_EMPTY2 = 2 # plain empty
S_TITLE = 3  # title
S_TITLE_EMPTY = 4
S_LBL   = 5  # info label
S_VAL   = 6  # info value
S_LBL2  = 7  # info label (row5 / signature)
S_VAL2  = 8  # info value (row5)
S_SEC   = 9  # section header bar
S_TH    = 10 # table column header
S_TH_EMPTY = 11
S_NO    = 12 # No. column / unit / qty
S_DESC  = 13 # description cell
S_PRICE = 14 # unit price / amount
S_TOT_EMPTY = 15
S_TOT_LBL = 16
S_TOT_MID = 17
S_TOT_PRE = 18
S_TOT_AMT = 19
S_NOTE_IDX = 20
S_NOTE_TTL = 20
S_NOTE_BODY = 21
S_SELLER = 24
S_FOOT  = 25

rows = []

# Row 1: company header
rows.append(row(1, 26,
    cell("A1", "WEIFANG MINGZE WATERPROOF MATERIAL CO., LTD.", S_CO) +
    "".join(cell(f"{c}1", "", S_EMPTY2, t="n") for c in "BCDEFGH")))

# Row 2: title
rows.append(row(2, 34,
    cell("A2", "SAMPLE CONTRACT", S_TITLE) +
    "".join(cell(f"{c}2", "", S_TITLE_EMPTY, t="n") for c in "BCDEFGH")))

# Row 3: Contract No. | Customer
rows.append(row(3, 26,
    cell("A3", "CONTRACT NO.", S_LBL) +
    cell("B3", "MZ-20260821-01", S_VAL) +
    cell("E3", "CUSTOMER NAME", S_LBL) +
    cell("F3", "BEDEM Energy Solutions DOO", S_VAL)))

# Row 4: Date | Contact
rows.append(row(4, 26,
    cell("A4", "DATE", S_LBL) +
    cell("B4", "August 21, 2026", S_VAL) +
    cell("E4", "CONTACT", S_LBL) +
    cell("F4", "Bras (Alibaba.com buyer)", S_VAL)))

# Row 5: Price Term | Email
rows.append(row(5, 30,
    cell("A5", "PRICE TERM", S_LBL2) +
    cell("B5", "Samples FOC; courier fee USD 63.50 paid by Buyer (door-to-door, Serbia)", S_VAL2) +
    cell("C5", "", S_EMPTY2, t="n") +
    cell("D5", "", S_EMPTY2, t="n") +
    cell("E5", "EMAIL", S_LBL2) +
    cell("F5", "nabavka@bedem.com", S_VAL2) +
    cell("G5", "", S_EMPTY2, t="n") +
    cell("H5", "", S_EMPTY2, t="n")))

# Row 6: section header
rows.append(row(6, 24,
    cell("A6", "SAMPLE DETAILS", S_SEC) +
    "".join(cell(f"{c}6", "", S_TITLE_EMPTY, t="n") for c in "BCDEFGH")))

# Row 7: table headers
rows.append(row(7, 30,
    cell("A7", "No.", S_TH) +
    cell("B7", "Product Description", S_TH) +
    cell("C7", "", S_TH_EMPTY, t="n") +
    cell("D7", "", S_TH_EMPTY, t="n") +
    cell("E7", "Unit", S_TH) +
    cell("F7", "Quantity", S_TH) +
    cell("G7", "Unit Price (USD)", S_TH) +
    cell("H7", "Amount (USD)", S_TH)))

# Row 8: item 1 - sample, FOC
desc1 = ("[SAMPLE] Waterproofing membrane sample - A4 size\n"
         "Per Buyer's request for PVC / SBS products | FREE OF CHARGE\n"
         "(Product model & full specification to be confirmed with Buyer before dispatch)")
rows.append(row(8, 76,
    cell("A8", "1", S_NO) +
    cell("B8", desc1, S_DESC) +
    cell("C8", "", S_TH_EMPTY, t="n") +
    cell("D8", "", S_TH_EMPTY, t="n") +
    cell("E8", "lot", S_NO) +
    cell("F8", "1", S_NO, t="n") +
    cell("G8", "0", S_PRICE, t="n") +
    cell("H8", "0", S_PRICE, formula='IF(OR(F8="",G8=""),"",F8*G8)')))

# Row 9: item 2 - courier fee USD 63.50
desc2 = ("[COURIER FEE] Door-to-door international courier to Pan\u010devo, Serbia\n"
         "(DHL / FedEx / UPS) | 1 carton | USD 63.50")
rows.append(row(9, 60,
    cell("A9", "2", S_NO) +
    cell("B9", desc2, S_DESC) +
    cell("C9", "", S_TH_EMPTY, t="n") +
    cell("D9", "", S_TH_EMPTY, t="n") +
    cell("E9", "lot", S_NO) +
    cell("F9", "1", S_NO, t="n") +
    cell("G9", "63.5", S_PRICE, t="n") +
    cell("H9", "63.5", S_PRICE, formula='IF(OR(F9="",G9=""),"",F9*G9)')))

# Row 10: total
rows.append(row(10, 24,
    cell("A10", "", S_TOT_EMPTY, t="n") +
    cell("B10", "TOTAL SAMPLE COST (sample + courier):", S_TOT_LBL) +
    cell("C10", "", S_TOT_MID, t="n") +
    cell("D10", "", S_TOT_MID, t="n") +
    cell("E10", "", S_TOT_MID, t="n") +
    cell("F10", "", S_TOT_MID, t="n") +
    cell("G10", "", S_TOT_PRE, t="n") +
    cell("H10", "63.5", S_TOT_AMT, formula='IF(COUNT(H8:H9)=0,"",SUM(H8:H9))')))

# Row 11: spacer
rows.append(empty_row(11, 8))

# Row 12: section header - PAYMENT & DELIVERY
rows.append(row(12, 24,
    cell("A12", "PAYMENT & DELIVERY", S_SEC) +
    "".join(cell(f"{c}12", "", S_TITLE_EMPTY, t="n") for c in "BCDEFGH")))


def block_row(r_num, title, body, ht):
    return row(r_num, ht,
        cell(f"A{r_num}", "", S_NOTE_IDX) +
        cell(f"B{r_num}", title, S_NOTE_TTL) +
        cell(f"D{r_num}", body, S_NOTE_BODY))


bank = ("Beneficiary Bank: Bank of China\n"
        "Branch: Shouguang Branch (Business Department)\n"
        "Bank Address: Shouguang City, Weifang, Shandong Province, China\n"
        "SWIFT / BIC Code: BKCHCNBJXXX\n"
        "Beneficiary Name: Weifang Mingze Waterproof Material Co., Ltd.\n"
        "Account Number: 244252214045\n"
        "Account Currency: USD\n"
        "Courier fee payable by T/T in full before dispatch.")
delivery = ("Shipping address: Miladina Popovi\u0107a 18, 26101 Pan\u010devo, Serbia.\n"
            "Buyer: BEDEM Energy Solutions DOO | PIB 105035592 | Reg. No. 20294531.\n"
            "Samples dispatched by international courier upon payment confirmation; tracking number provided.")

rows.append(block_row(13, "BANK DETAILS (USD WIRE TRANSFER)", bank, 120))
rows.append(block_row(14, "DELIVERY", delivery, 56))

# Row 15: spacer
rows.append(empty_row(15, 10))

# Row 16: signature
rows.append(row(16, 30,
    cell("A16", "SELLER / AUTHORIZED SIGNATURE:", S_LBL2) +
    cell("B16", "", S_EMPTY2, t="n") +
    cell("C16", "", S_EMPTY2, t="n") +
    cell("D16", "", S_EMPTY2, t="n") +
    cell("E16", "COMPANY STAMP:", S_LBL2) +
    cell("F16", "", S_EMPTY2, t="n") +
    cell("G16", "", S_EMPTY2, t="n") +
    cell("H16", "", S_EMPTY2, t="n")))

# Rows 17-18: blank
rows.append(empty_row(17, 10))
rows.append(empty_row(18, 10))

# Row 19: seller line
rows.append(row(19, 20,
    cell("A19", "Weifang Mingze Waterproof Material Co., Ltd. | Liu Zisong | zisong@mzwaterproof.com | Tel: +86 13964642628", S_SELLER) +
    "".join(cell(f"{c}19", "", S_EMPTY2, t="n") for c in "BCDEFGH")))

# Row 20: footer
rows.append(row(20, 20,
    cell("A20", "Thank you for your inquiry. We look forward to a long-term partnership.", S_FOOT) +
    "".join(cell(f"{c}20", "", S_EMPTY2, t="n") for c in "BCDEFGH")))

merges = """<x:mergeCells count="17">
  <x:mergeCell ref="A1:H1"/><x:mergeCell ref="A2:H2"/>
  <x:mergeCell ref="A6:H6"/><x:mergeCell ref="A12:H12"/>
  <x:mergeCell ref="B7:D7"/><x:mergeCell ref="B8:D8"/><x:mergeCell ref="B9:D9"/><x:mergeCell ref="B10:G10"/>
  <x:mergeCell ref="B13:C13"/><x:mergeCell ref="D13:H13"/>
  <x:mergeCell ref="B14:C14"/><x:mergeCell ref="D14:H14"/>
  <x:mergeCell ref="A16:D16"/><x:mergeCell ref="E16:H16"/>
  <x:mergeCell ref="A19:H19"/><x:mergeCell ref="A20:H20"/>
</x:mergeCells>"""

sheet_xml = f"""<?xml version="1.0" encoding="utf-8"?>
<x:worksheet xmlns:x="{ns}">
  <x:sheetPr><x:outlinePr summaryBelow="1" summaryRight="1"/><x:pageSetUpPr fitToPage="1"/></x:sheetPr>
  <x:dimension ref="A1:H20"/>
  <x:sheetViews><x:sheetView workbookViewId="0"><x:selection activeCell="A1" sqref="A1"/></x:sheetView></x:sheetViews>
  <x:sheetFormatPr baseColWidth="8" defaultRowHeight="15"/>
  <x:cols>
    <x:col width="13" customWidth="1" min="1" max="1"/>
    <x:col width="42" customWidth="1" min="2" max="2"/>
    <x:col width="2" customWidth="1" min="3" max="3"/>
    <x:col width="2" customWidth="1" min="4" max="4"/>
    <x:col width="14" customWidth="1" min="5" max="5"/>
    <x:col width="26" customWidth="1" min="6" max="6"/>
    <x:col width="13" customWidth="1" min="7" max="7"/>
    <x:col width="15" customWidth="1" min="8" max="8"/>
  </x:cols>
  <x:sheetData>
    {''.join(rows)}
  </x:sheetData>
  {merges}
  <x:printOptions horizontalCentered="1"/>
  <x:pageMargins left="0.3" right="0.3" top="0.4" bottom="0.4" header="0.5" footer="0.5"/>
  <x:pageSetup orientation="landscape" paperSize="9" fitToHeight="1" fitToWidth="1"/>
</x:worksheet>"""

# ── write workbook ─────────────────────────────────────────────────────────
tmp = OUT + ".tmp"
if os.path.exists(tmp):
    shutil.rmtree(tmp)
with zipfile.ZipFile(BASE, "r") as z:
    z.extractall(tmp)

with open(os.path.join(tmp, "xl/worksheets/sheet1.xml"), "w", encoding="utf-8") as f:
    f.write(sheet_xml)

if os.path.exists(OUT):
    os.remove(OUT)
with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
    for root_dir, dirs, files in os.walk(tmp):
        for file in files:
            full = os.path.join(root_dir, file)
            z.write(full, os.path.relpath(full, tmp))
shutil.rmtree(tmp)
print("Done:", OUT)

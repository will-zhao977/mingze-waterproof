# -*- coding: utf-8 -*-
"""
Generate a filled FOB quotation for ISOPLAST 5R (test), based on the FOB
business template in 公共模板/报价/ (not modifying the template itself).

Customer purchase info (2026-08-22):
  Product   : ISOPLAST 5R (Bituminous Waterproofing Membrane)
  Thickness : 5 mm (5R)
  Reinforce : Polyester non-woven fabric
  Modifier  : APP Modified Bitumen
  Top finish: White Mineral Aggregate (Slate Flakes)
  Standards : IS 1430-3 (Israeli) and EN 13707
  Qty       : 20'GP, 3700 m2
  FOB price : USD 2.05 / m2  (FOB Qingdao)
"""

import openpyxl
from openpyxl.styles import Alignment
from datetime import date

SRC = "公共模板/报价/明泽防水-报价单模板-FOB.xlsx"
OUT = "客户业务/报价/Zeev-Israel/Quotation_FOB_MZ_20260822_Zeev-Israel_ISOPLAST-5R_v1.xlsx"

# Product row 11 (from template). Column mapping:
# A No. | B NOS&MARKS | C Product description | D HS Code | E Pictures
# F Specification Model | G Quantity | H Unit | I Total gross weight (ton)
# J Unit Price | K Amount
PRODUCT_DESC = (
    "ISOPLAST 5R (Bituminous Waterproofing Membrane)"
)
SPEC_MODEL = (
    "Thickness: 5 mm (5R)\n"
    "Reinforcement: Polyester non-woven fabric\n"
    "Polymeric Modifier: APP Modified Bitumen\n"
    "Top Finish: White Mineral Aggregate (Slate Flakes)\n"
    "Standards: IS 1430-3 & EN 13707"
)
QUANTITY = 3700
UNIT = "m\u00b2"
UNIT_PRICE = 2.05
HS_CODE = "6807.10.0000"   # APP modified bitumen waterproofing membrane


wb = openpyxl.load_workbook(SRC)
ws = wb.active

row = 11
ws.cell(row, 2).value = "AS PER BUYER'S INSTRUCTION"   # B NOS&MARKS
ws.cell(row, 3).value = PRODUCT_DESC                       # C product description
ws.cell(row, 4).value = HS_CODE                            # D HS Code
ws.cell(row, 6).value = SPEC_MODEL                         # F specification/model
ws.cell(row, 7).value = QUANTITY                           # G quantity
ws.cell(row, 8).value = UNIT                               # H unit
ws.cell(row, 10).value = UNIT_PRICE                        # J unit price
# K amount formula already in the template (=G11*J11)

# fill the Date band (merged D3:F3) with today's date
ws["D3"].value = f"{date.today():%Y.%m.%d} (Beijing Time)"

# force data cells to wrap / top-align for readability
for col in (3, 6):
    c = ws.cell(row, col)
    c.alignment = Alignment(horizontal="left", vertical="top", wrap_text=True)

# widen the Specification / Model column to fit the multi-line spec, and let
# the product rows breathe. These are local to this quotation only.
ws.column_dimensions["F"].width = 32
ws.column_dimensions["B"].width = 14
ws.column_dimensions["D"].width = 13   # HS Code needs room for 6807.10.0000
for r in range(11, 15):
    ws.row_dimensions[r].height = 70

# make sure the amount cell recalcs on open
wb.calculation.fullCalcOnLoad = True

# A4 landscape, fit width to one page (columns never split across pages),
# height flows naturally -> may span multiple pages, text as large as possible.
ws.page_setup.orientation = "landscape"
ws.page_setup.paperSize = 9   # A4
ws.page_setup.fitToWidth = 1
ws.page_setup.fitToHeight = 0
if ws.sheet_properties.pageSetUpPr is not None:
    ws.sheet_properties.pageSetUpPr.fitToPage = True

wb.save(OUT)
print("Done:", OUT)

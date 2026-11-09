# -*- coding: utf-8 -*-
"""Render Quotation_FOB_MZ_20260822_Zeev-Israel_ISOPLAST-5R_v1.xlsx to an A4-landscape PDF,
matching the template layout (black/white, thin black borders, Arial)."""

import openpyxl
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import BaseDocTemplate, Frame, PageTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

SRC = "客户业务/报价/Zeev-Israel/Quotation_FOB_MZ_20260822_Zeev-Israel_ISOPLAST-5R_v1.xlsx"
OUT = "客户业务/报价/Zeev-Israel/Quotation_FOB_MZ_20260822_Zeev-Israel_ISOPLAST-5R_v1.pdf"

# Arial (or Helvetica fallback if not registered)
try:
    pdfmetrics.registerFont(TTFont("Arial", "/System/Library/Fonts/Supplemental/Arial.ttf"))
    pdfmetrics.registerFont(TTFont("Arial-Bold", "/System/Library/Fonts/Supplemental/Arial Bold.ttf"))
    FONT, FONTB = "Arial", "Arial-Bold"
except Exception:
    FONT, FONTB = "Helvetica", "Helvetica-Bold"

wb = openpyxl.load_workbook(SRC)
ws = wb.active

PAGE = landscape(A4)  # 842 x 595 pt
LM, RM, TM, BM = 11*mm, 11*mm, 10*mm, 10*mm
content_w = PAGE[0] - LM - RM

def _val(coord):
    v = ws[coord].value
    return "" if v is None else v

def amount():
    # K11 is formula =G11*J11
    q = ws["G11"].value or 0
    p = ws["J11"].value or 0
    return q * p

def fmt_num(v, dec=2):
    return f"{v:,.{dec}f}"

# ── styles ──
st_co = ParagraphStyle("co", fontName=FONTB, fontSize=13, leading=15, alignment=1)
st_ti = ParagraphStyle("ti", fontName=FONTB, fontSize=15, leading=18, alignment=1)
st_lb = ParagraphStyle("lb", fontName=FONTB, fontSize=9, leading=11)
st_vl = ParagraphStyle("vl", fontName=FONT, fontSize=9, leading=11)
st_cn = ParagraphStyle("cn", fontName=FONT, fontSize=9, leading=11, alignment=1)
st_th = ParagraphStyle("th", fontName=FONTB, fontSize=8, leading=10, alignment=1)
st_cell = ParagraphStyle("cell", fontName=FONT, fontSize=8, leading=10)
st_cellc = ParagraphStyle("cellc", fontName=FONT, fontSize=8, leading=10, alignment=1)
st_cellr = ParagraphStyle("cellr", fontName=FONT, fontSize=8, leading=10, alignment=2)
st_note = ParagraphStyle("note", fontName=FONT, fontSize=8.5, leading=11)

BLACK = colors.black
THIN = 0.5

def para(txt, st):
    return Paragraph(txt.replace("\n", "<br/>"), st)

def boxstyle():
    return [("GRID", (0,0), (-1,-1), THIN, BLACK),
            ("VALIGN", (0,0), (-1,-1), "MIDDLE")]

rows = []
comp = []  # row heights = [height_pt, ...]

# Header company + title
rows.append([para(_val("A1"), st_co)])
comp.append(22)
rows.append([para(_val("A2"), st_ti)])
comp.append(24)

# Date / Document No band (3 rows aligned to A3..K3 blocks)
rows.append([
    para(_val("A3"), st_lb), para("", st_vl), para(_val("D3"), st_vl),
    para("", st_vl), para(_val("G3"), st_lb), para("", st_vl),
    para("", st_vl), para("", st_lb), para("", st_vl),
    para("", st_vl), para("", st_vl),
])
comp.append(16)

# Seller / Buyer panel header
rows.append([para(_val("A4"), st_lb)]*6 + [para(_val("G4"), st_lb)]*5)
comp.append(14)

# Seller text block (merged A5:F8) and blank buyer (G5:K8)
seller = _val("A5")
rows.append([para(seller, st_vl)]*6 + [para("", st_vl)]*5)
comp.append(52)

# Product table header (11 cols, bilingual)
hdr = [para(_val(x + "10"), st_th) for x in "ABCDEFGHIJK"]
rows.append(hdr)
comp.append(34)

# Product row(s)
product = rows_base = None
qty = ws["G11"].value or 0
uprice = ws["J11"].value or 0
amt = amount()
prod = [
    para(str(ws["A11"].value), st_cellc), para(_val("B11"), st_cell),
    para(_val("C11"), st_cell), para("", st_cell), para("", st_cell),
    para(_val("F11"), st_cell), para(fmt_num(qty,0), st_cellc),
    para(_val("H11"), st_cellc), para("", st_cellc),
    para(fmt_num(uprice), st_cellr), para(fmt_num(amt), st_cellr),
]
rows.append(prod)
comp.append(66)

# blank product rows 2-4
for n in (2, 3, 4):
    rows.append([
        para(str(n), st_cellc), para("", st_cell), para("", st_cell),
        para("", st_cell), para("", st_cell), para("", st_cell),
        para("", st_cellc), para("", st_cellc), para("", st_cellc),
        para("", st_cellr), para("", st_cellr),
    ])
    comp.append(30)

# CAPITAL LETTERS / Total row
rows.append([para(_val("A15"), st_lb)]*9 + [para(_val("J15"), st_cn), para(fmt_num(amt), st_cellr)])
comp.append(17)

# Trade term lines
for n in (17, 18, 19, 20):
    rows.append([para(_val(f"A{n}"), st_lb)]*4 + [para(_val(f"E{n}"), st_vl)]*7)
    comp.append(15)

rows.append([para(_val("A22"), st_lb)]*11)
comp.append(14)

# Note lines
for n in (23, 24, 25):
    rows.append([para(_val(f"A{n}"), st_note)]*11)
    comp.append(22)

rows.append([para(_val("A27"), st_lb)]*11)
comp.append(14)

# Bank info
for n in (28, 29, 30, 31, 32, 33, 34):
    rows.append([para(_val(f"A{n}"), st_lb)]*3 + [para(_val(f"D{n}"), st_vl)]*8)
    comp.append(15)

rows.append([para(_val("A36"), st_lb)]*11)
comp.append(16)
rows.append([para(_val("A37"), st_co)]*11)
comp.append(20)

# table column widths (from xlsx)
colw = [ws.column_dimensions[c].width for c in "ABCDEFGHIJK"]
total = sum(colw)
widths = [w / total * content_w for w in colw]
# align each row's width to the full column span
def fullwidth(rs):
    # convert list into a Table with all 11 columns, merging where needed via SPAN
    return rs

tbl_rows = [[c for c in r] for r in rows]
tbl_style = [("GRID", (0,0), (-1,-1), THIN, BLACK),
             ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
             ("LEFTPADDING", (0,0), (-1,-1), 2),
             ("RIGHTPADDING", (0,0), (-1,-1), 2),
             ("TOPPADDING", (0,0), (-1,-1), 0),
             ("BOTTOMPADDING", (0,0), (-1,-1), 0)]

# merges across whole rows (full-width bands): A1:K1 company, A2:K2 title,
# A5:F8 seller, G5:K8 buyer, A15:I15 capital, A22:K22 note hdr, A23..A25 notes,
# A27 bank hdr, A36 stamp label, A37 company stamp
def span(t, r0, r1, c0, c1):
    ttl_style.append(("SPAN", (c0, r0), (c1, r1)))
ttl_style = tbl_style + [
    ("SPAN", (0,0), (10,0)),      # A1:K1 company
    ("SPAN", (0,1), (10,1)),      # A2:K2 title
    ("SPAN", (3,2), (5,2)),       # D3:F3 date
    ("SPAN", (8,2), (10,2)),      # J3:K3 doc no
    ("SPAN", (0,3), (5,3)),       # A4:F4 seller hdr
    ("SPAN", (6,3), (10,3)),      # G4:K4 buyer hdr
    ("SPAN", (0,4), (5,4)),       # A5:F8 seller text
    ("SPAN", (6,4), (10,4)),      # G5:K5?? buyer (single row here)
    ("SPAN", (0,10), (8,10)),     # A15:I15 capital letters
    ("SPAN", (0,14), (10,14)),    # A22 note hdr
    ("SPAN", (0,15), (10,15)),    # A23 note1
    ("SPAN", (0,16), (10,16)),    # A24 note2
    ("SPAN", (0,17), (10,17)),    # A25 note3
    ("SPAN", (0,18), (10,18)),    # A27 bank hdr
    ("SPAN", (0,26), (10,26)),    # A36 stamp label
    ("SPAN", (0,27), (10,27)),    # A37 company name
]

table = Table(tbl_rows, colWidths=widths, rowHeights=comp)
table.setStyle(TableStyle(ttl_style))

doc = BaseDocTemplate(OUT, pagesize=PAGE,
                      leftMargin=LM, rightMargin=RM, topMargin=TM, bottomMargin=BM,
                      title="Quotation MZ-20260822 ISOPLAST 5R (FOB)")
frame = Frame(LM, BM, content_w, PAGE[1]-TM-BM, id="main")
doc.addPageTemplates([PageTemplate(id="all", frames=[frame])])
story = [table]
doc.build(story)
print("Done:", OUT)

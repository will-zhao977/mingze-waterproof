#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Sample Proforma Invoice PDF (samples FOC + courier USD 63.50) for BEDEM Energy
Solutions DOO (Serbia). Same B&W bordered style as the MZ sample quotation series.
Bank details block added per user request (USD wire transfer)."""
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.platypus import (BaseDocTemplate, Frame, PageTemplate,
                                Paragraph, Spacer, Table, TableStyle, HRFlowable)

# Plain black & white: no color scheme, no shading (house style)
TEXT_PRIMARY = colors.HexColor('#111111')

PAGE_W, PAGE_H = A4
MARGIN = 15 * mm
CW = PAGE_W - 2 * MARGIN


def ps(name, **kw):
    base = dict(fontName='Helvetica', fontSize=9.5, leading=13,
                textColor=TEXT_PRIMARY, alignment=TA_LEFT, spaceAfter=0)
    base.update(kw)
    return ParagraphStyle(name, **base)


S_CO     = ps('co', fontName='Helvetica-Bold', fontSize=15, leading=18, spaceAfter=1)
S_TITLE  = ps('title', fontName='Helvetica-Bold', fontSize=19, leading=23,
              alignment=TA_CENTER, spaceBefore=6, spaceAfter=8)
S_LBL9   = ps('lbl9', fontName='Helvetica-Bold', fontSize=9, leading=12.5)
S_TXT9   = ps('txt9', fontSize=9, leading=12.5)
S_H      = ps('h', fontName='Helvetica-Bold', fontSize=11, leading=14,
              spaceBefore=10, spaceAfter=3)
S_CELL   = ps('cell', fontSize=9, leading=12)
S_CELL_B = ps('cellb', fontName='Helvetica-Bold', fontSize=9, leading=12)
S_CELL_H = ps('cellh', fontName='Helvetica-Bold', fontSize=9, leading=12)
S_TOTAL  = ps('total', fontName='Helvetica-Bold', fontSize=10, leading=13)
S_SIG    = ps('sig', fontName='Helvetica-Bold', fontSize=9.5, leading=13)
S_FOOT   = ps('foot', fontSize=8.5, leading=12, alignment=TA_CENTER)
S_THANKS = ps('thanks', fontSize=9, leading=12, alignment=TA_CENTER, spaceBefore=10)

story = [
    Paragraph("WEIFANG MINGZE WATERPROOF MATERIAL CO., LTD.", S_CO),
    HRFlowable(width='100%', thickness=1.2, color=TEXT_PRIMARY, spaceAfter=4),
    Paragraph("PROFORMA INVOICE", S_TITLE),
    HRFlowable(width='100%', thickness=0.8, color=TEXT_PRIMARY, spaceAfter=5),
]

left_pairs = [
    ("PI NO.", "MZ-20260821-02"),
    ("DATE", "August 21, 2026"),
    ("PRICE TERM", "Samples FOC; courier fee USD 63.50 paid by Buyer"),
]
right_pairs = [
    ("BUYER", "BEDEM Energy Solutions DOO"),
    ("CONTACT", "Bras (Alibaba.com buyer)"),
    ("BUYER E-MAIL", "nabavka@bedem.com"),
]
info_rows = []
for (l1, v1), (l2, v2) in zip(left_pairs, right_pairs):
    info_rows.append([Paragraph(l1, S_LBL9), Paragraph(v1, S_TXT9),
                      Paragraph(l2, S_LBL9), Paragraph(v2, S_TXT9)])
info_tbl = Table(info_rows, colWidths=[CW * 0.14, CW * 0.36, CW * 0.14, CW * 0.36])
info_tbl.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 1.5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 1.5),
    ('LEFTPADDING', (0, 0), (-1, -1), 0),
    ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ('LINEBELOW', (0, -1), (-1, -1), 0.5, TEXT_PRIMARY),
]))
story.append(info_tbl)
story.append(Spacer(1, 5))

story.append(Paragraph("GOODS AND CHARGES", S_H))
story.append(HRFlowable(width='100%', thickness=0.6, color=TEXT_PRIMARY,
                        spaceBefore=1, spaceAfter=4))

name1 = "Waterproofing Membrane Samples"
pdesc1 = ("PVC and SBS, A4 size, for Buyer\u2019s evaluation \u2014 <b>FREE OF CHARGE</b>; product model "
          "and full specification to be confirmed with Buyer before dispatch.")
name2 = "International Courier Fee"
pdesc2 = "Door-to-door to Pan\u010devo, Serbia (DHL / FedEx / UPS), payable by Buyer."
th = [Paragraph("No.", S_CELL_H), Paragraph("Product Name", S_CELL_H), Paragraph("Description", S_CELL_H),
      Paragraph("Unit", S_CELL_H), Paragraph("Quantity", S_CELL_H), Paragraph("Unit Price (USD)", S_CELL_H),
      Paragraph("Amount (USD)", S_CELL_H)]
rows = [
    th,
    [Paragraph("1", S_CELL_B), Paragraph(name1, S_CELL_B), Paragraph(pdesc1, S_CELL), Paragraph("lot", S_CELL),
     Paragraph("1", S_CELL), Paragraph("0.00", S_CELL), Paragraph("0.00", S_CELL)],
    [Paragraph("2", S_CELL_B), Paragraph(name2, S_CELL_B), Paragraph(pdesc2, S_CELL), Paragraph("lot", S_CELL),
     Paragraph("1", S_CELL), Paragraph("63.50", S_CELL), Paragraph("63.50", S_CELL)],
    [Paragraph("TOTAL PAYABLE BY BUYER (USD):", S_TOTAL), Paragraph("", S_CELL), Paragraph("", S_CELL),
     Paragraph("", S_CELL), Paragraph("", S_CELL), Paragraph("", S_CELL), Paragraph("63.50", S_TOTAL)],
]
colw = [CW * 0.045, CW * 0.21, CW * 0.335, CW * 0.06, CW * 0.085, CW * 0.135, CW * 0.125]
pt = Table(rows, colWidths=colw, hAlign='CENTER')
pt.setStyle(TableStyle([
    ('GRID', (0, 0), (-1, -2), 0.5, TEXT_PRIMARY),
    ('BOX', (0, -1), (-1, -1), 1.0, TEXT_PRIMARY),
    ('SPAN', (0, -1), (5, -1)),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('LEFTPADDING', (0, 0), (-1, -1), 5),
    ('RIGHTPADDING', (0, 0), (-1, -1), 5),
]))
story.append(pt)

story.append(Paragraph("TERMS AND CONDITIONS", S_H))
story.append(HRFlowable(width='100%', thickness=0.6, color=TEXT_PRIMARY,
                        spaceBefore=1, spaceAfter=4))

notes = [
    ("1", "Payment",
     "Courier fee <b>USD 63.50</b> \u2014 T/T wire transfer in full before dispatch, to the Seller\u2019s "
     "bank account stated below. Kindly quote the PI number <b>MZ-20260821-02</b> in your payment reference."),
    ("2", "Dispatch",
     "Samples dispatched by international courier (DHL / FedEx / UPS) within 3 working days after payment "
     "confirmation, door-to-door to Miladina Popovi\u0107a 18, 26101 Pan\u010devo, Serbia "
     "(BEDEM Energy Solutions DOO, PIB: 105035592, Reg. No. 20294531); tracking number provided."),
    ("3", "Validity",
     "This proforma invoice is valid for 30 days from the date of issue."),
]
nrows = [[Paragraph(no, S_CELL_B), Paragraph(label, S_CELL_B), Paragraph(body, S_CELL)]
         for no, label, body in notes]
nt = Table(nrows, colWidths=[CW * 0.05, CW * 0.16, CW * 0.79], hAlign='CENTER')
nt.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 3),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
    ('LEFTPADDING', (0, 0), (-1, -1), 3),
    ('RIGHTPADDING', (0, 0), (-1, -1), 3),
    ('LINEBELOW', (0, -1), (-1, -1), 0.5, TEXT_PRIMARY),
]))
story.append(nt)

story.append(Paragraph("SELLER\u2019S BANK DETAILS (FOR USD WIRE TRANSFER)", S_H))
story.append(HRFlowable(width='100%', thickness=0.6, color=TEXT_PRIMARY,
                        spaceBefore=1, spaceAfter=4))
bank = [
    ("Beneficiary Bank", "Bank of China, Shouguang Branch (Business Department)"),
    ("Bank Address", "Shouguang City, Weifang, Shandong Province, China"),
    ("SWIFT / BIC Code", "BKCHCNBJXXX"),
    ("Beneficiary Name", "Weifang Mingze Waterproof Material Co., Ltd."),
    ("Account Number", "244252214045"),
    ("Account Currency", "USD"),
]
brows = [[Paragraph(k, S_CELL_B), Paragraph(v, S_CELL)] for k, v in bank]
bt = Table(brows, colWidths=[CW * 0.24, CW * 0.76], hAlign='CENTER')
bt.setStyle(TableStyle([
    ('GRID', (0, 0), (-1, -1), 0.5, TEXT_PRIMARY),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 3),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
    ('LEFTPADDING', (0, 0), (-1, -1), 5),
    ('RIGHTPADDING', (0, 0), (-1, -1), 5),
]))
story.append(bt)

story.append(Spacer(1, 8))
sig = Table([[Paragraph("SELLER / AUTHORIZED SIGNATURE:", S_SIG),
              Paragraph("COMPANY STAMP:", S_SIG)]],
            colWidths=[CW * 0.5, CW * 0.5])
sig.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('LINEBELOW', (0, -1), (-1, -1), 0.5, TEXT_PRIMARY),
]))
story.append(sig)
story.append(Spacer(1, 4))
story.append(Paragraph("Weifang Mingze Waterproof Material Co., Ltd. &nbsp;|&nbsp; Liu Zisong &nbsp;|&nbsp; "
                       "zisong@mzwaterproof.com &nbsp;|&nbsp; Tel: +86 13964642628", S_FOOT))
story.append(Paragraph("Thank you for your inquiry. We look forward to a long-term partnership.", S_THANKS))


def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFont('Helvetica', 7.5)
    canvas.setFillColor(TEXT_PRIMARY)
    canvas.drawString(MARGIN, 10 * mm, "Proforma Invoice MZ-20260821-02 | August 21, 2026")
    canvas.drawRightString(PAGE_W - MARGIN, 10 * mm, f"Page {doc.page}")
    canvas.restoreState()


doc = BaseDocTemplate("/Users/chengzhi/workspace/mingze/客户业务/报价/Bedem-Serbia/SamplePI_MZ_20260821_Bedem-Serbia_v1.pdf",
                      pagesize=A4, leftMargin=MARGIN, rightMargin=MARGIN,
                      topMargin=MARGIN, bottomMargin=16 * mm,
                      title="Proforma Invoice - MZ-20260821-02",
                      author="Weifang Mingze Waterproof Material Co., Ltd.",
                      subject="Sample (PVC and SBS membranes, FOC) + courier USD 63.50 to Pancevo, "
                              "BEDEM Energy Solutions DOO (Serbia)")
frame = Frame(MARGIN, 16 * mm, CW, PAGE_H - MARGIN - 16 * mm, id='main')
doc.addPageTemplates([PageTemplate(id='page', frames=[frame], onPage=on_page)])
doc.build(story)
print("PI sample PDF generated")

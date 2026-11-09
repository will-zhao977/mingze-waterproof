# -*- coding: utf-8 -*-
"""
Build the Mingze universal PROFORMA INVOICE template.

Format follows the user's hand-tuned version of PI_Sample_MZ_20260821_Bedem_Serbia.xlsx
(2026-08-21): symmetric grid A:D = E:H = 52; terms rows = boxed No. + single-cell
bold label (B) + C:H body; bank rows = joined A:B label (no divider) + C:H value;
uniform 44pt term rows, 87pt parties row; Arial, black & white, no fills, outline-
only borders on merged ranges.

Fillable fields are blank; company-fixed fields (header, seller, bank, footer) kept.
Output: orders/明泽防水-PI通用模板.xlsx
"""

import zipfile, os

OUT = "orders/明泽防水-PI通用模板.xlsx"

SELLER = ("Weifang Mingze Waterproof Material Co., Ltd.\n"
          "Shouguang City, Weifang, Shandong Province, China\n"
          "Contact: Liu Zisong\n"
          "Email: zisong@mzwaterproof.com\n"
          "Tel: +86 13964642628")
BUYER_HINT = ("Buyer Company Name\n"
              "Address, Country\n"
              "Tax Identification Number (PIB)\n"
              "Registration No.\n"
              "E-mail")

BANK = [
    ("Beneficiary Bank:", "Bank of China, Shouguang Branch (Business Department)"),
    ("Bank Address:", "Shouguang City, Weifang, Shandong Province, China"),
    ("SWIFT / BIC Code:", "BKCHCNBJXXX"),
    ("Beneficiary Name:", "Weifang Mingze Waterproof Material Co., Ltd."),
    ("Account Number:", "244252214045"),
    ("Account Currency:", "USD"),
]

SELLER_LINE = ("Weifang Mingze Waterproof Material Co., Ltd.  |  Liu Zisong  |  "
               "zisong@mzwaterproof.com  |  Tel: +86 13964642628")
FOOTER = "Thank you for your inquiry. We look forward to a long-term partnership."

TERMS = [
    ("3.1", "Payment",
     "The total amount payable shall be paid by T/T wire transfer in full before dispatch, to the "
     "Seller\u2019s bank account stated in Section 4. Kindly quote the PI No. in the payment reference."),
    ("3.2", "Dispatch",
     "Goods will be dispatched within 3 working days after payment confirmation; the tracking number "
     "will be provided to the Buyer."),
    ("3.3", "Validity",
     "This proforma invoice is valid for 30 days from the date of issue."),
]


def border_sides(left=False, right=False, top=True, bottom=True):
    l = '<left style="thin"><color rgb="FF000000"/></left>' if left else "<left/>"
    r = '<right style="thin"><color rgb="FF000000"/></right>' if right else "<right/>"
    t = '<top style="thin"><color rgb="FF000000"/></top>' if top else "<top/>"
    b = '<bottom style="thin"><color rgb="FF000000"/></bottom>' if bottom else "<bottom/>"
    return f"<border>{l}{r}{t}{b}<diagonal/></border>"


BORDER_XML = ("<border><left/><right/><top/><bottom/><diagonal/></border>"
              + border_sides(left=True) + border_sides() + border_sides(right=True)
              + border_sides(left=True, right=True))
B_NONE, B_L, B_M, B_R, B_BOX = range(5)

FONTS_XML = (
    '<font><sz val="11"/><color rgb="FF000000"/><name val="Arial"/><family val="2"/></font>'
    '<font><b/><sz val="11"/><color rgb="FF000000"/><name val="Arial"/><family val="2"/></font>'
    '<font><b/><sz val="16"/><color rgb="FF000000"/><name val="Arial"/><family val="2"/></font>'
    '<font><b/><sz val="12"/><color rgb="FF000000"/><name val="Arial"/><family val="2"/></font>'
    '<font><sz val="9"/><color rgb="FF000000"/><name val="Arial"/><family val="2"/></font>')


def xf(font=0, border=0, numfmt=0, h="left", v="center", wrap=False):
    a = f'<alignment horizontal="{h}" vertical="{v}"' + (' wrapText="1"' if wrap else '') + "/>"
    attrs = f'numFmtId="{numfmt}" fontId="{font}" fillId="0" borderId="{border}" xfId="0" applyFont="1" applyAlignment="1"'
    if numfmt:
        attrs += ' applyNumberFormat="1"'
    return f"<xf {attrs}>{a}</xf>"


XFS = [
    xf(),                                             # 0 plain
    xf(font=3, h="center"),                           # 1 company
    xf(font=2, h="center"),                           # 2 title
    xf(font=1),                                       # 3 bold heading (no border)
    xf(font=0),                                       # 4 plain no border
    xf(font=4, h="center"),                           # 5 footer
    xf(font=1, border=B_BOX, h="center", wrap=True),  # 6 table header cell
    xf(border=B_BOX, h="center"),                     # 7 centered boxed (No./Unit/Qty)
    xf(border=B_BOX, numfmt=2, h="right"),            # 8 number boxed
    xf(font=1, border=B_BOX, numfmt=2, h="right"),    # 9 bold number boxed (total)
    xf(font=1, border=B_BOX, wrap=True),              # 10 product name (bold, boxed)
    xf(wrap=True),                                    # 11 wrap top (buyer hint, no border)
]
TRIPLET_DEFS = {
    "wrap_top":  dict(font=0, wrap=True, v="top"),
    "wrap_mid":  dict(font=0, wrap=True),
    "bold_left": dict(font=1),
    "txt_left":  dict(font=0),
    "bold_ctr":  dict(font=1, h="center", wrap=True),
}
TRIPLET_BASE = {}
_n = len(XFS)
for name, kw in TRIPLET_DEFS.items():
    TRIPLET_BASE[name] = _n
    XFS.append(xf(border=B_L, **kw))
    XFS.append(xf(border=B_M, **kw))
    XFS.append(xf(border=B_R, **kw))
    _n += 3

STYLES_XML = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
              '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
              '<numFmts count="0"/><fonts count="5">' + FONTS_XML + '</fonts>'
              '<fills count="2"><fill><patternFill patternType="none"/></fill>'
              '<fill><patternFill patternType="gray125"/></fill></fills>'
              '<borders count="5">' + BORDER_XML + '</borders>'
              '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
              f'<cellXfs count="{len(XFS)}">' + "".join(XFS) + '</cellXfs>'
              '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>'
              '<dxfs count="0"/></styleSheet>')

XF_DEF, XF_CO, XF_TITLE, XF_BOLD, XF_TXT, XF_FOOT = 0, 1, 2, 3, 4, 5
XF_TH, XF_C, XF_N, XF_TOTN, XF_NAME, XF_HINT = 6, 7, 8, 9, 10, 11

COLW = [5, 18, 15, 14, 8, 10, 18, 16]  # A:D = E:H = 52 (left-right symmetric)
N_ITEMS = 4  # blank fillable item rows


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def cell(ref, value="", style=0, t="inlineStr", formula=None):
    attrs = f'r="{ref}" s="{style}"'
    if formula:
        v = f"<v>{value}</v>" if value != "" else "<v/>"
        return f'<c {attrs}><f>{esc(formula)}</f>{v}</c>'
    if value == "":
        return f'<c {attrs}/>'
    if t == "n":
        return f'<c {attrs} t="n"><v>{value}</v></c>'
    return f'<c {attrs} t="inlineStr"><is><t>{esc(value)}</t></is></c>'


def put(r, c1, c2, style=None, value="", t="inlineStr", formula=None, triplet=None):
    cols = "ABCDEFGH"
    parts = []
    for i, c in enumerate(range(c1, c2 + 1)):
        if triplet is not None and c2 > c1:
            s = triplet + (0 if i == 0 else 2 if i == c2 - c1 else 1)
        else:
            s = style
        ref = f"{cols[c - 1]}{r}"
        parts.append(cell(ref, value if i == 0 else "", s,
                          t=t if i == 0 else "inlineStr",
                          formula=formula if i == 0 else None))
    return "".join(parts)


def row(r, cells, height=None):
    h = f' ht="{height}" customHeight="1"' if height else ""
    return f'<row r="{r}"{h}>{cells}</row>'


rows, merges = [], []
M = merges.append
T = TRIPLET_BASE


def line(r, text, style, height=None):
    rows.append(row(r, put(r, 1, 8, style=style, value=text), height))
    M(f"A{r}:H{r}")


line(1, "WEIFANG MINGZE WATERPROOF MATERIAL CO., LTD.", XF_CO, 22)
line(2, "PROFORMA INVOICE", XF_TITLE, 28)

rows.append(row(3,
    put(3, 1, 2, triplet=T["bold_left"], value="PI NO.:") +
    put(3, 3, 4, triplet=T["txt_left"]) +
    put(3, 5, 6, triplet=T["bold_left"], value="DATE:") +
    put(3, 7, 8, triplet=T["txt_left"]), 20))
M("A3:B3"); M("C3:D3"); M("E3:F3"); M("G3:H3")

line(5, "1. PARTIES", XF_BOLD, 20)
rows.append(row(6,
    put(6, 1, 4, triplet=T["bold_ctr"], value="SELLER") +
    put(6, 5, 8, triplet=T["bold_ctr"], value="BUYER"), 20))
M("A6:D6"); M("E6:H6")
rows.append(row(7,
    put(7, 1, 4, triplet=T["wrap_top"], value=SELLER) +
    put(7, 5, 8, style=XF_HINT, value=BUYER_HINT), 87))
M("A7:D7"); M("E7:H7")

line(9, "2. GOODS AND CHARGES", XF_BOLD, 20)
rows.append(row(10,
    put(10, 1, 1, style=XF_TH, value="No.") +
    put(10, 2, 2, style=XF_TH, value="Product Name") +
    put(10, 3, 4, triplet=T["bold_ctr"], value="Description") +
    put(10, 5, 5, style=XF_TH, value="Unit") +
    put(10, 6, 6, style=XF_TH, value="Quantity") +
    put(10, 7, 7, style=XF_TH, value="Unit Price (USD)") +
    put(10, 8, 8, style=XF_TH, value="Amount (USD)"), 20))
for i in range(N_ITEMS):
    r = 11 + i
    rows.append(row(r,
        put(r, 1, 1, style=XF_C, value=str(i + 1)) +
        put(r, 2, 2, style=XF_NAME) +
        put(r, 3, 4, triplet=T["wrap_mid"]) +
        put(r, 5, 5, style=XF_C) +
        put(r, 6, 6, style=XF_C) +
        put(r, 7, 7, style=XF_N) +
        put(r, 8, 8, style=XF_N, formula=f'IF(OR(F{r}="",G{r}=""),"",F{r}*G{r})'), 30))
first, last = 11, 10 + N_ITEMS
rows.append(row(last + 1,
    put(last + 1, 1, 7, triplet=T["bold_left"], value="TOTAL PAYABLE BY BUYER (USD):") +
    put(last + 1, 8, 8, style=XF_TOTN,
        formula=f'IF(COUNT(H{first}:H{last})=0,"",SUM(H{first}:H{last}))'), 20))
M(f"A{last + 1}:G{last + 1}")

t0 = last + 3  # terms section heading row
line(t0, "3. TERMS AND CONDITIONS", XF_BOLD, 20)
for i, (no, label, body) in enumerate(TERMS):
    r = t0 + 1 + i
    rows.append(row(r,
        put(r, 1, 1, style=XF_C, value=no) +
        put(r, 2, 2, style=XF_NAME, value=label) +
        put(r, 3, 8, triplet=T["wrap_top"], value=body), 44))
    M(f"C{r}:H{r}")

b0 = t0 + len(TERMS) + 2  # bank section heading row
line(b0, "4. SELLER\u2019S BANK DETAILS (FOR USD WIRE TRANSFER)", XF_BOLD, 20)
BL = T["bold_left"]
for i, (label, value) in enumerate(BANK):
    r = b0 + 1 + i
    rows.append(row(r,
        put(r, 1, 1, style=BL, value=label) +        # A: left+top+bottom
        put(r, 2, 2, style=BL + 1) +                 # B: top+bottom (joined with A)
        put(r, 3, 8, triplet=T["txt_left"], value=value), 20))
    M(f"C{r}:H{r}")

s0 = b0 + len(BANK) + 2  # signature rows
rows.append(row(s0,
    put(s0, 1, 4, triplet=T["bold_left"], value="SELLER / AUTHORIZED SIGNATURE:") +
    put(s0, 5, 8, triplet=T["bold_left"], value="COMPANY STAMP:"), 20))
M(f"A{s0}:D{s0}"); M(f"E{s0}:H{s0}")
rows.append(row(s0 + 1,
    put(s0 + 1, 1, 4, triplet=T["txt_left"]) + put(s0 + 1, 5, 8, triplet=T["txt_left"]), 42))
M(f"A{s0 + 1}:D{s0 + 1}"); M(f"E{s0 + 1}:H{s0 + 1}")

line(s0 + 3, SELLER_LINE, XF_FOOT)
line(s0 + 4, FOOTER, XF_FOOT)

merge_xml = f'<mergeCells count="{len(merges)}">' + \
    "".join(f'<mergeCell ref="{m}"/>' for m in merges) + "</mergeCells>"
cols_xml = "".join(f'<col width="{COLW[i]}" customWidth="1" min="{i + 1}" max="{i + 1}"/>' for i in range(8))
sheet_xml = f"""<?xml version="1.0" encoding="utf-8"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetPr><outlinePr summaryBelow="1" summaryRight="1"/><pageSetUpPr fitToPage="1"/></sheetPr><dimension ref="A1:H{s0 + 4}"/><sheetViews><sheetView showGridLines="0" workbookViewId="0"><selection activeCell="A1" sqref="A1"/></sheetView></sheetViews><sheetFormatPr baseColWidth="8" defaultRowHeight="15"/><cols>{cols_xml}</cols>
<sheetData>
{''.join(rows)}
</sheetData>
{merge_xml}<printOptions horizontalCentered="1"/><pageMargins left="0.75" right="0.75" top="1" bottom="1" header="0.5" footer="0.5"/><pageSetup orientation="portrait" paperSize="9" fitToHeight="1" fitToWidth="1"/></worksheet>"""

CONTENT_TYPES = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>"""
RELS = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>"""
WB_RELS = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>"""

wb = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
      '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
      'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
      '<sheets><sheet name="Proforma Invoice" sheetId="1" state="visible" r:id="rId1"/></sheets>'
      '<calcPr calcId="124519" fullCalcOnLoad="1"/></workbook>')

if os.path.exists(OUT):
    os.remove(OUT)
with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
    z.writestr("[Content_Types].xml", CONTENT_TYPES)
    z.writestr("_rels/.rels", RELS)
    z.writestr("xl/workbook.xml", wb)
    z.writestr("xl/_rels/workbook.xml.rels", WB_RELS)
    z.writestr("xl/styles.xml", STYLES_XML)
    z.writestr("xl/worksheets/sheet1.xml", sheet_xml)
print("Done:", OUT)

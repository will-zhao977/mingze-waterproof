# -*- coding: utf-8 -*-
"""
Rebuild MZ-20260821 Bedem (Serbia) sample documents in minimal default style.

User feedback 2026-08-21 (cumulative):
  1. concise — repeated content deleted;
  2. default black & white — Arial (cross-platform), black text, NO fills;
  3. complete borders, professional contract form look;
  4. borders draw ONLY on the OUTLINE of merged ranges (L/M/R member xfs) —
     full-box member styles made WPS draw internal lines inside merges
     ("looked unmerged"), and merged cells never auto-fit height;
  5. row heights computed from content at ~1.0 char per width unit (Arial).

Outputs:
  客户业务/报价/Bedem-Serbia/SampleContract_MZ_20260821_Bedem-Serbia_v1.xlsx  (MZ-20260821-01)
  客户业务/报价/Bedem-Serbia/SamplePI_MZ_20260821_Bedem-Serbia_v1.xlsx        (MZ-20260821-02)
"""

import zipfile, os
import math

OUT_DIR = "客户业务/报价/Bedem-Serbia"

SELLER = ("Weifang Mingze Waterproof Material Co., Ltd.\n"
          "Shouguang City, Weifang, Shandong Province, China\n"
          "Contact: Liu Zisong  |  zisong@mzwaterproof.com  |  Tel: +86 13964642628")
BUYER = ("BEDEM Energy Solutions DOO\n"
         "Miladina Popovi\u0107a 18, 26101 Pan\u010devo, Serbia\n"
         "Tax Identification Number (PIB): 105035592  |  Registration No.: 20294531\n"
         "E-mail: nabavka@bedem.com")

NAME1 = "Waterproofing Membrane Samples"
DESC1 = ("PVC and SBS, A4 size, for Buyer\u2019s evaluation \u2014 FREE OF CHARGE; product model and full "
         "specification to be confirmed with Buyer before dispatch.")
NAME2 = "International Courier Fee"
DESC2 = "Door-to-door to Pan\u010devo, Serbia (DHL / FedEx / UPS), payable by Buyer."

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


def border_sides(left=False, right=False, top=True, bottom=True):
    def side(on):
        return '<left style="thin"><color rgb="FF000000"/></left>' if on else "<left/>"
    l = '<left style="thin"><color rgb="FF000000"/></left>' if left else "<left/>"
    r = '<right style="thin"><color rgb="FF000000"/></right>' if right else "<right/>"
    t = '<top style="thin"><color rgb="FF000000"/></top>' if top else "<top/>"
    b = '<bottom style="thin"><color rgb="FF000000"/></bottom>' if bottom else "<bottom/>"
    return f"<border>{l}{r}{t}{b}<diagonal/></border>"


# border pool: 0 none, then outline variants used by L/M/R member styles
BORDER_XML = ("<border><left/><right/><top/><bottom/><diagonal/></border>"
              + border_sides(left=True)                      # 1 L: left+top+bottom
              + border_sides()                               # 2 M: top+bottom
              + border_sides(right=True)                     # 3 R: right+top+bottom
              + border_sides(left=True, right=True))         # 4 full box

B_NONE, B_L, B_M, B_R, B_BOX = range(5)

# fonts: 0 Arial11, 1 Arial11 bold, 2 Arial16 bold(title), 3 Arial12 bold(company), 4 Arial9(footer)
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


# cellXfs — single styles 0-8, then L/M/R triplets 10+ (3 consecutive per type)
XFS = [
    xf(),                                    # 0 DEF plain
    xf(font=3, h="center"),                  # 1 company header
    xf(font=2, h="center"),                  # 2 title
    xf(font=1),                              # 3 bold left (section headings)
    xf(font=0),                              # 4 plain left, no border
    xf(font=4, h="center"),                  # 5 footer small centered
    xf(font=1, border=B_BOX, h="center", wrap=True),   # 6 table header single cell
    xf(border=B_BOX, h="center"),            # 7 centered boxed single (No./lot/qty)
    xf(border=B_BOX, numfmt=2, h="right"),   # 8 number boxed single
    xf(font=1, border=B_BOX, numfmt=2, h="right"),  # 9 bold number boxed (total)
    xf(font=1, border=B_BOX, wrap=True),            # 10 product-name cell (bold, wrapped)
]
# triplet base styles: (base index) -> L, M, R variants appended after singles
TRIPLETS = {
    "wrap_top":  xf(wrap=True, v="top"),          # party blocks, term bodies
    "wrap_mid":  xf(wrap=True),                   # table descriptions
    "bold_left": xf(font=1),                      # labels: info/bank/terms/signature
    "txt_left":  xf(),                            # values: info/bank/signing box
    "bold_ctr":  xf(font=1, h="center", wrap=True),  # SELLER/BUYER labels, Description header
}
TRIPLET_BASE = {}
_next = len(XFS)
for name, base in TRIPLETS.items():
    TRIPLET_BASE[name] = _next
    for b in (B_L, B_M, B_R):
        numfmt = 2 if False else 0
        XFS.append(xf(font=1 if "bold" in name else 0, border=b, numfmt=0,
                      h="center" if name == "bold_ctr" else "left",
                      v="top" if name == "wrap_top" else "center",
                      wrap=("wrap" in name)))
    _next += 3

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
XF_TH, XF_C, XF_N, XF_TOTN, XF_NAME = 6, 7, 8, 9, 10

# merged-range display widths (sum of column width units) for height estimation.
# Grid is left-right symmetric: A:D = E:H = 52 so the parties/signature halves
# and the page as a whole look balanced (user request 2026-08-21).
COLW = [5, 18, 15, 14, 8, 10, 18, 16]
W_AD, W_EH, W_DH = sum(COLW[0:4]), sum(COLW[4:8]), sum(COLW[3:8])
W_NAME, W_DESC = COLW[1], COLW[2] + COLW[3]


def est_lines(text, width_units, chars_per_unit=1.0):
    per = width_units * chars_per_unit
    return sum(max(1, math.ceil(len(seg) / per)) for seg in text.split("\n"))


def ht_for(lines, per_line=15, pad=6, minimum=20):
    return max(minimum, lines * per_line + pad)


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
    """Write cells c1..c2. With `triplet` (an L/M/R base index) each member
    carries only its outline edges so no internal lines appear inside the
    merged range in any application; the value goes in the first cell."""
    cols = "ABCDEFGH"
    parts = []
    for i, c in enumerate(range(c1, c2 + 1)):
        if triplet is not None:
            s = triplet + (0 if (c2 > c1 and i == 0) else 2 if i == c2 - c1 else 1)
        else:
            s = style
        ref = f"{cols[c - 1]}{r}"
        parts.append(cell(ref, value if i == 0 else "", s, t=t if i == 0 else "inlineStr",
                          formula=formula if i == 0 else None))
    return "".join(parts)


def row(r, cells, height=None):
    h = f' ht="{height}" customHeight="1"' if height else ""
    return f'<row r="{r}"{h}>{cells}</row>'


def build_sheet(doc):
    """doc: 'contract' or 'pi'"""
    is_pi = doc == "pi"
    T = TRIPLET_BASE
    rows, merges = [], []
    M = merges.append

    def line(r, text, style, height=None):
        rows.append(row(r, put(r, 1, 8, style=style, value=text), height))
        M(f"A{r}:H{r}")

    # 1-2: company + title
    line(1, "WEIFANG MINGZE WATERPROOF MATERIAL CO., LTD.", XF_CO, 22)
    line(2, "PROFORMA INVOICE" if is_pi else "SAMPLE CONTRACT", XF_TITLE, 28)

    # 3: number + date (boxed form row)
    rows.append(row(3,
        put(3, 1, 2, triplet=T["bold_left"], value="PI NO.:" if is_pi else "CONTRACT NO.:") +
        put(3, 3, 4, triplet=T["txt_left"], value="MZ-20260821-02" if is_pi else "MZ-20260821-01") +
        put(3, 5, 6, triplet=T["bold_left"], value="DATE:") +
        put(3, 7, 8, triplet=T["txt_left"], value="August 21, 2026"), 20))
    M("A3:B3"); M("C3:D3"); M("E3:F3"); M("G3:H3")

    # 5: parties
    line(5, "1. PARTIES", XF_BOLD, 20)
    rows.append(row(6,
        put(6, 1, 4, triplet=T["bold_ctr"], value="SELLER") +
        put(6, 5, 8, triplet=T["bold_ctr"], value="BUYER"), 20))
    M("A6:D6"); M("E6:H6")
    rows.append(row(7,
        put(7, 1, 4, triplet=T["wrap_top"], value=SELLER) +
        put(7, 5, 8, triplet=T["wrap_top"], value=BUYER),
        ht_for(max(est_lines(SELLER, W_AD), est_lines(BUYER, W_EH)))))
    M("A7:D7"); M("E7:H7")

    # 9: goods table
    line(9, "2. GOODS AND CHARGES" if is_pi else "2. SAMPLE DETAILS AND CHARGES", XF_BOLD, 20)
    rows.append(row(10,
        put(10, 1, 1, style=XF_TH, value="No.") +
        put(10, 2, 2, style=XF_TH, value="Product Name") +
        put(10, 3, 4, triplet=T["bold_ctr"], value="Description") +
        put(10, 5, 5, style=XF_TH, value="Unit") +
        put(10, 6, 6, style=XF_TH, value="Quantity") +
        put(10, 7, 7, style=XF_TH, value="Unit Price (USD)") +
        put(10, 8, 8, style=XF_TH, value="Amount (USD)"), 20))
    for i, (name, desc, price) in enumerate([(NAME1, DESC1, 0), (NAME2, DESC2, 63.5)]):
        r = 11 + i
        rows.append(row(r,
            put(r, 1, 1, style=XF_C, value=str(i + 1)) +
            put(r, 2, 2, style=XF_NAME, value=name) +
            put(r, 3, 4, triplet=T["wrap_mid"], value=desc) +
            put(r, 5, 5, style=XF_C, value="lot") +
            put(r, 6, 6, style=XF_C, value="1", t="n") +
            put(r, 7, 7, style=XF_N, value=str(price), t="n") +
            put(r, 8, 8, style=XF_N, value=str(price), formula=f'IF(OR(F{r}="",G{r}=""),"",F{r}*G{r})'),
            ht_for(max(est_lines(name, W_NAME), est_lines(desc, W_DESC)))))
    rows.append(row(13,
        put(13, 1, 7, triplet=T["bold_left"], value="TOTAL PAYABLE BY BUYER (USD):") +
        put(13, 8, 8, style=XF_TOTN, value="63.5", formula='IF(COUNT(H11:H12)=0,"",SUM(H11:H12))'), 20))
    M("A13:G13")

    # 15: terms (concise — no repetition of table/party content)
    line(15, "3. TERMS AND CONDITIONS", XF_BOLD, 20)
    no_label = "PI No. MZ-20260821-02" if is_pi else "Contract No. MZ-20260821-01"
    terms = [
        ("3.1", "Payment",
         "The courier fee of USD 63.50 shall be paid by T/T wire transfer in full before dispatch, to the "
         "Seller\u2019s bank account stated in Section 4. Kindly quote the %s in the payment reference." % no_label),
        ("3.2", "Dispatch",
         "Samples dispatched by international courier (DHL / FedEx / UPS) within 3 working days after payment "
         "confirmation; tracking number provided to the Buyer."),
        ("3.3", "Validity",
         "This document is valid for 30 days from the date of issue."),
    ]
    for i, (no, label, body) in enumerate(terms):
        r = 16 + i
        rows.append(row(r,
            put(r, 1, 1, style=XF_C, value=no) +
            put(r, 2, 3, triplet=T["bold_left"], value=label) +
            put(r, 4, 8, triplet=T["wrap_top"], value=body),
            ht_for(est_lines(body, W_DH))))
        M(f"B{r}:C{r}"); M(f"D{r}:H{r}")

    # 20: bank details
    line(20, "4. SELLER\u2019S BANK DETAILS (FOR USD WIRE TRANSFER)", XF_BOLD, 20)
    for i, (label, value) in enumerate(BANK):
        r = 21 + i
        rows.append(row(r,
            put(r, 1, 3, triplet=T["bold_left"], value=label) +
            put(r, 4, 8, triplet=T["txt_left"], value=value), 20))
        M(f"A{r}:C{r}"); M(f"D{r}:H{r}")

    # 28-29: signature boxes with signing space
    rows.append(row(28,
        put(28, 1, 4, triplet=T["bold_left"], value="SELLER / AUTHORIZED SIGNATURE:") +
        put(28, 5, 8, triplet=T["bold_left"], value="COMPANY STAMP:"), 20))
    M("A28:D28"); M("E28:H28")
    rows.append(row(29,
        put(29, 1, 4, triplet=T["txt_left"]) + put(29, 5, 8, triplet=T["txt_left"]), 42))
    M("A29:D29"); M("E29:H29")

    line(30, SELLER_LINE, XF_FOOT)
    line(31, FOOTER, XF_FOOT)

    merge_xml = f'<mergeCells count="{len(merges)}">' + \
        "".join(f'<mergeCell ref="{m}"/>' for m in merges) + "</mergeCells>"

    cols_xml = "".join(f'<col width="{COLW[i]}" customWidth="1" min="{i + 1}" max="{i + 1}"/>' for i in range(8))
    return f"""<?xml version="1.0" encoding="utf-8"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetPr><outlinePr summaryBelow="1" summaryRight="1"/><pageSetUpPr fitToPage="1"/></sheetPr><dimension ref="A1:H31"/><sheetViews><sheetView showGridLines="0" workbookViewId="0"><selection activeCell="A1" sqref="A1"/></sheetView></sheetViews><sheetFormatPr baseColWidth="8" defaultRowHeight="15"/><cols>{cols_xml}</cols>
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


def write_package(path, sheet_xml, sheet_name):
    wb = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
          '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
          'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
          f'<sheets><sheet name="{sheet_name}" sheetId="1" state="visible" r:id="rId1"/></sheets>'
          '<calcPr calcId="124519" fullCalcOnLoad="1"/></workbook>')
    if os.path.exists(path):
        os.remove(path)
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", CONTENT_TYPES)
        z.writestr("_rels/.rels", RELS)
        z.writestr("xl/workbook.xml", wb)
        z.writestr("xl/_rels/workbook.xml.rels", WB_RELS)
        z.writestr("xl/styles.xml", STYLES_XML)
        z.writestr("xl/worksheets/sheet1.xml", sheet_xml)
    print("Done:", path)


write_package(os.path.join(OUT_DIR, "SampleContract_MZ_20260821_Bedem-Serbia_v1.xlsx"),
              build_sheet("contract"), "Sample Contract")
# PI_Sample_MZ_20260821_Bedem_Serbia.xlsx 于 2026-08-21 10:41 被用户手工调整过版式，
# 不再从此脚本重生成覆盖；通用版式见 公共模板/出货与报关/明泽防水-PI通用模板.xlsx

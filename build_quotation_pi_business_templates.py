# -*- coding: utf-8 -*-
"""
Build the three Mingze business-style templates in one pass, following the
user-provided PROFORMA INVOICE reference (2026-08-22):
  - company header + document type title;
  - Date / Document No. band;
  - The Buyer / The Seller panel (seller = company fixed info);
  - bilingual two-row product table header (EN + ZH);
  - 4 blank fillable product rows (amount = qty*price), CAPITAL LETTERS, Total;
  - Trade Term / Payment / Shipment / Remarks lines;
  - numbered Note clauses;
  - BENEFICIARY BANK INFO (company fixed);
  - THE BUYER / THE SELLER signature.

Style: black & white only, Arial, thin black borders drawn on the OUTLINE of
merged ranges (L/M/R triplet), larger fonts for readability.

Outputs (variable fields left blank; only company-fixed data filled):
  公共模板/报价/明泽防水-报价单模板-FOB.xlsx   (COMMERCIAL QUOTATION (FOB))
  公共模板/报价/明泽防水-报价单模板-EXW.xlsx   (COMMERCIAL QUOTATION (EXW))
  公共模板/报价/明泽防水-报价单模板-CIF.xlsx   (COMMERCIAL QUOTATION (CIF))
  公共模板/报价/明泽防水-报价单模板-DDP.xlsx   (COMMERCIAL QUOTATION (DDP))
  公共模板/出货与报关/明泽防水-PI通用模板.xlsx       (PROFORMA INVOICE)
"""

import zipfile, os


# ── per-template parameters ────────────────────────────────────────────────
TEMPLATES = [
    dict(
        out="公共模板/报价/明泽防水-报价单模板-FOB.xlsx",
        doc_type="COMMERCIAL QUOTATION  ( FOB )",
        price_hdr="Unit Price\n(FOB Qingdao)",
        amt_hdr="Amount\n(FOB Qingdao)",
        trade_term="FOB [China Qingdao port]",
        note2=("Under FOB term, seller bears all costs and risks before goods are "
               "loaded on board at the port of loading; ocean freight, insurance "
               "and destination port charges are borne by buyer."),
    ),
    dict(
        out="公共模板/报价/明泽防水-报价单模板-EXW.xlsx",
        doc_type="COMMERCIAL QUOTATION  ( EXW )",
        price_hdr="Unit Price\n(EXW)",
        amt_hdr="Amount\n(EXW)",
        trade_term="EXW [Named Place of Delivery]",
        note2=("Under EXW term, buyer bears all costs and risks from the moment "
               "goods are placed at buyer's disposal at the seller's premises; "
               "loading, export clearance, inland transport and ocean freight are "
               "borne by the buyer."),
    ),
    dict(
        out="公共模板/报价/明泽防水-报价单模板-CIF.xlsx",
        doc_type="COMMERCIAL QUOTATION  ( CIF )",
        price_hdr="Unit Price\n(CIF)",
        amt_hdr="Amount\n(CIF)",
        trade_term="CIF [Named Port of Destination]",
        note2=("Under CIF term, seller bears the cost, freight and marine insurance "
               "to the named port of destination; the risk is transferred to the "
               "buyer when the goods are loaded on board at the port of shipment, "
               "and the buyer bears unloading and destination charges."),
    ),
    dict(
        out="公共模板/报价/明泽防水-报价单模板-DDP.xlsx",
        doc_type="COMMERCIAL QUOTATION  ( DDP )",
        price_hdr="Unit Price\n(DDP)",
        amt_hdr="Amount\n(DDP)",
        trade_term="DDP [Named Place of Delivery]",
        note2=("Under DDP term, seller bears all costs and risks to deliver the "
               "goods to the named place of destination, including carriage, "
               "insurance, import clearance and duties. Buyer's cooperation "
               "is required to provide import documents."),
    ),
    dict(
        out="公共模板/出货与报关/明泽防水-PI通用模板.xlsx",
        doc_type="PROFORMA INVOICE",
        price_hdr="Unit Price\n(USD)",
        amt_hdr="Amount\n(USD)",
        trade_term="FOB [China Qingdao port]",
        note2=("Costs and risks are borne by the seller and the buyer as defined by "
               "the agreed Incoterms term; carriage, insurance and destination "
               "charges depend on the term agreed."),
    ),
]


# ── fixed company info ─────────────────────────────────────────────────────
COMPANY = "WEIFANG MINGZE WATERPROOF MATERIAL CO., LTD."
SELLER = [
    "Contact Person: Liu Zisong",
    "TEL: 086-13964642628",
    "Email: zisong@mzwaterproof.com",
    ("Address: Caoxinzhuang Village, Yangkou Town, Shouguang City, "
     "Weifang City, Shandong, China."),
    "Postal code: 262700",
]

BANK = [
    ("Bank:", "Bank of China"),
    ("Branch:", "Shouguang Branch (Business Department)"),
    ("Bank Address:", "Shouguang City, Weifang, Shandong Province, China"),
    ("SWIFT / BIC Code:", "BKCHCNBJXXX"),
    ("Beneficiary Name:", "Weifang Mingze Waterproof Material Co., Ltd."),
    ("Account Number:", "244252214045"),
    ("Account Currency:", "USD"),
]

NOTE1 = ("This Proforma Invoice is only for quotation, buyer's payment and customs "
         "clearance, not for final settlement. Formal Commercial Invoice will be "
         "issued after shipment.")
NOTE3 = ("Risk will be transferred to the buyer after goods are delivered as per the "
         "agreed Incoterms term. The seller shall not be liable for delivery delay "
         "caused by force majeure.")

# Fixed commercial defaults (user-confirmed 2026-08-22).
DEFAULT_PAYMENT = "By T/T 30% deposit, 70% balance before shipment."
DEFAULT_SHIPMENT = "Within 3-10 working days after receiving your Deposit."
DEFAULT_REMARKS = "Validity time is 15 days."


# ── borders ────────────────────────────────────────────────────────────────
def _b(left=False, right=False, top=False, bottom=False):
    l = '<left style="thin"><color rgb="FF000000"/></left>' if left else "<left/>"
    r = '<right style="thin"><color rgb="FF000000"/></right>' if right else "<right/>"
    t = '<top style="thin"><color rgb="FF000000"/></top>' if top else "<top/>"
    b = '<bottom style="thin"><color rgb="FF000000"/></bottom>' if bottom else "<bottom/>"
    return f"<border>{l}{r}{t}{b}<diagonal/></border>"


# index: 0 none; 1 L; 2 M; 3 R; 4 BOX; 5 T; 6 RT; 7 LONLY; 8 RONLY;
#        9 LB; 10 B; 11 RB; 12 LT
BORDER_LIST = ["<border><left/><right/><top/><bottom/><diagonal/></border>",
               _b(left=True, top=True, bottom=True),          # 1 L
               _b(top=True, bottom=True),                     # 2 M
               _b(right=True, top=True, bottom=True),         # 3 R
               _b(left=True, right=True, top=True, bottom=True),  # 4 BOX
               _b(top=True),                                  # 5 T
               _b(right=True, top=True),                      # 6 RT
               _b(left=True),                                 # 7 LONLY
               _b(right=True),                                # 8 RONLY
               _b(left=True, bottom=True),                    # 9 LB
               _b(bottom=True),                               # 10 B
               _b(right=True, bottom=True),                   # 11 RB
               _b(left=True, top=True)]                       # 12 LT
BORDER_XML = "".join(BORDER_LIST)
(B_NONE, B_L, B_M, B_R, B_BOX, B_T, B_RT,
 B_LONLY, B_RONLY, B_LB, B_B, B_RB, B_LT) = range(13)


# ── fonts ──────────────────────────────────────────────────────────────────
FONTS_XML = (
    # 0 body Arial 11
    '<font><sz val="11"/><color rgb="FF000000"/><name val="Arial"/><family val="2"/></font>'
    # 1 body bold
    '<font><b/><sz val="11"/><color rgb="FF000000"/><name val="Arial"/><family val="2"/></font>'
    # 2 company
    '<font><b/><sz val="13"/><color rgb="FF000000"/><name val="Arial"/><family val="2"/></font>'
    # 3 doc type title
    '<font><b/><sz val="15"/><color rgb="FF000000"/><name val="Arial"/><family val="2"/></font>'
    # 4 table body Arial 10
    '<font><sz val="10"/><color rgb="FF000000"/><name val="Arial"/><family val="2"/></font>'
    # 5 table header bold Arial 10
    '<font><b/><sz val="10"/><color rgb="FF000000"/><name val="Arial"/><family val="2"/></font>'
    # 6 small label/note Arial 10
    '<font><sz val="10"/><color rgb="FF000000"/><name val="Arial"/><family val="2"/></font>'
)
F_BODY, F_BOLDBODY, F_COMPANY, F_TITLE, F_TBODY, F_TH, F_SMALL = range(7)


def xf(font=0, border=0, numfmt=0, h="left", v="center", wrap=False):
    a = '<alignment horizontal="%s" vertical="%s"%s/>' % (
        h, v, ' wrapText="1"' if wrap else "")
    attrs = ('numFmtId="%d" fontId="%d" fillId="0" borderId="%d" xfId="0" '
             'applyFont="1" applyAlignment="1"' % (numfmt, font, border))
    if numfmt:
        attrs += ' applyNumberFormat="1"'
    return f"<xf {attrs}>{a}</xf>"


# Base cell styles (no triplet) -> map name to numeric style index.
XLIST = []
STYLES = {}


def add_style(name, **kw):
    STYLES[name] = len(XLIST)
    XLIST.append(xf(**kw))
    return STYLES[name]


add_style("body")                                # 0
add_style("body_ctr", h="center")                # 1
add_style("header", font=F_COMPANY, h="center")  # 2 company line
add_style("title", font=F_TITLE, h="center")     # 3 doc type
add_style("th", font=F_TH, border=B_BOX, h="center", wrap=True)          # 4
add_style("zh", font=F_TH, border=B_BOX, h="center", wrap=True)          # 5
add_style("cell", font=F_TBODY, border=B_BOX, h="center", wrap=True)     # 6
add_style("cell_l", font=F_TBODY, border=B_BOX, wrap=True)               # 7
add_style("cell_num", font=F_TBODY, border=B_BOX, numfmt=4, h="right")   # 8
add_style("cell_numn", font=F_TBODY, border=B_BOX, numfmt=3, h="center") # 9
add_style("cell_t", font=F_TBODY, border=B_BOX, numfmt=164, h="center")  # 10
add_style("tot_num", font=F_BOLDBODY, border=B_BOX, numfmt=4, h="right") # 11
add_style("note_bold", font=F_BOLDBODY)                                   # 12
add_style("lbl", font=F_BOLDBODY)                                         # 13
add_style("body_wrap", wrap=True)                                         # 14
add_style("tot_lbl", font=F_BOLDBODY, border=B_BOX, h="center")           # 15


# Triplet variants (L / M / R) for merged horizontal runs, keyed by base name.
TRIPLET_DEFS = {
    "label":  dict(font=F_BOLDBODY),
    "value":  dict(font=F_BODY),
    "valuetxt": dict(font=F_BODY, numfmt=49),
    "wrap":   dict(font=F_BODY, wrap=True),
    "holder": dict(font=F_BODY, wrap=True),
}
TRIPLET = {}
for name, kw in TRIPLET_DEFS.items():
    i_l = len(XLIST); XLIST.append(xf(border=B_L, **kw))
    i_m = len(XLIST); XLIST.append(xf(border=B_M, **kw))
    i_r = len(XLIST); XLIST.append(xf(border=B_R, **kw))
    TRIPLET[name] = (i_l, i_m, i_r)


# Border-only style cache for 2D merged blocks (perimeter borders).
BSTYLE = {}


def bstyle(border=0, font=F_BODY, h="left", v="center", wrap=False, numfmt=0):
    key = (border, font, h, v, wrap, numfmt)
    if key not in BSTYLE:
        BSTYLE[key] = len(XLIST)
        XLIST.append(xf(font=font, border=border, numfmt=numfmt, h=h, v=v, wrap=wrap))
    return BSTYLE[key]


NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
COLS = "ABCDEFGHIJK"  # 11 columns
# Balanced so left (A..F) and right (G..K) both sum to 68, keeping Buyer /
# Seller symmetric; long header labels get room (Quantity, Gross weight).
# Balanced so left (A..F) and right (G..K) both sum to 68; widths matched to
# the verified actual quotation (B=14, D=13, F=32) for readable PDF output.
COLW = [4, 14, 18, 13, 8, 32, 14, 9, 11, 15, 19]


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


def put_cells(r, c1, c2, style=0, value="", t="inlineStr", formula=None, triplet=None):
    parts = []
    for i, c in enumerate(range(c1, c2 + 1)):
        if triplet is not None and c2 > c1:
            s = triplet[0] if i == 0 else triplet[2] if i == c2 - c1 else triplet[1]
        else:
            s = style
        ref = f"{COLS[c - 1]}{r}"
        parts.append(cell(ref, value if i == 0 else "", s,
                          t=t if i == 0 else "inlineStr",
                          formula=formula if i == 0 else None))
    return "".join(parts)


def xrow(r, cells, height=None):
    h = f' ht="{height}" customHeight="1"' if height else ""
    return f'<row r="{r}"{h}>{cells}</row>'


def rect_block(rows, r1, r2, c1, c2, border_cell, value=None, val_cell=None,
               height=None):
    """Emit a 2D merged rectangle with correct perimeter borders.

    border_cell(r, c) -> style index for that boundary cell (LONLY/RONLY/T/B/
    LT/RT/LB/RB). Interior cells and untouched contents handled by callers.
    """
    for r in range(r1, r2 + 1):
        cells = []
        for c in range(c1, c2 + 1):
            ref = f"{COLS[c - 1]}{r}"
            val = ""
            if val_cell == (r, c) and value is not None:
                val = value
            cells.append(cell(ref, val, border_cell(r, c)))
        rows.append(xrow(r, "".join(cells), height))


def build(t):
    rows, merges = [], []
    M = merges.append
    T = TRIPLET

    def line(r, text, style, height=None, c1=1, c2=11):
        rows.append(xrow(r, put_cells(r, c1, c2, style=style, value=text), height))
        M(f"{COLS[c1 - 1]}{r}:{COLS[c2 - 1]}{r}")

    # ── header ──
    line(1, COMPANY, STYLES["header"], 22)
    line(2, t["doc_type"], STYLES["title"], 26)

    # ── Date / Document No. band (bordered) ──
    r = 3
    rows.append(xrow(r,
        put_cells(r, 1, 3, triplet=T["label"], value="Date:") +
        put_cells(r, 4, 6, triplet=T["value"], value="  \u3000\u3000 (Beijing Time)") +
        put_cells(r, 7, 9, triplet=T["label"], value="Document No.:") +
        put_cells(r, 10, 11, triplet=T["value"]), 22))
    M("A3:C3"); M("D3:F3"); M("G3:I3"); M("J3:K3")

    # ── Buyer / Seller panel (Seller left, Buyer right) ──
    r = 4
    rows.append(xrow(r,
        put_cells(r, 1, 6, triplet=T["label"], value="The Seller:") +
        put_cells(r, 7, 11, triplet=T["label"], value="The Buyer:"), 20))
    M("A4:F4"); M("G4:K4")

    def block(r1, r2, c1, c2, value=None, val_cell=None, wrap=False, height=22):
        # perimeter borders chosen by position; outline of the merged block
        for rr in range(r1, r2 + 1):
            cells = []
            for cc in range(c1, c2 + 1):
                is_top = rr == r1
                is_bot = rr == r2
                is_left = cc == c1
                is_right = cc == c2
                # pick border by position
                if is_top and is_left:
                    bd = B_LT
                elif is_top and is_right:
                    bd = B_RT
                elif is_bot and is_left:
                    bd = B_LB
                elif is_bot and is_right:
                    bd = B_RB
                elif is_top:
                    bd = B_T
                elif is_bot:
                    bd = B_B
                elif is_left:
                    bd = B_LONLY
                elif is_right:
                    bd = B_RONLY
                else:
                    bd = B_NONE
                val = value if val_cell == (rr, cc) else ""
                cells.append(cell(f"{COLS[cc - 1]}{rr}", val,
                                  bstyle(border=bd, wrap=wrap)))
            rows.append(xrow(rr, "".join(cells), height))

    seller_txt = "\n".join(SELLER)
    block(5, 8, 1, 6, value=seller_txt, val_cell=(5, 1), wrap=True, height=28)
    M("A5:F8")
    block(5, 8, 7, 11, height=28)                      # buyer area (blank)
    M("G5:K8")

    # ── product table header (bilingual, one cell with newline) ──
    hdr = [
        "NO.\n序号", "NOS&MARKS\n唛头", "Product description\n产品名",
        "HS Code\nHS编码", "Pictures\n图片", "Specification Model\n规格",
        "Quantity (20GP)\n数量（20GP）", "Unit\n单位",
        "Total gross weight (ton)\n总毛重（吨）",
        t["price_hdr"] + "\n单价", t["amt_hdr"] + "\n金额",
    ]
    hdr_cells = "".join(
        cell(f"{COLS[c]}10", hdr[c], STYLES["th"]) for c in range(11)
    )
    rows.append(xrow(10, hdr_cells, 58))

    # ── product rows ──
    first = 11
    n_items = 4
    for i in range(n_items):
        r = first + i
        cells = (
            cell(f"A{r}", str(i + 1), STYLES["cell_numn"], t="n") +
            cell(f"B{r}", "", STYLES["cell_l"]) +
            cell(f"C{r}", "", STYLES["cell_l"]) +
            cell(f"D{r}", "", STYLES["cell"]) +
            cell(f"E{r}", "", STYLES["cell"]) +
            cell(f"F{r}", "", STYLES["cell_l"]) +
            cell(f"G{r}", "", STYLES["cell_numn"]) +
            cell(f"H{r}", "", STYLES["cell"]) +
            cell(f"I{r}", "", STYLES["cell_t"]) +
            cell(f"J{r}", "", STYLES["cell_num"]) +
            cell(f"K{r}", "", STYLES["cell_num"],
                 formula=f'IF(OR(G{r}="",J{r}=""),"",G{r}*J{r})')
        )
        rows.append(xrow(r, cells, 70))

    last = first + n_items - 1
    # ── CAPITAL LETTERS + Total ──
    r = last + 1
    rows.append(xrow(r,
        put_cells(r, 1, 9, triplet=T["label"], value="CAPITAL LETTERS:") +
        put_cells(r, 10, 10, style=STYLES["tot_lbl"], value="Total") +
        put_cells(r, 11, 11, style=STYLES["tot_num"],
                  formula=f'IF(COUNT(K{first}:K{last})=0,"",SUM(K{first}:K{last}))'), 24))
    M(f"A{r}:I{r}"); M(f"J{r}:J{r}")

    # ── trade term lines (fixed defaults) ──
    tr0 = r + 2
    term_lines = [
        ("Trade Term:", t["trade_term"]),
        ("Terms of Payment:", DEFAULT_PAYMENT),
        ("Time of shipment:", DEFAULT_SHIPMENT),
        ("Remarks:", DEFAULT_REMARKS),
    ]
    for j, (label, fill) in enumerate(term_lines):
        rr = tr0 + j
        rows.append(xrow(rr,
            put_cells(rr, 1, 4, triplet=T["label"], value=label) +
            put_cells(rr, 5, 11, triplet=T["value"], value=fill), 22))
        M(f"A{rr}:D{rr}"); M(f"E{rr}:K{rr}")

    # ── Note ──
    n0 = tr0 + len(term_lines) + 1
    line(n0, "Note:", STYLES["note_bold"], 18)
    notes = [NOTE1, t["note2"], NOTE3]
    for k, txt in enumerate(notes):
        rr = n0 + 1 + k
        # one boxed row spanning A:K, number + text inline, wrapped
        rows.append(xrow(rr,
            put_cells(rr, 1, 11, triplet=T["wrap"],
                      value=f"{k+1}. {txt}"), 34))
        M(f"A{rr}:K{rr}")

    # ── bank info ──
    b0 = n0 + len(notes) + 2
    line(b0, "BENEFICIARY BANK INFO:", STYLES["note_bold"], 18)
    for j, (label, value) in enumerate(BANK):
        rr = b0 + 1 + j
        vt = T["valuetxt"] if label == "Account Number:" else T["value"]
        rows.append(xrow(rr,
            put_cells(rr, 1, 3, triplet=T["label"], value=label) +
            put_cells(rr, 4, 11, triplet=vt, value=value), 22))
        M(f"D{rr}:K{rr}")

    # ── signature: company name + stamp area ──
    s0 = b0 + len(BANK) + 2
    rows.append(xrow(s0,
        put_cells(s0, 1, 11, triplet=T["label"], value="THE SELLER (COMPANY STAMP):"), 26))
    M(f"A{s0}:K{s0}")
    rows.append(xrow(s0 + 1,
        put_cells(s0 + 1, 1, 11, style=STYLES["header"], value=COMPANY), 28))
    M(f"A{s0 + 1}:K{s0 + 1}")
    rows.append(xrow(s0 + 2, put_cells(s0 + 2, 1, 11, style=0), 48))

    # ── cols / merges ──
    cols_xml = "".join(
        f'<col width="{COLW[i]}" customWidth="1" min="{i+1}" max="{i+1}"/>'
        for i in range(11)
    )
    merge_xml = f'<mergeCells count="{len(merges)}">' + \
        "".join(f'<mergeCell ref="{m}"/>' for m in merges) + "</mergeCells>"

    sheet_xml = f"""<?xml version="1.0" encoding="utf-8"?>
<worksheet xmlns="{NS}"><sheetPr><outlinePr summaryBelow="1" summaryRight="1"/><pageSetUpPr fitToPage="1"/></sheetPr><dimension ref="A1:K{s0+1}"/><sheetViews><sheetView showGridLines="0" workbookViewId="0"><selection activeCell="A1" sqref="A1"/></sheetView></sheetViews><sheetFormatPr baseColWidth="8" defaultRowHeight="15"/><cols>{cols_xml}</cols>
<sheetData>
{''.join(rows)}
</sheetData>
{merge_xml}<printOptions horizontalCentered="1"/><pageMargins left="0.4" right="0.4" top="0.5" bottom="0.5" header="0.3" footer="0.3"/><pageSetup orientation="landscape" paperSize="9" fitToHeight="0" fitToWidth="1"/></worksheet>"""

    # ── styles / package ──
    styles_xml = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
                  f'<styleSheet xmlns="{NS}">'
                  '<numFmts count="2"><numFmt numFmtId="164" formatCode="0.0"/>'
                  '<numFmt numFmtId="165" formatCode="#,##0"/></numFmts>'
                  f'<fonts count="{len(FONTS_XML.split("</font>")) - 1}">' + FONTS_XML + '</fonts>'
                  '<fills count="2"><fill><patternFill patternType="none"/></fill>'
                  '<fill><patternFill patternType="gray125"/></fill></fills>'
                  '<borders count="13">' + BORDER_XML + '</borders>'
                  '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
                  f'<cellXfs count="{len(XLIST)}">' + "".join(XLIST) + '</cellXfs>'
                  '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>'
                  '<dxfs count="0"/></styleSheet>')

    CONTENT_TYPES = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
                     '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
                     '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
                     '<Default Extension="xml" ContentType="application/xml"/>'
                     '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
                     '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
                     '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>')
    RELS = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>')
    WB_RELS = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
               '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
               '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>'
               '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>')
    wb = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
          f'<workbook xmlns="{NS}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
          '<sheets><sheet name="Quotation" sheetId="1" state="visible" r:id="rId1"/></sheets>'
          '<calcPr calcId="124519" fullCalcOnLoad="1"/></workbook>')

    out = t["out"]
    if os.path.exists(out):
        os.remove(out)
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", CONTENT_TYPES)
        z.writestr("_rels/.rels", RELS)
        z.writestr("xl/workbook.xml", wb)
        z.writestr("xl/_rels/workbook.xml.rels", WB_RELS)
        z.writestr("xl/styles.xml", styles_xml)
        z.writestr("xl/worksheets/sheet1.xml", sheet_xml)
    print("Done:", out)


# NOTE: row index for buyer/seller panel used list positions; after building all,
# clear the earlier misalignment by asserting merges carry through. Rebuild cleanly.
for t in TEMPLATES:
    build(t)

# -*- coding: utf-8 -*-
"""
Generate the Mingze EPDM-to-UK (Felixstowe) commercial quotation workbook by
emitting an officecli `batch` command array. officecli is the actual document
engine; this script only builds the batch JSON.

DESIGN = comparison matrix that answers the Buyer's request directly:
  rows  = each requested data point (loading, sqm, pricing, freight, weight,
          adhesive, total cost, cost per sqm);
  two data columns = 20 FT and 40 FT options, side by side for a true
  cost-per-square-metre comparison.

Compact (no blank spacer rows). Single sheet "Quotation", columns A..F.

TRUTHFULNESS: only Mingze's fixed identity (company, contact, bank, default
terms), the customer's own stated product (1.2 mm vulcanized EPDM, 4.5 m &
5.5 m widths, standard roll length) and the customer's initial 20ft request
(25 + 35 rolls) are pre-filled. All prices, sqm/roll, weights, freight, lead
times, adhesive and totals are left blank for the supplier to confirm.
"""

import json, subprocess, sys, os

FILE = "客户业务/报价/客户待确认/报价_20260908_EPDM-Felixstowe/Quotation_CIF_MZ_20260908_UK_EPDM-1.2mm-Felixstowe_v2.xlsx"
COLS = "ABCDEF"          # 6 columns
ROOT = "/Users/chengzhi/workspace/mingze"

COMPANY = "WEIFANG MINGZE WATERPROOF MATERIAL CO., LTD."
SELLER = (
    "Contact Person: Liu Zisong\n"
    "TEL: 086-13964642628\n"
    "Email: zisong@mzwaterproof.com\n"
    "Address: Caoxinzhuang Village, Yangkou Town, Shouguang City,\n"
    "Weifang City, Shandong, China.  Postal code: 262700"
)
BANK = [
    ("Bank:", "Bank of China"),
    ("Branch:", "Shouguang Branch (Business Department)"),
    ("Bank Address:", "Shouguang City, Weifang, Shandong Province, China"),
    ("SWIFT / BIC Code:", "BKCHCNBJXXX"),
    ("Beneficiary Name:", "Weifang Mingze Waterproof Material Co., Ltd."),
    ("Account Number:", "244252214045"),
    ("Account Currency:", "USD"),
]

# A = metric label, B = 20FT, C = 40FT, D..F = footer value column
COLW = [44, 26, 26, 14, 14, 14]

cmds = []


def setv(ref, value, **kw):
    props = {"value": value}
    props.update(kw)
    cmds.append({"command": "set", "path": f"/Quotation/{ref}", "props": props})


def setp(ref, **kw):
    cmds.append({"command": "set", "path": f"/Quotation/{ref}", "props": kw})


def merge(addr):
    cmds.append({"command": "set", "path": "/Quotation", "props": {"merge": addr}})


def row_height(r, h):
    setp(f"row[{r}]", height=h)


def cols():
    for i, w in enumerate(COLW):
        setp(f"col[{COLS[i]}]", width=w)


def full(r, text, bold=False, size=10, height=None):
    """Full-width content row (merge A:F)."""
    setv(f"A{r}", text)
    merge(f"A{r}:F{r}")
    props = {"border.all": "thin", "alignment.wrapText": "true", "font.size": size}
    if bold:
        props["font.bold"] = "true"
    if height:
        props["alignment.horizontal"] = "center"
    setp(f"A{r}:F{r}", **props)


def section(r, text, hl=False):
    """Section sub-header row spanning the table columns A..F."""
    setv(f"A{r}", text)
    merge(f"A{r}:F{r}")
    props = {"font.bold": "true", "border.all": "thin"}
    if hl:
        props["font.size"] = 12
    setp(f"A{r}:F{r}", **props)


def matrix_header(r):
    """Column headers for the two container options (B, C)."""
    setv(f"A{r}", "")
    setv(f"B{r}", "20 FT CONTAINER", bold=True)
    setv(f"C{r}", "40 FT CONTAINER", bold=True)
    for c in "ABC":
        setp(f"{c}{r}", **{"border.all": "thin", "font.bold": "true",
                           "alignment.wrapText": "true",
                           "alignment.horizontal": "center", "font.size": 10})


def data(r, label, bval="", cval="", lf=None, bf=None, cf=None,
         lenum=None, benum=None, cenum=None, num=None, bold=False):
    """One comparison-table row: label in A, values in B (20ft) and C (40ft)."""
    setv(f"A{r}", label, bold=bold)
    for col, val, form, nf in (("B", bval, bf, benum), ("C", cval, cf, cenum)):
        if form:
            props = {}
            if nf:
                props["numberformat"] = nf
            props["formula"] = form
            setp(f"{col}{r}", **props)
        else:
            setv(f"{col}{r}", val, **({"numberformat": nf} if nf else {}))
    setp(f"A{r}", **{"border.all": "thin", "alignment.wrapText": "true",
                     "alignment.horizontal": "left", "font.size": 10})
    for col in "BC":
        setp(f"{col}{r}", **{"border.all": "thin", "font.bold": "true" if bold else "false",
                             "alignment.horizontal": "center", "font.size": 10})


def lv(r, label, value, num=None):
    """Footer label (A) | value (B:F) row."""
    setv(f"A{r}", label, **{"font.bold": "true"})
    merge(f"B{r}:F{r}")
    setv(f"B{r}", value)
    props = {"border.all": "thin", "alignment.wrapText": "true", "font.size": 10}
    if num:
        props["numberformat"] = num
    setp(f"A{r}", **{"border.all": "thin", "font.bold": "true",
                     "alignment.wrapText": "true"})
    setp(f"B{r}:F{r}", **props)


HEIGHTS = {
    1: 22, 2: 26, 3: 20, 4: 18, 5: 60,
    6: 18, 7: 30, 8: 36,
    9: 18, 10: 22, 11: 22, 12: 22, 13: 22, 14: 22, 15: 24, 16: 24,
    17: 18, 18: 22, 19: 22, 20: 22, 21: 24,
    22: 18, 23: 22, 24: 22, 25: 22,
    26: 18, 27: 22, 28: 22,
    29: 18, 30: 22, 31: 22, 32: 22, 33: 22, 34: 22, 35: 22, 36: 22,
    37: 26, 38: 26, 39: 26, 40: 26,
    41: 18, 42: 26, 43: 26,
    44: 20, 45: 20, 46: 20, 47: 24,
    48: 18, 49: 30, 50: 30, 51: 30,
    52: 18, 53: 20, 54: 20, 55: 20, 56: 20, 57: 20, 58: 20, 59: 20,
    60: 26, 61: 28, 62: 44,
}


def build():
    cmds.insert(0, {"command": "set", "path": "/Sheet1", "props": {"name": "Quotation"}})
    cols()

    # Header
    setv("A1", COMPANY)
    setp("A1:F1", **{"font.bold": "true", "font.size": 12,
                     "alignment.horizontal": "center", "border.all": "thin"})
    merge("A1:F1")
    setv("A2", "COMMERCIAL QUOTATION  ( CIF )")
    setp("A2:F2", **{"font.bold": "true", "font.size": 15,
                     "alignment.horizontal": "center"})
    merge("A2:F2")

    # Date / Document No
    setv("A3", "Date:")
    setp("A3", **{"font.bold": "true", "border.all": "thin"})
    merge("B3:C3")
    setp("B3:C3", **{"border.all": "thin", "numberformat": "yyyy-mm-dd"})
    setv("D3", "Document No.:")
    setp("D3:E3", **{"font.bold": "true", "border.all": "thin"})
    merge("D3:E3")
    setp("F3", **{"border.all": "thin"})

    # Seller / Buyer
    setv("A4", "The Seller:")
    setp("A4:C4", **{"font.bold": "true", "border.all": "thin"})
    merge("A4:C4")
    setv("D4", "The Buyer:")
    setp("D4:F4", **{"font.bold": "true", "border.all": "thin"})
    merge("D4:F4")
    setv("A5", SELLER)
    setp("A5:C5", **{"border.all": "thin", "alignment.wrapText": "true",
                     "alignment.vertical": "top", "font.size": 9})
    merge("A5:C5")
    setp("D5:F5", **{"border.all": "thin"})
    merge("D5:F5")

    # 1 · Product confirmation
    section(6, "1  ·  PRODUCT CONFIRMATION")
    full(7, "Product: 1.2 mm vulcanized EPDM roofing / waterproofing membrane "
            "(三元乙丙橡胶防水卷材) — confirmed as requested by the Buyer.", size=10)
    full(8, "Roll width: 4.5 m & 5.5 m; thickness: 1.2 mm; roll length & unit "
            "weight: supplier standard length (to be confirmed). Suitable for "
            "adhesive-bonded or mechanically-fixed single-ply EPDM flat-roof "
            "systems.", size=9)

    # 2 · Container loading
    section(9, "2  ·  CONTAINER LOADING  (rolls & square metres)")
    matrix_header(10)
    data(11, "Roll width 4.5 m — quantity (rolls)", 25, "", num="#,##0")
    data(12, "Roll width 4.5 m — sqm per roll", "", "", num="#,##0.0")
    data(13, "Roll width 5.5 m — quantity (rolls)", 35, "", num="#,##0")
    data(14, "Roll width 5.5 m — sqm per roll", "", "", num="#,##0.0")
    data(15, "TOTAL ROLLS",
         bf='IF(COUNT(B11,B13)=0,"",B11+B13)', cf='IF(COUNT(C11,C13)=0,"",C11+C13)',
         num="#,##0", bold=True)
    data(16, "TOTAL SQUARE METRES",
         bf='IF(OR(B12="",B14=""),"",B11*B12+B13*B14)',
         cf='IF(OR(C12="",C14=""),"",C11*C12+C13*C14)',
         num="#,##0.0", bold=True)

    # 3 · Pricing
    section(17, "3  ·  PRICING  (USD)")
    data(18, "Unit price — per square metre (USD)", "", "", num="$#,##0.00")
    data(19, "Unit price — per roll, 4.5 m (USD)",
         bf='IF(OR(B12="",B18=""),"",B12*B18)',
         cf='IF(OR(C12="",C18=""),"",C12*C18)', num="$#,##0.00")
    data(20, "Unit price — per roll, 5.5 m (USD)",
         bf='IF(OR(B14="",B18=""),"",B14*B18)',
         cf='IF(OR(C14="",C18=""),"",C14*C18)', num="$#,##0.00")
    data(21, "MEMBRANE TOTAL (USD)",
         bf='IF(OR(B16="",B18=""),"",B16*B18)',
         cf='IF(OR(C16="",C18=""),"",C16*C18)', num="$#,##0.00", bold=True)

    # 4 · Freight & lead time
    section(22, "4  ·  FREIGHT & LEAD TIME")
    data(23, "Ocean freight to Felixstowe, UK (USD)", "", "", num="$#,##0.00")
    data(24, "Production time", "", "")
    data(25, "Transit time (China → Felixstowe)", "", "")

    # 5 · Weight & offloading
    section(26, "5  ·  WEIGHT & OFFLOADING")
    data(27, "Container gross weight", "", "")
    data(28, "Offloading / destination handling", "Buyer", "Buyer")

    # 6 · Bonding adhesive
    section(29, "6  ·  BONDING ADHESIVE  (full membrane quantity)")
    data(30, "Adhesive type", "", "")
    data(31, "Pack / container size", "", "")
    data(32, "Coverage per container (m²)", "", "", num="#,##0")
    data(33, "Quantity required", "", "", num="#,##0")
    data(34, "Adhesive total (USD)", "", "", num="$#,##0.00")
    data(35, "Adhesive extra freight (USD)", "", "", num="$#,##0.00")
    data(36, "Ship in same container — legal & safe?", "To be confirmed",
         "To be confirmed")

    # 7 · Total landed cost (highlight)
    section(37, "7  ·  TOTAL LANDED COST  (CIF FELIXSTOWE, UK)", hl=True)
    data(38, "EPDM membrane + adhesive + freight (USD)",
         bf='IF(COUNT(B21,B23,B34)=0,"",B21+B23+B34)',
         cf='IF(COUNT(C21,C23,C34)=0,"",C21+C23+C34)',
         num="$#,##0.00", bold=True)
    data(39, "TOTAL COST PER SQUARE METRE (USD)",
         bf='IF(OR(B16="",B16=0),"",B38/B16)', cf='IF(OR(C16="",C16=0),"",C38/C16)',
         num="$#,##0.00", bold=True)
    full(40, "Compare the cost per square metre above — the lower figure is the "
             "better value. 20 ft vs 40 ft are quoted on the same basis for a "
             "true like-for-like comparison.", size=9)

    # 8 · Included / excluded
    section(41, "8  ·  WHAT'S INCLUDED  /  EXCLUDED")
    full(42, "INCLUDED (Seller, CIF Felixstowe): goods, export packing, export "
             "customs clearance, ocean freight and marine insurance to Felixstowe "
             "port.", size=9)
    full(43, "EXCLUDED (Buyer): UK import customs clearance, import duty & VAT, "
             "Felixstowe port handling & unloading, and inland haulage from "
             "Felixstowe to Brierley Hill (West Midlands). A DAP / DDP delivered "
             "price can be quoted separately.", size=9)

    # Terms
    lv(44, "Trade Term:", "CIF [Felixstowe, United Kingdom]")
    lv(45, "Terms of Payment:", "By T/T 30% deposit, 70% balance before shipment.")
    lv(46, "Time of Shipment:", "Within 3-10 working days after receiving your Deposit.")
    lv(47, "Remarks:", "Validity time is 15 days. Best pricing applied to the full "
                       "container quantity as quoted.")

    # Notes
    setv("A48", "Note:")
    setp("A48", **{"font.bold": "true"})
    full(49, "1.  This quotation is based on the product, specifications and "
             "loading set out above. Roll length, unit weight, container packing, "
             "freight, lead time and adhesive figures are to be confirmed before "
             "order confirmation.", size=9)
    full(50, "2.  Under CIF term the seller bears the cost, freight and marine "
             "insurance to the named port of destination; the risk transfers to the "
             "buyer when the goods are loaded on board, and the buyer bears "
             "unloading and destination charges (incl. UK import clearance & duty).",
         size=9)
    full(51, "3.  Risk transfers in accordance with the agreed Incoterms term. The "
             "seller shall not be liable for delivery delay caused by force majeure.",
         size=9)

    # Bank
    setv("A52", "BENEFICIARY BANK INFO:")
    setp("A52", **{"font.bold": "true"})
    for i, (label, value) in enumerate(BANK):
        r = 53 + i
        if label == "Account Number:":
            setv(f"A{r}", label, **{"font.bold": "true"})
            setp(f"A{r}", **{"border.all": "thin", "font.bold": "true",
                             "alignment.wrapText": "true"})
            setv(f"B{r}", value, numberformat="@", type="string")
            merge(f"B{r}:F{r}")
            setp(f"B{r}:F{r}", **{"border.all": "thin", "alignment.wrapText": "true"})
        else:
            lv(r, label, value)

    # Signature
    setv("A60", "THE SELLER (COMPANY STAMP):")
    setp("A60", **{"font.bold": "true", "border.all": "thin"})
    merge("A60:F60")
    setv("A61", COMPANY)
    setp("A61:F61", **{"font.bold": "true", "alignment.horizontal": "center",
                       "border.all": "thin"})
    merge("A61:F61")

    for r, h in HEIGHTS.items():
        row_height(r, h)


if __name__ == "__main__":
    build()
    with open("/tmp/quote_epdm_batch.json", "w", encoding="utf-8") as f:
        json.dump(cmds, f, ensure_ascii=False)
    print(f"Generated {len(cmds)} officecli batch commands", flush=True)
    ret = subprocess.run(
        ["officecli", "batch", FILE, "--input", "/tmp/quote_epdm_batch.json"],
        capture_output=True, text=True, cwd=ROOT)
    sys.stdout.write(ret.stdout)
    sys.stderr.write(ret.stderr)
    sys.exit(ret.returncode)

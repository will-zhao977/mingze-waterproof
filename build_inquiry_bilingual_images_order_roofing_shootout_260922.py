# -*- coding: utf-8 -*-
"""
在用户修改过的中英文对照表基础上：
  1) 数据行按客户原表顺序重排（原 Sheet2 第 8–25 行顺序）；
  2) 把图片加回来（原表每行的产品图 A 列 + 规格/特性图 D 列，共 36 张，缩略后嵌入）；
  3) 其余内容严格保留用户版本（含其表头写法、去掉说明行的处理）。

输入：/tmp/rfq_user_edited_input.xlsx（用户已编辑版本的临时快照，需单独提供）
     客户原始文件（取图用，只读）
输出：客户业务/报价/Roofing-Shootout/客户询价单-文字版中英文_Roofing-Shootout_260922.xlsx
"""

import os
import re
import shutil
import tempfile

import openpyxl
from openpyxl.drawing.image import Image as XLImage
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from PIL import Image as PILImage

USER_FILE = "/tmp/rfq_user_edited_input.xlsx"   # 用户编辑版快照（10 列、含分类分组）
OUT_FILE = "/Users/chengzhi/workspace/mingze/客户业务/报价/Roofing-Shootout/客户询价单-文字版中英文_Roofing-Shootout_260922.xlsx"
SRC = "/Users/chengzhi/workspace/mingze/客户业务/报价/Roofing-Shootout/Roofing Shootout Quotation Sheet 260922.xlsx"
SRC_SHEET = "Sheet2"
# 用户版当前顺序（按分类）= 原表行号顺序
CUR_ORDER = [8, 11, 12, 14, 9, 10, 15, 16, 25, 17, 20, 21, 22, 23, 18, 19, 13, 24]
# 目标顺序 = 客户原表原始顺序
ORIG_ORDER = list(range(8, 26))

F_BASE = Font(name="Arial", size=10)
F_BOLD = Font(name="Arial", size=10, bold=True)
F_TITLE = Font(name="Arial", size=14, bold=True)
A_WRAP = Alignment(horizontal="left", vertical="top", wrap_text=True)
A_CTR = Alignment(horizontal="center", vertical="center", wrap_text=True)
THIN = Side(style="thin", color="000000")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
HEAD = PatternFill("solid", fgColor="F2F2F2")

# 新表列结构（在用户版 10 列基础上，于 SKU 之后插入 2 列图片）
HEADERS = [
    "序号\nNo.", "Model # / SKU\n型号 / 货号",
    "产品图片\nProduct Image", "特性图\nFeatures (image)",
    "产品名称\nProduct Name", "规格尺寸\nSize", "产品特点\nFeatures",
    "包装方式\nPackaging", "预计年销量\nEst. Yearly Units",
    "客户目标价\nTarget Price USD", "供方报价\nSupplier Price USD", "备注\nRemarks",
]
WIDTHS = [6, 12, 17, 17, 46, 30, 56, 26, 16, 14, 14, 40]
# 用户版列 → 新表列（用户版 1..10 → 新表）
CUR2NEW = {1: 1, 2: 2, 3: 5, 4: 6, 5: 7, 6: 8, 7: 9, 8: 10, 9: 11, 10: 12}
IMG_COLS = ((0, 3), (3, 4))  # (原表图片列0基, 新表列号)：A列产品图→C，D列特性图→D


def est_lines(text, width):
    if text in (None, ""):
        return 1
    total = 0
    for para in str(text).split("\n"):
        eff = sum(2 if ord(ch) > 0x2E80 else 1 for ch in para)
        total += max(1, -(-eff // max(1, int(width))))
    return total


def extract_images(tmp):
    """按原表行号取出两张图，缩略后保存，返回 {原表行: {新表列: 路径，(w,h)}}。"""
    wb = openpyxl.load_workbook(SRC)
    ws = wb[SRC_SHEET]
    out = {}
    for im in ws._images:
        row = im.anchor._from.row + 1
        col = im.anchor._from.col
        if row not in ORIG_ORDER or col not in (0, 3):
            continue
        pil = PILImage.open(__import__("io").BytesIO(im._data()))
        box = (200, 200) if col == 0 else (340, 190)
        pil = pil.convert("RGB")
        pil.thumbnail(box, PILImage.LANCZOS)
        if col == 0:
            p = os.path.join(tmp, f"p{row}.jpg")
            pil.save(p, "JPEG", quality=88)
        else:
            p = os.path.join(tmp, f"f{row}.png")
            pil.save(p, "PNG")
        new_col = 3 if col == 0 else 4
        out.setdefault(row, {})[new_col] = (p, pil.size)
    return out


def main():
    uwb = openpyxl.load_workbook(USER_FILE)
    uws = uwb.active
    u_title = uws.cell(1, 1).value
    u_headers = [uws.cell(3, c).value for c in range(1, 11)]
    u_widths = {c: uws.column_dimensions[get_column_letter(c)].width for c in range(1, 11)}

    # 用户版数据行（分类顺序）→ 原表行号
    u_rows = [r for r in range(1, uws.max_row + 1) if isinstance(uws.cell(r, 1).value, int)]
    assert len(u_rows) == 18, len(u_rows)
    src_of = {CUR_ORDER[i]: ur for i, ur in enumerate(u_rows)}
    chk = openpyxl.load_workbook(SRC, data_only=True)[SRC_SHEET]
    for s, ur in src_of.items():
        assert uws.cell(ur, 2).value == chk.cell(s, 2).value, (s, ur)
        en_u = (uws.cell(ur, 3).value or "").split("\n")[0].strip()
        en_c = (chk.cell(s, 3).value or "").split("\n")[0].strip()
        assert en_u == en_c, (s, en_u, en_c)
    print("行匹配校验通过：用户版 18 行 ↔ 原表 8–25 行一一对应")

    tmp = tempfile.mkdtemp(prefix="rfq_img_")
    imgs = extract_images(tmp)

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "询价单（中英文）"
    ws.sheet_view.showGridLines = False
    for i, w in enumerate(WIDTHS, start=1):
        ws.column_dimensions[get_column_letter(i)].width = w

    # 标题（去掉已不成立的"文字版"字样）
    ws["A1"] = re.sub(r"（文字版・中英文对照）\s*Customer RFQ — Text Only \(Bilingual\)",
                      "（中英文对照）  Customer RFQ (Bilingual)", str(u_title))
    ws["A1"].font = F_TITLE
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=len(HEADERS))
    ws.row_dimensions[1].height = 24

    # 表头
    for i, h in enumerate(HEADERS, start=1):
        c = ws.cell(3, i, h)
        c.font = F_BOLD
        c.alignment = A_CTR
        c.border = BORDER
        c.fill = HEAD
    ws.row_dimensions[3].height = 30

    new_index = {s: i + 1 for i, s in enumerate(ORIG_ORDER)}

    r = 4
    for s in ORIG_ORDER:
        ur = src_of[s]
        vals = {}
        for uc, nc in CUR2NEW.items():
            vals[nc] = uws.cell(ur, uc).value
        vals[1] = new_index[s]                      # 序号按新顺序重排
        # 备注：不再提"原表第 N 行"（整表已按原表顺序排列，属冗余、易误读），
        # 只保留重复行提示与客户对年销量的备注。
        if s in (8, 11):
            other = 11 if s == 8 else 8
            qn = "Shootout QTY" if s == 8 else "In line item. Same item as the shootout"
            vals[12] = (f"与本表第 {new_index[other]} 项同 SKU 1551417，同一产品重复出现，"
                        f"建议与客户确认是否合并；客户备注：{qn}")
        else:
            vals[12] = None
        for nc in range(1, len(HEADERS) + 1):
            if nc in (3, 4):
                continue
            c = ws.cell(r, nc, vals.get(nc))
            c.font = F_BASE
            c.border = BORDER
            c.alignment = A_CTR if nc in (1, 2, 9, 10, 11) else A_WRAP
        ws.cell(r, 10).number_format = '"$"#,##0.00'
        ws.cell(r, 11).number_format = '"$"#,##0.00'
        for nc in (3, 4):
            c = ws.cell(r, nc)
            c.border = BORDER
            c.alignment = A_CTR

        # 图片
        img_h = 0
        for src_col, nc in IMG_COLS:
            item = imgs.get(s, {}).get(nc)
            if not item:
                continue
            path, (w, h) = item
            ws.add_image(XLImage(path), f"{get_column_letter(nc)}{r}")
            img_h = max(img_h, h * 0.75)
        text_h = max(est_lines(vals.get(nc), WIDTHS[nc - 1])
                     for nc in (5, 6, 7, 8, 12))
        ws.row_dimensions[r].height = min(500, max(30, img_h + 6, text_h * 13 + 6))
        r += 1

    ws.freeze_panes = "A4"
    wb.save(OUT_FILE)
    shutil.rmtree(tmp, ignore_errors=True)
    print("已写回:", OUT_FILE, os.path.getsize(OUT_FILE), "bytes")


if __name__ == "__main__":
    main()

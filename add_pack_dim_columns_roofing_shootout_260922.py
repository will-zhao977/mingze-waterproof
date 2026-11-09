# -*- coding: utf-8 -*-
"""
在用户当前的《客户询价单_Roofing-Shootout_260922.xlsx》（WPS 保存版，图片为
"嵌入单元格图片" DISPIMG）末尾追加 20 个「包装尺寸」待填栏位：

  主箱 / 内盒 / 零售包装 / 托盘   ×   高度 / 宽度 / 深度 / 重量 / 装量

客户原表这 4 组字段（J–AD 列，表头写明 in Inches）在 18 行里全部为空，属于
客户留给供应商填写的栏位，本表把它们搬过来并直接标注公制单位（cm / kg）。

做法：直接改 xl/worksheets/sheet1.xml（纯追加单元格 + 列宽 + 合并区），
不经过 openpyxl 重写，避免丢失 WPS 的 xl/cellimages.xml（嵌入图片）。
"""

import os
import re
import shutil
import sys
import zipfile

TARGET = "/Users/chengzhi/workspace/mingze/客户业务/报价/Roofing-Shootout/客户询价单_Roofing-Shootout_260922.xlsx"
BACKUP = "/tmp/rfq_before_packdims.xlsx"

# (列, 表头两行：中文 / 英文)
GROUPS = [
    ("主箱", "Master", 12),   # L 起
    ("内盒", "Inner", 17),    # Q 起
    ("零售", "Retail", 22),   # V 起
    ("托盘", "Pallet", 27),   # AA 起
]
FIELDS = [
    ("高度 (cm)", "H (cm)"),
    ("宽度 (cm)", "W (cm)"),
    ("深度 (cm)", "D (cm)"),
    ("重量 (kg)", "Wt (kg)"),
    ("装量", "Qty"),
]
FIRST_ROW, LAST_ROW = 3, 20          # 数据行
HEADER_ROW = 2
HDR_STYLE = "3"                      # 表头样式（沿用现有表头）
CELL_STYLE = "4"                     # 数据样式（沿用现有文本格）


def col_letter(n):
    s = ""
    while n:
        n, r = divmod(n - 1, 26)
        s = chr(65 + r) + s
    return s


def build_cells():
    """返回 {行号: [cell xml, ...]}"""
    out = {}
    hdr = []
    for cn_name, en_name, start in GROUPS:
        for i, (cn_f, en_f) in enumerate(FIELDS):
            col = col_letter(start + i)
            text = f"{cn_name}{cn_f}\n{en_name} {en_f}"
            hdr.append(
                f'<c r="{col}{HEADER_ROW}" s="{HDR_STYLE}" t="inlineStr">'
                f'<is><t xml:space="preserve">{text}</t></is></c>'
            )
    out[HEADER_ROW] = hdr
    for r in range(FIRST_ROW, LAST_ROW + 1):
        out[r] = [f'<c r="{col_letter(c)}{r}" s="{CELL_STYLE}"/>'
                  for c in range(12, 32)]
    return out


def patch_sheet_xml(xml: str) -> str:
    cells = build_cells()
    for r in sorted(cells, reverse=True):
        m = re.search(rf'<row r="{r}"[^>]*>.*?</row>', xml, re.S)
        if not m:
            raise SystemExit(f"未找到第 {r} 行")
        row = m.group(0)
        new_row = row.replace("</row>", "".join(cells[r]) + "</row>")
        if r == HEADER_ROW:
            new_row = re.sub(r'ht="[\d.]+"', 'ht="52"', new_row)
        new_row = re.sub(r'spans="1:\d+"', 'spans="1:31"', new_row)
        xml = xml[:m.start()] + new_row + xml[m.end():]

    # 列宽：在现有 <cols> 末尾追加 12–31 列
    xml = xml.replace("</cols>", '<col min="12" max="31" width="14" customWidth="1"/></cols>')
    # 使用区域与标题合并区扩展到最后列 AE(31)
    xml = re.sub(r'<dimension ref="A1:K20"/>', '<dimension ref="A1:AE20"/>', xml)
    xml = re.sub(r'<mergeCell ref="A1:K1"/>', '<mergeCell ref="A1:AE1"/>', xml)
    return xml


def main():
    shutil.copy2(TARGET, BACKUP)
    tmp = "/tmp/rfq_packdims_work"
    shutil.rmtree(tmp, ignore_errors=True)
    os.makedirs(tmp)
    with zipfile.ZipFile(TARGET) as z:
        names = z.namelist()
        z.extractall(tmp)

    sheet = os.path.join(tmp, "xl/worksheets/sheet1.xml")
    xml = open(sheet, encoding="utf-8").read()
    new = patch_sheet_xml(xml)
    open(sheet, "w", encoding="utf-8").write(new)
    print("sheet1.xml:", len(xml), "->", len(new))
    assert 'r="L2"' in new and 'r="AE2"' in new and 'r="AE20"' in new

    # 原样重打包（保留所有部件，特别是 xl/cellimages.xml）
    out = TARGET + ".tmp"
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zo:
        for n in names:
            zo.write(os.path.join(tmp, n), n)
    shutil.move(out, TARGET)
    shutil.rmtree(tmp, ignore_errors=True)
    print("已写入:", TARGET, os.path.getsize(TARGET), "bytes")
    print("备份:", BACKUP)


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""预填《中国签证邀请函》(驻加拿大使馆版可编辑PDF)的邀请单位信息。

字段映射按页面坐标核实（Y 自上而下递减）：
  第一部分 邀请单位：TextField1[0]=单位名称+联系人, DataDropDownList[0]=性别(单位邀请留默认),
    DateTimeField1[0]=出生日期(留空), TextField1[1]=身份证号(留空), TextField1[2]=地址,
    TextField1[3]=电话, email[0]=邮箱, TextField1[4]=与被邀请人关系
  第三部分：TextField1[10]=访华事由(预填), 其余抵离日期/天数/地点/费用勾选由客户与用户填
用法：python3 fill_visa_invitation_form.py <源PDF> <输出PDF>
"""
import sys
import logging
logging.getLogger("pypdf").setLevel(logging.ERROR)
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, NumberObject

P = "topmostSubform[0].Page1[0]."
COMPANY_FILL = {
    P + "TextField1[0]": "WEIFANG MINGZE WATERPROOF MATERIAL CO., LTD.\n(Attn: Liu Zisong)",
    P + "TextField1[2]": "Caoxinzhuang Village, Yangkou Town, Shouguang City,\nWeifang City, Shandong, China",
    P + "TextField1[3]": "086-13964642628",
    P + "email[0]": "zisong@mzwaterproof.com",
    P + "TextField1[4]": "Business partner",
    P + "TextField1[10]": "Business negotiation and factory inspection",
}
# 单行栏截断处理：名称/地址栏开多行标志；性别下拉默认"女Female"易致填错，清空
MULTILINE_FIELDS = {P + "TextField1[0]", P + "TextField1[2]"}
CLEAR_DROPDOWNS = [P + "DataDropDownList[0]", P + "DataDropDownList[1]"]

src, out = sys.argv[1], sys.argv[2]
reader = PdfReader(src)
writer = PdfWriter(clone_from=reader)
page = writer.pages[0]

for a in page.get("/Annots", []):
    o = a.get_object()
    if P + str(o.get("/T", "")) in MULTILINE_FIELDS:
        o[NameObject("/Ff")] = NumberObject(int(o.get("/Ff", 0)) | 4096)

writer.update_page_form_field_values(page, COMPANY_FILL, auto_regenerate=False)
for name in CLEAR_DROPDOWNS:
    try:
        writer.update_page_form_field_values(page, {name: ""}, auto_regenerate=False)
    except Exception as e:
        print(f"clear {name} failed: {e}")

with open(out, "wb") as f:
    writer.write(f)

chk = PdfReader(out).get_fields()
for name in COMPANY_FILL:
    print(f"{name.split('.')[-1]} = {chk[name].get('/V')!r}")

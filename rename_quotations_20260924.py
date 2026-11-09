# -*- coding: utf-8 -*-
"""
quotations/ 报价单据改名（按用户规则：类型 + MZ + 日期 + 客户/国家）

规则落地：
  类型_MZ_YYYYMMDD_客户或国家[_贸易术语/产品/目的港].扩展名
  · 类型：Quotation / SampleQuotation / FOB / CIF / FOB-CIF / PI / SamplePI / SampleContract
  · 日期统一 8 位 YYYYMMDD（便于同类按日期排序）
  · 空格换下划线；客户/国家英文，多词用 -
  · 同一单据的 xlsx/pdf/jpg 共用同一主名
执行后会写出改名记录，便于回溯/回滚。
"""

import json
import os
import shutil

QDIR = "/Users/chengzhi/workspace/mingze/quotations"
LOG = "/Users/chengzhi/workspace/mingze/notes/报价单改名记录-2026-09-24.md"

# 主名映射（同主名的 .xlsx/.pdf/.jpg 一起改）
RENAME = {
    # ---- 报价单 ----
    "FOB_Quotation_MZ_20260717": "FOB_MZ_20260717_Hasharon",
    "CIF_Quotation_MZ_20260727_Albania": "CIF_MZ_20260727_Albania",
    "CIF_Quotation_MZ_20260727_Durres": "CIF_MZ_20260727_Albania-Durres",
    "FOB_Quotation_MZ_20260818_Junaid_India": "FOB_MZ_20260818_Junaid-India",
    "CIF_Quotation_MZ_20260818_Kolkata_Junaid": "CIF_MZ_20260818_Junaid-India",
    "Quotation_MZ_20260818_Junaid_India_FOB_CIF": "FOB-CIF_MZ_20260818_Junaid-India",
    "Sample_Quotation_MZ_20260818_Junaid_India": "SampleQuotation_MZ_20260818_Junaid-India",
    "Quotation_MZ_20260821_ISOPLAST_5R_FOB": "FOB_MZ_20260821_Zeev-Israel_ISOPLAST-5R",
    "Quotation_MZ_20260822_ISOPLAST_5R_FOB": "FOB_MZ_20260822_Zeev-Israel_ISOPLAST-5R",
    "Quotation_MZ_20260824_ISOPLAST_5R_CIF_Lome": "CIF_MZ_20260824_Zeev-Israel_ISOPLAST-5R-Lome",
    "Quotation_MZ_20260908_EPDM_1.2mm_CIF_Felixstowe": "CIF_MZ_20260908_UK_EPDM-1.2mm-Felixstowe",
    "FOB_Quotation_MZ_2026092201_Israel": "FOB_MZ_20260922_Israel",
    # ---- PI / 样品 PI ----
    "PI_MZG20260821001_EPDM_FOB_USD": "PI_MZ_20260821-001_EPDM_FOB_USD",
    "PI_MZG20260821002_EPDM_FOB_USD": "PI_MZ_20260821-002_EPDM_FOB_USD",
    "PI_Sample_MZ_20260821_Bedem_Serbia": "SamplePI_MZ_20260821_Bedem-Serbia",
    # ---- 合同 ----
    "Sample_Contract_MZ_20260821_Bedem_Serbia": "SampleContract_MZ_20260821_Bedem-Serbia",
    "Sample Contract_MZ2026092201": "SampleContract_MZ_20260922_TevaBaeir-Israel",
    # ---- 无名图片：实为两份 PI 的盖章渲染图 ----
    "cf60f7bf228e51f093d18258735c5c65": "PI_MZ_20260821-001_EPDM_FOB_CNY-stamped",
    "f7a2393c9d18ac3e355f3b3344e9148d": "PI_MZ_20260821-002_EPDM_FOB_CNY-stamped",
}

# 本次不动、需用户决定：模板 / 备份 / 旧稿 / PI 的 USD 版渲染图另行说明
SKIP = {
    "Quotation_MZ_模板.xlsx",
    "Quotation_MZ_20260908_EPDM_1.2mm_CIF_Felixstowe.BACKUP-20260908.xlsx",
    "明泽防水报价单-APP-I-PY-PE-PE-3-10-FOB-CIF-2026-08-18.xlsx",
}


def main():
    files = [f for f in os.listdir(QDIR) if os.path.isfile(os.path.join(QDIR, f))]
    done, skipped, missing = [], [], set(RENAME)
    for f in sorted(files):
        base, ext = os.path.splitext(f)
        if base in RENAME:
            new = RENAME[base] + ext
            src, dst = os.path.join(QDIR, f), os.path.join(QDIR, new)
            if os.path.exists(dst):
                raise SystemExit(f"目标已存在，停止：{new}")
            os.rename(src, dst)
            done.append((f, new))
            missing.discard(base)
        else:
            skipped.append(f)
    if missing:
        print("⚠ 未找到（映射里没有对应文件）:", sorted(missing))
    print(f"改名 {len(done)} 个文件；未改动 {len(skipped)} 个：")
    for a, b in done:
        print(f"   {a}  →  {b}")
    print("\n未改动：")
    for f in skipped:
        print("   ", f)

    os.makedirs(os.path.dirname(LOG), exist_ok=True)
    with open(LOG, "w", encoding="utf-8") as fh:
        fh.write("# quotations/ 报价单据改名记录（2026-09-24）\n\n")
        fh.write("命名规则：`类型_MZ_YYYYMMDD_客户或国家[_贸易术语/产品/目的港].扩展名`\n\n")
        fh.write("| 原文件名 | 新文件名 |\n|---|---|\n")
        for a, b in done:
            fh.write(f"| {a} | {b} |\n")
        fh.write("\n未改动（待决定）：\n")
        for f in skipped:
            fh.write(f"- {f}\n")
    print("\n改名记录:", LOG)


if __name__ == "__main__":
    main()

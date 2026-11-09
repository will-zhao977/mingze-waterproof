// 明泽防水-商务邀请函模板（尼泊尔客户 M 签证用）
// 依据：加德满都中国签证申请中心《签证申请最新要求》(2023-11-30)
// 邀请函三要素：被邀请人个人信息 / 访问信息(事由、抵离日期、地点、关系、费用来源) / 邀请单位信息+盖章签字
// 样式：纯黑白、Arial、细黑框（与对外单据标准一致）
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, WidthType, BorderStyle, TabStopType, TabStopPosition,
} = require("docx");
const fs = require("fs");

const OUT = "/Users/chengzhi/workspace/mingze/公共模板/商务函件/明泽防水-商务邀请函模板.docx";

const FONT = "Arial";
const THIN = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
const ALL_THIN = { top: THIN, bottom: THIN, left: THIN, right: THIN, insideHorizontal: THIN, insideVertical: THIN };
const CELL_MARGIN = { top: 80, bottom: 80, left: 140, right: 140 };

function run(text, opts = {}) {
  return new TextRun({ text, font: FONT, size: 22, color: "000000", ...opts });
}

function para(children, opts = {}) {
  return new Paragraph({ spacing: { line: 312, after: 100 }, children, ...opts });
}

// 表格行：左标签(粗体) + 右值
function fieldRow(label, value, labelPct, valuePct) {
  return new TableRow({
    cantSplit: true,
    children: [
      new TableCell({
        width: { size: labelPct, type: WidthType.PERCENTAGE },
        margins: CELL_MARGIN,
        children: [para([run(label, { bold: true, size: 20 })], { spacing: { line: 276, after: 0 } })],
      }),
      new TableCell({
        width: { size: valuePct, type: WidthType.PERCENTAGE },
        margins: CELL_MARGIN,
        children: [para([run(value, { size: 20 })], { spacing: { line: 276, after: 0 } })],
      }),
    ],
  });
}

function caption(text) {
  return new Paragraph({
    keepNext: true,
    spacing: { before: 220, after: 100, line: 312 },
    children: [run(text, { bold: true, size: 22 })],
  });
}

const letterhead = [
  para([run("WEIFANG MINGZE WATERPROOF MATERIAL CO., LTD.", { bold: true, size: 28 })],
    { alignment: AlignmentType.CENTER, spacing: { line: 312, after: 60 } }),
  para([run("Caoxinzhuang Village, Yangkou Town, Shouguang City, Weifang City, Shandong, China  |  Tel: 086-13964642628  |  Email: zisong@mzwaterproof.com", { size: 18 })],
    { alignment: AlignmentType.CENTER, spacing: { line: 276, after: 120 } }),
  // 信头分隔线（段落边框，禁止用字符线）
  new Paragraph({
    spacing: { after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000", space: 1 } },
    children: [],
  }),
];

const titleBlock = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 240, line: 312 },
    children: [run("INVITATION LETTER", { bold: true, size: 32 })],
  }),
  // Ref No. 左 + Date 右
  new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
    spacing: { after: 200, line: 312 },
    children: [run("Ref. No.: MZ-__________"), run("\t"), run("Date: ______________________")],
  }),
];

const toBlock = [
  para([run("To: The Visa Officer")]),
  para([run("Chinese Visa Application Service Center")]),
  para([run("Kathmandu, Nepal")], { spacing: { line: 312, after: 200 } }),
];

const salutation = para([run("Dear Sir or Madam,")]);

const intro = new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { line: 312, after: 160 },
  children: [
    run("We, "),
    run("Weifang Mingze Waterproof Material Co., Ltd.", { bold: true }),
    run(", a waterproof materials manufacturer located in Shouguang City, Weifang City, Shandong Province, China, hereby invite the following business partner(s) to visit our company in China for business negotiation and factory inspection:"),
  ],
});

const inviteeTable = new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  borders: ALL_THIN,
  rows: [
    fieldRow("Full Name (as shown on passport)", "", 40, 60),
    fieldRow("Gender", "", 40, 60),
    fieldRow("Date of Birth", "", 40, 60),
    fieldRow("Nationality", "", 40, 60),
    fieldRow("Passport Number", "", 40, 60),
    fieldRow("Passport Expiry Date", "", 40, 60),
    fieldRow("Position / Occupation", "", 40, 60),
    fieldRow("Company (in Nepal)", "", 40, 60),
  ],
});

const visitTable = new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  borders: ALL_THIN,
  rows: [
    fieldRow("Purpose of Visit", "Business negotiation and factory inspection", 40, 60),
    fieldRow("Intended Date of Arrival in China", "", 40, 60),
    fieldRow("Intended Date of Departure from China", "", 40, 60),
    fieldRow("Place(s) to Visit", "Caoxinzhuang Village, Yangkou Town, Shouguang City, Weifang City, Shandong Province, China; other place(s): ________________", 40, 60),
    fieldRow("Relationship with the Inviting Company", "Business partner", 40, 60),
    fieldRow("Expenses Borne by", "(   ) The Inviting Company        (   ) The Invitee", 40, 60),
  ],
});

const guarantee = new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { before: 200, line: 312, after: 160 },
  children: [
    run("We hereby guarantee that the above-mentioned invitee(s) will comply with Chinese laws and regulations during the visit in China and will leave China on schedule upon its completion."),
  ],
});

const closing = [
  para([run("Should you need any further information, please feel free to contact us at the details below.")]),
  para([run("Thank you for your kind consideration.")], { spacing: { line: 312, after: 240 } }),
];

const signature = [
  para([run("Yours faithfully,")], { alignment: AlignmentType.RIGHT }),
  new Paragraph({ spacing: { after: 0 }, children: [] }),
  new Paragraph({ spacing: { after: 0 }, children: [] }),
  new Paragraph({ spacing: { after: 0 }, children: [] }),
  para([run("WEIFANG MINGZE WATERPROOF MATERIAL CO., LTD.", { bold: true })], { alignment: AlignmentType.RIGHT }),
  para([run("(Company Stamp / Signature of Legal Representative)", { italics: true, size: 18 })], { alignment: AlignmentType.RIGHT }),
];

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: FONT, size: 22, color: "000000" },
        paragraph: { spacing: { line: 312 } },
      },
    },
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1200, bottom: 1100, left: 1440, right: 1440 },
      },
    },
    children: [
      ...letterhead,
      ...titleBlock,
      ...toBlock,
      salutation,
      intro,
      caption("Information of the Invitee(s)"),
      inviteeTable,
      caption("Visit Details"),
      visitTable,
      guarantee,
      ...closing,
      ...signature,
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(OUT, buf);
  console.log("written:", OUT);
});

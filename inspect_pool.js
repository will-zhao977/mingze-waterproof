(() => {
  const txt = el => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
  const out = {};
  out.url = location.href;
  const bodyTxt = (document.body.innerText || '').replace(/[ \t]+/g, ' ');
  out.planNameFound = bodyTxt.includes('全站推广_方案包_20260731103532');
  out.planIdFound = bodyTxt.includes('383290905');
  out.headSnippet = bodyTxt.slice(0, 300);
  out.tabs = Array.from(document.querySelectorAll('[role=tab],[class*=tabs-tab]'))
    .map(e => txt(e)).filter(t => t && t.length < 30).slice(0, 20);
  out.tabCountsLabels = (bodyTxt.match(/商品\(\d+\)/g) || []).slice(0, 5);
  out.totalLabel = (bodyTxt.match(/总计[:：]\s*\d+\s*个?/g) || []).slice(0, 5);
  out.dateRange = (bodyTxt.match(/20\d\d-\d\d-\d\d\s*[-~]\s*20\d\d-\d\d-\d\d/g) || []).slice(0, 3);

  // switches / toggles
  const sw = Array.from(document.querySelectorAll('[class*=switch],[role=switch]'));
  out.switchCount = sw.length;
  out.switchSample = sw.slice(0, 6).map(s => ({
    cls: (s.className || '').toString().slice(0, 70),
    text: txt(s).slice(0, 20),
    aria: s.getAttribute('aria-checked'),
    visible: s.offsetParent !== null
  }));

  // action keyword text nodes
  const kw = ['暂停', '从计划移除', '移除', '删除', '去优化', '批量', '开始推广', '停止推广'];
  const hits = [];
  document.querySelectorAll('a,button,span,div,i,label').forEach(el => {
    const t = txt(el);
    if (!t || t.length > 10) return;
    if (kw.includes(t)) {
      const r = el.getBoundingClientRect();
      hits.push({
        tag: el.tagName, text: t,
        visible: !!(el.offsetParent !== null && r.width > 0),
        cls: (el.className || '').toString().slice(0, 60)
      });
    }
  });
  out.actionHits = hits.slice(0, 60);
  out.actionHitCount = hits.length;

  // first product row: dump each td
  const rows = Array.from(document.querySelectorAll('tr')).filter(tr => /1601\d{9}/.test(tr.innerText || ''));
  out.productRowCount = rows.length;
  if (rows[0]) {
    const tds = Array.from(rows[0].querySelectorAll('td'));
    out.row0 = tds.map((td, i) => ({
      i,
      text: txt(td).slice(0, 40),
      html: td.innerHTML.length > 400 ? td.innerHTML.slice(0, 400) + '...' : td.innerHTML
    }));
  }
  // any element with title mentioning 暂停/移除
  const attrHits = [];
  document.querySelectorAll('[title],[aria-label]').forEach(e => {
    const v = (e.getAttribute('title') || '') + ' | ' + (e.getAttribute('aria-label') || '');
    if (/暂停|移除|删除|批量/.test(v)) attrHits.push(v.slice(0, 80));
  });
  out.attrHits = Array.from(new Set(attrHits)).slice(0, 30);
  return out;
})()

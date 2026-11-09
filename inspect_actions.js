(() => {
  const out = {};
  const txt = el => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
  // 1. Plan identity
  const head = document.querySelector('h1,h2,.campaign-name,.plan-name');
  out.docTitle = document.title;
  out.url = location.href;
  // 2. All elements whose exact text matches action keywords
  const kw = ['暂停', '从计划移除', '移除', '删除', '去优化', '批量'];
  const hits = [];
  document.querySelectorAll('a,button,span,div,i').forEach(el => {
    const t = txt(el);
    if (!t || t.length > 12) return;
    if (kw.includes(t)) {
      const r = el.getBoundingClientRect();
      hits.push({
        tag: el.tagName, cls: (el.className || '').toString().slice(0, 80), text: t,
        w: Math.round(r.width), h: Math.round(r.height),
        visible: !!(el.offsetParent !== null && r.width > 0),
        depth: (() => { let d = 0, p = el; while (p && p.parentElement) { d++; p = p.parentElement; } return d; })()
      });
    }
  });
  out.actionHits = hits.slice(0, 60);
  out.actionHitCount = hits.length;
  // 3. First 3 product rows: dump the 操作 cell contents
  const rows = Array.from(document.querySelectorAll('tr')).filter(tr => /1601\d{9}/.test(tr.innerText || ''));
  out.rowCount = rows.length;
  out.sampleRows = rows.slice(0, 3).map(tr => {
    const tds = Array.from(tr.querySelectorAll('td'));
    const last = tds[tds.length - 1];
    return {
      text: txt(tr).slice(0, 220),
      tdCount: tds.length,
      opCellHTML: last ? last.innerHTML.slice(0, 700) : null,
      opCellText: last ? txt(last) : null,
      rowControls: Array.from(tr.querySelectorAll('button,a,i[class*=icon],span[class*=btn]')).map(e => txt(e)).filter(Boolean).slice(0, 12)
    };
  });
  // 4. Look for selection/batch bars in DOM
  const bars = [];
  document.querySelectorAll('[class*=batch],[class*=selected],[class*=toolbar],[class*=operate-bar],[class*=action-bar]').forEach(el => {
    const t = txt(el);
    if (t && t.length < 200) bars.push({ cls: (el.className || '').toString().slice(0, 100), text: t.slice(0, 150), visible: el.offsetParent !== null });
  });
  out.bars = bars.slice(0, 20);
  // 5. checkboxes
  out.checkboxes = document.querySelectorAll('input[type=checkbox], .next-checkbox').length;
  return out;
})()

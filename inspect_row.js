(() => {
  const txt = el => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
  const trs = Array.from(document.querySelectorAll('tr')).filter(tr => /1601\d{9}/.test(tr.innerText || ''));
  const tr = trs[0];
  const tds = Array.from(tr.querySelectorAll('td'));
  const cols = tds.map((td, i) => ({
    i,
    cls: (td.className || '').toString().slice(0, 90),
    text: txt(td).slice(0, 60),
    btns: Array.from(td.querySelectorAll('button,a,i,svg,span[class*=icon]')).map(e => e.tagName + ':' + txt(e).slice(0, 20)).slice(0, 8),
    html: td.innerHTML.length > 300 ? td.innerHTML.slice(0, 300) + '…' : td.innerHTML
  }));
  // header cells
  const hdr = Array.from(document.querySelectorAll('th')).map((th, i) => ({ i, text: txt(th).slice(0, 24) }));
  // hidden interactive elements anywhere in table container
  const hidden = [];
  document.querySelectorAll('button,a,[class*=btn],[class*=icon],[class*=more],[class*=dropdown]').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0 || el.offsetParent === null) {
      const t = txt(el);
      if (t && t.length <= 10) hidden.push({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 70), text: t });
    }
  });
  return { headerCells: hdr, rowCols: cols, hiddenCount: hidden.length, hiddenSample: hidden.slice(0, 40) };
})()

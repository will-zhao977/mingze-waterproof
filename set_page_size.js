(async () => {
  const txt = el => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
  const out = {};
  // locate product-table pagination container (contains 每页显示)
  const containers = Array.from(document.querySelectorAll('div,ul,section')).filter(e => {
    const t = txt(e);
    return t.includes('每页显示') && t.length < 160 && e.offsetParent !== null;
  });
  out.containerCount = containers.length;
  const pg = containers[containers.length - 1];
  out.pgHTML = pg ? pg.outerHTML.slice(0, 2000) : null;
  // click the "50" page-size option inside pagination
  let clicked = false;
  if (pg) {
    const cand = Array.from(pg.querySelectorAll('li,span,a,div,button')).filter(e => txt(e) === '50' && e.offsetParent !== null);
    if (cand.length) { cand[cand.length - 1].click(); clicked = true; }
  }
  await new Promise(r => setTimeout(r, 2500));
  const rows = Array.from(document.querySelectorAll('tr')).filter(tr => /1601\d{9}/.test(tr.innerText || ''));
  const body = document.body.innerText.replace(/[ \t]+/g, ' ');
  out.clicked50 = clicked;
  out.rowCount = rows.length;
  out.tab = (body.match(/商品\(\d+\)/g) || [])[0];
  out.total = (body.match(/总计[:：]\s*\d+\s*个/g) || [])[0];
  out.pageText = (body.match(/每页显示[^\n]{0,60}/g) || [])[0];
  return out;
})()

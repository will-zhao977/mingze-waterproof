(async () => {
  const txt = el => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const getRows = () => Array.from(document.querySelectorAll('tr')).filter(tr => /1601\d{9}|1000003\d{9}/.test(tr.innerText || ''));
  const pidOf = tr => {
    const a = tr.querySelector('a[href*="itemId="]');
    const m = a && a.href.match(/itemId=(\d+)/);
    return m ? m[1] : null;
  };
  const isActive = tr => {
    const c = tr.querySelector('.c-col-status');
    return !!(c && c.querySelector('div[style*="background-color"]'));
  };
  const curPage = () => { const e = document.querySelector('.next-pagination-item.next-current'); return e ? txt(e) : '?'; };

  if (!window.__activePids) window.__activePids = [];
  if (!window.__started) {
    window.__started = true;
    const p1 = Array.from(document.querySelectorAll('.next-pagination-item')).find(e => txt(e) === '1');
    if (p1 && curPage() !== '1') { p1.click(); await sleep(2500); }
  }
  const perPage = [];
  const budget = 12;
  for (let i = 0; i < budget; i++) {
    const rows = getRows();
    const act = [];
    rows.forEach(tr => { const p = pidOf(tr); if (p && isActive(tr)) act.push(p); });
    act.forEach(p => { if (!window.__activePids.includes(p)) window.__activePids.push(p); });
    perPage.push({ page: curPage(), rows: rows.length, active: act.length });
    const nxt = document.querySelector('.next-pagination-next') || Array.from(document.querySelectorAll('button')).find(b => /下一页/.test(b.getAttribute('aria-label') || ''));
    if (!nxt || nxt.disabled) { perPage.push({ stop: 'last page reached' }); break; }
    const before = getRows().map(pidOf)[0];
    nxt.click();
    let ch = false;
    for (let w = 0; w < 20; w++) { await sleep(300); if (getRows().map(pidOf)[0] !== before) { ch = true; break; } }
    if (!ch) { perPage.push({ stop: 'no page change' }); break; }
  }
  const b = document.body.innerText.replace(/[ \t]+/g, ' ');
  return { perPage, activeTotal: window.__activePids.length, activeIds: window.__activePids.slice(), tab: (b.match(/商品\((\d+)\)/g) || [])[0] };
})()

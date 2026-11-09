(async () => {
  const TO_PAUSE = new Set(__TO_PAUSE__);
  const txt = el => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const getRows = () => Array.from(document.querySelectorAll('tr')).filter(tr => /1601\d{9}/.test(tr.innerText || ''));
  const pidOf = tr => {
    const a = tr.querySelector('a[href*="itemId="]');
    const m = a && a.href.match(/itemId=(\d+)/);
    return m ? m[1] : null;
  };
  const tag = () => { getRows().forEach(tr => { const p = pidOf(tr); if (p) tr.setAttribute('data-pid', p); }); };
  const isActive = pid => {
    const tr = document.querySelector('tr[data-pid="' + pid + '"]');
    const c = tr && tr.querySelector('.c-col-status');
    return !!(c && c.querySelector('div[style*="background-color"]'));
  };
  const curPage = () => { const e = document.querySelector('.next-pagination-item.next-current'); return e ? txt(e) : '?'; };
  const done = window.__done || new Set();
  const budget = 6;
  const perPage = [];
  for (let i = 0; i < budget; i++) {
    tag();
    const pids = getRows().map(pidOf).filter(Boolean);
    const active = pids.filter(p => isActive(p));
    const leftover = active.filter(p => TO_PAUSE.has(p) && !done.has(p));
    perPage.push({ page: curPage(), rows: pids.length, active: active.length, leftoverTargets: leftover.length, leftoverSample: leftover.slice(0, 5) });
    const nxt = document.querySelector('.next-pagination-next') || Array.from(document.querySelectorAll('button')).find(b => /下一页/.test(b.getAttribute('aria-label') || ''));
    if (!nxt || nxt.disabled) { perPage.push({ stop: 'last page reached' }); break; }
    const before = getRows().map(pidOf)[0];
    nxt.click();
    let ch = false;
    for (let w = 0; w < 20; w++) { await sleep(300); if (getRows().map(pidOf)[0] !== before) { ch = true; break; } }
    if (!ch) { perPage.push({ stop: 'no page change' }); break; }
  }
  const b = document.body.innerText.replace(/[ \t]+/g, ' ');
  return { perPage, curPage: curPage(), tab: (b.match(/商品\((\d+)\)/g) || [])[0], total: (b.match(/总计[:：]\s*\d+\s*个/g) || [])[0] };
})()

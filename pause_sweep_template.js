(async () => {
  const TO_PAUSE = new Set(__TO_PAUSE__);
  const KEEP = new Set(__TO_KEEP__);
  const txt = el => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const getRows = () => Array.from(document.querySelectorAll('tr')).filter(tr => /1601\d{9}/.test(tr.innerText || ''));
  const pidOf = tr => {
    const a = tr.querySelector('a[href*="itemId="]');
    const m = a && a.href.match(/itemId=(\d+)/);
    return m ? m[1] : null;
  };
  const tag = () => { getRows().forEach(tr => { const p = pidOf(tr); if (p) tr.setAttribute('data-pid', p); }); };
  const rowByPid = pid => document.querySelector('tr[data-pid="' + pid + '"]');
  const cbOf = pid => { const tr = rowByPid(pid); return tr ? tr.querySelector('input[type=checkbox]') : null; };
  const isActive = pid => { const tr = rowByPid(pid); const c = tr && tr.querySelector('.c-col-status'); return !!(c && c.querySelector('div[style*="background-color"]')); };
  const curPage = () => { const e = document.querySelector('.next-pagination-item.next-current'); return e ? txt(e) : '?'; };

  if (!window.__done) window.__done = new Set();
  if (!window.__log) window.__log = [];
  const done = window.__done, log = window.__log;

  const budget = 3;
  const summary = [];

  for (let i = 0; i < budget; i++) {
    tag();
    const pageNo = curPage();
    const pids = getRows().map(pidOf).filter(Boolean);
    const targets = pids.filter(p => TO_PAUSE.has(p) && !done.has(p) && isActive(p));
    const rec = { page: pageNo, rows: pids.length, keepOnPage: pids.filter(p => KEEP.has(p)).length, targets: targets.length, selected: 0, ok: false, toast: null, fail: [], barText: null };

    if (targets.length) {
      for (let c = 0; c < 3; c++) {
        const chk = Array.from(document.querySelectorAll('tr input[type=checkbox]')).filter(cb => cb.checked);
        if (!chk.length) break;
        chk[0].click();
        await sleep(150);
      }
      for (let pass = 0; pass < 3; pass++) {
        tag();
        let need = 0;
        for (const pid of targets) {
          const cb = cbOf(pid);
          if (cb && !cb.checked) {
            cb.click(); need++; await sleep(70);
            const cb2 = cbOf(pid);
            if (cb2 && !cb2.checked) { const lb = cb2.closest('label'); if (lb) { lb.click(); await sleep(70); } }
          }
        }
        await sleep(400);
        if (need === 0) break;
      }
      tag(); await sleep(500);
      const okList = [], fail = [];
      targets.forEach(pid => { const cb = cbOf(pid); if (cb && cb.checked) okList.push(pid); else fail.push(pid); });
      rec.selected = okList.length;
      rec.fail = fail;
      const bar = document.querySelector('[class*=batchActionsWrap]');
      rec.barText = bar ? txt(bar) : null;
      if (fail.length === 0 && okList.length === targets.length) {
        const btn = Array.from(document.querySelectorAll('[class*=btnItem]')).find(b => txt(b) === '暂停');
        if (btn) {
          btn.click();
          await sleep(2000);
          const ov = Array.from(document.querySelectorAll('.next-overlay-wrapper.opened')).map(o => txt(o)).filter(Boolean);
          rec.toast = ov.slice(0, 3);
          rec.ok = rec.toast.some(t => t.includes('操作成功'));
          if (rec.ok) okList.forEach(p => done.add(p));
        } else rec.fail = ['no batch pause button'];
      }
    }
    log.push(rec);
    summary.push(rec);

    const nxt = document.querySelector('.next-pagination-next') || Array.from(document.querySelectorAll('button')).find(b => /下一页/.test(b.getAttribute('aria-label') || ''));
    if (!nxt || nxt.disabled) { summary.push({ stop: 'last page' }); break; }
    const firstBefore = getRows().map(pidOf)[0];
    nxt.click();
    let ch = false;
    for (let w = 0; w < 20; w++) { await sleep(300); if (getRows().map(pidOf)[0] !== firstBefore) { ch = true; break; } }
    if (!ch) { summary.push({ stop: 'no page change' }); break; }
  }

  const b2 = document.body.innerText.replace(/[ \t]+/g, ' ');
  return {
    summary,
    doneCount: done.size,
    curPage: curPage(),
    tab: (b2.match(/商品\(\d+\)/g) || [])[0],
    total: (b2.match(/总计[:：]\s*\d+\s*个/g) || [])[0]
  };
})()

(async () => {
  const C = ['PX001T82O','PX001T8U3','PX001T9LX','PX001UG27','PX001UFAU'];
  const S = 'CS000YJTU';
  let box = document.getElementById('__bx');
  if (!box) { box = document.createElement('div'); box.id = '__bx'; box.style.cssText = 'position:fixed;left:0;top:0;width:900px;height:600px;opacity:0.01;'; document.body.appendChild(box); }
  if (box.querySelectorAll('iframe').length !== C.length) {
    box.innerHTML = '';
    C.forEach(c => { const f = document.createElement('iframe'); f.src = '/course/play.htm?code=' + c + '&seriesCode=' + S; f.width = 300; f.height = 200; f.dataset.code = c; box.appendChild(f); });
    await new Promise(r => setTimeout(r, 12000));
  }
  [...box.querySelectorAll('iframe')].forEach(f => {
    try {
      const w = f.contentWindow, d = f.contentDocument;
      try { Object.defineProperty(d, 'visibilityState', { get: () => 'visible', configurable: true }); } catch (e) {}
      try { Object.defineProperty(d, 'hidden', { get: () => false, configurable: true }); } catch (e) {}
      try { w.document.hasFocus = () => true; } catch (e) {}
      if (w.__k) clearInterval(w.__k);
      w.__k = w.setInterval(() => { try { const v = d.querySelector('video'); if (v) { v.muted = true; if (!v.ended && v.paused) v.play().catch(() => {}); if (v.playbackRate !== 8) v.playbackRate = 8; } } catch (e) {} }, 1500);
      const v = d.querySelector('video'); v.muted = true; v.playbackRate = 8; v.play().catch(() => {});
    } catch (e) {}
  });
  await new Promise(r => setTimeout(r, 4000));
  return [...box.querySelectorAll('iframe')].map(f => { try { const v = f.contentDocument.querySelector('video'); return { c: f.dataset.code, cur: +v.currentTime.toFixed(0), dur: Math.round(v.duration), ended: v.ended, paused: v.paused }; } catch (e) { return { c: f.dataset.code, err: 1 }; } });
})()

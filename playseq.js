(async () => {
  const all = ['PX001TADJ','PX001T82O','PX001T8U3','PX001T9LX','PX001UG27','PX001T8UM','PX001UG28','PX001UIDQ','PX001UJ5W','PX001UIDR','PX001UFAU','PX001UGUJ','PX001UHMB','PX0025RH7','PX00271PU','PX0025LFJ','PX0025MYA','PX0025M70'];
  const S = 'CS000YJTU';
  const BATCH = 5;
  let box = document.getElementById('__bx');
  if (!box) { box = document.createElement('div'); box.id = '__bx'; box.style.cssText = 'position:fixed;left:-9999px;top:0;width:1200px;height:900px;'; document.body.appendChild(box); }
  const st = window.__st = window.__st || { sampled: [], batches: [] };
  const prev = [...box.querySelectorAll('iframe')];
  const sampled = prev.map(f => { try { const v = f.contentDocument.querySelector('video'); return { c: f.dataset.code, cur: +v.currentTime.toFixed(1), dur: Math.round(v.duration), ended: v.ended, err: v.error && v.error.code }; } catch (e) { return { c: f.dataset.code, err: String(e) }; } });
  if (sampled.length) { st.sampled.push(sampled); }
  const seen = new Set(st.sampled.flat().map(x => x.c));
  const next = all.filter(c => !seen.has(c)).slice(0, BATCH);
  box.innerHTML = '';
  if (next.length) {
    next.forEach(c => { const f = document.createElement('iframe'); f.src = '/course/play.htm?code=' + c + '&seriesCode=' + S; f.width = 400; f.height = 300; f.dataset.code = c; box.appendChild(f); });
    st.batches.push(next);
    await new Promise(r => setTimeout(r, 10000));
    [...box.querySelectorAll('iframe')].forEach(f => { try { const v = f.contentDocument.querySelector('video'); v.muted = true; v.playbackRate = 4; v.play().catch(() => {}); } catch (e) {} });
    await new Promise(r => setTimeout(r, 2000));
  }
  const cur = [...box.querySelectorAll('iframe')].map(f => { try { const v = f.contentDocument.querySelector('video'); return { c: f.dataset.code, dur: Math.round(v.duration), cur: +v.currentTime.toFixed(1) }; } catch (e) { return { c: f.dataset.code, err: String(e) }; } });
  return { batchJustStarted: next, current: cur, allSampled: st.sampled };
})()

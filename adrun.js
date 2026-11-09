(async () => {
  const B = [
    ['PX002DLR4', 'PX002DOA2', 'PX002DMKW'],
    ['PX002DAIR', 'PX002D5L6', 'PX002DACM'],
    ['PX002DCN9', 'PX002DCNA', 'PX002DH78'],
  ];
  const S = 'CS0013FR5';
  const RATE = 8;
  let box = document.getElementById('__bx');
  if (!box) { box = document.createElement('div'); box.id = '__bx'; box.style.cssText = 'position:fixed;left:-9999px;top:0;width:1200px;height:900px;'; document.body.appendChild(box); }
  const st = window.__st = window.__st || { stage: 0, log: [] };
  const sample = () => [...box.querySelectorAll('iframe')].map(f => { try { const v = f.contentDocument.querySelector('video'); return { c: f.dataset.code, cur: +v.currentTime.toFixed(1), dur: Math.round(v.duration), ended: v.ended, err: v.error && v.error.code }; } catch (e) { return { c: f.dataset.code, err: String(e) }; } });
  const s0 = sample();
  if (s0.length) st.log.push({ stage: st.stage, s: s0 });
  const allEnded = s0.length > 0 && s0.every(x => x.ended === true);
  if (allEnded && st.stage < B.length - 1) st.stage++;
  const cur = B[st.stage];
  const codes = [...box.querySelectorAll('iframe')].map(f => f.dataset.code);
  if (codes.join() !== cur.join()) {
    box.innerHTML = '';
    cur.forEach(c => { const f = document.createElement('iframe'); f.src = '/course/play.htm?code=' + c + '&seriesCode=' + S; f.width = 400; f.height = 300; f.dataset.code = c; box.appendChild(f); });
    await new Promise(r => setTimeout(r, 10000));
    [...box.querySelectorAll('iframe')].forEach(f => { try { const v = f.contentDocument.querySelector('video'); v.muted = true; v.playbackRate = RATE; v.play().catch(() => {}); } catch (e) {} });
    await new Promise(r => setTimeout(r, 2000));
  } else {
    [...box.querySelectorAll('iframe')].forEach(f => { try { const v = f.contentDocument.querySelector('video'); v.muted = true; v.playbackRate = RATE; if (!v.ended) v.play().catch(() => {}); } catch (e) {} });
  }
  return { stage: st.stage, playing: cur, current: sample(), log: st.log };
})()

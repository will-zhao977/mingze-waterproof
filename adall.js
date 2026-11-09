(async () => {
  const C = ['PX002DLR4','PX002DOA2','PX002DMKW','PX002DAIR','PX002D5L6','PX002DACM','PX002DCN9','PX002DCNA','PX002DH78'];
  const S = 'CS0013FR5';
  let box = document.getElementById('__bx');
  if (!box) { box = document.createElement('div'); box.id = '__bx'; box.style.cssText = 'position:fixed;left:0;top:0;width:1000px;height:700px;opacity:0.01;'; document.body.appendChild(box); }
  if (box.querySelectorAll('iframe').length !== C.length) {
    box.innerHTML = '';
    C.forEach(c => { const f = document.createElement('iframe'); f.src = '/course/play.htm?code=' + c + '&seriesCode=' + S; f.width = 320; f.height = 220; f.dataset.code = c; box.appendChild(f); });
    await new Promise(r => setTimeout(r, 12000));
  }
  let n = 0;
  [...box.querySelectorAll('iframe')].forEach(f => { try { const v = f.contentDocument.querySelector('video'); v.muted = true; v.playbackRate = 8; if (!v.ended) { v.play().catch(() => {}); } n++; } catch (e) {} });
  await new Promise(r => setTimeout(r, 4000));
  const st = [...box.querySelectorAll('iframe')].map(f => { try { const v = f.contentDocument.querySelector('video'); return { c: f.dataset.code, cur: +v.currentTime.toFixed(1), dur: Math.round(v.duration), ended: v.ended, paused: v.paused, rs: v.readyState, err: v.error && v.error.code }; } catch (e) { return { c: f.dataset.code, err: String(e) }; } });
  return { frames: box.querySelectorAll('iframe').length, played: n, vis: document.visibilityState, list: st };
})()

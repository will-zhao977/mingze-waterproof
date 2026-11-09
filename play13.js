(async () => {
  const codes = ['PX002DLR4','PX002DOA2','PX002DMKW','PX002D17I','PX002CZ8Q','PX002DL6N','PX002DAIR','PX002DAIS','PX002D5L6','PX002DACM','PX002DCN9','PX002DCNA','PX002DH78'];
  const S = 'CS0013FR5';
  let box = document.getElementById('__bx');
  if (!box) { box = document.createElement('div'); box.id = '__bx'; box.style.cssText = 'position:fixed;left:-9999px;top:0;width:1200px;height:900px;'; document.body.appendChild(box); }
  const existing = [...box.querySelectorAll('iframe')].length;
  if (existing < codes.length) {
    box.innerHTML = '';
    codes.forEach(c => { const f = document.createElement('iframe'); f.src = '/course/play.htm?code=' + c + '&seriesCode=' + S; f.width = 400; f.height = 300; f.dataset.code = c; box.appendChild(f); });
    await new Promise(r => setTimeout(r, 12000));
  }
  const out = [...box.querySelectorAll('iframe')].map(f => { try { const v = f.contentDocument.querySelector('video'); return { c: f.dataset.code, dur: Math.round(v.duration), cur: +v.currentTime.toFixed(1), paused: v.paused, rs: v.readyState }; } catch (e) { return { c: f.dataset.code, err: String(e) }; } });
  [...box.querySelectorAll('iframe')].forEach(f => { try { const v = f.contentDocument.querySelector('video'); if (v) { v.muted = true; v.playbackRate = 2; v.play().catch(() => {}); } } catch (e) {} });
  return { box: !!document.getElementById('__bx'), frames: out.length, list: out };
})()

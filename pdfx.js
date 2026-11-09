(async () => {
  const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
  if (!window.__pdfLoaded) {
    await new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = CDN + 'pdf.min.js';
      s.onload = res;
      s.onerror = () => rej(new Error('cdn load fail'));
      document.head.appendChild(s);
    });
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = CDN + 'pdf.worker.min.js';
    window.__pdfLoaded = true;
  }
  window.__pdftext = async (url) => {
    const r = await fetch(url, { credentials: 'include' });
    const b = await r.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: b }).promise;
    let out = '';
    for (let i = 1; i <= Math.min(pdf.numPages, 60); i++) {
      const p = await pdf.getPage(i);
      const tc = await p.getTextContent();
      const line = tc.items.map((x) => x.str).join(' ').replace(/\s+/g, ' ').trim();
      if (line) out += '[p' + i + '] ' + line + '\n';
    }
    window.__lastPdf = { pages: pdf.numPages, text: out };
    return { pages: pdf.numPages, chars: out.length, text: out.slice(0, 1200) };
  };
  const u = 'https://peixun.alibaba.com/openvideo/downLoadCourseWare.json?courseWare=Hb2fa58e9121f41c385bcbd3296ab1281T.pdf&fileName=AI%E6%97%B6%E4%BB%A3%E6%95%88%E6%9E%9C%E5%B9%BF%E5%91%8A%E6%8A%95%E6%94%BE.pdf&courseWareId=2292003&courseId=PX002D17I';
  return { __result: { ready: true, test: await window.__pdftext(u) } };
})()

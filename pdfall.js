(async () => {
  const urls = Array.from(document.querySelectorAll('a[href*="downLoadCourseWare"]')).map((a) => a.href);
  const res = [];
  const full = {};
  for (const u of urls) {
    const fn = decodeURIComponent(new URL(u).searchParams.get('fileName') || '');
    try {
      const r = await window.__pdftext(u);
      full[fn] = window.__lastPdf.text;
      res.push({ fn, pages: r.pages, chars: r.chars, head: r.text.slice(0, 160) });
    } catch (e) {
      res.push({ fn, err: String(e).slice(0, 90) });
    }
  }
  return { __result: { n: urls.length, summary: res, full } };
})()

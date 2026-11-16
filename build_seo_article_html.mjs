#!/usr/bin/env node
/**
 * Weifang Mingze Waterproof Material Co., Ltd.
 * Static SEO + GEO Article HTML, Sitemap, LLMs Context & Pre-rendered Index Builder
 *
 * Usage:
 *   node build_seo_article_html.mjs
 *
 * 1. Reads seo_articles/schedule_tracker.json and src/data.js
 * 2. Compiles existing Markdown drafts into public/articles/<slug>/index.html
 * 3. Builds public/articles/index.html (Engineering Guides Hub)
 * 4. Updates public/sitemap.xml locally
 * 5. Synchronizes public/llms.txt & public/llms-full.txt (including Factory Size: 68,000 m² & published guides)
 * 6. Synchronizes index.html (JSON-LD 37-SKU full lab specs, #MZ-CAT-xx deep links, og-banner-1200x630.jpg, /articles/ links & verified footer)
 * Does NOT execute git commit or git push.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  COMPANY_INFO,
  CATEGORIES,
  PRODUCTS,
  SOLUTIONS,
  WHY_CHOOSE_US,
  EXPORT_FAQS,
  COMPARISON_MATRIX
} from './src/data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRACKER_PATH = path.join(__dirname, 'seo_articles', 'schedule_tracker.json');
const PUBLIC_DIR = path.join(__dirname, 'public');
const ARTICLES_OUT_DIR = path.join(PUBLIC_DIR, 'articles');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');
const LLMS_TXT_PATH = path.join(PUBLIC_DIR, 'llms.txt');
const LLMS_FULL_TXT_PATH = path.join(PUBLIC_DIR, 'llms-full.txt');
const INDEX_HTML_PATH = path.join(__dirname, 'index.html');
const OG_BANNER_URL = 'https://mingzewaterproof.com/assets/images/og-banner-1200x630.jpg';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatCardStandard(standards) {
  if (!standards) return '';
  const parts = standards
    .split(/\s+\/\s+(?![^()]*\))/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length <= 2) return parts.join(' · ');
  const intl = parts.find((p) => /^(ASTM|EN|GRI|IMO|ISO|BS|ACI|FLL)/i.test(p));
  if (intl && intl !== parts[0]) {
    return `${intl} · ${parts[0]}`;
  }
  return `${parts[0]} · ${parts[1]}`;
}

function formatInline(text) {
  let out = text;
  out = out.replace(/<br\s*\/?>/gi, '___BR___');
  out = escapeHtml(out);
  out = out.replace(/___BR___/g, '<br>');
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  return out;
}

function parseMetadataAndSchema(rawMd, fallbackTitle, slug) {
  const metaTitleMatch = rawMd.match(/Meta Title:\s*([^\n(]+)/i);
  const metaDescMatch = rawMd.match(/Meta Description:\s*([^\n(]+)/i);
  const canonicalMatch = rawMd.match(/Canonical URL:\s*(\S+)/i);
  const skusMatch = rawMd.match(/Target SKUs:\s*([^\n]+)/i);
  const pubDateMatch = rawMd.match(/Published Date:\s*(\S+)/i);

  const metaTitle = metaTitleMatch
    ? metaTitleMatch[1].trim()
    : `${fallbackTitle.slice(0, 52)} | Mingze`;
  const metaDescription = metaDescMatch
    ? metaDescMatch[1].trim()
    : `${fallbackTitle}. Direct factory technical specification and 20GP loading guide by Weifang Mingze Waterproof Material Co., Ltd.`;
  const canonicalUrl = canonicalMatch
    ? canonicalMatch[1].trim()
    : `https://mingzewaterproof.com/articles/${slug}/`;
  const targetSkus = skusMatch ? skusMatch[1].trim() : '';
  const publishedDate = pubDateMatch ? pubDateMatch[1].trim() : new Date().toISOString().slice(0, 10);

  let jsonLdRaw = null;
  const jsonBlocks = [...rawMd.matchAll(/```json\s*([\s\S]*?)```/g)];
  for (const m of jsonBlocks) {
    if (m[1].includes('schema.org')) {
      jsonLdRaw = m[1].trim();
      break;
    }
  }

  return {
    metaTitle,
    metaDescription,
    canonicalUrl,
    targetSkus,
    publishedDate,
    jsonLdRaw
  };
}

function markdownToHtml(rawMd) {
  const md = rawMd.replace(/<!--[\s\S]*?-->/g, '');
  const lines = md.split(/\r?\n/);
  const htmlParts = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    if (/^---+\s*$/.test(line.trim())) {
      htmlParts.push('<hr class="art-divider">');
      i++;
      continue;
    }

    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      const codeContent = codeLines.join('\n');
      if (lang === 'json' && codeContent.includes('schema.org')) {
        htmlParts.push(
          `<details class="art-schema-details"><summary>View Embedded Schema.org JSON-LD Structured Data</summary><pre class="art-code"><code>${escapeHtml(codeContent)}</code></pre></details>`
        );
      } else {
        htmlParts.push(`<pre class="art-diagram"><code>${escapeHtml(codeContent)}</code></pre>`);
      }
      continue;
    }

    if (line.trim().startsWith('>')) {
      const bqLines = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        bqLines.push(lines[i].replace(/^\s*>\s?/, ''));
        i++;
      }
      const innerHtml = bqLines
        .map((l) => {
          if (l.startsWith('### ')) {
            return `<div class="geo-box-title">${formatInline(l.slice(4))}</div>`;
          }
          return `<p>${formatInline(l)}</p>`;
        })
        .join('\n');
      htmlParts.push(`<aside class="geo-answer-box" aria-label="Technical Summary">${innerHtml}</aside>`);
      continue;
    }

    if (line.trim().startsWith('|') && i + 1 < lines.length && /^\s*\|[\s\-:|]+\|\s*$/.test(lines[i + 1])) {
      const headerCells = line
        .trim()
        .replace(/^\||\|$/g, '')
        .split('|')
        .map((c) => formatInline(c.trim()));
      i += 2;
      const bodyRows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const rowCells = lines[i]
          .trim()
          .replace(/^\||\|$/g, '')
          .split('|')
          .map((c) => formatInline(c.trim()));
        bodyRows.push(rowCells);
        i++;
      }
      const thead = `<thead><tr>${headerCells.map((h) => `<th>${h}</th>`).join('')}</tr></thead>`;
      const tbody = `<tbody>${bodyRows
        .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`)
        .join('\n')}</tbody>`;
      htmlParts.push(`<div class="art-table-wrap"><table class="art-table">${thead}${tbody}</table></div>`);
      continue;
    }

    const hMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (hMatch) {
      const level = hMatch[1].length;
      const text = formatInline(hMatch[2].trim());
      const idSlug = hMatch[2]
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      htmlParts.push(`<h${level} id="${idSlug}" class="art-h${level}">${text}</h${level}>`);
      i++;
      continue;
    }

    if (/^\s*([-*•]|\d+\.)\s+/.test(line)) {
      const isOrdered = /^\s*\d+\.\s+/.test(line);
      const tag = isOrdered ? 'ol' : 'ul';
      const items = [];
      while (i < lines.length && /^\s*([-*•]|\d+\.)\s+/.test(lines[i])) {
        const itemText = lines[i].replace(/^\s*([-*•]|\d+\.)\s+/, '');
        items.push(`<li>${formatInline(itemText)}</li>`);
        i++;
      }
      htmlParts.push(`<${tag} class="art-list">${items.join('\n')}</${tag}>`);
      continue;
    }

    const paraLines = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('>') &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('|') &&
      !/^---+\s*$/.test(lines[i].trim()) &&
      !/^\s*([-*•]|\d+\.)\s+/.test(lines[i])
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    if (paraLines.length > 0) {
      htmlParts.push(`<p class="art-p">${formatInline(paraLines.join(' '))}</p>`);
    } else {
      i++;
    }
  }

  return htmlParts.join('\n');
}

function renderArticlePage({ item, meta, bodyHtml }) {
  const jsonLdScript = meta.jsonLdRaw
    ? `<script type="application/ld+json">\n${meta.jsonLdRaw}\n</script>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(meta.metaTitle)}</title>
  <meta name="description" content="${escapeHtml(meta.metaDescription)}" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
  <link rel="canonical" href="https://mingzewaterproof.com/articles/${item.slug}/" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeHtml(meta.metaTitle)}" />
  <meta property="og:description" content="${escapeHtml(meta.metaDescription)}" />
  <meta property="og:url" content="https://mingzewaterproof.com/articles/${item.slug}/" />
  <meta property="og:site_name" content="Weifang Mingze Waterproof Material Co., Ltd." />
  <meta property="og:image" content="${OG_BANNER_URL}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(meta.metaTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(meta.metaDescription)}" />
  <meta name="twitter:image" content="${OG_BANNER_URL}" />
  ${jsonLdScript}
  <style>
    :root {
      --bg: #FFFFFF;
      --bg-soft: #FBF6F6;
      --text: #22262E;
      --text-sub: #5D6670;
      --text-light: #9AA2AB;
      --accent: #D7000F;
      --accent-dark: #A8000C;
      --line: #EAE2E2;
      --font: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      --max-w: 1120px;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font);
      background: var(--bg);
      color: var(--text);
      font-size: 16px;
      line-height: 1.7;
      -webkit-font-smoothing: antialiased;
    }
    a { color: var(--accent); text-decoration: none; }
    a:hover { text-decoration: underline; }
    .art-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(255,255,255,0.96);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--line);
    }
    .art-header-inner {
      max-width: var(--max-w);
      margin: 0 auto;
      padding: 0 24px;
      height: 68px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .art-brand {
      font-weight: 700;
      font-size: 1.05rem;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .art-brand-badge {
      background: var(--accent);
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 7px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .art-nav {
      display: flex;
      align-items: center;
      gap: 20px;
      font-size: 14px;
      font-weight: 500;
    }
    .art-nav a { color: var(--text-sub); }
    .art-nav a:hover { color: var(--accent); text-decoration: none; }
    .art-nav .art-cta-btn {
      background: var(--accent);
      color: #fff;
      padding: 8px 16px;
      font-weight: 600;
      border-radius: 2px;
    }
    .art-nav .art-cta-btn:hover { background: var(--accent-dark); color: #fff; }
    .art-breadcrumb {
      background: var(--bg-soft);
      border-bottom: 1px solid var(--line);
      padding: 12px 24px;
      font-size: 13px;
      color: var(--text-sub);
    }
    .art-breadcrumb-inner {
      max-width: var(--max-w);
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .art-meta-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      font-size: 12px;
    }
    .art-pill {
      background: #fff;
      border: 1px solid var(--line);
      padding: 2px 10px;
      color: var(--text-sub);
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }
    .art-main {
      max-width: var(--max-w);
      margin: 0 auto;
      padding: 44px 24px 80px;
      display: grid;
      grid-template-columns: minmax(0, 1fr) 290px;
      gap: 48px;
      align-items: start;
    }
    @media (max-width: 920px) {
      .art-main { grid-template-columns: 1fr; }
    }
    .art-h1 {
      font-size: clamp(1.65rem, 3vw, 2.3rem);
      line-height: 1.24;
      letter-spacing: -0.02em;
      margin-bottom: 24px;
      color: var(--text);
    }
    .art-h2 {
      font-size: 1.38rem;
      line-height: 1.32;
      margin: 40px 0 16px;
      padding-bottom: 10px;
      border-bottom: 2px solid var(--text);
      color: var(--text);
    }
    .art-h3 {
      font-size: 1.1rem;
      margin: 26px 0 10px;
      color: var(--text);
    }
    .art-p { margin-bottom: 16px; color: var(--text); }
    .art-list { margin: 0 0 20px 22px; }
    .art-list li { margin-bottom: 8px; }
    .art-divider { border: 0; border-top: 1px solid var(--line); margin: 36px 0; }
    .geo-answer-box {
      background: var(--bg-soft);
      border-left: 4px solid var(--accent);
      padding: 20px 24px;
      margin: 0 0 32px;
    }
    .geo-box-title {
      font-weight: 700;
      font-size: 0.95rem;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 8px;
    }
    .geo-answer-box p { margin: 0; font-size: 0.98rem; line-height: 1.65; }
    .art-table-wrap {
      width: 100%;
      overflow-x: auto;
      margin: 20px 0 28px;
      border: 1px solid var(--line);
    }
    .art-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
      text-align: left;
    }
    .art-table th {
      background: #1B1F26;
      color: #fff;
      font-weight: 600;
      padding: 12px 14px;
      border-right: 1px solid #2F3640;
      white-space: nowrap;
    }
    .art-table td {
      padding: 11px 14px;
      border-top: 1px solid var(--line);
      border-right: 1px solid var(--line);
      vertical-align: top;
    }
    .art-table tr:nth-child(even) td { background: #FAFAFA; }
    .art-diagram, .art-code {
      background: #181B20;
      color: #E6EDF3;
      padding: 18px 20px;
      overflow-x: auto;
      font-size: 12.5px;
      line-height: 1.5;
      margin: 18px 0 24px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    .art-schema-details {
      margin: 20px 0;
      border: 1px solid var(--line);
      padding: 12px 16px;
      background: #FAFAFA;
      font-size: 14px;
    }
    .art-schema-details summary { cursor: pointer; font-weight: 600; color: var(--text-sub); }
    code {
      background: #F3EFEF;
      padding: 2px 6px;
      font-size: 0.9em;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }
    .art-diagram code, .art-code code { background: transparent; padding: 0; }
    .art-sidebar {
      position: sticky;
      top: 92px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .art-card {
      border: 1px solid var(--line);
      background: #fff;
      padding: 22px;
    }
    .art-card-dark {
      background: #1B1F26;
      color: #fff;
      border-color: #1B1F26;
    }
    .art-card h4 {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
      color: var(--accent);
    }
    .art-card-dark h4 { color: #FF4D58; }
    .art-card p { font-size: 13.5px; line-height: 1.55; margin-bottom: 14px; color: var(--text-sub); }
    .art-card-dark p { color: #D0D7DE; }
    .art-btn-block {
      display: block;
      text-align: center;
      background: var(--accent);
      color: #fff;
      font-weight: 600;
      font-size: 14px;
      padding: 11px 16px;
      margin-top: 10px;
    }
    .art-btn-block:hover { background: var(--accent-dark); text-decoration: none; }
    .art-btn-outline {
      display: block;
      text-align: center;
      border: 1px solid #485260;
      color: #fff;
      font-weight: 600;
      font-size: 13.5px;
      padding: 9px 16px;
      margin-top: 8px;
    }
    .art-btn-outline:hover { border-color: #fff; text-decoration: none; }
    .art-spec-list {
      list-style: none;
      font-size: 13px;
    }
    .art-spec-list li {
      padding: 7px 0;
      border-bottom: 1px solid var(--line);
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }
    .art-spec-list li:last-child { border-bottom: 0; }
    .art-footer {
      background: #14171D;
      color: #9AA2AB;
      padding: 40px 24px;
      font-size: 13.5px;
      border-top: 3px solid var(--accent);
    }
    .art-footer-inner {
      max-width: var(--max-w);
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 24px;
    }
    .art-footer a { color: #fff; }
  </style>
</head>
<body>
  <header class="art-header">
    <div class="art-header-inner">
      <a href="/" class="art-brand">
        <span class="art-brand-badge">MINGZE</span>
        <span>Weifang Mingze Waterproof</span>
      </a>
      <nav class="art-nav">
        <a href="/articles/">Engineering Guides</a>
        <a href="/#products">37 Product Catalog</a>
        <a href="/llms-full.txt">TDS / LLMs Index</a>
        <a href="https://wa.me/8616658506707?text=Hello%20Mingze%20Waterproof%2C%20I%20need%20a%20quote%20and%20A4%20sample%20box." class="art-cta-btn" target="_blank" rel="noopener">Get FOB Quote</a>
      </nav>
    </div>
  </header>

  <div class="art-breadcrumb">
    <div class="art-breadcrumb-inner">
      <div>
        <a href="/">Home</a> &nbsp;/&nbsp; <a href="/articles/">Engineering Selection Guides</a> &nbsp;/&nbsp; <span>${escapeHtml(item.day || item.week || '')}</span>
      </div>
      <div class="art-meta-pills">
        <span class="art-pill">SKUs: ${escapeHtml((item.target_skus || []).join(', '))}</span>
        <span class="art-pill">Verified: ${escapeHtml(meta.publishedDate)}</span>
        <span class="art-pill">CNAS-Standard QC Lab</span>
      </div>
    </div>
  </div>

  <main class="art-main">
    <article class="art-content">
      ${bodyHtml}
    </article>

    <aside class="art-sidebar">
      <div class="art-card art-card-dark">
        <h4>Direct Factory Quotation</h4>
        <p>Sourcing directly from our 68,000 m² facility in Taitou, Shouguang (200 km to Qingdao Port). Request FOB/CIF container pricing &amp; free A4 sample swatch boxes.</p>
        <a class="art-btn-block" href="https://wa.me/8616658506707?text=Hello%20Mingze%20Waterproof%2C%20I%20am%20inquiring%20about%20${encodeURIComponent((item.target_skus || []).join(', '))}" target="_blank" rel="noopener">WhatsApp: +86 16658506707</a>
        <a class="art-btn-outline" href="mailto:zhao@mzwaterproof.com?subject=Inquiry%20for%20${encodeURIComponent(item.title)}">Email: zhao@mzwaterproof.com</a>
      </div>

      <div class="art-card">
        <h4>Factory Verification</h4>
        <ul class="art-spec-list">
          <li><span>Established</span><strong>2008</strong></li>
          <li><span>Plant Area</span><strong>68,000 m²</strong></li>
          <li><span>Membrane Output</span><strong>50M m² / yr</strong></li>
          <li><span>Coating Output</span><strong>25,000 MT / yr</strong></li>
          <li><span>Export Port</span><strong>Qingdao (200 km)</strong></li>
          <li><span>Standards</span><strong>ASTM / EN / GB</strong></li>
        </ul>
      </div>

      <div class="art-card">
        <h4>Associated Catalog SKUs</h4>
        <p>Click any model code to open its laboratory specification sheet:</p>
        <ul class="art-spec-list">
          ${(item.target_skus || [])
            .map((sku) => {
              const p = PRODUCTS.find((prod) => prod.code === sku);
              const label = p ? `${sku} (${p.categoryName.split(' ')[0]})` : sku;
              return `<li><span>Model Code</span><a href="/#${encodeURIComponent(sku)}"><strong>${escapeHtml(label)}</strong></a></li>`;
            })
            .join('\n')}
        </ul>
      </div>
    </aside>
  </main>

  <footer class="art-footer">
    <div class="art-footer-inner">
      <div>
        <strong>Weifang Mingze Waterproof Material Co., Ltd.</strong><br />
        Taitou Industrial Zone, Shouguang, Weifang City, Shandong Province, China<br />
        ISO 9001:2015 | ISO 14001:2015 | ISO 45001:2018 | CE (EN 13707 / EN 13956)
      </div>
      <div>
        Email: <a href="mailto:zhao@mzwaterproof.com">zhao@mzwaterproof.com</a> / <a href="mailto:zhao@mingzewaterproof.com">zhao@mingzewaterproof.com</a><br />
        WhatsApp: <a href="https://wa.me/8616658506707">+86 16658506707</a> | Tel: +86-400-0563-996<br />
        <a href="/">Main Catalog</a> &nbsp;·&nbsp; <a href="/articles/">All Engineering Guides</a> &nbsp;·&nbsp; <a href="/sitemap.xml">Sitemap</a> &nbsp;·&nbsp; <a href="/llms.txt">llms.txt</a> &nbsp;·&nbsp; <a href="/llms-full.txt">llms-full.txt</a>
      </div>
    </div>
  </footer>
</body>
</html>
`;
}

function renderIndexHubPage(publishedArticles) {
  const rowsHtml = publishedArticles
    .map(
      (a) => `
      <div class="hub-card">
        <div class="hub-meta">
          <span class="hub-badge">${escapeHtml(a.day || a.week || 'GUIDE')}</span>
          <span>SKUs: ${(a.target_skus || [])
            .map((sku) => `<a href="/#${encodeURIComponent(sku)}">${escapeHtml(sku)}</a>`)
            .join(', ')}</span>
          <span>Updated: ${escapeHtml(a.generated_at || '2026-11')}</span>
        </div>
        <h2><a href="/articles/${a.slug}/">${escapeHtml(a.title)}</a></h2>
        <p>${escapeHtml(a.metaDescription)}</p>
        <a class="hub-read-link" href="/articles/${a.slug}/">Read Technical Specification &amp; Loading Guide &rarr;</a>
      </div>`
    )
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Waterproofing Engineering &amp; Specification Guides | Weifang Mingze Waterproof</title>
  <meta name="description" content="Technical selection guides, ASTM/EN standard comparisons, and 20GP container loading tables for SBS/APP bitumen, HDPE, TPO, PVC, and liquid coatings by Weifang Mingze Waterproof." />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
  <link rel="canonical" href="https://mingzewaterproof.com/articles/" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Waterproofing Engineering &amp; Specification Guides | Weifang Mingze Waterproof" />
  <meta property="og:description" content="Technical selection guides, ASTM/EN standard comparisons, and 20GP container loading tables for SBS/APP bitumen, HDPE, TPO, PVC, and liquid coatings." />
  <meta property="og:url" content="https://mingzewaterproof.com/articles/" />
  <meta property="og:image" content="${OG_BANNER_URL}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Waterproofing Engineering &amp; Specification Guides | Weifang Mingze Waterproof" />
  <meta name="twitter:description" content="Technical selection guides, ASTM/EN standard comparisons, and 20GP container loading tables for SBS/APP bitumen, HDPE, TPO, PVC, and liquid coatings." />
  <meta name="twitter:image" content="${OG_BANNER_URL}" />
  <style>
    :root {
      --bg: #FFFFFF;
      --bg-soft: #FBF6F6;
      --text: #22262E;
      --text-sub: #5D6670;
      --accent: #D7000F;
      --line: #EAE2E2;
      --font: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: var(--font); color: var(--text); background: var(--bg); line-height: 1.65; }
    a { color: var(--accent); text-decoration: none; }
    a:hover { text-decoration: underline; }
    .hub-header { border-bottom: 1px solid var(--line); padding: 20px 24px; }
    .hub-header-inner { max-width: 1080px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
    .hub-hero { background: var(--bg-soft); border-bottom: 1px solid var(--line); padding: 48px 24px; }
    .hub-hero-inner { max-width: 1080px; margin: 0 auto; }
    .hub-hero h1 { font-size: 2rem; margin-bottom: 12px; }
    .hub-main { max-width: 1080px; margin: 0 auto; padding: 40px 24px 80px; display: grid; gap: 24px; }
    .hub-card { border: 1px solid var(--line); padding: 26px; background: #fff; }
    .hub-meta { display: flex; flex-wrap: wrap; gap: 12px; font-size: 12.5px; color: var(--text-sub); margin-bottom: 10px; font-family: ui-monospace, monospace; }
    .hub-badge { background: var(--accent); color: #fff; padding: 1px 8px; font-weight: 700; }
    .hub-card h2 { font-size: 1.3rem; margin-bottom: 10px; }
    .hub-card h2 a { color: var(--text); }
    .hub-card h2 a:hover { color: var(--accent); }
    .hub-card p { color: var(--text-sub); font-size: 15px; margin-bottom: 14px; }
    .hub-read-link { font-weight: 600; font-size: 14px; }
  </style>
</head>
<body>
  <header class="hub-header">
    <div class="hub-header-inner">
      <a href="/" style="font-weight:700;color:#22262E;">&larr; Back to Weifang Mingze Waterproof Main Catalog (37 SKUs)</a>
      <div>
        <a href="/llms.txt">llms.txt</a> &nbsp;·&nbsp; <a href="/llms-full.txt">llms-full.txt</a> &nbsp;·&nbsp; <a href="https://wa.me/8616658506707">WhatsApp: +86 16658506707</a>
      </div>
    </div>
  </header>
  <section class="hub-hero">
    <div class="hub-hero-inner">
      <h1>Engineering Specification &amp; Export Procurement Guides</h1>
      <p>Empirical laboratory parameters, ASTM / EN (CE) / GB compliance references, and FOB Qingdao 20GP container loading tables prepared by Weifang Mingze Waterproof CNAS-Standard QC Laboratory.</p>
    </div>
  </section>
  <main class="hub-main">
    ${rowsHtml}
  </main>
</body>
</html>
`;
}

function updateSitemap(publishedArticles) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    {
      loc: 'https://mingzewaterproof.com/',
      lastmod: today,
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      loc: 'https://mingzewaterproof.com/articles/',
      lastmod: today,
      changefreq: 'daily',
      priority: '0.9'
    },
    ...publishedArticles.map((a) => ({
      loc: `https://mingzewaterproof.com/articles/${a.slug}/`,
      lastmod: a.generated_at || today,
      changefreq: 'weekly',
      priority: '0.8'
    }))
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
  fs.writeFileSync(SITEMAP_PATH, xml, 'utf8');
}

function updateLlmsFiles(publishedArticles) {
  const guidesLines = publishedArticles.map(
    (a) =>
      `- **[${a.day || a.week || 'Guide'}] [${a.title}](https://mingzewaterproof.com/articles/${a.slug}/)** | Target SKUs: ${(a.target_skus || []).join(', ')} | Summary: ${a.metaDescription}`
  );

  const llmsTxt = `# ${COMPANY_INFO.name} (${COMPANY_INFO.legalNameZh})

> Direct industrial manufacturer and global exporter of 37 standardized waterproofing membranes, liquid coatings, butyl tapes, and geosynthetics in Taitou Industrial Zone, Weifang, Shandong, China (Established ${COMPANY_INFO.established}, ${COMPANY_INFO.facilityArea} facility, ${COMPANY_INFO.annualCapacity}, 200 km from Qingdao Port).

## Key Corporate & Export Facts
- **Manufacturer Legal Name**: ${COMPANY_INFO.name} (${COMPANY_INFO.legalNameZh})
- **Established**: ${COMPANY_INFO.established}
- **Facility Area**: ${COMPANY_INFO.facilityArea}
- **Annual Capacity**: ${COMPANY_INFO.annualCapacity}
- **Manufacturing Base**: ${COMPANY_INFO.address}
- **Export Loading Port**: ${COMPANY_INFO.port}
- **Quality & Product Certifications**: ${COMPANY_INFO.certifications.join(', ')}
- **Official Export Email**: ${COMPANY_INFO.email} (Alternate: ${COMPANY_INFO.altEmail})
- **WhatsApp / Direct Engineering Desk**: ${COMPANY_INFO.whatsapp} (${COMPANY_INFO.whatsappLink})
- **Telephone**: ${COMPANY_INFO.phone}
- **Technical Review & QA Authority**: Weifang Mingze Waterproof CNAS-Standard QC Laboratory & Chief Export Engineering Team (Last Updated: November 2026)
- **Full Technical Specification Database (37 SKUs)**: [llms-full.txt](https://mingzewaterproof.com/llms-full.txt)
- **Engineering Selection Guides Hub**: [https://mingzewaterproof.com/articles/](https://mingzewaterproof.com/articles/)

## Published Engineering Specification & Procurement Guides
${guidesLines.length > 0 ? guidesLines.join('\n') : '- [Engineering Guides Hub](https://mingzewaterproof.com/articles/)'}

## Key Membrane Comparison & 20GP Container Loading Guide
| Material System | Execution Standard | Thickness | Service Temp Range | Primary Use | 20GP Container Loading |
|---|---|---|---|---|---|
${COMPARISON_MATRIX.map(
  (r) => `| ${r.system} | ${r.standard} | ${r.thickness} | ${r.tempRange} | ${r.application} | ${r.loading20GP} |`
).join('\n')}

## 5 Core Product Categories (37 Export SKUs)
${CATEGORIES.map((c) => `- **${c.name}** (${c.count} SKUs): ${c.description}`).join('\n')}

## Complete 37-SKU Product Index
${PRODUCTS.map(
  (p) =>
    `- **[${p.code} — ${p.name}](https://mingzewaterproof.com/#${p.code})** | Category: ${p.categoryName} | Standards: ${p.standards} | Thickness: ${p.thickness} | Package: ${p.rollSize}`
).join('\n')}

## Engineering Application Systems
${SOLUTIONS.map(
  (s) =>
    `- **${s.title}** (${s.subtitle}): ${s.description} Recommended SKUs: ${s.recommendedProducts.join(', ')}`
).join('\n')}

## Frequently Asked Questions (B2B Procurement & Technical)
${EXPORT_FAQS.map((f) => `### ${f.q}\n${f.a}`).join('\n\n')}
`;

  fs.writeFileSync(LLMS_TXT_PATH, llmsTxt, 'utf8');

  const llmsFullTxt = `# ${COMPANY_INFO.name} — Complete 37-SKU Technical Data Sheet (TDS) Reference for AI & Engineering Procurement

> Authoritative machine-readable specification dossier for ${COMPANY_INFO.name} (Established ${COMPANY_INFO.established}). All product specifications align with ASTM, EN/CE, and GB standards. Reviewed by Weifang Mingze Waterproof CNAS-Standard QC Laboratory (Last Updated: November 2026). For container quotations (FOB Qingdao / CIF) and complimentary physical sample swatch boxes, contact ${COMPANY_INFO.email} or WhatsApp ${COMPANY_INFO.whatsapp}.

## 1. Company Profile & Manufacturing Capacity
- **Company**: ${COMPANY_INFO.name} (${COMPANY_INFO.legalNameZh})
- **Established**: ${COMPANY_INFO.established}
- **Factory Size**: ${COMPANY_INFO.facilityArea}
- **Annual Capacity**: ${COMPANY_INFO.annualCapacity}
- **Plant Address**: ${COMPANY_INFO.address}
- **Seaport**: ${COMPANY_INFO.port}
- **Email**: ${COMPANY_INFO.email} / ${COMPANY_INFO.altEmail}
- **WhatsApp**: ${COMPANY_INFO.whatsapp}
- **Telephone**: ${COMPANY_INFO.phone}
- **Certifications**: ${COMPANY_INFO.certifications.join(', ')}

## 2. Key Membrane Comparison & 20GP Container Loading Guide
| Material System | Execution Standard | Thickness | Service Temp Range | Primary Use | 20GP Container Loading |
|---|---|---|---|---|---|
${COMPARISON_MATRIX.map(
  (r) => `| ${r.system} | ${r.standard} | ${r.thickness} | ${r.tempRange} | ${r.application} | ${r.loading20GP} |`
).join('\n')}

## 3. Published Engineering Selection & Container Procurement Guides
${guidesLines.length > 0 ? guidesLines.join('\n') : '- [Engineering Guides Hub](https://mingzewaterproof.com/articles/)'}

## 4. Full 37-SKU Technical Specifications & Laboratory Parameters
${PRODUCTS.map((p) => {
  const featuresStr = (p.features || []).join('; ');
  const specsLines = (p.specs || []).map((s) => `  - ${s.property}: ${s.value}`).join('\n');
  return `### ${p.code}: ${p.name}
- **Direct Product URL**: https://mingzewaterproof.com/#${p.code}
- **Category**: ${p.categoryName}
- **Execution Standards**: ${p.standards}
- **Nominal Thickness / Spec**: ${p.thickness}
- **Roll / Package Dimensions**: ${p.rollSize}
- **Overview**: ${p.brief}
- **Applications**: ${p.applications}
- **Key Features**: ${featuresStr}
- **Technical Parameters**:
${specsLines}`;
}).join('\n\n')}
`;

  fs.writeFileSync(LLMS_FULL_TXT_PATH, llmsFullTxt, 'utf8');
}

function updateMainIndexHtml(publishedArticles) {
  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://mingzewaterproof.com/#organization',
        name: COMPANY_INFO.name,
        alternateName: [COMPANY_INFO.shortName, COMPANY_INFO.legalNameZh],
        url: 'https://mingzewaterproof.com/',
        logo: 'https://mingzewaterproof.com/assets/images/brand-logo-v2.png',
        image: OG_BANNER_URL,
        foundingDate: COMPANY_INFO.established,
        description:
          'Direct industrial manufacturer and global exporter of 37 standardized waterproofing membranes (SBS, APP, TPO, PVC, EPDM, Pre-applied HDPE), liquid waterproof coatings (Polyurethane, Polyurea, JS, K11), butyl sealing tapes, and geosynthetics in Shandong, China.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Taitou Industrial Zone, Shouguang',
          addressLocality: 'Weifang',
          addressRegion: 'Shandong',
          addressCountry: 'CN'
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'International Export Sales & Technical Support',
            email: COMPANY_INFO.email,
            telephone: COMPANY_INFO.whatsapp,
            availableLanguage: ['English', 'Chinese']
          },
          {
            '@type': 'ContactPoint',
            contactType: 'Corporate Customer Service',
            email: COMPANY_INFO.altEmail,
            telephone: COMPANY_INFO.phone,
            availableLanguage: ['English', 'Chinese']
          }
        ]
      },
      {
        '@type': 'WebSite',
        '@id': 'https://mingzewaterproof.com/#website',
        url: 'https://mingzewaterproof.com/',
        name: 'Mingze Waterproof | SBS, TPO & HDPE Membrane Factory',
        publisher: {
          '@id': 'https://mingzewaterproof.com/#organization'
        },
        inLanguage: 'en'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://mingzewaterproof.com/#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://mingzewaterproof.com/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Waterproofing Products (37 SKUs)',
            item: 'https://mingzewaterproof.com/#products'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Engineering Solutions',
            item: 'https://mingzewaterproof.com/#solutions'
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: 'Engineering Selection Guides',
            item: 'https://mingzewaterproof.com/articles/'
          },
          {
            '@type': 'ListItem',
            position: 5,
            name: 'Technical FAQ',
            item: 'https://mingzewaterproof.com/#faq'
          }
        ]
      },
      {
        '@type': 'ItemList',
        '@id': 'https://mingzewaterproof.com/#product-catalog',
        name: 'Mingze Waterproof Complete 37-SKU Export Product Catalog',
        numberOfItems: PRODUCTS.length,
        itemListElement: PRODUCTS.map((p, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': 'Product',
            '@id': `https://mingzewaterproof.com/#${p.code}`,
            url: `https://mingzewaterproof.com/#${p.code}`,
            sku: p.code,
            mpn: p.code,
            name: p.name,
            category: p.categoryName,
            image: `https://mingzewaterproof.com${p.image}`,
            description: `${p.brief} Execution Standards: ${p.standards}. Thickness: ${p.thickness}. Package: ${p.rollSize}. Applications: ${p.applications}`,
            brand: {
              '@type': 'Brand',
              name: COMPANY_INFO.shortName
            },
            manufacturer: {
              '@id': 'https://mingzewaterproof.com/#organization'
            },
            additionalProperty: [
              {
                '@type': 'PropertyValue',
                name: 'Execution Standards',
                value: p.standards
              },
              {
                '@type': 'PropertyValue',
                name: 'Thickness / Specification',
                value: p.thickness
              },
              {
                '@type': 'PropertyValue',
                name: 'Packaging / Roll Size',
                value: p.rollSize
              },
              {
                '@type': 'PropertyValue',
                name: 'Primary Engineering Applications',
                value: p.applications
              },
              ...(p.specs || []).map((s) => ({
                '@type': 'PropertyValue',
                name: s.property,
                value: s.value
              }))
            ]
          }
        }))
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://mingzewaterproof.com/#faq',
        mainEntity: EXPORT_FAQS.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a
          }
        }))
      }
    ]
  };

  const productCardsHtml = PRODUCTS.map((p) => {
    const specsListHtml = (p.specs || [])
      .map((s) => `<li><strong>${escapeHtml(s.property)}:</strong> ${escapeHtml(s.value)}</li>`)
      .join('');
    return `              <article id="${escapeHtml(p.code)}" class="min-card">
                <div class="min-card-img">
                  <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.code)} ${escapeHtml(p.name)} (${escapeHtml(p.standards)})" loading="lazy" width="300" height="300" />
                </div>
                <div class="min-card-meta">${escapeHtml(p.code)} · ${escapeHtml(formatCardStandard(p.standards))}</div>
                <h3 class="min-card-title"><a href="#${escapeHtml(p.code)}" style="color:inherit;text-decoration:none;">${escapeHtml(p.name)}</a></h3>
                <p class="min-card-spec">${escapeHtml(p.brief)} Standards: ${escapeHtml(p.standards)}. Thickness: ${escapeHtml(p.thickness)}. Package: ${escapeHtml(p.rollSize)}. Applications: ${escapeHtml(p.applications)}</p>
                <ul class="min-card-specs-seo" style="font-size:12px;color:#5D6670;margin:8px 0 0 16px;line-height:1.45;">
                  ${specsListHtml}
                </ul>
              </article>`;
  }).join('\n');

  const solutionsHtml = SOLUTIONS.map(
    (s) => `              <div class="min-clean-box">
                <h3>${escapeHtml(s.title)}</h3>
                <p>${escapeHtml(s.description)}</p>
              </div>`
  ).join('\n');

  const comparisonRowsHtml = COMPARISON_MATRIX.map(
    (r) => `                  <tr>
                    <td><strong>${escapeHtml(r.system)}</strong></td>
                    <td>${escapeHtml(r.standard)}</td>
                    <td>${escapeHtml(r.thickness)}</td>
                    <td>${escapeHtml(r.tempRange)}</td>
                    <td>${escapeHtml(r.application)}</td>
                    <td>${escapeHtml(r.loading20GP)}</td>
                  </tr>`
  ).join('\n');

  const guidesCardsHtml = publishedArticles
    .map(
      (g) => `              <article class="min-clean-box" style="background:#FFFFFF;border:1px solid #EAE2E2;padding:24px;">
                <div style="font-size:12px;font-weight:700;color:#D7000F;margin-bottom:6px;">
                  ${escapeHtml(g.day || g.week || 'GUIDE')} · Target SKUs: ${escapeHtml((g.target_skus || []).join(', '))}
                </div>
                <h4 style="font-size:17px;margin-bottom:8px;">
                  <a href="/articles/${escapeHtml(g.slug)}/" style="color:#22262E;text-decoration:none;">${escapeHtml(g.title)}</a>
                </h4>
                <p style="margin-bottom:12px;">${escapeHtml(g.metaDescription)}</p>
                <a href="/articles/${escapeHtml(g.slug)}/" style="font-size:13px;font-weight:600;color:#D7000F;">Read Full Technical Specification &amp; 20GP Loading Guide &rarr;</a>
              </article>`
    )
    .join('\n');

  const whyChooseHtml = WHY_CHOOSE_US.map(
    (w) => `              <div class="min-clean-box">
                <h3>${escapeHtml(w.title)}</h3>
                <p>${escapeHtml(w.desc)}</p>
              </div>`
  ).join('\n');

  const faqHtml = EXPORT_FAQS.map(
    (f) => `              <details class="min-faq-item" open>
                <summary class="min-faq-q"><h3>${escapeHtml(f.q)}</h3></summary>
                <p class="min-faq-a">${escapeHtml(f.a)}</p>
              </details>`
  ).join('\n');

  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mingze Waterproof | SBS, TPO &amp; HDPE Membrane Factory</title>
    <meta name="description" content="ISO &amp; CE certified China manufacturer of 37 waterproofing products: SBS/APP bitumen, Pre-applied HDPE, TPO/PVC membranes &amp; PU coatings. FOB Qingdao." />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <link rel="canonical" href="https://mingzewaterproof.com/" />
    <link rel="alternate" hreflang="en" href="https://mingzewaterproof.com/" />
    <link rel="alternate" hreflang="x-default" href="https://mingzewaterproof.com/" />
    <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM Summary Context" />
    <link rel="alternate" type="text/plain" href="/llms-full.txt" title="LLM Full 37-SKU Technical Specification Database" />

    <!-- Open Graph / Social Sharing -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Weifang Mingze Waterproof Material Co., Ltd." />
    <meta property="og:title" content="Mingze Waterproof | SBS, TPO &amp; HDPE Membrane Factory" />
    <meta property="og:description" content="ISO &amp; CE certified China manufacturer of 37 waterproofing products: SBS/APP bitumen, Pre-applied HDPE, TPO/PVC membranes &amp; PU coatings. FOB Qingdao." />
    <meta property="og:url" content="https://mingzewaterproof.com/" />
    <meta property="og:image" content="${OG_BANNER_URL}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Mingze Waterproof | SBS, TPO &amp; HDPE Membrane Factory" />
    <meta name="twitter:description" content="ISO &amp; CE certified China manufacturer of 37 waterproofing products: SBS/APP bitumen, Pre-applied HDPE, TPO/PVC membranes &amp; PU coatings. FOB Qingdao." />
    <meta name="twitter:image" content="${OG_BANNER_URL}" />

    <!-- Schema.org JSON-LD Structured Data (Organization + WebSite + BreadcrumbList + 37 Products ItemList with Lab Specs + FAQPage) -->
    <script type="application/ld+json">
${JSON.stringify(schemaGraph, null, 2)}
    </script>
  </head>
  <body>
    <div id="root">
      <header class="min-header">
        <div class="min-header-inner">
          <a href="https://mingzewaterproof.com/" class="min-brand">
            <img src="/assets/images/brand-logo-v2.png" alt="Mingze Waterproof 明泽防水" class="min-brand-logo" width="138" height="40" />
          </a>
          <nav class="min-nav" aria-label="Primary Navigation">
            <a href="https://mingzewaterproof.com/#products">Products</a>
            <a href="https://mingzewaterproof.com/#solutions">Solutions</a>
            <a href="/articles/">Guides</a>
            <a href="https://mingzewaterproof.com/#factory">Factory</a>
            <a href="https://mingzewaterproof.com/#faq">FAQ</a>
            <a href="https://mingzewaterproof.com/#contact">Contact</a>
          </nav>
        </div>
      </header>
      <main id="top">
        <section class="min-hero">
          <div class="min-container">
            <span class="min-tag">Direct Manufacturer · Est. 2008 · Shandong, China</span>
            <h1>Engineered Waterproofing Membranes &amp; Coatings.</h1>
            <p class="min-hero-lead">Weifang Mingze Waterproof Material Co., Ltd. manufactures and exports 37 standardized waterproofing products across SBS/APP modified bitumen, Pre-applied HDPE, TPO/PVC/EPDM single-ply membranes, polyurethane/polyurea liquid coatings, and butyl sealing tapes with ISO 9001, CE (EN 13707 / EN 13956), and ASTM compliance from our 68,000 m² facility (50,000,000+ m² annual capacity, 200 km from Qingdao Port).</p>
          </div>
        </section>
        <section id="products" class="min-section">
          <div class="min-container">
            <h2>Waterproofing Products Catalog (37 Export SKUs)</h2>
            <p>Explore our five core waterproofing product series: Modified Bitumen &amp; Shingles, Polymer &amp; HDPE Pre-Applied Membranes, Liquid Coatings &amp; Slurry, Flashing &amp; Butyl Tapes, and Geosynthetics &amp; Auxiliaries.</p>
            <div class="min-product-grid">
${productCardsHtml}
            </div>
          </div>
        </section>
        <section id="solutions" class="min-section-soft">
          <div class="min-container">
            <h2>Engineering Solutions &amp; Technical Comparison</h2>
            <div class="min-three-grid">
${solutionsHtml}
            </div>
            <div class="min-table-wrap">
              <table class="min-compare-table">
                <thead>
                  <tr>
                    <th>Material System</th>
                    <th>Execution Standard</th>
                    <th>Thickness</th>
                    <th>Service Temp Range</th>
                    <th>Primary Engineering Use</th>
                    <th>20GP Container Loading</th>
                  </tr>
                </thead>
                <tbody>
${comparisonRowsHtml}
                </tbody>
              </table>
            </div>
            <div class="min-guides-block" style="margin-top:48px;">
              <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
                <h3 style="font-size:20px;font-weight:700;">Engineering Specification &amp; Procurement Guides</h3>
                <a href="/articles/" style="font-size:14px;font-weight:600;color:#D7000F;">View All Technical Selection Guides &rarr;</a>
              </div>
              <div class="min-three-grid">
${guidesCardsHtml}
              </div>
            </div>
          </div>
        </section>
        <section id="factory" class="min-section">
          <div class="min-container">
            <h2>Why Partner With Mingze Waterproof Factory</h2>
            <div class="min-three-grid">
${whyChooseHtml}
            </div>
          </div>
        </section>
        <section id="faq" class="min-section-soft">
          <div class="min-container">
            <h2>Frequently Asked Questions (Technical &amp; Export FAQ)</h2>
            <div class="min-faq-list">
${faqHtml}
            </div>
            <div class="min-eeat-bar">
              <span><strong>Technical Verification:</strong> Compiled &amp; reviewed by Weifang Mingze Waterproof CNAS-Standard QC Laboratory &amp; Chief Export Engineering Team (ISO 9001:2015 · CE EN 13707 / EN 13956).</span>
              <span><strong>Last Updated:</strong> November 2026 · Direct Factory Dossier</span>
            </div>
          </div>
        </section>
        <section id="contact" class="min-section">
          <div class="min-container">
            <h2>Get Factory Quote &amp; Free Samples</h2>
            <p>Contact Weifang Mingze Waterproof Material Co., Ltd. Export Department directly via Email at <a href="mailto:zhao@mzwaterproof.com">zhao@mzwaterproof.com</a> (or <a href="mailto:zhao@mingzewaterproof.com">zhao@mingzewaterproof.com</a>), Tel <a href="tel:+864000563996">+86-400-0563-996</a>, or WhatsApp <a href="https://wa.me/8616658506707?text=Hello%20Mingze%20Waterproof%2C%20I%20am%20interested%20in%20your%20products.">+86 16658506707</a>. Factory Address: Taitou Industrial Zone, Shouguang, Weifang City, Shandong Province, China. Loading Port: Qingdao Port (200 km / 2.5h Highway Transit).</p>
          </div>
        </section>
      </main>
      <footer class="min-footer">
        <div class="min-container min-footer-inner">
          <div>© 2026 Weifang Mingze Waterproof Material Co., Ltd. (潍坊明泽防水材料有限公司) · Est. 2008</div>
          <div>
            Taitou Industrial Zone, Shouguang, Weifang City, Shandong Province, China · <a href="mailto:zhao@mzwaterproof.com">zhao@mzwaterproof.com</a> / <a href="mailto:zhao@mingzewaterproof.com">zhao@mingzewaterproof.com</a> · Tel: +86-400-0563-996 · <a href="/articles/">Engineering Guides</a> · <a href="/llms.txt">LLMs Index</a> · <a href="/llms-full.txt">Full 37-SKU TDS</a> · <a href="/sitemap.xml">Sitemap</a>
          </div>
        </div>
      </footer>
    </div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;

  fs.writeFileSync(INDEX_HTML_PATH, indexHtml, 'utf8');
}

function main() {
  const tracker = JSON.parse(fs.readFileSync(TRACKER_PATH, 'utf8'));
  fs.mkdirSync(ARTICLES_OUT_DIR, { recursive: true });

  const publishedArticles = [];

  for (const item of tracker.articles) {
    const candidates = [
      item.draft_file ? path.join(__dirname, item.draft_file) : null,
      item.day ? path.join(__dirname, 'seo_articles', `${item.day}-${item.slug}.md`) : null,
      item.week ? path.join(__dirname, 'seo_articles', `${item.week}-${item.slug}.md`) : null
    ].filter(Boolean);

    const mdPath = candidates.find((p) => fs.existsSync(p));
    if (!mdPath) continue;

    const rawMd = fs.readFileSync(mdPath, 'utf8');
    const meta = parseMetadataAndSchema(rawMd, item.title, item.slug);
    const bodyHtml = markdownToHtml(rawMd);

    const outDir = path.join(ARTICLES_OUT_DIR, item.slug);
    fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, 'index.html');
    const html = renderArticlePage({ item, meta, bodyHtml });
    fs.writeFileSync(outFile, html, 'utf8');

    item.html_file = `public/articles/${item.slug}/index.html`;
    publishedArticles.push({
      ...item,
      metaDescription: meta.metaDescription
    });
    console.log(`[OK] Built static HTML: public/articles/${item.slug}/index.html`);
  }

  // Write articles hub index.html
  const hubHtml = renderIndexHubPage(publishedArticles);
  fs.writeFileSync(path.join(ARTICLES_OUT_DIR, 'index.html'), hubHtml, 'utf8');
  console.log(`[OK] Built hub index: public/articles/index.html (${publishedArticles.length} article(s))`);

  // Update sitemap.xml
  updateSitemap(publishedArticles);
  console.log(`[OK] Updated public/sitemap.xml (${publishedArticles.length + 2} URLs)`);

  // Update llms.txt and llms-full.txt
  updateLlmsFiles(publishedArticles);
  console.log(`[OK] Synchronized public/llms.txt and public/llms-full.txt (37 SKUs + ${publishedArticles.length} guide(s))`);

  // Update main index.html pre-rendered DOM & JSON-LD
  updateMainIndexHtml(publishedArticles);
  console.log(`[OK] Synchronized index.html (JSON-LD 37-SKU lab specs + static DOM + OG 1200x630 banner)`);

  // Save updated html_file references back to schedule_tracker.json
  fs.writeFileSync(TRACKER_PATH, JSON.stringify(tracker, null, 2) + '\n', 'utf8');
}

main();

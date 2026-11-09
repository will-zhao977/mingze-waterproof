# Weifang Mingze Waterproof Material Co., Ltd. - Official B2B Web Platform

Official B2B export and technical product platform for **Weifang Mingze Waterproof Material Co., Ltd.** (潍坊明泽防水材料有限公司).

## Overview
- **Architecture**: Single-page application built with React 18, Vite 5, Lucide-React, and native modern architectural CSS design system.
- **Product Inventory**: Full 37 products across 5 core categories with comprehensive technical data sheets (TDS), test standards (ASTM / CE EN / GB), and application matrices.
- **Direct Trade Channels**: Integrated business emails (`zhao@mzwaterproof.com`, `zhao@mingzewaterproof.com`) and 24/7 WhatsApp export desk (`+86 16658506707`).
- **Deployment**: Hosted on Cloudflare Pages with direct CI/CD deployment from this repository.

## Project Structure
```
code/
├── index.html               # Main HTML entry with SEO metadata and Google Fonts
├── package.json             # React 18 & Vite build dependencies
├── vite.config.js           # Vite build configuration
├── src/
│   ├── main.jsx             # Interactive UI, navigation, product filters, TDS modals, and RFQ forms
│   ├── data.js              # Complete 37 products database, categories, solutions, and standards
│   └── styles.css           # Architectural B2B industrial design system
├── public/
│   └── assets/
│       └── images/
│           └── products/    # 37 independent high-definition product photographs (cat-01.jpg ~ cat-37.jpg)
└── README.md
```

## Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Production build
npm run build
```

## Cloudflare Pages Build Settings
- **Framework preset**: `Vite` / `React`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/`

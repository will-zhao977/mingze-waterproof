import React, { useState, useMemo, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import {
  COMPANY_INFO,
  CATEGORIES,
  PRODUCTS,
  SOLUTIONS,
  STANDARDS_MATRIX,
  WHY_CHOOSE_US
} from "./data";

const QA_PATHWAY_STEPS = [
  {
    code: "STAGE 01 / IQC",
    title: "Raw Bitumen & Polymer Verification",
    marker: "100% INCOMING BATCH TEST",
    desc: "Every shipment of base bitumen, SBS/APP modifiers, polyester mat, and virgin TPO/HDPE resin undergoes softening point, melt flow index, and ash content verification before entering mixing silos."
  },
  {
    code: "STAGE 02 / IPQC",
    title: "In-Line Gauge & Tensile Calibration",
    marker: "CONTINUOUS LASER MONITORING",
    desc: "Automated calendering and extrusion lines monitor membrane thickness (±0.05mm), carrier impregnation saturation, and seam peel strength every 500 linear meters."
  },
  {
    code: "STAGE 03 / OQC",
    title: "CNAS-Standard Lab & COA Release",
    marker: "LOT-STAMPED TRACEABILITY",
    desc: "Finished rolls and liquid batches are tested for -25°C low-temperature flexibility, 0.3 MPa hydrostatic impermeability, and UV aging prior to issuing batch-specific COA & TDS documents."
  }
];

const LAYER_ROLES = [
  "STRUCTURAL SUBSTRATE",
  "PRIMARY VAPOR / BASE LAYER",
  "CORE WATERPROOFING / INSULATION",
  "EXPOSED / PROTECTION FINISH"
];

const HERO_SPECIMENS = [
  {
    id: "hdpe",
    code: "PLATE 00-A / PRE-APPLIED HDPE",
    title: "Pre-Applied HDPE Blindside Membrane (MZ-CAT-11)",
    standard: "ASTM D5385 · GB/T 23457",
    image: "/assets/images/product-hdpe.jpg",
    specLeft: "1.2mm / 1.5mm / 2.0mm Virgin HDPE",
    specRight: "70m Hydrostatic Head Resistance"
  },
  {
    id: "bitumen",
    code: "PLATE 00-B / SBS & APP BITUMEN",
    title: "SBS / APP Torch-Applied Bitumen Roll (MZ-CAT-01)",
    standard: "EN 13707 · ASTM D6164",
    image: "/assets/images/product-bitumen.jpg",
    specLeft: "3.0mm / 4.0mm / 5.0mm PY Reinforced",
    specRight: "-25°C Arctic to +130°C Tropical Grade"
  },
  {
    id: "polymer",
    code: "PLATE 00-C / TPO & PVC SINGLE-PLY",
    title: "TPO / PVC Exposed Roofing Sheet (MZ-CAT-08)",
    standard: "ASTM D6878 · EN 13956",
    image: "/assets/images/product-polymer.jpg",
    specLeft: "1.2mm / 1.5mm / 2.0mm Weldable Sheet",
    specRight: "High SRI Solar Reflective Cool Roof"
  },
  {
    id: "coating",
    code: "PLATE 00-D / LIQUID POLYURETHANE",
    title: "Elastomeric PU & Polyurea Coating (MZ-CAT-17)",
    standard: "ASTM C836 · GB/T 19250",
    image: "/assets/images/product-coating.jpg",
    specLeft: "≥ 450% Elongation · Seamless Film",
    specRight: "20kg / 25kg Steel & HDPE Pails"
  }
];

function App() {
  // Hero specimen switcher
  const [heroSpecimenIdx, setHeroSpecimenIdx] = useState(0);

  // Catalogue filter & view states
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("ledger"); // 'ledger' | 'packshot'

  // Mobile navigation disclosure
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals: TDS Dossier Modal & Sample Swatch Box Modal
  const [selectedTdsProduct, setSelectedTdsProduct] = useState(null);
  const [sampleModalOpen, setSampleModalOpen] = useState(false);

  // Copy feedback state
  const [copiedKey, setCopiedKey] = useState(null);

  // RFQ Form state & validation
  const [rfqForm, setRfqForm] = useState({
    company: "",
    email: "",
    country: "",
    projectType: "Commercial / Industrial Roofing",
    productInterest: "",
    quantity: "",
    port: "",
    requestSampleBox: true,
    notes: ""
  });
  const [rfqTouched, setRfqTouched] = useState({});
  const [rfqErrors, setRfqErrors] = useState({});
  const [rfqSubmitted, setRfqSubmitted] = useState(false);

  // Sample Box Modal Form state
  const [sampleForm, setSampleForm] = useState({
    company: "",
    contactName: "",
    email: "",
    country: "",
    courierNote: "",
    selectedSystems: ["bitumen-shingles", "polymer-hdpe"]
  });
  const [sampleSubmitted, setSampleSubmitted] = useState(false);

  // Escape key closes active modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (selectedTdsProduct) setSelectedTdsProduct(null);
        if (sampleModalOpen) setSampleModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTdsProduct, sampleModalOpen]);

  // Filtered 37-SKU products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchesCat =
        activeCategory === "all" || item.categoryId === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesCat;
      const matchesQuery =
        item.code.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.standards.toLowerCase().includes(q) ||
        item.applications.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  // Select category from 01 / Material Systems and jump to 02 / Catalogue
  const handleSelectSystem = (categoryId) => {
    setActiveCategory(categoryId);
    const el = document.getElementById("catalogue");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Prefill RFQ form with a specific SKU and jump to 06 / Trade Desk
  const handleInquireProduct = (product) => {
    setSelectedTdsProduct(null);
    setRfqForm((prev) => ({
      ...prev,
      productInterest: `${product.code} — ${product.name} (${product.thickness})`
    }));
    setRfqSubmitted(false);
    const el = document.getElementById("trade-desk");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Copy contact string helper
  const handleCopyText = (key, value) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).catch(() => {});
    }
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 2200);
  };

  // Validate RFQ fields
  const validateRfq = (values) => {
    const errs = {};
    if (!values.company.trim()) {
      errs.company = "REQUIRED: Enter company or contractor name.";
    }
    if (!values.email.trim()) {
      errs.email = "REQUIRED: Enter official business email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      errs.email = "INVALID FORMAT: Provide a valid email (e.g. name@company.com).";
    }
    if (!values.country.trim()) {
      errs.country = "REQUIRED: Specify destination country or region.";
    }
    if (!values.quantity.trim()) {
      errs.quantity = "REQUIRED: Enter estimated area (m²), rolls, or containers.";
    }
    return errs;
  };

  const handleRfqChange = (field, value) => {
    const next = { ...rfqForm, [field]: value };
    setRfqForm(next);
    if (rfqTouched[field]) {
      setRfqErrors(validateRfq(next));
    }
  };

  const handleRfqBlur = (field) => {
    const nextTouched = { ...rfqTouched, [field]: true };
    setRfqTouched(nextTouched);
    setRfqErrors(validateRfq(rfqForm));
  };

  const handleRfqSubmit = (e) => {
    e.preventDefault();
    const allTouched = {
      company: true,
      email: true,
      country: true,
      quantity: true
    };
    setRfqTouched(allTouched);
    const errs = validateRfq(rfqForm);
    setRfqErrors(errs);
    if (Object.keys(errs).length === 0) {
      setRfqSubmitted(true);
    }
  };

  // Toggle system in Sample Swatch Modal
  const toggleSampleSystem = (catId) => {
    setSampleForm((prev) => {
      const exists = prev.selectedSystems.includes(catId);
      const next = exists
        ? prev.selectedSystems.filter((id) => id !== catId)
        : [...prev.selectedSystems, catId];
      return { ...prev, selectedSystems: next };
    });
  };

  const handleSampleSubmit = (e) => {
    e.preventDefault();
    if (!sampleForm.company.trim() || !sampleForm.email.trim()) return;
    setSampleSubmitted(true);
  };

  return (
    <div className="dossier-shell">
      {/* ====================================================================
          TOP UTILITY STRIP (Dark Engineering Context Band)
          ==================================================================== */}
      <div className="utility-strip" data-component="utility-strip">
        <div className="utility-strip-inner">
          <div className="utility-cluster">
            <span className="utility-item">
              <strong>DOSSIER REF:</strong> MZ-EXP-2026 / REV.04
            </span>
            <span className="utility-item">
              <strong>STANDARDS:</strong> ISO9001 · CE EN 13707 / EN 13956 · ASTM
            </span>
            <span className="utility-item">
              <strong>PORT DISPATCH:</strong> QINGDAO PORT (200 KM)
            </span>
          </div>
          <div className="utility-cluster">
            <span className="utility-item">
              <strong>EXPORT DESK:</strong>{" "}
              <a className="utility-link" href={`mailto:${COMPANY_INFO.email}`}>
                {COMPANY_INFO.email}
              </a>
            </span>
            <span className="utility-item">
              <strong>WHATSAPP:</strong>{" "}
              <a
                className="utility-link"
                href={COMPANY_INFO.whatsappLink}
                target="_blank"
                rel="noreferrer"
              >
                {COMPANY_INFO.whatsapp}
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          STICKY ARCHITECTURAL HEADER (68px)
          ==================================================================== */}
      <header className="site-header" data-component="site-header">
        <div className="header-inner">
          <a href="#top" className="brand-lockup">
            <span className="brand-monogram" aria-hidden="true">
              MZ
            </span>
            <span className="brand-wordmark">
              <span className="brand-wordmark-main">MINGZE WATERPROOF</span>
              <span className="brand-wordmark-sub">
                SHANDONG MANUFACTURING BASE · EST. 2008
              </span>
            </span>
          </a>

          <nav className="header-nav" aria-label="Primary Engineering Dossier Navigation">
            <a href="#systems" className="header-anchor">
              01 / SYSTEMS
            </a>
            <a href="#catalogue" className="header-anchor">
              02 / 37-SKU CATALOGUE
            </a>
            <a href="#assemblies" className="header-anchor">
              03 / ASSEMBLIES
            </a>
            <a href="#standards" className="header-anchor">
              04 / QA &amp; STANDARDS
            </a>
            <a href="#factory" className="header-anchor">
              05 / FACTORY
            </a>
            <a href="#trade-desk" className="header-anchor">
              06 / TRADE DESK
            </a>
          </nav>

          <div className="header-cta-wrap">
            <button
              type="button"
              className="arch-btn arch-btn-secondary arch-btn-compact"
              onClick={() => {
                setSampleSubmitted(false);
                setSampleModalOpen(true);
              }}
            >
              SAMPLE BOX
            </button>
            <a href="#trade-desk" className="arch-btn arch-btn-primary arch-btn-compact">
              REQUEST FOB QUOTE
            </a>
            <button
              type="button"
              className="mobile-menu-toggle"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation drawer"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <span className="tech-label" style={{ color: "inherit" }}>
                {mobileMenuOpen ? "CLOSE" : "MENU"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer" data-component="mobile-drawer">
          <div className="mobile-drawer-links">
            <a
              href="#systems"
              className="header-anchor"
              onClick={() => setMobileMenuOpen(false)}
            >
              01 / MATERIAL SYSTEMS (05 SERIES)
            </a>
            <a
              href="#catalogue"
              className="header-anchor"
              onClick={() => setMobileMenuOpen(false)}
            >
              02 / 37-SKU TECHNICAL CATALOGUE
            </a>
            <a
              href="#assemblies"
              className="header-anchor"
              onClick={() => setMobileMenuOpen(false)}
            >
              03 / ENGINEERING ASSEMBLIES
            </a>
            <a
              href="#standards"
              className="header-anchor"
              onClick={() => setMobileMenuOpen(false)}
            >
              04 / QA PATHWAY &amp; STANDARDS
            </a>
            <a
              href="#factory"
              className="header-anchor"
              onClick={() => setMobileMenuOpen(false)}
            >
              05 / FACTORY BASE (68,000 M²)
            </a>
            <a
              href="#trade-desk"
              className="header-anchor"
              onClick={() => setMobileMenuOpen(false)}
            >
              06 / DIRECT TRADE DESK &amp; RFQ
            </a>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <a
              href="#trade-desk"
              className="arch-btn arch-btn-primary arch-btn-compact"
              onClick={() => setMobileMenuOpen(false)}
            >
              REQUEST FOB QUOTE
            </a>
            <button
              type="button"
              className="arch-btn arch-btn-secondary arch-btn-compact"
              onClick={() => {
                setMobileMenuOpen(false);
                setSampleSubmitted(false);
                setSampleModalOpen(true);
              }}
            >
              REQUEST SAMPLE SWATCH BOX
            </button>
          </div>
        </div>
      )}

      <main id="top">
        {/* ==================================================================
            ASYMMETRIC 7 / 5 PROOF-LED HERO PLATE
            ================================================================== */}
        <section className="plate-warm hero-plate" data-component="hero-section">
          <div className="arch-container">
            <div className="hero-asymmetric-grid">
              {/* Left 7 Columns: Dominant Statement & Primary Actions */}
              <div className="hero-left-field">
                <div>
                  <div className="hero-eyebrow-row">
                    <span className="hero-locator-tag">
                      FOB QINGDAO · DIRECT MANUFACTURER
                    </span>
                    <span className="tech-label">
                      WEIFANG MINGZE WATERPROOF MATERIAL CO., LTD.
                    </span>
                  </div>
                  <h1>
                    ARCHITECTURAL WATERPROOFING MEMBRANES &amp; LIQUID SYSTEMS FOR GLOBAL INFRASTRUCTURE.
                  </h1>
                  <p className="hero-deck">
                    Engineered in Taitou Industrial Zone, China’s waterproof manufacturing hub. We manufacture and export 37 standardized SKUs across SBS/APP modified bitumen, TPO/PVC/HDPE single-ply sheets, and elastomeric coatings with full ASTM, EN/CE, and GB batch compliance.
                  </p>
                </div>

                <div className="hero-action-cluster">
                  <a href="#trade-desk" className="arch-btn arch-btn-primary">
                    REQUEST FOB / CIF CONTAINER QUOTE
                  </a>
                  <a href="#catalogue" className="arch-btn arch-btn-secondary">
                    INSPECT 37-SKU TECHNICAL LEDGER
                  </a>
                  <button
                    type="button"
                    className="arch-btn arch-btn-secondary"
                    onClick={() => {
                      setSampleSubmitted(false);
                      setSampleModalOpen(true);
                    }}
                  >
                    ORDER FREE SAMPLE BOX
                  </button>
                </div>
              </div>

              {/* Right 5 Columns: Architectural Showcase Frame */}
              <div className="hero-right-field">
                <div className="showcase-frame">
                  <div className="showcase-frame-bar">
                    <span className="tech-label">
                      {HERO_SPECIMENS[heroSpecimenIdx].code}
                    </span>
                    <span className="tech-label tech-label-cobalt">
                      {HERO_SPECIMENS[heroSpecimenIdx].standard}
                    </span>
                  </div>
                  <div
                    className="showcase-media-box"
                    style={{ backgroundColor: "#FFFFFF", padding: "12px" }}
                  >
                    <img
                      src={HERO_SPECIMENS[heroSpecimenIdx].image}
                      alt={HERO_SPECIMENS[heroSpecimenIdx].title}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      borderBottom: "1px solid var(--color-border)",
                      backgroundColor: "var(--color-surface-warm)"
                    }}
                  >
                    {HERO_SPECIMENS.map((spec, idx) => (
                      <button
                        key={spec.id}
                        type="button"
                        onClick={() => setHeroSpecimenIdx(idx)}
                        style={{
                          minHeight: "44px",
                          border: "none",
                          borderRight:
                            idx < 3 ? "1px solid var(--color-border)" : "none",
                          borderBottom:
                            heroSpecimenIdx === idx
                              ? "3px solid var(--color-tertiary)"
                              : "3px solid transparent",
                          backgroundColor:
                            heroSpecimenIdx === idx
                              ? "var(--color-surface)"
                              : "transparent",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.68rem",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          cursor: "pointer",
                          color: "var(--color-primary)"
                        }}
                      >
                        0{idx + 1} / {spec.id}
                      </button>
                    ))}
                  </div>
                  <div className="showcase-caption-grid">
                    <div className="showcase-spec-cell">
                      <span className="tech-label">SPECIMEN SPECIFICATION</span>
                      <strong>{HERO_SPECIMENS[heroSpecimenIdx].title}</strong>
                      <span>{HERO_SPECIMENS[heroSpecimenIdx].specLeft}</span>
                    </div>
                    <div className="showcase-spec-cell">
                      <span className="tech-label">ENGINEERING PERFORMANCE</span>
                      <strong>{HERO_SPECIMENS[heroSpecimenIdx].specRight}</strong>
                      <span>20GP / 40HQ Palletized Export Loading</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4-Cell Ruled Proof Metric Strip */}
          <div className="hero-metrics-strip">
            <div className="arch-container">
              <div className="hero-metrics-grid">
                <div className="hero-metric-cell">
                  <span className="tech-label">01 / ESTABLISHED TRACK RECORD</span>
                  <div className="metric-value">2008 / 18+ YRS</div>
                  <p className="metric-qualifier">
                    Dedicated industrial waterproofing synthesis &amp; global container export.
                  </p>
                </div>
                <div className="hero-metric-cell">
                  <span className="tech-label">02 / FACILITY FOOTPRINT</span>
                  <div className="metric-value">68,000 m²</div>
                  <p className="metric-qualifier">
                    Automated bitumen, polymer extrusion &amp; chemical reaction plant in Shandong.
                  </p>
                </div>
                <div className="hero-metric-cell">
                  <span className="tech-label">03 / ANNUAL OUTPUT CAPACITY</span>
                  <div className="metric-value">50M+ m² / YR</div>
                  <p className="metric-qualifier">
                    50,000,000 m² waterproof membranes + 25,000 metric tons liquid coatings.
                  </p>
                </div>
                <div className="hero-metric-cell">
                  <span className="tech-label">04 / MARITIME LOGISTICS</span>
                  <div className="metric-value">200 km PORT</div>
                  <p className="metric-qualifier">
                    2.5-hour highway transit to Qingdao Port for rapid global shipping.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            01 / MATERIAL SYSTEMS (Numbered 01–05 Architectural Index)
            ================================================================== */}
        <section
          id="systems"
          className="plate-paper section-pad"
          data-component="material-systems-section"
        >
          <div className="arch-container">
            <div className="plate-header-grid">
              <div className="plate-index-col">
                <span className="tech-label tech-label-cobalt">SECTION 01</span>
                <span className="plate-index-num">01 / 05</span>
                <span className="tech-label">MATERIAL SYSTEMS</span>
              </div>
              <div className="plate-title-col">
                <h2>FIVE CORE WATERPROOFING PRODUCT FAMILIES</h2>
                <p className="plate-deck">
                  Our manufacturing program is organized into five engineered material families covering subterranean foundations, exposed industrial roofs, civil tunnels, and structural joint sealing. Select any system to filter the 37-SKU technical ledger below.
                </p>
              </div>
            </div>

            <div className="systems-ledger">
              {CATEGORIES.map((cat, idx) => {
                const isSelected = activeCategory === cat.id;
                const indexStr = String(idx + 1).padStart(2, "0");
                return (
                  <div
                    key={cat.id}
                    className={`system-ledger-row ${isSelected ? "active-system" : ""}`}
                  >
                    <div className="system-num-cell">{indexStr}</div>
                    <div className="system-name-cell">
                      <span className="tech-label">
                        SYSTEM FAMILY {indexStr} · {cat.count} SKUS
                      </span>
                      <h3>{cat.name}</h3>
                    </div>
                    <div className="system-desc-cell">{cat.description}</div>
                    <div className="system-thumb-cell">
                      <img src={cat.image} alt={cat.name} loading="lazy" />
                    </div>
                    <div className="system-action-cell">
                      <button
                        type="button"
                        className={`arch-btn arch-btn-compact ${
                          isSelected ? "arch-btn-primary" : "arch-btn-secondary"
                        }`}
                        onClick={() => handleSelectSystem(cat.id)}
                      >
                        {isSelected ? "ACTIVE FILTER" : `FILTER ${cat.count} SKUS →`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================================================================
            02 / 37-SKU TECHNICAL CATALOGUE (Ledger Table + Packshot Spec Grid)
            ================================================================== */}
        <section
          id="catalogue"
          className="plate-warm section-pad"
          data-component="technical-catalogue-section"
        >
          <div className="arch-container">
            <div className="plate-header-grid">
              <div className="plate-index-col">
                <span className="tech-label tech-label-cobalt">SECTION 02</span>
                <span className="plate-index-num">37 SKUS</span>
                <span className="tech-label">TECHNICAL LEDGER</span>
              </div>
              <div className="plate-title-col">
                <h2>COMPLETE 37-SKU EXPORT SPECIFICATION CATALOGUE</h2>
                <p className="plate-deck">
                  100% aligned with Mingze Waterproof official technical submittals. Every product record includes verified execution standards, nominal thickness/packaging, studio product photography, and downloadable Technical Data Sheet (TDS) parameters.
                </p>
              </div>
            </div>

            {/* Catalogue Search, View Switcher & Segmented Category Filters */}
            <div className="catalogue-controls-plate">
              <div className="catalogue-top-bar">
                <div className="search-field-group">
                  <label htmlFor="sku-search-input" className="tech-label">
                    SEARCH BY SKU CODE, MATERIAL NAME, STANDARD (ASTM / EN / GB) OR USE CASE
                  </label>
                  <div className="search-input-wrap">
                    <input
                      id="sku-search-input"
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g. MZ-CAT-01, TPO, ASTM D6878, HDPE, Polyurea..."
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        className="search-clear-btn"
                        onClick={() => setSearchQuery("")}
                      >
                        CLEAR
                      </button>
                    )}
                  </div>
                </div>

                <div className="view-mode-group" role="group" aria-label="Catalogue display mode">
                  <button
                    type="button"
                    className={`filter-segment-btn ${
                      viewMode === "ledger" ? "active" : ""
                    }`}
                    onClick={() => setViewMode("ledger")}
                  >
                    TECHNICAL LEDGER VIEW
                  </button>
                  <button
                    type="button"
                    className={`filter-segment-btn ${
                      viewMode === "packshot" ? "active" : ""
                    }`}
                    onClick={() => setViewMode("packshot")}
                  >
                    PACKSHOT SPEC GRID
                  </button>
                </div>
              </div>

              <div
                className="filter-segmented-row"
                role="tablist"
                aria-label="Filter products by material system"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === "all"}
                  className={`filter-segment-btn ${
                    activeCategory === "all" ? "active" : ""
                  }`}
                  onClick={() => setActiveCategory("all")}
                >
                  ALL SYSTEMS ({PRODUCTS.length})
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={activeCategory === cat.id}
                    className={`filter-segment-btn ${
                      activeCategory === cat.id ? "active" : ""
                    }`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    {cat.shortName} ({cat.count})
                  </button>
                ))}
              </div>
            </div>

            <div className="catalogue-status-bar">
              <span>
                DISPLAYING <strong>{filteredProducts.length}</strong> OF{" "}
                <strong>{PRODUCTS.length}</strong> CERTIFIED EXPORT SKUS
                {activeCategory !== "all" ? ` · FILTER: ${activeCategory.toUpperCase()}` : ""}
                {searchQuery ? ` · QUERY: "${searchQuery}"` : ""}
              </span>
              <span>UNIT SYSTEM: METRIC (MM / M / KG) · FOB QINGDAO</span>
            </div>

            {/* Empty Filter State */}
            {filteredProducts.length === 0 ? (
              <div className="empty-ledger-box">
                <p className="tech-label tech-label-signal" style={{ marginBottom: "8px" }}>
                  NO MATCHING SPECIFICATION RECORDS
                </p>
                <h3 style={{ marginBottom: "12px", color: "var(--color-primary)" }}>
                  No SKU matched "{searchQuery}" under the selected category filter.
                </h3>
                <button
                  type="button"
                  className="arch-btn arch-btn-secondary arch-btn-compact"
                  onClick={() => {
                    setActiveCategory("all");
                    setSearchQuery("");
                  }}
                >
                  RESET ALL CATALOGUE FILTERS
                </button>
              </div>
            ) : viewMode === "ledger" ? (
              /* MODE A: DENSE TECHNICAL LEDGER TABLE */
              <div className="ledger-table-wrap">
                <div className="ledger-head-row" aria-hidden="true">
                  <div>SKU CODE</div>
                  <div>MATERIAL SPECIFICATION &amp; PHOTO</div>
                  <div>EXECUTION STANDARDS</div>
                  <div>DIMENSIONS / PACKAGING</div>
                  <div style={{ textAlign: "right" }}>TECHNICAL ACTIONS</div>
                </div>

                {filteredProducts.map((product) => (
                  <div key={product.id} className="ledger-item-row">
                    <div className="ledger-sku-cell">
                      <span className="sku-code-mono">{product.code}</span>
                      <span className="sku-cat-tag">{product.categoryName}</span>
                    </div>

                    <div className="ledger-product-cell">
                      <div className="ledger-mini-thumb">
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                        />
                      </div>
                      <div className="ledger-product-info">
                        <h3>{product.name}</h3>
                        <p>{product.brief}</p>
                      </div>
                    </div>

                    <div className="ledger-std-cell">
                      <span className="ledger-cell-mobile-label">
                        EXECUTION STANDARDS
                      </span>
                      {product.standards}
                    </div>

                    <div className="ledger-dim-cell">
                      <span className="ledger-cell-mobile-label">
                        THICKNESS &amp; PACKAGING
                      </span>
                      <div>
                        <strong>THK:</strong> {product.thickness}
                      </div>
                      <div>
                        <strong>PKG:</strong> {product.rollSize}
                      </div>
                    </div>

                    <div className="ledger-actions-cell">
                      <button
                        type="button"
                        className="arch-btn arch-btn-secondary arch-btn-compact"
                        onClick={() => setSelectedTdsProduct(product)}
                      >
                        OPEN TDS
                      </button>
                      <button
                        type="button"
                        className="arch-btn arch-btn-primary arch-btn-compact"
                        onClick={() => handleInquireProduct(product)}
                      >
                        INQUIRE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* MODE B: STUDIO PACKSHOT SPECIFICATION GRID */
              <div className="spec-packshot-grid">
                {filteredProducts.map((product) => (
                  <article key={product.id} className="spec-sheet-item">
                    <div className="spec-sheet-top">
                      <span className="sku-code-mono">{product.code}</span>
                      <span className="tech-label">{product.categoryName}</span>
                    </div>
                    <div className="spec-sheet-media">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                      />
                    </div>
                    <div className="spec-sheet-body">
                      <h3>{product.name}</h3>
                      <p>{product.brief}</p>
                      <dl className="spec-sheet-dl">
                        <div className="spec-sheet-dl-row">
                          <dt>STANDARD</dt>
                          <dd>{product.standards}</dd>
                        </div>
                        <div className="spec-sheet-dl-row">
                          <dt>THICKNESS</dt>
                          <dd>{product.thickness}</dd>
                        </div>
                        <div className="spec-sheet-dl-row">
                          <dt>PACKAGING</dt>
                          <dd>{product.rollSize}</dd>
                        </div>
                      </dl>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          className="arch-btn arch-btn-secondary arch-btn-compact"
                          style={{ flex: 1 }}
                          onClick={() => setSelectedTdsProduct(product)}
                        >
                          OPEN TDS
                        </button>
                        <button
                          type="button"
                          className="arch-btn arch-btn-primary arch-btn-compact"
                          style={{ flex: 1 }}
                          onClick={() => handleInquireProduct(product)}
                        >
                          INQUIRE
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ==================================================================
            03 / ENGINEERING ASSEMBLIES (Dark Plate Cross-Section Drawings)
            ================================================================== */}
        <section
          id="assemblies"
          className="plate-dark section-pad"
          data-component="engineering-assemblies-section"
        >
          <div className="arch-container">
            <div className="plate-header-grid">
              <div className="plate-index-col">
                <span className="tech-label tech-label-dark">SECTION 03</span>
                <span className="plate-index-num">04 DETAILS</span>
                <span className="tech-label tech-label-dark">BUILD-UP ASSEMBLIES</span>
              </div>
              <div className="plate-title-col">
                <h2>ARCHITECTURAL BUILD-UP &amp; LAYER ASSEMBLIES</h2>
                <p className="plate-deck">
                  Standardized multi-layer waterproofing cross-sections for commercial flat roofs, blindside underground foundations, exposed metal roof refurbishment, and civil tunnels. Click any recommended SKU badge to inspect its full Technical Data Sheet.
                </p>
              </div>
            </div>

            <div className="assemblies-grid">
              {SOLUTIONS.map((sol, sIdx) => (
                <article key={sol.id} className="assembly-plate">
                  <div>
                    <div className="assembly-plate-header">
                      <span className="tech-label tech-label-dark">
                        DRAWING DETAIL 03-{sIdx + 1} · {sol.subtitle}
                      </span>
                      <h3>{sol.title}</h3>
                      <p>{sol.description}</p>
                    </div>

                    {/* Architectural Layer Cross-Section Schematic */}
                    <div className="assembly-drawing-box">
                      <div className="drawing-datum-label">
                        <span>CROSS-SECTION LAYER STACK (TOP TO SUBSTRATE)</span>
                        <span>DATUM: 1:5 SCALE</span>
                      </div>
                      <div className="drawing-stack">
                        {[...sol.systemLayers].reverse().map((layerName, lIdx) => {
                          const layerNum = sol.systemLayers.length - lIdx;
                          const toneClass = `band-tone-${(lIdx % 4) + 1}`;
                          return (
                            <div
                              key={layerName}
                              className={`drawing-layer-band ${toneClass}`}
                            >
                              <span className="layer-coord">L0{layerNum}</span>
                              <span className="layer-name">{layerName}</span>
                              <span className="layer-role-tag">
                                {LAYER_ROLES[layerNum - 1] || "SYSTEM LAYER"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="assembly-plate-footer">
                    <div>
                      <span
                        className="tech-label tech-label-dark"
                        style={{ display: "block", marginBottom: "6px" }}
                      >
                        SPECIFIED MINGZE SKUS (CLICK FOR TDS):
                      </span>
                      <div className="assembly-sku-list">
                        {sol.recommendedProducts.map((code) => {
                          const prod = PRODUCTS.find((p) => p.code === code);
                          return (
                            <button
                              key={code}
                              type="button"
                              className="assembly-sku-code"
                              style={{ cursor: "pointer" }}
                              onClick={() => prod && setSelectedTdsProduct(prod)}
                              title={prod ? prod.name : code}
                            >
                              {code}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <a
                      href="#trade-desk"
                      className="arch-btn arch-btn-outline-dark arch-btn-compact"
                      onClick={() => {
                        setRfqForm((prev) => ({
                          ...prev,
                          projectType: sol.title,
                          productInterest: `System Assembly: ${sol.title} (${sol.recommendedProducts.join(", ")})`
                        }));
                      }}
                    >
                      QUOTE THIS SYSTEM →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================================
            04 / QA PATHWAY & INTERNATIONAL STANDARDS MATRIX
            ================================================================== */}
        <section
          id="standards"
          className="plate-paper section-pad"
          data-component="qa-standards-section"
        >
          <div className="arch-container">
            <div className="plate-header-grid">
              <div className="plate-index-col">
                <span className="tech-label tech-label-cobalt">SECTION 04</span>
                <span className="plate-index-num">QA / LAB</span>
                <span className="tech-label">COMPLIANCE MATRIX</span>
              </div>
              <div className="plate-title-col">
                <h2>3-STAGE LABORATORY QA PATHWAY &amp; INTERNATIONAL STANDARDS</h2>
                <p className="plate-deck">
                  Every container shipped from our Weifang facility is backed by full batch traceability. Our in-house testing center executes rigorous physical and chemical testing in accordance with ASTM International, European CE (EN), and Chinese GB standards.
                </p>
              </div>
            </div>

            {/* 3-Step Horizontal Laboratory QA Pathway */}
            <div className="qa-pathway-grid">
              {QA_PATHWAY_STEPS.map((step) => (
                <div key={step.code} className="qa-stage-cell">
                  <div className="qa-stage-top">
                    <span className="tech-label">{step.code}</span>
                    <span className="tech-label tech-label-signal">{step.marker}</span>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              ))}
            </div>

            {/* ASTM / EN / GB Compliance Ledger Matrix */}
            <div className="standards-ledger-table">
              {STANDARDS_MATRIX.map((group) => (
                <div key={group.organization} className="standards-group-block">
                  <div className="standards-group-bar">
                    <h3>{group.organization}</h3>
                    <span className="tech-label">
                      {group.standards.length} VERIFIED TEST PROTOCOLS
                    </span>
                  </div>
                  <div className="standards-rows-list">
                    {group.standards.map((std) => (
                      <div key={std.code} className="standard-record-cell">
                        <div className="standard-record-code">{std.code}</div>
                        <div className="standard-record-title">{std.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================================
            05 / FACTORY BASE & PRODUCTION CAPABILITY PLATE
            ================================================================== */}
        <section
          id="factory"
          className="plate-warm section-pad"
          data-component="factory-capability-section"
        >
          <div className="arch-container">
            <div className="plate-header-grid">
              <div className="plate-index-col">
                <span className="tech-label tech-label-cobalt">SECTION 05</span>
                <span className="plate-index-num">68,000 m²</span>
                <span className="tech-label">MANUFACTURING BASE</span>
              </div>
              <div className="plate-title-col">
                <h2>SHANDONG INDUSTRIAL MANUFACTURING &amp; OEM EXPORT BASE</h2>
                <p className="plate-deck">
                  Headquartered in Taitou Industrial Zone, Shouguang, Weifang City — China’s primary waterproof material manufacturing cluster. We eliminate trading intermediaries by delivering factory-direct container loads with full OEM private-label support.
                </p>
              </div>
            </div>

            <div className="factory-capability-grid">
              {WHY_CHOOSE_US.map((item, idx) => (
                <div key={item.title} className="capability-block">
                  <div className="capability-num">0{idx + 1}</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Dark Specification Rail */}
            <div className="factory-spec-rail">
              <div className="spec-rail-item">
                <span className="tech-label tech-label-dark">PLANT LOCATION</span>
                <strong>Taitou Industrial Zone, Weifang, China</strong>
              </div>
              <div className="spec-rail-item">
                <span className="tech-label tech-label-dark">EXPORT LOADING PORT</span>
                <strong>Qingdao Port (200 km / 2.5h Transit)</strong>
              </div>
              <div className="spec-rail-item">
                <span className="tech-label tech-label-dark">CERTIFICATIONS</span>
                <strong>ISO9001 · ISO14001 · CE EN 13707/13956</strong>
              </div>
              <div className="spec-rail-item">
                <span className="tech-label tech-label-dark">TRADE TERMS &amp; OEM</span>
                <strong>FOB / CIF / CFR · Custom Private Label</strong>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            06 / DIRECT TRADE DESK & RFQ CONVERSION SUITE
            ================================================================== */}
        <section
          id="trade-desk"
          className="plate-paper section-pad"
          data-component="direct-trade-desk-section"
        >
          <div className="arch-container">
            <div className="plate-header-grid">
              <div className="plate-index-col">
                <span className="tech-label tech-label-cobalt">SECTION 06</span>
                <span className="plate-index-num">RFQ DESK</span>
                <span className="tech-label">DIRECT EXPORT CONTACT</span>
              </div>
              <div className="plate-title-col">
                <h2>DIRECT FACTORY TRADE DESK &amp; PROJECT RFQ SUBMITTAL</h2>
                <p className="plate-deck">
                  Connect directly with our international export engineering team for container pricing (20GP / 40HQ), custom project submittals (TDS, MSDS, COA), and complimentary physical sample swatch boxes.
                </p>
              </div>
            </div>

            <div className="trade-desk-grid">
              {/* Left 5 Columns: Official Verified Contact Ledger & Sample Promise */}
              <div className="trade-channels-panel">
                <span className="tech-label tech-label-cobalt">
                  OFFICIAL VERIFIED EXPORT CHANNELS
                </span>
                <h3
                  style={{
                    fontSize: "var(--text-headline-sm)",
                    color: "var(--color-primary)",
                    margin: "8px 0 16px"
                  }}
                >
                  Weifang Mingze Waterproof Export Department
                </h3>

                <div className="contact-ledger-row">
                  <span className="tech-label">PRIMARY EXPORT EMAIL (24H RESPONSE)</span>
                  <a
                    href={`mailto:${COMPANY_INFO.email}`}
                    className="contact-value-link"
                  >
                    {COMPANY_INFO.email}
                  </a>
                  <div style={{ marginTop: "8px" }}>
                    <button
                      type="button"
                      className="arch-btn arch-btn-secondary arch-btn-compact"
                      onClick={() => handleCopyText("email1", COMPANY_INFO.email)}
                    >
                      {copiedKey === "email1" ? "COPIED TO CLIPBOARD ✓" : "COPY EMAIL"}
                    </button>
                  </div>
                </div>

                <div className="contact-ledger-row">
                  <span className="tech-label">ALTERNATE CORPORATE EMAIL</span>
                  <a
                    href={`mailto:${COMPANY_INFO.altEmail}`}
                    className="contact-value-link"
                  >
                    {COMPANY_INFO.altEmail}
                  </a>
                  <div style={{ marginTop: "8px" }}>
                    <button
                      type="button"
                      className="arch-btn arch-btn-secondary arch-btn-compact"
                      onClick={() => handleCopyText("email2", COMPANY_INFO.altEmail)}
                    >
                      {copiedKey === "email2" ? "COPIED TO CLIPBOARD ✓" : "COPY ALT EMAIL"}
                    </button>
                  </div>
                </div>

                <div className="contact-ledger-row">
                  <span className="tech-label">DIRECT WHATSAPP / WECHAT ENGINEERING DESK</span>
                  <a
                    href={COMPANY_INFO.whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="contact-value-link"
                  >
                    {COMPANY_INFO.whatsapp}
                  </a>
                  <div style={{ marginTop: "8px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <a
                      href={COMPANY_INFO.whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                      className="arch-btn arch-btn-primary arch-btn-compact"
                    >
                      CHAT ON WHATSAPP →
                    </a>
                    <button
                      type="button"
                      className="arch-btn arch-btn-secondary arch-btn-compact"
                      onClick={() => handleCopyText("whatsapp", COMPANY_INFO.whatsapp)}
                    >
                      {copiedKey === "whatsapp" ? "COPIED ✓" : "COPY NUMBER"}
                    </button>
                  </div>
                </div>

                <div className="contact-ledger-row">
                  <span className="tech-label">MANUFACTURING PLANT ADDRESS</span>
                  <p
                    style={{
                      fontSize: "var(--text-body-sm)",
                      color: "var(--color-on-surface)",
                      marginTop: "4px"
                    }}
                  >
                    {COMPANY_INFO.address}
                  </p>
                </div>

                <div className="sample-box-callout">
                  <span className="tech-label tech-label-signal">
                    COMPLIMENTARY ENGINEERING SWATCH KIT
                  </span>
                  <h4
                    style={{
                      fontSize: "1rem",
                      color: "var(--color-primary)",
                      margin: "6px 0"
                    }}
                  >
                    Free Physical Membrane &amp; Coating Sample Box
                  </h4>
                  <p
                    style={{
                      fontSize: "var(--text-body-sm)",
                      color: "var(--color-secondary)",
                      marginBottom: "14px"
                    }}
                  >
                    We dispatch physical A4/swatch cuts of SBS, APP, TPO, PVC, Pre-Applied HDPE, and Butyl Tapes via DHL/FedEx for contractor submittal approval and lab testing.
                  </p>
                  <button
                    type="button"
                    className="arch-btn arch-btn-dark arch-btn-compact"
                    onClick={() => {
                      setSampleSubmitted(false);
                      setSampleModalOpen(true);
                    }}
                  >
                    OPEN SAMPLE BOX REQUEST FORM
                  </button>
                </div>
              </div>

              {/* Right 7 Columns: Structured Engineering RFQ Form */}
              <div className="rfq-dossier-form">
                <div className="rfq-form-header">
                  <span className="tech-label">
                    FORM DOC: MZ-RFQ-2026 · DIRECT FACTORY QUOTATION
                  </span>
                  <h3
                    style={{
                      fontSize: "var(--text-headline-md)",
                      color: "var(--color-primary)",
                      marginTop: "4px"
                    }}
                  >
                    SUBMIT PROJECT SPECIFICATION &amp; CONTAINER INQUIRY
                  </h3>
                </div>

                {rfqSubmitted ? (
                  <div className="form-success-banner" role="status">
                    <span className="tech-label" style={{ color: "var(--color-success)" }}>
                      RFQ DOSSIER PREPARED · READY FOR IMMEDIATE DISPATCH
                    </span>
                    <h4
                      style={{
                        fontSize: "var(--text-headline-sm)",
                        color: "var(--color-primary)",
                        margin: "8px 0"
                      }}
                    >
                      Thank you, {rfqForm.company}. Your inquiry package is structured.
                    </h4>
                    <p
                      style={{
                        fontSize: "var(--text-body-sm)",
                        color: "var(--color-on-surface)",
                        marginBottom: "16px"
                      }}
                    >
                      Choose your preferred instant transmission channel below to send your specification directly to our export engineering desk ({COMPANY_INFO.email} / WhatsApp {COMPANY_INFO.whatsapp}):
                    </p>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      <a
                        className="arch-btn arch-btn-primary arch-btn-compact"
                        href={`mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(
                          `[RFQ Inquiry] ${rfqForm.company} - ${rfqForm.country}`
                        )}&body=${encodeURIComponent(
                          `Company: ${rfqForm.company}\nWork Email: ${rfqForm.email}\nCountry/Region: ${rfqForm.country}\nProject Type: ${rfqForm.projectType}\nSpecified SKU/System: ${rfqForm.productInterest || "General Catalogue"}\nEstimated Quantity: ${rfqForm.quantity}\nTarget Destination Port: ${rfqForm.port || "TBD"}\nSample Swatch Box Requested: ${rfqForm.requestSampleBox ? "Yes" : "No"}\n\nProject Notes:\n${rfqForm.notes}`
                        )}`}
                      >
                        SEND VIA EMAIL CLIENT ({COMPANY_INFO.email})
                      </a>
                      <a
                        className="arch-btn arch-btn-dark arch-btn-compact"
                        target="_blank"
                        rel="noreferrer"
                        href={`https://wa.me/8616658506707?text=${encodeURIComponent(
                          `Hello Mingze Export Desk, RFQ from ${rfqForm.company} (${rfqForm.country}). Email: ${rfqForm.email}. Product: ${rfqForm.productInterest || "Waterproofing Membranes"}. Qty: ${rfqForm.quantity}. Port: ${rfqForm.port || "TBD"}. Sample Box: ${rfqForm.requestSampleBox ? "Yes" : "No"}.`
                        )}`}
                      >
                        SEND VIA WHATSAPP (+86 16658506707)
                      </a>
                      <button
                        type="button"
                        className="arch-btn arch-btn-secondary arch-btn-compact"
                        onClick={() => setRfqSubmitted(false)}
                      >
                        EDIT INQUIRY FIELDS
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRfqSubmit} noValidate>
                    {Object.keys(rfqErrors).length > 0 && (
                      <div className="form-error-summary" role="alert">
                        <h4>
                          VALIDATION ALERT: PLEASE RESOLVE {Object.keys(rfqErrors).length} REQUIRED FIELD(S)
                        </h4>
                        <ul style={{ paddingLeft: "18px", fontSize: "var(--text-body-sm)" }}>
                          {Object.values(rfqErrors).map((errMsg) => (
                            <li key={errMsg}>{errMsg}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="form-row-split">
                      <div className="arch-field">
                        <label htmlFor="rfq-company">COMPANY / CONTRACTOR NAME *</label>
                        <input
                          id="rfq-company"
                          type="text"
                          className="arch-input"
                          value={rfqForm.company}
                          onChange={(e) => handleRfqChange("company", e.target.value)}
                          onBlur={() => handleRfqBlur("company")}
                          aria-invalid={Boolean(rfqErrors.company)}
                          placeholder="e.g. Apex Roofing & Civil Engineering Ltd."
                        />
                        {rfqErrors.company && (
                          <span className="field-error-msg">{rfqErrors.company}</span>
                        )}
                      </div>

                      <div className="arch-field">
                        <label htmlFor="rfq-email">OFFICIAL WORK EMAIL *</label>
                        <input
                          id="rfq-email"
                          type="email"
                          className="arch-input"
                          value={rfqForm.email}
                          onChange={(e) => handleRfqChange("email", e.target.value)}
                          onBlur={() => handleRfqBlur("email")}
                          aria-invalid={Boolean(rfqErrors.email)}
                          placeholder="e.g. procurement@company.com"
                        />
                        {rfqErrors.email && (
                          <span className="field-error-msg">{rfqErrors.email}</span>
                        )}
                      </div>
                    </div>

                    <div className="form-row-split">
                      <div className="arch-field">
                        <label htmlFor="rfq-country">DESTINATION COUNTRY / REGION *</label>
                        <input
                          id="rfq-country"
                          type="text"
                          className="arch-input"
                          value={rfqForm.country}
                          onChange={(e) => handleRfqChange("country", e.target.value)}
                          onBlur={() => handleRfqBlur("country")}
                          aria-invalid={Boolean(rfqErrors.country)}
                          placeholder="e.g. UAE, Saudi Arabia, Singapore, Australia"
                        />
                        {rfqErrors.country && (
                          <span className="field-error-msg">{rfqErrors.country}</span>
                        )}
                      </div>

                      <div className="arch-field">
                        <label htmlFor="rfq-project-type">APPLICATION / PROJECT SECTOR</label>
                        <select
                          id="rfq-project-type"
                          className="arch-select"
                          value={rfqForm.projectType}
                          onChange={(e) => handleRfqChange("projectType", e.target.value)}
                        >
                          <option value="Commercial / Industrial Flat Roofing">
                            Commercial / Industrial Flat Roofing
                          </option>
                          <option value="Underground Basement & Foundation (Pre-Applied)">
                            Underground Basement &amp; Foundation (Pre-Applied)
                          </option>
                          <option value="Exposed Metal Roof Refurbishment">
                            Exposed Metal Roof Refurbishment
                          </option>
                          <option value="Bridges, Tunnels & Civil Infrastructure">
                            Bridges, Tunnels &amp; Civil Infrastructure
                          </option>
                          <option value="Wholesale Distribution / OEM Private Label">
                            Wholesale Distribution / OEM Private Label
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="arch-field">
                      <label htmlFor="rfq-product">
                        SPECIFIED SKU CODE OR MATERIAL SYSTEM
                      </label>
                      <input
                        id="rfq-product"
                        type="text"
                        className="arch-input"
                        value={rfqForm.productInterest}
                        onChange={(e) => handleRfqChange("productInterest", e.target.value)}
                        placeholder="e.g. MZ-CAT-01 SBS 4mm, MZ-CAT-08 TPO 1.5mm, or click INQUIRE on any SKU above"
                      />
                    </div>

                    <div className="form-row-split">
                      <div className="arch-field">
                        <label htmlFor="rfq-quantity">
                          ESTIMATED ORDER VOLUME (M² / ROLLS / CONTAINERS) *
                        </label>
                        <input
                          id="rfq-quantity"
                          type="text"
                          className="arch-input"
                          value={rfqForm.quantity}
                          onChange={(e) => handleRfqChange("quantity", e.target.value)}
                          onBlur={() => handleRfqBlur("quantity")}
                          aria-invalid={Boolean(rfqErrors.quantity)}
                          placeholder="e.g. 25,000 m² or 1×20GP Container"
                        />
                        {rfqErrors.quantity && (
                          <span className="field-error-msg">{rfqErrors.quantity}</span>
                        )}
                      </div>

                      <div className="arch-field">
                        <label htmlFor="rfq-port">
                          TARGET DISCHARGE PORT (FOR CIF / CFR QUOTE)
                        </label>
                        <input
                          id="rfq-port"
                          type="text"
                          className="arch-input"
                          value={rfqForm.port}
                          onChange={(e) => handleRfqChange("port", e.target.value)}
                          placeholder="e.g. Jebel Ali, Port Klang, Santos, Rotterdam"
                        />
                      </div>
                    </div>

                    <label className="checkbox-row">
                      <input
                        type="checkbox"
                        checked={rfqForm.requestSampleBox}
                        onChange={(e) =>
                          handleRfqChange("requestSampleBox", e.target.checked)
                        }
                      />
                      <div>
                        <span
                          className="tech-label"
                          style={{ color: "var(--color-primary)", display: "block" }}
                        >
                          INCLUDE COMPLIMENTARY PHYSICAL SAMPLE SWATCH BOX
                        </span>
                        <span
                          style={{
                            fontSize: "var(--text-body-sm)",
                            color: "var(--color-secondary)"
                          }}
                        >
                          Check to receive physical membrane cuts, TDS sheets, and batch test reports with your quotation.
                        </span>
                      </div>
                    </label>

                    <div className="arch-field">
                      <label htmlFor="rfq-notes">
                        TECHNICAL SPECIFICATIONS, THICKNESS, REINFORCEMENT OR OEM NOTES
                      </label>
                      <textarea
                        id="rfq-notes"
                        className="arch-textarea"
                        value={rfqForm.notes}
                        onChange={(e) => handleRfqChange("notes", e.target.value)}
                        placeholder="Specify reinforcement type (Polyester PY / Fiberglass G), surface finish (PE / Sand / Mineral Slate), climate grade (-25°C SBS / +130°C APP), or custom OEM label requirements..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="arch-btn arch-btn-primary"
                      style={{ width: "100%" }}
                    >
                      GENERATE OFFICIAL RFQ SUBMITTAL &amp; CONNECT WITH EXPORT DESK
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ====================================================================
          ARCHITECTURAL TITLE-BLOCK FOOTER
          ==================================================================== */}
      <footer className="titleblock-footer" data-component="site-footer">
        <div className="arch-container">
          <div className="titleblock-grid">
            <div className="titleblock-cell">
              <h4>MANUFACTURER IDENTIFICATION</h4>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  marginBottom: "6px",
                  color: "var(--color-on-dark)"
                }}
              >
                {COMPANY_INFO.name}
              </p>
              <p
                style={{
                  fontSize: "var(--text-body-sm)",
                  color: "var(--color-border)",
                  marginBottom: "12px"
                }}
              >
                {COMPANY_INFO.legalNameZh} · Direct Industrial Waterproofing Manufacturer &amp; Global Exporter since 2008.
              </p>
              <p className="tech-label tech-label-dark">
                PLANT: TAITOU INDUSTRIAL ZONE, SHOUGUANG, WEIFANG, SHANDONG, CHINA
              </p>
            </div>

            <div className="titleblock-cell">
              <h4>MATERIAL SYSTEMS (37 SKUS)</h4>
              <ul className="titleblock-links">
                {CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <a
                      href="#catalogue"
                      onClick={() => setActiveCategory(cat.id)}
                    >
                      {cat.shortName} ({cat.count} SKUs)
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="titleblock-cell">
              <h4>DOSSIER NAVIGATION</h4>
              <ul className="titleblock-links">
                <li>
                  <a href="#systems">01 / Material Systems Index</a>
                </li>
                <li>
                  <a href="#catalogue">02 / 37-SKU Technical Ledger</a>
                </li>
                <li>
                  <a href="#assemblies">03 / Build-Up Assemblies</a>
                </li>
                <li>
                  <a href="#standards">04 / Lab QA &amp; Standards Matrix</a>
                </li>
                <li>
                  <a href="#factory">05 / 68,000 m² Factory Base</a>
                </li>
                <li>
                  <a href="#trade-desk">06 / Direct Trade Desk &amp; RFQ</a>
                </li>
              </ul>
            </div>

            <div className="titleblock-cell">
              <h4>EXPORT DESK CONTACTS</h4>
              <ul className="titleblock-links">
                <li>
                  <a href={`mailto:${COMPANY_INFO.email}`}>
                    Email: {COMPANY_INFO.email}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${COMPANY_INFO.altEmail}`}>
                    Alt: {COMPANY_INFO.altEmail}
                  </a>
                </li>
                <li>
                  <a
                    href={COMPANY_INFO.whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp: {COMPANY_INFO.whatsapp}
                  </a>
                </li>
                <li>
                  <span
                    style={{
                      fontSize: "var(--text-body-sm)",
                      color: "var(--color-border)"
                    }}
                  >
                    Port: {COMPANY_INFO.port}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="titleblock-closing">
            <span>
              © {new Date().getFullYear()} {COMPANY_INFO.name} ALL RIGHTS RESERVED.
            </span>
            <span>
              DRAWING SYSTEM: SWISS ARCHITECTURAL DOSSIER · ISO9001 / CE / ASTM COMPLIANT
            </span>
          </div>
        </div>
      </footer>

      {/* ====================================================================
          MODAL 1: TECHNICAL DATA SHEET (TDS) DOSSIER MODAL
          ==================================================================== */}
      {selectedTdsProduct && (
        <div
          className="arch-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tds-modal-title"
          onClick={() => setSelectedTdsProduct(null)}
        >
          <div
            className="arch-modal-frame"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="arch-modal-bar">
              <div>
                <span className="tech-label tech-label-dark">
                  TECHNICAL DATA SHEET (TDS) · {selectedTdsProduct.code}
                </span>
                <h3
                  id="tds-modal-title"
                  style={{ fontSize: "1.15rem", marginTop: "2px" }}
                >
                  {selectedTdsProduct.name}
                </h3>
              </div>
              <button
                type="button"
                className="arch-modal-close"
                onClick={() => setSelectedTdsProduct(null)}
              >
                ESC / CLOSE ✕
              </button>
            </div>

            <div className="arch-modal-body">
              <div className="tds-modal-top-grid">
                <div
                  style={{
                    border: "1px solid var(--color-primary)",
                    backgroundColor: "#FFFFFF",
                    padding: "12px"
                  }}
                >
                  <img
                    src={selectedTdsProduct.image}
                    alt={selectedTdsProduct.name}
                    style={{ width: "100%", height: "auto", objectFit: "contain" }}
                  />
                </div>
                <div>
                  <span className="tech-label tech-label-cobalt">
                    {selectedTdsProduct.categoryName}
                  </span>
                  <p
                    style={{
                      fontSize: "var(--text-body-md)",
                      color: "var(--color-primary)",
                      margin: "8px 0 14px"
                    }}
                  >
                    {selectedTdsProduct.brief}
                  </p>
                  <div className="tds-modal-meta-grid">
                    <div>
                      <span className="tech-label" style={{ display: "block" }}>
                        EXECUTION STANDARDS
                      </span>
                      <strong>{selectedTdsProduct.standards}</strong>
                    </div>
                    <div>
                      <span className="tech-label" style={{ display: "block" }}>
                        NOMINAL THICKNESS
                      </span>
                      <strong>{selectedTdsProduct.thickness}</strong>
                    </div>
                    <div>
                      <span className="tech-label" style={{ display: "block" }}>
                        PACKAGING / ROLL DIMENSIONS
                      </span>
                      <strong>{selectedTdsProduct.rollSize}</strong>
                    </div>
                    <div>
                      <span className="tech-label" style={{ display: "block" }}>
                        PRIMARY ENGINEERING APPLICATIONS
                      </span>
                      <span>{selectedTdsProduct.applications}</span>
                    </div>
                  </div>
                </div>
              </div>

              <span className="tech-label">
                KEY ENGINEERING ADVANTAGES &amp; FORMULATION FEATURES
              </span>
              <ul
                style={{
                  margin: "8px 0 20px",
                  paddingLeft: "20px",
                  fontSize: "var(--text-body-sm)",
                  color: "var(--color-on-surface)"
                }}
              >
                {selectedTdsProduct.features.map((feat) => (
                  <li key={feat} style={{ marginBottom: "4px" }}>
                    {feat}
                  </li>
                ))}
              </ul>

              <span className="tech-label">
                LABORATORY PHYSICAL &amp; MECHANICAL PROPERTY LEDGER
              </span>
              <table className="tds-spec-table">
                <thead>
                  <tr>
                    <th>TEST PROPERTY / PARAMETER</th>
                    <th>VERIFIED SPECIFICATION VALUE</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTdsProduct.specs.map((row) => (
                    <tr key={row.property}>
                      <td>{row.property}</td>
                      <td>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap"
                }}
              >
                <span className="tech-label">
                  BATCH COA &amp; MSDS INCLUDED WITH EVERY CONTAINER SHIPMENT
                </span>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="arch-btn arch-btn-secondary arch-btn-compact"
                    onClick={() => window.print()}
                  >
                    PRINT / SAVE TDS SHEET
                  </button>
                  <button
                    type="button"
                    className="arch-btn arch-btn-primary arch-btn-compact"
                    onClick={() => handleInquireProduct(selectedTdsProduct)}
                  >
                    REQUEST FOB QUOTE FOR {selectedTdsProduct.code} →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: COMPLIMENTARY SAMPLE SWATCH BOX MODAL
          ==================================================================== */}
      {sampleModalOpen && (
        <div
          className="arch-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sample-modal-title"
          onClick={() => setSampleModalOpen(false)}
        >
          <div
            className="arch-modal-frame"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="arch-modal-bar">
              <div>
                <span className="tech-label tech-label-dark">
                  ENGINEERING SUBMITTAL KIT · DHL / FEDEX GLOBAL DISPATCH
                </span>
                <h3
                  id="sample-modal-title"
                  style={{ fontSize: "1.15rem", marginTop: "2px" }}
                >
                  Request Complimentary Physical Sample Swatch Box
                </h3>
              </div>
              <button
                type="button"
                className="arch-modal-close"
                onClick={() => setSampleModalOpen(false)}
              >
                ESC / CLOSE ✕
              </button>
            </div>

            <div className="arch-modal-body">
              {sampleSubmitted ? (
                <div className="form-success-banner" role="status">
                  <span className="tech-label" style={{ color: "var(--color-success)" }}>
                    SAMPLE KIT REQUEST READY
                  </span>
                  <h4 style={{ margin: "8px 0", color: "var(--color-primary)" }}>
                    Sample Swatch Box Request Prepared for {sampleForm.company}
                  </h4>
                  <p
                    style={{
                      fontSize: "var(--text-body-sm)",
                      marginBottom: "16px"
                    }}
                  >
                    Click below to confirm your delivery address with our export desk via Email or WhatsApp so our laboratory can prepare your cut samples within 24 hours:
                  </p>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <a
                      className="arch-btn arch-btn-primary arch-btn-compact"
                      href={`mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(
                        `[Sample Swatch Box Request] ${sampleForm.company} - ${sampleForm.country}`
                      )}&body=${encodeURIComponent(
                        `Company: ${sampleForm.company}\nContact Person: ${sampleForm.contactName}\nEmail: ${sampleForm.email}\nCountry/Address: ${sampleForm.country}\nSelected Material Systems: ${sampleForm.selectedSystems.join(", ")}\nNotes / Courier Account: ${sampleForm.courierNote}`
                      )}`}
                    >
                      CONFIRM VIA EMAIL ({COMPANY_INFO.email})
                    </a>
                    <a
                      className="arch-btn arch-btn-dark arch-btn-compact"
                      target="_blank"
                      rel="noreferrer"
                      href={`https://wa.me/8616658506707?text=${encodeURIComponent(
                        `Hello Mingze Export Desk, I would like to request the Free Sample Swatch Box for ${sampleForm.company} (${sampleForm.country}). Contact: ${sampleForm.contactName} (${sampleForm.email}). Systems: ${sampleForm.selectedSystems.join(", ")}.`
                      )}`}
                    >
                      CONFIRM VIA WHATSAPP
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSampleSubmit}>
                  <p
                    style={{
                      fontSize: "var(--text-body-sm)",
                      color: "var(--color-secondary)",
                      marginBottom: "18px"
                    }}
                  >
                    Select the material systems you wish to include in your physical sample box for engineering evaluation and tender submittals:
                  </p>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: "10px",
                      marginBottom: "20px"
                    }}
                  >
                    {CATEGORIES.map((cat) => {
                      const checked = sampleForm.selectedSystems.includes(cat.id);
                      return (
                        <label
                          key={cat.id}
                          className="checkbox-row"
                          style={{ marginBottom: 0 }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleSampleSystem(cat.id)}
                          />
                          <div>
                            <span
                              className="tech-label"
                              style={{ color: "var(--color-primary)", display: "block" }}
                            >
                              {cat.shortName}
                            </span>
                            <span style={{ fontSize: "0.75rem", color: "var(--color-secondary)" }}>
                              {cat.count} SKUs Available
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  <div className="form-row-split">
                    <div className="arch-field">
                      <label htmlFor="sample-company">COMPANY NAME *</label>
                      <input
                        id="sample-company"
                        type="text"
                        required
                        className="arch-input"
                        value={sampleForm.company}
                        onChange={(e) =>
                          setSampleForm({ ...sampleForm, company: e.target.value })
                        }
                        placeholder="Your company name"
                      />
                    </div>
                    <div className="arch-field">
                      <label htmlFor="sample-contact">CONTACT PERSON &amp; TITLE *</label>
                      <input
                        id="sample-contact"
                        type="text"
                        required
                        className="arch-input"
                        value={sampleForm.contactName}
                        onChange={(e) =>
                          setSampleForm({ ...sampleForm, contactName: e.target.value })
                        }
                        placeholder="e.g. Chief Engineer / Purchasing Director"
                      />
                    </div>
                  </div>

                  <div className="form-row-split">
                    <div className="arch-field">
                      <label htmlFor="sample-email">WORK EMAIL *</label>
                      <input
                        id="sample-email"
                        type="email"
                        required
                        className="arch-input"
                        value={sampleForm.email}
                        onChange={(e) =>
                          setSampleForm({ ...sampleForm, email: e.target.value })
                        }
                        placeholder="name@company.com"
                      />
                    </div>
                    <div className="arch-field">
                      <label htmlFor="sample-country">
                        DESTINATION COUNTRY &amp; CITY *
                      </label>
                      <input
                        id="sample-country"
                        type="text"
                        required
                        className="arch-input"
                        value={sampleForm.country}
                        onChange={(e) =>
                          setSampleForm({ ...sampleForm, country: e.target.value })
                        }
                        placeholder="e.g. Dubai, UAE"
                      />
                    </div>
                  </div>

                  <div className="arch-field">
                    <label htmlFor="sample-notes">
                      SPECIFIC SKU CODES, THICKNESS OR COURIER INSTRUCTIONS
                    </label>
                    <input
                      id="sample-notes"
                      type="text"
                      className="arch-input"
                      value={sampleForm.courierNote}
                      onChange={(e) =>
                        setSampleForm({ ...sampleForm, courierNote: e.target.value })
                      }
                      placeholder="e.g. Need 4mm SBS Torch-on + 1.5mm Pre-applied HDPE samples"
                    />
                  </div>

                  <button
                    type="submit"
                    className="arch-btn arch-btn-primary"
                    style={{ width: "100%" }}
                  >
                    PREPARE SAMPLE SWATCH BOX DISPATCH REQUEST
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

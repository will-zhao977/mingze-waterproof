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

const HERO_FEATURED_SYSTEMS = [
  {
    id: "bitumen",
    tabLabel: "SBS / APP Bitumen",
    badge: "Best-Selling Roofing Series",
    standard: "EN 13707 · ASTM D6164",
    title: "SBS & APP Modified Bitumen Waterproof Membranes",
    spec: "3.0mm / 4.0mm / 5.0mm · Torch-On & Self-Adhesive Rolls",
    image: "/assets/images/product-bitumen.jpg"
  },
  {
    id: "hdpe",
    tabLabel: "Pre-Applied HDPE",
    badge: "Basement & Tunnel Flagship",
    standard: "ASTM D5385 · GB/T 23457",
    title: "Pre-Applied HDPE Blindside Waterproofing Membrane",
    spec: "1.2mm / 1.5mm / 2.0mm · 70m Hydrostatic Head Resistance",
    image: "/assets/images/product-hdpe.jpg"
  },
  {
    id: "polymer",
    tabLabel: "TPO / PVC Sheet",
    badge: "Commercial Cool Roof",
    standard: "ASTM D6878 · EN 13956",
    title: "TPO & PVC Exposed Single-Ply Roofing Membranes",
    spec: "1.2mm / 1.5mm / 2.0mm · Hot-Air Weldable & UV Resistant",
    image: "/assets/images/product-polymer.jpg"
  },
  {
    id: "coating",
    tabLabel: "Liquid Coatings",
    badge: "Seamless Elastomeric",
    standard: "ASTM C836 · GB/T 19250",
    title: "Polyurethane (PU), JS Cementitious & Polyurea Coatings",
    spec: "≥ 450% Elongation · 20kg / 25kg Export Pails",
    image: "/assets/images/product-coating.jpg"
  }
];

function App() {
  // Hero featured product switcher
  const [heroTabIdx, setHeroTabIdx] = useState(0);

  // Product catalogue filter & search states
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals: Product Details (TDS) & Free Sample Box
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sampleModalOpen, setSampleModalOpen] = useState(false);

  // Copy feedback
  const [copiedField, setCopiedField] = useState(null);

  // Inquiry Form State
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
  const [rfqErrors, setRfqErrors] = useState({});
  const [rfqSubmitted, setRfqSubmitted] = useState(false);

  // Sample Box Modal Form State
  const [sampleForm, setSampleForm] = useState({
    company: "",
    contactName: "",
    email: "",
    country: "",
    notes: ""
  });
  const [sampleSubmitted, setSampleSubmitted] = useState(false);

  // Close modals on Escape key
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        if (selectedProduct) setSelectedProduct(null);
        if (sampleModalOpen) setSampleModalOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedProduct, sampleModalOpen]);

  // Filter 37 products by category & search query
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchCat =
        activeCategory === "all" || item.categoryId === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchCat;
      const matchQuery =
        item.code.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.standards.toLowerCase().includes(q) ||
        item.applications.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [activeCategory, searchQuery]);

  // Select series card -> filter product grid & scroll to products
  const handleSelectSeries = (catId) => {
    setActiveCategory(catId);
    const el = document.getElementById("products");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Click Inquire Now on a product card -> prefill RFQ form & scroll to contact
  const handleInquireProduct = (product) => {
    setSelectedProduct(null);
    setRfqForm((prev) => ({
      ...prev,
      productInterest: `${product.code} - ${product.name} (${product.thickness})`
    }));
    setRfqSubmitted(false);
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Copy contact helper
  const handleCopy = (key, text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedField(key);
    setTimeout(() => {
      setCopiedField((prev) => (prev === key ? null : prev));
    }, 2200);
  };

  // Validate RFQ form
  const handleRfqSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!rfqForm.company.trim()) {
      errs.company = "Please enter your company name.";
    }
    if (!rfqForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rfqForm.email.trim())) {
      errs.email = "Please enter a valid business email address.";
    }
    if (!rfqForm.country.trim()) {
      errs.country = "Please enter your destination country or region.";
    }
    if (!rfqForm.quantity.trim()) {
      errs.quantity = "Please enter estimated order quantity (m², rolls, or containers).";
    }
    setRfqErrors(errs);
    if (Object.keys(errs).length === 0) {
      setRfqSubmitted(true);
    }
  };

  const handleSampleSubmit = (e) => {
    e.preventDefault();
    if (!sampleForm.company.trim() || !sampleForm.email.trim()) return;
    setSampleSubmitted(true);
  };

  const activeHeroItem = HERO_FEATURED_SYSTEMS[heroTabIdx];

  return (
    <div>
      {/* ====================================================================
          1. CORPORATE TOP BAR
          ==================================================================== */}
      <div className="b2b-topbar" data-component="topbar">
        <div className="b2b-topbar-inner">
          <div className="b2b-topbar-group">
            <span className="b2b-topbar-item">
              <strong>Direct Factory Since 2008:</strong> 68,000 m² Manufacturing Base in Shandong, China
            </span>
            <span className="b2b-topbar-item">
              <strong>Certifications:</strong> ISO9001 · CE (EN 13707 / EN 13956) · ASTM
            </span>
          </div>
          <div className="b2b-topbar-group">
            <span className="b2b-topbar-item">
              <strong>Email:</strong>{" "}
              <a className="b2b-topbar-link" href={`mailto:${COMPANY_INFO.email}`}>
                {COMPANY_INFO.email}
              </a>
            </span>
            <span className="b2b-topbar-item">
              <strong>WhatsApp:</strong>{" "}
              <a
                className="b2b-topbar-link"
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
          2. STICKY CORPORATE NAVIGATION HEADER
          ==================================================================== */}
      <header className="b2b-header" data-component="header">
        <div className="b2b-header-inner">
          <a href="#top" className="b2b-logo-link">
            <span className="b2b-logo-badge">MZ</span>
            <span className="b2b-logo-text">
              <span className="b2b-logo-title">MINGZE WATERPROOF</span>
              <span className="b2b-logo-subtitle">
                Global Waterproofing Manufacturer &amp; Exporter
              </span>
            </span>
          </a>

          <nav className="b2b-nav" aria-label="Main Navigation">
            <a href="#series" className="b2b-nav-link">
              Product Series
            </a>
            <a href="#products" className="b2b-nav-link">
              All 37 Products
            </a>
            <a href="#solutions" className="b2b-nav-link">
              Engineering Solutions
            </a>
            <a href="#factory" className="b2b-nav-link">
              Factory &amp; QC
            </a>
            <a href="#contact" className="b2b-nav-link">
              Contact Us
            </a>
          </nav>

          <div className="b2b-header-actions">
            <button
              type="button"
              className="b2b-btn b2b-btn-outline b2b-btn-sm"
              onClick={() => {
                setSampleSubmitted(false);
                setSampleModalOpen(true);
              }}
            >
              Free Sample Box
            </button>
            <a href="#contact" className="b2b-btn b2b-btn-primary b2b-btn-sm">
              Get A Free Quote
            </a>
            <button
              type="button"
              className="b2b-mobile-toggle"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? "Close ✕" : "Menu ☰"}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="b2b-mobile-menu">
            <div className="b2b-mobile-nav-list">
              <a
                href="#series"
                className="b2b-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                5 Core Product Series
              </a>
              <a
                href="#products"
                className="b2b-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                All 37 Waterproofing Products
              </a>
              <a
                href="#solutions"
                className="b2b-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Engineering Application Solutions
              </a>
              <a
                href="#factory"
                className="b2b-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Factory Strength &amp; Standards
              </a>
              <a
                href="#contact"
                className="b2b-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Request A Quote &amp; Contact
              </a>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <a
                href="#contact"
                className="b2b-btn b2b-btn-primary b2b-btn-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get A Free Quote
              </a>
              <button
                type="button"
                className="b2b-btn b2b-btn-outline b2b-btn-sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSampleSubmitted(false);
                  setSampleModalOpen(true);
                }}
              >
                Request Free Sample Box
              </button>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        {/* ==================================================================
            3. MAINSTREAM B2B CORPORATE HERO BANNER
            ================================================================== */}
        <section className="b2b-hero" data-component="hero-banner">
          <div className="b2b-container">
            <div className="b2b-hero-grid">
              {/* Left Column: Corporate Value Proposition */}
              <div className="b2b-hero-content">
                <div className="b2b-hero-badges">
                  <span className="b2b-hero-pill">ISO 9001 / 14001 Certified</span>
                  <span className="b2b-hero-pill">CE &amp; ASTM Compliant</span>
                  <span className="b2b-hero-pill">FOB Qingdao Port Direct</span>
                </div>

                <h1>
                  Leading Industrial Manufacturer of{" "}
                  <span>Waterproofing Membranes &amp; Coatings</span>
                </h1>

                <p className="b2b-hero-desc">
                  Weifang Mingze Waterproof Material Co., Ltd. supplies global contractors, building material distributors, and infrastructure developers with 37 standardized waterproofing products — factory-direct from China’s largest waterproof production base.
                </p>

                <ul className="b2b-hero-check-list">
                  <li>
                    <span className="b2b-check-dot">✓</span>
                    50,000,000+ m² Annual Membrane Output
                  </li>
                  <li>
                    <span className="b2b-check-dot">✓</span>
                    25,000+ Tons Liquid Coatings Capacity
                  </li>
                  <li>
                    <span className="b2b-check-dot">✓</span>
                    7–10 Days Rapid Container Loading
                  </li>
                  <li>
                    <span className="b2b-check-dot">✓</span>
                    OEM / ODM Private Label &amp; Free Samples
                  </li>
                </ul>

                <div className="b2b-hero-actions">
                  <a href="#contact" className="b2b-btn b2b-btn-primary b2b-btn-lg">
                    Request Factory Price List
                  </a>
                  <a href="#products" className="b2b-btn b2b-btn-ghost-light b2b-btn-lg">
                    Browse 37 Products
                  </a>
                  <a
                    href={COMPANY_INFO.whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="b2b-btn b2b-btn-whatsapp b2b-btn-lg"
                  >
                    WhatsApp Export Desk
                  </a>
                </div>
              </div>

              {/* Right Column: Interactive Flagship Product Card */}
              <div className="b2b-hero-showcase-card">
                <div className="b2b-showcase-header">
                  <span className="b2b-showcase-tag">{activeHeroItem.badge}</span>
                  <span className="b2b-showcase-std">{activeHeroItem.standard}</span>
                </div>

                <div className="b2b-showcase-img-box">
                  <img
                    src={activeHeroItem.image}
                    alt={activeHeroItem.title}
                  />
                </div>

                <div className="b2b-showcase-tabs" role="tablist">
                  {HERO_FEATURED_SYSTEMS.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={heroTabIdx === idx}
                      className={`b2b-showcase-tab ${
                        heroTabIdx === idx ? "active" : ""
                      }`}
                      onClick={() => setHeroTabIdx(idx)}
                    >
                      {item.tabLabel}
                    </button>
                  ))}
                </div>

                <div className="b2b-showcase-footer">
                  <div>
                    <h3>{activeHeroItem.title}</h3>
                    <p>{activeHeroItem.spec}</p>
                  </div>
                  <a
                    href="#products"
                    className="b2b-btn b2b-btn-primary b2b-btn-sm"
                  >
                    View Catalog →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            4. ELEVATED CORPORATE STATS BAR
            ================================================================== */}
        <div className="b2b-stats-wrap" data-component="stats-bar">
          <div className="b2b-container">
            <div className="b2b-stats-grid">
              <div className="b2b-stat-card">
                <div className="b2b-stat-num">2008</div>
                <div className="b2b-stat-title">Established Manufacturer</div>
                <p className="b2b-stat-desc">
                  18+ years specializing in industrial waterproofing R&amp;D, manufacturing, and global container export.
                </p>
              </div>
              <div className="b2b-stat-card">
                <div className="b2b-stat-num">68,000 m²</div>
                <div className="b2b-stat-title">Modern Factory Area</div>
                <p className="b2b-stat-desc">
                  Automated bitumen, TPO/PVC/HDPE extrusion, and polyurethane synthesis lines in Weifang, Shandong.
                </p>
              </div>
              <div className="b2b-stat-card">
                <div className="b2b-stat-num">50M+ m²</div>
                <div className="b2b-stat-title">Annual Production Capacity</div>
                <p className="b2b-stat-desc">
                  50 million m² roll membranes plus 25,000 tons of liquid coatings for stable bulk supply.
                </p>
              </div>
              <div className="b2b-stat-card">
                <div className="b2b-stat-num">200 km</div>
                <div className="b2b-stat-title">To Qingdao Seaport</div>
                <p className="b2b-stat-desc">
                  2.5-hour highway access to Qingdao Port ensuring fast 20GP/40HQ container booking and low inland freight.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================
            5. FIVE CORE PRODUCT SERIES OVERVIEW
            ================================================================== */}
        <section
          id="series"
          className="b2b-section"
          data-component="product-series-section"
        >
          <div className="b2b-container">
            <div className="b2b-section-header">
              <span className="b2b-eyebrow">5 Core Product Categories</span>
              <h2>Comprehensive Waterproofing Product Portfolio</h2>
              <p>
                Click any product family below to filter our complete 37-product catalog. All products support custom roll dimensions, thickness, and private-label OEM packaging.
              </p>
            </div>

            <div className="b2b-series-grid">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className={`b2b-series-card ${
                    activeCategory === cat.id ? "active" : ""
                  }`}
                  onClick={() => handleSelectSeries(cat.id)}
                >
                  <div className="b2b-series-img">
                    <img src={cat.image} alt={cat.name} loading="lazy" />
                  </div>
                  <div className="b2b-series-body">
                    <span className="b2b-series-count">{cat.count} Products</span>
                    <h3>{cat.name}</h3>
                    <p>{cat.description}</p>
                    <span className="b2b-series-link">
                      Filter {cat.shortName} →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================================
            6. STANDARD B2B PRODUCT CARD GRID (ALL 37 SKUS)
            ================================================================== */}
        <section
          id="products"
          className="b2b-section-alt"
          data-component="product-catalog-section"
        >
          <div className="b2b-container">
            <div className="b2b-section-header">
              <span className="b2b-eyebrow">Official Product Catalog</span>
              <h2>All 37 Waterproofing Products &amp; Specifications</h2>
              <p>
                High-resolution studio product photos, verified ASTM / EN / GB execution standards, and detailed technical specifications for global B2B procurement.
              </p>
            </div>

            {/* Top 5 Category Filter Tabs + Search Box */}
            <div className="b2b-catalogue-toolbar">
              <div
                className="b2b-category-tabs"
                role="tablist"
                aria-label="Product Category Filters"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === "all"}
                  className={`b2b-tab-btn ${
                    activeCategory === "all" ? "active" : ""
                  }`}
                  onClick={() => setActiveCategory("all")}
                >
                  All Products ({PRODUCTS.length})
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={activeCategory === cat.id}
                    className={`b2b-tab-btn ${
                      activeCategory === cat.id ? "active" : ""
                    }`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    {cat.shortName} ({cat.count})
                  </button>
                ))}
              </div>

              <div className="b2b-search-row">
                <div className="b2b-search-box">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by product name, model (e.g. MZ-CAT-01), standard (ASTM, EN), or application..."
                    aria-label="Search products"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="b2b-search-clear"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="b2b-catalogue-count">
                  Showing <strong>{filteredProducts.length}</strong> of{" "}
                  <strong>{PRODUCTS.length}</strong> Export Products
                </div>
              </div>
            </div>

            {/* Product Grid or Empty State */}
            {filteredProducts.length === 0 ? (
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  padding: "48px 24px",
                  textAlign: "center"
                }}
              >
                <h3
                  style={{
                    color: "var(--color-primary)",
                    marginBottom: "8px"
                  }}
                >
                  No products matched "{searchQuery}"
                </h3>
                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    marginBottom: "16px"
                  }}
                >
                  Try clearing your search keyword or switching to "All Products".
                </p>
                <button
                  type="button"
                  className="b2b-btn b2b-btn-primary b2b-btn-sm"
                  onClick={() => {
                    setActiveCategory("all");
                    setSearchQuery("");
                  }}
                >
                  Show All 37 Products
                </button>
              </div>
            ) : (
              <div className="b2b-product-grid">
                {filteredProducts.map((product) => (
                  <article key={product.id} className="b2b-product-card">
                    <div
                      className="b2b-product-thumb"
                      onClick={() => setSelectedProduct(product)}
                      title="Click to view Technical Data Sheet (TDS)"
                    >
                      <span className="b2b-sku-badge">{product.code}</span>
                      <span className="b2b-cat-badge">{product.categoryName}</span>
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                      />
                    </div>

                    <div className="b2b-product-body">
                      <h3>{product.name}</h3>
                      <p className="b2b-product-brief">{product.brief}</p>

                      <div className="b2b-product-specs">
                        <div className="b2b-spec-line">
                          <span>Standard:</span>
                          <strong>{product.standards}</strong>
                        </div>
                        <div className="b2b-spec-line">
                          <span>Thickness / Spec:</span>
                          <strong>{product.thickness}</strong>
                        </div>
                        <div className="b2b-spec-line">
                          <span>Package Size:</span>
                          <strong>{product.rollSize}</strong>
                        </div>
                      </div>

                      <div className="b2b-product-actions">
                        <button
                          type="button"
                          className="b2b-btn b2b-btn-outline b2b-btn-sm"
                          onClick={() => setSelectedProduct(product)}
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          className="b2b-btn b2b-btn-primary b2b-btn-sm"
                          onClick={() => handleInquireProduct(product)}
                        >
                          Inquire Now
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
            7. ENGINEERING APPLICATION SOLUTIONS
            ================================================================== */}
        <section
          id="solutions"
          className="b2b-section"
          data-component="solutions-section"
        >
          <div className="b2b-container">
            <div className="b2b-section-header">
              <span className="b2b-eyebrow">Engineering Application Systems</span>
              <h2>Complete Waterproofing Solutions by Project Type</h2>
              <p>
                Proven multi-layer waterproofing assemblies for industrial flat roofs, deep underground foundations, exposed metal roof refurbishment, and civil tunnels.
              </p>
            </div>

            <div className="b2b-solutions-grid">
              {SOLUTIONS.map((sol) => (
                <article key={sol.id} className="b2b-solution-card">
                  <div>
                    <div className="b2b-solution-sub">{sol.subtitle}</div>
                    <h3>{sol.title}</h3>
                    <p className="b2b-solution-desc">{sol.description}</p>

                    <div className="b2b-layers-box">
                      <div className="b2b-layers-title">
                        Recommended System Build-Up Layers:
                      </div>
                      {sol.systemLayers.map((layer, idx) => (
                        <div key={layer} className="b2b-layer-step">
                          <span className="b2b-layer-num">{idx + 1}</span>
                          <span>{layer}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="b2b-solution-footer">
                    <div>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "var(--color-text-muted)",
                          display: "block",
                          marginBottom: "6px"
                        }}
                      >
                        Matching Products (Click for TDS):
                      </span>
                      <div className="b2b-rec-pills">
                        {sol.recommendedProducts.map((code) => {
                          const prod = PRODUCTS.find((p) => p.code === code);
                          return (
                            <button
                              key={code}
                              type="button"
                              className="b2b-rec-pill"
                              onClick={() => prod && setSelectedProduct(prod)}
                              title={prod ? prod.name : code}
                            >
                              {code}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <a
                      href="#contact"
                      className="b2b-btn b2b-btn-primary b2b-btn-sm"
                      onClick={() => {
                        setRfqForm((prev) => ({
                          ...prev,
                          projectType: sol.title,
                          productInterest: `${sol.title} System (${sol.recommendedProducts.join(", ")})`
                        }));
                      }}
                    >
                      Get Solution Quote
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================================
            8. FACTORY STRENGTH & INTERNATIONAL STANDARDS
            ================================================================== */}
        <section
          id="factory"
          className="b2b-section-alt"
          data-component="factory-section"
        >
          <div className="b2b-container">
            <div className="b2b-section-header">
              <span className="b2b-eyebrow">Why Partner With Mingze</span>
              <h2>Source Factory Advantages &amp; International Quality Standards</h2>
              <p>
                Every batch undergoes rigorous raw material inspection, in-line thickness gauge control, and laboratory testing before shipment from Qingdao Port.
              </p>
            </div>

            <div className="b2b-why-grid">
              {WHY_CHOOSE_US.map((item, idx) => (
                <div key={item.title} className="b2b-why-card">
                  <div className="b2b-why-icon">0{idx + 1}</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="b2b-standards-panel">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px"
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      color: "var(--color-primary)",
                      marginBottom: "4px"
                    }}
                  >
                    International Testing &amp; Compliance Standards
                  </h3>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--color-text-secondary)"
                    }}
                  >
                    Full TDS, MSDS, and batch Certificate of Analysis (COA) provided with every export container.
                  </p>
                </div>
                <button
                  type="button"
                  className="b2b-btn b2b-btn-outline b2b-btn-sm"
                  onClick={() => {
                    setSampleSubmitted(false);
                    setSampleModalOpen(true);
                  }}
                >
                  Request Free Sample &amp; Test Reports
                </button>
              </div>

              <div className="b2b-standards-columns">
                {STANDARDS_MATRIX.map((group) => (
                  <div key={group.organization} className="b2b-std-col">
                    <h4>{group.organization}</h4>
                    {group.standards.map((std) => (
                      <div key={std.code} className="b2b-std-item">
                        <div className="b2b-std-code">{std.code}</div>
                        <div className="b2b-std-title">{std.title}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            9. DIRECT EXPORT CONTACT & RFQ INQUIRY SECTION
            ================================================================== */}
        <section
          id="contact"
          className="b2b-section"
          data-component="contact-section"
        >
          <div className="b2b-container">
            <div className="b2b-section-header">
              <span className="b2b-eyebrow">Direct Factory Export Desk</span>
              <h2>Request A Free Quote or Sample Swatch Box</h2>
              <p>
                Contact our international sales engineers directly via Email or WhatsApp, or submit your project requirements below for a fast FOB / CIF quotation within 24 hours.
              </p>
            </div>

            <div className="b2b-contact-grid">
              {/* Left Column: Direct Contact Channels */}
              <div className="b2b-contact-card">
                <h3>Weifang Mingze Waterproof Material Co., Ltd.</h3>
                <p
                  style={{
                    color: "#CBD5E1",
                    fontSize: "0.9rem",
                    marginBottom: "16px"
                  }}
                >
                  Direct Manufacturer &amp; Global Exporter · Response within 24 Hours
                </p>

                <div className="b2b-contact-item">
                  <span className="b2b-contact-label">Official Export Email</span>
                  <a
                    href={`mailto:${COMPANY_INFO.email}`}
                    className="b2b-contact-val"
                  >
                    {COMPANY_INFO.email}
                  </a>
                  <div style={{ marginTop: "8px" }}>
                    <button
                      type="button"
                      className="b2b-btn b2b-btn-ghost-light b2b-btn-sm"
                      onClick={() => handleCopy("email1", COMPANY_INFO.email)}
                    >
                      {copiedField === "email1" ? "Copied ✓" : "Copy Email"}
                    </button>
                  </div>
                </div>

                <div className="b2b-contact-item">
                  <span className="b2b-contact-label">Alternate Email</span>
                  <a
                    href={`mailto:${COMPANY_INFO.altEmail}`}
                    className="b2b-contact-val"
                  >
                    {COMPANY_INFO.altEmail}
                  </a>
                  <div style={{ marginTop: "8px" }}>
                    <button
                      type="button"
                      className="b2b-btn b2b-btn-ghost-light b2b-btn-sm"
                      onClick={() => handleCopy("email2", COMPANY_INFO.altEmail)}
                    >
                      {copiedField === "email2" ? "Copied ✓" : "Copy Alt Email"}
                    </button>
                  </div>
                </div>

                <div className="b2b-contact-item">
                  <span className="b2b-contact-label">
                    WhatsApp / WeChat Instant Support
                  </span>
                  <a
                    href={COMPANY_INFO.whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="b2b-contact-val"
                  >
                    {COMPANY_INFO.whatsapp}
                  </a>
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap"
                    }}
                  >
                    <a
                      href={COMPANY_INFO.whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                      className="b2b-btn b2b-btn-whatsapp b2b-btn-sm"
                    >
                      Chat on WhatsApp →
                    </a>
                    <button
                      type="button"
                      className="b2b-btn b2b-btn-ghost-light b2b-btn-sm"
                      onClick={() => handleCopy("wa", COMPANY_INFO.whatsapp)}
                    >
                      {copiedField === "wa" ? "Copied ✓" : "Copy Number"}
                    </button>
                  </div>
                </div>

                <div className="b2b-contact-item">
                  <span className="b2b-contact-label">Factory Address &amp; Port</span>
                  <p style={{ fontSize: "0.88rem", color: "#E2E8F0" }}>
                    {COMPANY_INFO.address}
                    <br />
                    Loading Port: {COMPANY_INFO.port}
                  </p>
                </div>

                <div className="b2b-sample-banner">
                  <h4 style={{ fontSize: "1rem", marginBottom: "6px" }}>
                    Free Physical Sample Swatch Box
                  </h4>
                  <p
                    style={{
                      fontSize: "0.84rem",
                      color: "#E2E8F0",
                      marginBottom: "12px"
                    }}
                  >
                    We provide free A4 physical membrane &amp; coating samples via DHL/FedEx for contractor submittal approval and quality evaluation.
                  </p>
                  <button
                    type="button"
                    className="b2b-btn b2b-btn-primary b2b-btn-sm"
                    onClick={() => {
                      setSampleSubmitted(false);
                      setSampleModalOpen(true);
                    }}
                  >
                    Request Free Sample Box
                  </button>
                </div>
              </div>

              {/* Right Column: Standard B2B Inquiry Form */}
              <div className="b2b-rfq-card">
                <h3
                  style={{
                    fontSize: "1.35rem",
                    color: "var(--color-primary)",
                    marginBottom: "6px"
                  }}
                >
                  Send Your Inquiry Direct to Factory
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--color-text-secondary)",
                    marginBottom: "20px"
                  }}
                >
                  Fill out your project or wholesale requirements below. Our export manager will reply with FOB/CIF pricing and TDS files.
                </p>

                {rfqSubmitted ? (
                  <div
                    style={{
                      backgroundColor: "#F0FDF4",
                      border: "1px solid #86EFAC",
                      borderRadius: "var(--radius-md)",
                      padding: "24px"
                    }}
                  >
                    <h4
                      style={{
                        color: "var(--color-success)",
                        fontSize: "1.1rem",
                        marginBottom: "8px"
                      }}
                    >
                      Inquiry Prepared Successfully — Thank You, {rfqForm.company}!
                    </h4>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--color-text-main)",
                        marginBottom: "16px"
                      }}
                    >
                      Click either button below to send your inquiry immediately via Email or WhatsApp to our export team:
                    </p>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <a
                        className="b2b-btn b2b-btn-primary b2b-btn-sm"
                        href={`mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(
                          `[Product Inquiry] ${rfqForm.company} (${rfqForm.country})`
                        )}&body=${encodeURIComponent(
                          `Company: ${rfqForm.company}\nEmail: ${rfqForm.email}\nCountry: ${rfqForm.country}\nApplication: ${rfqForm.projectType}\nProducts of Interest: ${rfqForm.productInterest || "General Catalog"}\nQuantity: ${rfqForm.quantity}\nDestination Port: ${rfqForm.port || "TBD"}\nFree Sample Box Needed: ${rfqForm.requestSampleBox ? "Yes" : "No"}\n\nNotes:\n${rfqForm.notes}`
                        )}`}
                      >
                        Send via Email ({COMPANY_INFO.email})
                      </a>
                      <a
                        className="b2b-btn b2b-btn-whatsapp b2b-btn-sm"
                        target="_blank"
                        rel="noreferrer"
                        href={`https://wa.me/8616658506707?text=${encodeURIComponent(
                          `Hello Mingze Waterproof, Inquiry from ${rfqForm.company} (${rfqForm.country}). Email: ${rfqForm.email}. Product: ${rfqForm.productInterest || "Waterproofing Materials"}. Qty: ${rfqForm.quantity}. Port: ${rfqForm.port || "TBD"}.`
                        )}`}
                      >
                        Send via WhatsApp (+86 16658506707)
                      </a>
                      <button
                        type="button"
                        className="b2b-btn b2b-btn-outline b2b-btn-sm"
                        onClick={() => setRfqSubmitted(false)}
                      >
                        Modify Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRfqSubmit} noValidate>
                    <div className="b2b-form-row">
                      <div className="b2b-field">
                        <label htmlFor="rfq-company">Company Name *</label>
                        <input
                          id="rfq-company"
                          type="text"
                          className="b2b-input"
                          value={rfqForm.company}
                          onChange={(e) =>
                            setRfqForm({ ...rfqForm, company: e.target.value })
                          }
                          placeholder="Your company or contractor name"
                        />
                        {rfqErrors.company && (
                          <span className="b2b-field-error">{rfqErrors.company}</span>
                        )}
                      </div>

                      <div className="b2b-field">
                        <label htmlFor="rfq-email">Business Email *</label>
                        <input
                          id="rfq-email"
                          type="email"
                          className="b2b-input"
                          value={rfqForm.email}
                          onChange={(e) =>
                            setRfqForm({ ...rfqForm, email: e.target.value })
                          }
                          placeholder="name@company.com"
                        />
                        {rfqErrors.email && (
                          <span className="b2b-field-error">{rfqErrors.email}</span>
                        )}
                      </div>
                    </div>

                    <div className="b2b-form-row">
                      <div className="b2b-field">
                        <label htmlFor="rfq-country">Country / Region *</label>
                        <input
                          id="rfq-country"
                          type="text"
                          className="b2b-input"
                          value={rfqForm.country}
                          onChange={(e) =>
                            setRfqForm({ ...rfqForm, country: e.target.value })
                          }
                          placeholder="e.g. UAE, Saudi Arabia, Singapore, Chile"
                        />
                        {rfqErrors.country && (
                          <span className="b2b-field-error">{rfqErrors.country}</span>
                        )}
                      </div>

                      <div className="b2b-field">
                        <label htmlFor="rfq-type">Project / Business Type</label>
                        <select
                          id="rfq-type"
                          className="b2b-select"
                          value={rfqForm.projectType}
                          onChange={(e) =>
                            setRfqForm({ ...rfqForm, projectType: e.target.value })
                          }
                        >
                          <option value="Commercial / Industrial Roofing">
                            Commercial / Industrial Roofing
                          </option>
                          <option value="Underground Basement & Foundation">
                            Underground Basement &amp; Foundation
                          </option>
                          <option value="Exposed Metal Roof Refurbishment">
                            Exposed Metal Roof Refurbishment
                          </option>
                          <option value="Bridges, Tunnels & Civil Engineering">
                            Bridges, Tunnels &amp; Civil Engineering
                          </option>
                          <option value="Building Material Distributor / OEM">
                            Building Material Distributor / OEM
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="b2b-field">
                      <label htmlFor="rfq-product">
                        Product Name or Model Number
                      </label>
                      <input
                        id="rfq-product"
                        type="text"
                        className="b2b-input"
                        value={rfqForm.productInterest}
                        onChange={(e) =>
                          setRfqForm({
                            ...rfqForm,
                            productInterest: e.target.value
                          })
                        }
                        placeholder="e.g. MZ-CAT-01 SBS Membrane, TPO Sheet, or click 'Inquire Now' on any product card"
                      />
                    </div>

                    <div className="b2b-form-row">
                      <div className="b2b-field">
                        <label htmlFor="rfq-qty">
                          Estimated Order Quantity *
                        </label>
                        <input
                          id="rfq-qty"
                          type="text"
                          className="b2b-input"
                          value={rfqForm.quantity}
                          onChange={(e) =>
                            setRfqForm({ ...rfqForm, quantity: e.target.value })
                          }
                          placeholder="e.g. 20,000 m² or 1×20GP Container"
                        />
                        {rfqErrors.quantity && (
                          <span className="b2b-field-error">{rfqErrors.quantity}</span>
                        )}
                      </div>

                      <div className="b2b-field">
                        <label htmlFor="rfq-port">
                          Destination Port (for CIF Quote)
                        </label>
                        <input
                          id="rfq-port"
                          type="text"
                          className="b2b-input"
                          value={rfqForm.port}
                          onChange={(e) =>
                            setRfqForm({ ...rfqForm, port: e.target.value })
                          }
                          placeholder="e.g. Jebel Ali, Port Klang, Santos"
                        />
                      </div>
                    </div>

                    <label className="b2b-checkbox-box">
                      <input
                        type="checkbox"
                        checked={rfqForm.requestSampleBox}
                        onChange={(e) =>
                          setRfqForm({
                            ...rfqForm,
                            requestSampleBox: e.target.checked
                          })
                        }
                      />
                      <div>
                        <strong
                          style={{
                            display: "block",
                            fontSize: "0.88rem",
                            color: "var(--color-primary)"
                          }}
                        >
                          Request Free Physical Sample Box Together With Quote
                        </strong>
                        <span
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--color-text-secondary)"
                          }}
                        >
                          Includes A4 membrane cuts, TDS sheets, and lab test reports.
                        </span>
                      </div>
                    </label>

                    <div className="b2b-field">
                      <label htmlFor="rfq-notes">
                        Detailed Specifications / Thickness / Reinforcement / OEM Requirements
                      </label>
                      <textarea
                        id="rfq-notes"
                        className="b2b-textarea"
                        value={rfqForm.notes}
                        onChange={(e) =>
                          setRfqForm({ ...rfqForm, notes: e.target.value })
                        }
                        placeholder="Please let us know your required thickness, surface finish (PE film / sand / mineral slate), or custom packaging needs..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="b2b-btn b2b-btn-primary b2b-btn-lg"
                      style={{ width: "100%" }}
                    >
                      Submit Inquiry for Factory Quote
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ====================================================================
          10. CORPORATE FOOTER
          ==================================================================== */}
      <footer className="b2b-footer" data-component="footer">
        <div className="b2b-container">
          <div className="b2b-footer-grid">
            <div className="b2b-footer-col">
              <h4>{COMPANY_INFO.name}</h4>
              <p style={{ fontSize: "0.86rem", marginBottom: "12px" }}>
                Direct manufacturer and global exporter of SBS/APP modified bitumen membranes, TPO/PVC/HDPE polymeric sheets, liquid waterproof coatings, and butyl sealing tapes since 2008.
              </p>
              <p style={{ fontSize: "0.8rem", color: "#94A3B8" }}>
                Factory Base: {COMPANY_INFO.address}
              </p>
            </div>

            <div className="b2b-footer-col">
              <h4>Product Categories</h4>
              <ul className="b2b-footer-links">
                {CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <a
                      href="#products"
                      onClick={() => setActiveCategory(cat.id)}
                    >
                      {cat.shortName} ({cat.count})
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="b2b-footer-col">
              <h4>Quick Navigation</h4>
              <ul className="b2b-footer-links">
                <li>
                  <a href="#series">5 Core Product Series</a>
                </li>
                <li>
                  <a href="#products">All 37 Export Products</a>
                </li>
                <li>
                  <a href="#solutions">Engineering Solutions</a>
                </li>
                <li>
                  <a href="#factory">Factory &amp; Quality Control</a>
                </li>
                <li>
                  <a href="#contact">Request A Quote</a>
                </li>
              </ul>
            </div>

            <div className="b2b-footer-col">
              <h4>Export Department</h4>
              <ul className="b2b-footer-links">
                <li>
                  <a href={`mailto:${COMPANY_INFO.email}`}>
                    Email: {COMPANY_INFO.email}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${COMPANY_INFO.altEmail}`}>
                    Alt Email: {COMPANY_INFO.altEmail}
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
                <li>Port: {COMPANY_INFO.port}</li>
              </ul>
            </div>
          </div>

          <div className="b2b-footer-bottom">
            <span>
              © {new Date().getFullYear()} {COMPANY_INFO.name} All Rights Reserved.
            </span>
            <span>
              ISO9001:2015 · ISO14001:2015 · CE EN 13707 / EN 13956 · ASTM Compliant
            </span>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Quick Chat Button */}
      <a
        href={COMPANY_INFO.whatsappLink}
        target="_blank"
        rel="noreferrer"
        className="b2b-floating-wa"
        aria-label="Chat with Mingze Waterproof on WhatsApp"
      >
        <span>WhatsApp: {COMPANY_INFO.whatsapp}</span>
      </a>

      {/* ====================================================================
          MODAL 1: PRODUCT TECHNICAL DATA SHEET (TDS) MODAL
          ==================================================================== */}
      {selectedProduct && (
        <div
          className="b2b-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tds-title"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="b2b-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="b2b-modal-header">
              <div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#93C5FD",
                    fontWeight: 700,
                    textTransform: "uppercase"
                  }}
                >
                  Technical Data Sheet (TDS) · Model {selectedProduct.code}
                </span>
                <h3 id="tds-title" style={{ fontSize: "1.15rem", marginTop: "2px" }}>
                  {selectedProduct.name}
                </h3>
              </div>
              <button
                type="button"
                className="b2b-modal-close"
                onClick={() => setSelectedProduct(null)}
              >
                Close ✕
              </button>
            </div>

            <div className="b2b-modal-body">
              <div className="b2b-modal-top-split">
                <div
                  style={{
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    padding: "14px",
                    backgroundColor: "#FFFFFF"
                  }}
                >
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    style={{ width: "100%", height: "auto", objectFit: "contain" }}
                  />
                </div>

                <div>
                  <span className="b2b-eyebrow" style={{ marginBottom: "8px" }}>
                    {selectedProduct.categoryName}
                  </span>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "var(--color-text-main)",
                      marginBottom: "14px"
                    }}
                  >
                    {selectedProduct.brief}
                  </p>
                  <div className="b2b-product-specs" style={{ marginBottom: 0 }}>
                    <div className="b2b-spec-line">
                      <span>Execution Standards:</span>
                      <strong>{selectedProduct.standards}</strong>
                    </div>
                    <div className="b2b-spec-line">
                      <span>Thickness / Spec:</span>
                      <strong>{selectedProduct.thickness}</strong>
                    </div>
                    <div className="b2b-spec-line">
                      <span>Packaging / Roll Size:</span>
                      <strong>{selectedProduct.rollSize}</strong>
                    </div>
                    <div className="b2b-spec-line">
                      <span>Applications:</span>
                      <strong>{selectedProduct.applications}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <h4
                style={{
                  fontSize: "0.95rem",
                  color: "var(--color-primary)",
                  marginBottom: "8px"
                }}
              >
                Key Product Advantages &amp; Features
              </h4>
              <ul
                style={{
                  paddingLeft: "20px",
                  marginBottom: "20px",
                  fontSize: "0.88rem",
                  color: "var(--color-text-secondary)"
                }}
              >
                {selectedProduct.features.map((f) => (
                  <li key={f} style={{ marginBottom: "4px" }}>
                    {f}
                  </li>
                ))}
              </ul>

              <h4
                style={{
                  fontSize: "0.95rem",
                  color: "var(--color-primary)",
                  marginBottom: "6px"
                }}
              >
                Technical Parameters &amp; Laboratory Test Data
              </h4>
              <table className="b2b-tds-table">
                <thead>
                  <tr>
                    <th>Property / Test Item</th>
                    <th>Standard Specification Value</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProduct.specs.map((row) => (
                    <tr key={row.property}>
                      <td>{row.property}</td>
                      <td>
                        <strong>{row.value}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  flexWrap: "wrap"
                }}
              >
                <button
                  type="button"
                  className="b2b-btn b2b-btn-outline b2b-btn-sm"
                  onClick={() => window.print()}
                >
                  Print / Save PDF
                </button>
                <button
                  type="button"
                  className="b2b-btn b2b-btn-primary b2b-btn-sm"
                  onClick={() => handleInquireProduct(selectedProduct)}
                >
                  Inquire Now for {selectedProduct.code} →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: FREE SAMPLE SWATCH BOX REQUEST MODAL
          ==================================================================== */}
      {sampleModalOpen && (
        <div
          className="b2b-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sample-title"
          onClick={() => setSampleModalOpen(false)}
        >
          <div
            className="b2b-modal-card"
            style={{ maxWidth: "600px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="b2b-modal-header">
              <div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#93C5FD",
                    fontWeight: 700,
                    textTransform: "uppercase"
                  }}
                >
                  DHL / FedEx Global Dispatch
                </span>
                <h3 id="sample-title" style={{ fontSize: "1.15rem", marginTop: "2px" }}>
                  Request Free Physical Sample Swatch Box
                </h3>
              </div>
              <button
                type="button"
                className="b2b-modal-close"
                onClick={() => setSampleModalOpen(false)}
              >
                Close ✕
              </button>
            </div>

            <div className="b2b-modal-body">
              {sampleSubmitted ? (
                <div
                  style={{
                    backgroundColor: "#F0FDF4",
                    border: "1px solid #86EFAC",
                    borderRadius: "var(--radius-md)",
                    padding: "20px"
                  }}
                >
                  <h4
                    style={{
                      color: "var(--color-success)",
                      marginBottom: "8px"
                    }}
                  >
                    Sample Request Ready for {sampleForm.company}
                  </h4>
                  <p
                    style={{
                      fontSize: "0.88rem",
                      marginBottom: "14px"
                    }}
                  >
                    Click below to confirm your delivery details with our export team via Email or WhatsApp:
                  </p>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <a
                      className="b2b-btn b2b-btn-primary b2b-btn-sm"
                      href={`mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(
                        `[Free Sample Box Request] ${sampleForm.company}`
                      )}&body=${encodeURIComponent(
                        `Company: ${sampleForm.company}\nContact Name: ${sampleForm.contactName}\nEmail: ${sampleForm.email}\nCountry/City: ${sampleForm.country}\nRequired Samples: ${sampleForm.notes}`
                      )}`}
                    >
                      Confirm via Email
                    </a>
                    <a
                      className="b2b-btn b2b-btn-whatsapp b2b-btn-sm"
                      target="_blank"
                      rel="noreferrer"
                      href={`https://wa.me/8616658506707?text=${encodeURIComponent(
                        `Hello Mingze Waterproof, I would like to request the Free Sample Box for ${sampleForm.company} (${sampleForm.country}). Contact: ${sampleForm.contactName} (${sampleForm.email}). Samples needed: ${sampleForm.notes}`
                      )}`}
                    >
                      Confirm via WhatsApp
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSampleSubmit}>
                  <p
                    style={{
                      fontSize: "0.88rem",
                      color: "var(--color-text-secondary)",
                      marginBottom: "16px"
                    }}
                  >
                    Enter your company and delivery details below to receive complimentary A4 membrane cuts and technical catalogs:
                  </p>
                  <div className="b2b-form-row">
                    <div className="b2b-field">
                      <label htmlFor="s-company">Company Name *</label>
                      <input
                        id="s-company"
                        type="text"
                        required
                        className="b2b-input"
                        value={sampleForm.company}
                        onChange={(e) =>
                          setSampleForm({ ...sampleForm, company: e.target.value })
                        }
                        placeholder="Your company name"
                      />
                    </div>
                    <div className="b2b-field">
                      <label htmlFor="s-contact">Contact Person *</label>
                      <input
                        id="s-contact"
                        type="text"
                        required
                        className="b2b-input"
                        value={sampleForm.contactName}
                        onChange={(e) =>
                          setSampleForm({
                            ...sampleForm,
                            contactName: e.target.value
                          })
                        }
                        placeholder="Your name & title"
                      />
                    </div>
                  </div>
                  <div className="b2b-form-row">
                    <div className="b2b-field">
                      <label htmlFor="s-email">Business Email *</label>
                      <input
                        id="s-email"
                        type="email"
                        required
                        className="b2b-input"
                        value={sampleForm.email}
                        onChange={(e) =>
                          setSampleForm({ ...sampleForm, email: e.target.value })
                        }
                        placeholder="name@company.com"
                      />
                    </div>
                    <div className="b2b-field">
                      <label htmlFor="s-country">Country &amp; City *</label>
                      <input
                        id="s-country"
                        type="text"
                        required
                        className="b2b-input"
                        value={sampleForm.country}
                        onChange={(e) =>
                          setSampleForm({ ...sampleForm, country: e.target.value })
                        }
                        placeholder="e.g. Dubai, UAE"
                      />
                    </div>
                  </div>
                  <div className="b2b-field">
                    <label htmlFor="s-notes">
                      Samples Needed (e.g. SBS 4mm, TPO 1.5mm, HDPE, PU Coating)
                    </label>
                    <input
                      id="s-notes"
                      type="text"
                      className="b2b-input"
                      value={sampleForm.notes}
                      onChange={(e) =>
                        setSampleForm({ ...sampleForm, notes: e.target.value })
                      }
                      placeholder="Specify product models or thickness..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="b2b-btn b2b-btn-primary"
                    style={{ width: "100%" }}
                  >
                    Submit Sample Box Request
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

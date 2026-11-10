import React, { useState, useMemo, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import {
  COMPANY_INFO,
  CATEGORIES,
  PRODUCTS,
  SOLUTIONS,
  WHY_CHOOSE_US,
  EXPORT_FAQS,
  COMPARISON_MATRIX
} from "./data";

const HERO_SLIDES = [
  {
    label: "SBS / APP Bitumen",
    title: "SBS & APP Modified Bitumen Membrane",
    spec: "3.0mm / 4.0mm / 5.0mm · Torch-On & Self-Adhesive Rolls",
    image: "/assets/images/products/cat-01-v2.jpg"
  },
  {
    label: "Pre-Applied HDPE",
    title: "Pre-Applied HDPE Waterproof Membrane",
    image: "/assets/images/products/cat-11-v2.png"
  },
  {
    label: "TPO / PVC Sheet",
    title: "TPO & PVC Single-Ply Roofing Membrane",
    image: "/assets/images/products/cat-08-v2.jpg"
  },
  {
    label: "Liquid Coating",
    title: "Polyurethane & Polyurea Waterproof Coating",
    image: "/assets/images/products/cat-17-v2.jpg"
  }
];

function App() {
  const [heroSlide, setHeroSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [rfqForm, setRfqForm] = useState({
    company: "",
    email: "",
    country: "",
    product: "",
    quantity: "",
    notes: ""
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape" && selectedProduct) {
        setSelectedProduct(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedProduct]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchCat =
        activeCategory === "all" || item.categoryId === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchCat;
      return (
        matchCat &&
        (item.code.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q) ||
          item.standards.toLowerCase().includes(q))
      );
    });
  }, [activeCategory, searchQuery]);

  const visibleProducts = filteredProducts;

  const handleInquireProduct = (product) => {
    setSelectedProduct(null);
    setRfqForm((prev) => ({
      ...prev,
      product: `${product.code} — ${product.name}`
    }));
    setSubmitted(false);
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!rfqForm.company.trim() || !rfqForm.email.trim()) return;
    setSubmitted(true);
  };

  return (
    <div>
      {/* 1. Minimalist Sticky Header */}
      <header className="min-header">
        <div className="min-header-inner">
          <a href="#top" className="min-brand">
            <img
              src="/assets/images/brand-logo-v2.png"
              alt="Mingze Waterproof 明泽防水"
              className="min-brand-logo"
            />
          </a>

          <nav className="min-nav">
            <a href="#products">Products</a>
            <a href="#solutions">Solutions</a>
            <a href="#factory">Factory</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="min-header-right">
            <a
              href={COMPANY_INFO.whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="min-btn min-btn-ghost"
            >
              WhatsApp
            </a>
            <a href="#contact" className="min-btn min-btn-dark">
              Get Quote
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        {/* 2. Minimalist Hero */}
        <section className="min-hero">
          <div className="min-container">
            <div className="min-hero-grid">
              <div>
                <span className="min-tag">
                  Direct Manufacturer · Est. 2008 · Shandong, China
                </span>
                <h1>
                  Engineered Waterproofing Membranes &amp; Coatings.
                </h1>
                <p className="min-hero-lead">
                  We manufacture and export 37 standardized waterproofing products across SBS/APP bitumen, TPO/PVC/HDPE membranes, and liquid coatings with ISO, CE, and ASTM compliance.
                </p>

                <div className="min-hero-btns">
                  <a href="#products" className="min-btn min-btn-dark">
                    Explore 37 Products
                  </a>
                  <a href="#contact" className="min-btn min-btn-ghost">
                    Request Price List &amp; Samples
                  </a>
                </div>

                <div className="min-metrics">
                  <div>
                    <div className="min-metric-num">68,000 m²</div>
                    <div className="min-metric-label">Factory Area</div>
                  </div>
                  <div>
                    <div className="min-metric-num">50M+ m²</div>
                    <div className="min-metric-label">Annual Capacity</div>
                  </div>
                  <div>
                    <div className="min-metric-num">37 SKUs</div>
                    <div className="min-metric-label">5 Core Series</div>
                  </div>
                  <div>
                    <div className="min-metric-num">200 km</div>
                    <div className="min-metric-label">To Qingdao Port</div>
                  </div>
                </div>
              </div>

              <div className="min-hero-visual">
                <div className="min-hero-img-wrap">
                  <img
                    src={HERO_SLIDES[heroSlide].image}
                    alt={HERO_SLIDES[heroSlide].title}
                  />
                </div>
                <div className="min-hero-dots">
                  <span className="min-hero-caption">
                    {HERO_SLIDES[heroSlide].title}
                  </span>
                  <div className="min-dot-group">
                    {HERO_SLIDES.map((s, idx) => (
                      <button
                        key={s.label}
                        type="button"
                        className={`min-dot-btn ${
                          heroSlide === idx ? "active" : ""
                        }`}
                        onClick={() => setHeroSlide(idx)}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Minimalist Product Gallery (Clean 4-Column Cards) */}
        <section id="products" className="min-section">
          <div className="min-container">
            <div className="min-sec-head">
              <div>
                <span className="min-tag">Product Catalog</span>
                <h2>Waterproofing Products</h2>
                <p>Click any product to view full technical specifications and TDS data.</p>
              </div>
              <input
                type="search"
                className="min-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search model or keyword..."
              />
            </div>

            <div className="min-filter-bar">
              <div className="min-tabs">
                <button
                  type="button"
                  className={`min-tab ${activeCategory === "all" ? "active" : ""}`}
                  onClick={() => setActiveCategory("all")}
                >
                  All
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`min-tab ${
                      activeCategory === cat.id ? "active" : ""
                    }`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    {cat.shortName}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-product-grid">
              {visibleProducts.map((product) => (
                <article
                  key={product.id}
                  className="min-card"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="min-card-img">
                    <img
                      src={product.image}
                      alt={`${product.code} ${product.name} (${product.standards})`}
                      loading="lazy"
                    />
                  </div>
                  <div className="min-card-meta">
                    {product.code} · {product.categoryName}
                  </div>
                  <h3 className="min-card-title">{product.name}</h3>
                  <div className="min-card-spec">
                    {product.thickness} · {product.standards.split("/")[0].trim()}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Minimalist Application Solutions */}
        <section id="solutions" className="min-section-soft">
          <div className="min-container">
            <div className="min-sec-head">
              <div>
                <span className="min-tag">Applications</span>
                <h2>Engineering Solutions</h2>
              </div>
            </div>

            <div className="min-three-grid">
              {SOLUTIONS.map((sol, idx) => (
                <div key={sol.id} className="min-clean-box">
                  <div className="min-clean-num">0{idx + 1} / SYSTEM</div>
                  <h3>{sol.title}</h3>
                  <p>{sol.description}</p>
                </div>
              ))}
            </div>

            <div className="min-table-wrap">
              <table className="min-compare-table">
                <caption>
                  <span className="min-visually-hidden">
                    Waterproofing Membrane Technical Comparison and 20GP Container Loading Guide
                  </span>
                </caption>
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
                  {COMPARISON_MATRIX.map((row) => (
                    <tr key={row.system}>
                      <td>
                        <strong>{row.system}</strong>
                      </td>
                      <td>{row.standard}</td>
                      <td>{row.thickness}</td>
                      <td>{row.tempRange}</td>
                      <td>{row.application}</td>
                      <td>{row.loading20GP}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 5. Minimalist Factory & Quality */}
        <section id="factory" className="min-section">
          <div className="min-container">
            <div className="min-sec-head">
              <div>
                <span className="min-tag">Manufacturing Base</span>
                <h2>Why Partner With Mingze</h2>
              </div>
            </div>

            <div className="min-three-grid">
              {WHY_CHOOSE_US.map((item, idx) => (
                <div key={item.title} className="min-clean-box">
                  <div className="min-clean-num">0{idx + 1}</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5.5 Minimalist Technical & Export FAQ (GEO & SEO Structured Section) */}
        <section id="faq" className="min-section-soft">
          <div className="min-container">
            <div className="min-sec-head">
              <div>
                <span className="min-tag">Technical &amp; Export FAQ</span>
                <h2>Frequently Asked Questions</h2>
                <p>
                  Key specifications, ASTM / EN compliance, container loading, and direct export terms.
                </p>
              </div>
            </div>

            <div className="min-faq-list">
              {EXPORT_FAQS.map((item, idx) => (
                <details
                  key={item.q}
                  className="min-faq-item"
                  open={idx === 0}
                >
                  <summary className="min-faq-q">{item.q}</summary>
                  <p className="min-faq-a">{item.a}</p>
                </details>
              ))}
            </div>

            <div className="min-eeat-bar">
              <span>
                <strong>Technical Verification:</strong> Compiled &amp; reviewed by Weifang Mingze Waterproof CNAS-Standard QC Laboratory &amp; Chief Export Engineering Team (ISO 9001:2015 · CE EN 13707 / EN 13956).
              </span>
              <span>
                <strong>Last Updated:</strong> November 2026 · Direct Factory Dossier
              </span>
            </div>
          </div>
        </section>

        {/* 6. Minimalist Contact & Direct Inquiry */}
        <section
          id="contact"
          className="min-section"
          style={{ borderTop: "1px solid var(--line)" }}
        >
          <div className="min-container">
            <div className="min-contact-grid">
              <div>
                <span className="min-tag">Direct Export Desk</span>
                <h2 style={{ fontSize: "2rem", marginBottom: "12px" }}>
                  Get Factory Quote &amp; Free Samples
                </h2>
                <p style={{ color: "var(--text-sub)" }}>
                  Contact our export team directly via Email or WhatsApp for FOB/CIF container pricing, TDS sheets, and free physical sample boxes.
                </p>

                <div className="min-contact-list">
                  <div className="min-contact-row">
                    <span>Email</span>
                    <a href={`mailto:${COMPANY_INFO.email}`}>
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                  <div className="min-contact-row">
                    <span>WhatsApp / Phone</span>
                    <a
                      href={COMPANY_INFO.whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {COMPANY_INFO.whatsapp}
                    </a>
                  </div>
                  <div className="min-contact-row">
                    <span>Factory Location</span>
                    <strong>{COMPANY_INFO.address}</strong>
                  </div>
                  <div className="min-contact-row" style={{ borderBottom: "none" }}>
                    <span>Export Loading Port</span>
                    <strong>{COMPANY_INFO.port}</strong>
                  </div>
                </div>
              </div>

              <div className="min-form">
                {submitted ? (
                  <div>
                    <span className="min-tag">Inquiry Ready</span>
                    <h3 style={{ marginBottom: "8px" }}>
                      Thank you, {rfqForm.company}
                    </h3>
                    <p
                      style={{
                        color: "var(--text-sub)",
                        fontSize: "0.9rem",
                        marginBottom: "20px"
                      }}
                    >
                      Send your inquiry directly via Email or WhatsApp below:
                    </p>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <a
                        className="min-btn min-btn-dark"
                        href={`mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(
                          `Inquiry from ${rfqForm.company}`
                        )}&body=${encodeURIComponent(
                          `Company: ${rfqForm.company}\nEmail: ${rfqForm.email}\nCountry: ${rfqForm.country}\nProduct: ${rfqForm.product}\nQuantity: ${rfqForm.quantity}\nNotes: ${rfqForm.notes}`
                        )}`}
                      >
                        Send via Email
                      </a>
                      <a
                        className="min-btn min-btn-ghost"
                        target="_blank"
                        rel="noreferrer"
                        href={`https://wa.me/8616658506707?text=${encodeURIComponent(
                          `Hello Mingze, Inquiry from ${rfqForm.company} (${rfqForm.country}). Product: ${rfqForm.product}. Qty: ${rfqForm.quantity}.`
                        )}`}
                      >
                        Send via WhatsApp
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit}>
                    <div className="min-form-row">
                      <div className="min-field">
                        <label>Company Name *</label>
                        <input
                          type="text"
                          required
                          className="min-input"
                          value={rfqForm.company}
                          onChange={(e) =>
                            setRfqForm({ ...rfqForm, company: e.target.value })
                          }
                          placeholder="Your company"
                        />
                      </div>
                      <div className="min-field">
                        <label>Business Email *</label>
                        <input
                          type="email"
                          required
                          className="min-input"
                          value={rfqForm.email}
                          onChange={(e) =>
                            setRfqForm({ ...rfqForm, email: e.target.value })
                          }
                          placeholder="name@company.com"
                        />
                      </div>
                    </div>

                    <div className="min-form-row">
                      <div className="min-field">
                        <label>Country / Region</label>
                        <input
                          type="text"
                          className="min-input"
                          value={rfqForm.country}
                          onChange={(e) =>
                            setRfqForm({ ...rfqForm, country: e.target.value })
                          }
                          placeholder="e.g. UAE, Singapore"
                        />
                      </div>
                      <div className="min-field">
                        <label>Estimated Quantity</label>
                        <input
                          type="text"
                          className="min-input"
                          value={rfqForm.quantity}
                          onChange={(e) =>
                            setRfqForm({ ...rfqForm, quantity: e.target.value })
                          }
                          placeholder="e.g. 1×20GP or 20,000 m²"
                        />
                      </div>
                    </div>

                    <div className="min-field">
                      <label>Product of Interest</label>
                      <input
                        type="text"
                        className="min-input"
                        value={rfqForm.product}
                        onChange={(e) =>
                          setRfqForm({ ...rfqForm, product: e.target.value })
                        }
                        placeholder="e.g. SBS 4mm Membrane, TPO Sheet, HDPE..."
                      />
                    </div>

                    <div className="min-field">
                      <label>Specifications &amp; Sample Request</label>
                      <textarea
                        className="min-textarea"
                        value={rfqForm.notes}
                        onChange={(e) =>
                          setRfqForm({ ...rfqForm, notes: e.target.value })
                        }
                        placeholder="Thickness, reinforcement, destination port, or free sample box request..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="min-btn min-btn-dark"
                      style={{ width: "100%" }}
                    >
                      Send Inquiry
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 7. Minimalist Footer */}
      <footer className="min-footer">
        <div className="min-container min-footer-inner">
          <span>© {new Date().getFullYear()} {COMPANY_INFO.name}</span>
          <span>
            {COMPANY_INFO.email} · WhatsApp {COMPANY_INFO.whatsapp}
          </span>
        </div>
      </footer>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          className="min-modal-backdrop"
          onClick={() => setSelectedProduct(null)}
        >
          <div className="min-modal" onClick={(e) => e.stopPropagation()}>
            <div className="min-modal-top">
              <div>
                <span className="min-tag" style={{ marginBottom: "4px" }}>
                  {selectedProduct.code} · {selectedProduct.categoryName}
                </span>
                <h3 style={{ fontSize: "1.25rem" }}>{selectedProduct.name}</h3>
              </div>
              <button
                type="button"
                className="min-btn min-btn-ghost"
                onClick={() => setSelectedProduct(null)}
              >
                Close ✕
              </button>
            </div>

            <div className="min-modal-grid">
              <div
                style={{
                  background: "var(--bg-soft)",
                  border: "1px solid var(--line)",
                  borderRadius: "8px",
                  padding: "16px"
                }}
              >
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                />
              </div>
              <div>
                <p
                  style={{
                    color: "var(--text-sub)",
                    marginBottom: "16px",
                    fontSize: "0.92rem"
                  }}
                >
                  {selectedProduct.brief}
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    fontSize: "0.85rem"
                  }}
                >
                  <div>
                    <span style={{ color: "var(--text-light)", display: "block" }}>
                      Standards
                    </span>
                    <strong>{selectedProduct.standards}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-light)", display: "block" }}>
                      Thickness
                    </span>
                    <strong>{selectedProduct.thickness}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-light)", display: "block" }}>
                      Package
                    </span>
                    <strong>{selectedProduct.rollSize}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-light)", display: "block" }}>
                      Application
                    </span>
                    <span>{selectedProduct.applications}</span>
                  </div>
                </div>
              </div>
            </div>

            <table className="min-spec-table">
              <thead>
                <tr>
                  <th>Technical Property</th>
                  <th>Specification</th>
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

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                className="min-btn min-btn-dark"
                onClick={() => handleInquireProduct(selectedProduct)}
              >
                Inquire This Product →
              </button>
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

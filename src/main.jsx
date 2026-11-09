import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ShieldCheck,
  Building2,
  Mail,
  MapPin,
  FileText,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Search,
  Award,
  Anchor,
  X,
  Send,
  Sparkles,
  Layers,
  ChevronRight,
  ExternalLink,
  PhoneCall
} from 'lucide-react';
import './styles.css';
import {
  COMPANY_INFO,
  CATEGORIES,
  PRODUCTS,
  SOLUTIONS,
  STANDARDS_MATRIX,
  WHY_CHOOSE_US
} from './data.js';

function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteProductCode, setQuoteProductCode] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Filter products by category and search keyword
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchCat = activeTab === 'all' || p.categoryId === activeTab;
      const matchSearch = searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.standards.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.applications.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeTab, searchQuery]);

  const openQuoteModal = (productCode = '') => {
    setQuoteProductCode(productCode);
    setIsQuoteModalOpen(true);
    setFormSubmitted(false);
  };

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setIsQuoteModalOpen(false);
      setFormSubmitted(false);
    }, 2500);
  };

  return (
    <div className="site-wrapper">
      {/* 1. Ultra-Clean Top Utility Strip */}
      <div className="top-utility-bar">
        <div className="top-utility-inner">
          <div className="top-utility-group">
            <span className="top-utility-item">
              <Building2 size={13} color="#3B82F6" />
              <span><strong>Factory Base:</strong> Shouguang, Weifang, China</span>
            </span>
            <span className="top-utility-item">
              <Anchor size={13} color="#10B981" />
              <span><strong>Loading Port:</strong> Qingdao Port (200 km Direct Highway)</span>
            </span>
          </div>

          <div className="top-utility-group">
            <a href={`mailto:${COMPANY_INFO.email}`} className="top-utility-link top-utility-item">
              <Mail size={12} color="#3B82F6" />
              <span>{COMPANY_INFO.email}</span>
            </a>
            <a href={COMPANY_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" className="top-utility-item" style={{ color: '#25D366', fontWeight: 600 }}>
              <MessageCircle size={13} />
              <span>WhatsApp: {COMPANY_INFO.whatsapp}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Architectural Sticky Header */}
      <header className="site-header">
        <div className="header-inner">
          <a href="#" className="brand-logo-area">
            <div className="brand-badge">MZ</div>
            <div className="brand-text">
              <h1>MINGZE WATERPROOF</h1>
              <span>Weifang Mingze Waterproof Material Co., Ltd.</span>
            </div>
          </a>

          <nav className="site-nav">
            <a href="#products" className="nav-link">Products ({PRODUCTS.length})</a>
            <a href="#solutions" className="nav-link">Solutions</a>
            <a href="#standards" className="nav-link">Technical & QA</a>
            <a href="#about" className="nav-link">Factory</a>
            <a href="#contact" className="nav-link">Contact</a>
          </nav>

          <div className="header-actions">
            <a href={COMPANY_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-sm">
              <MessageCircle size={15} /> WhatsApp
            </a>
            <button onClick={() => openQuoteModal()} className="btn btn-primary btn-sm">
              Get FOB Quote <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* 3. Hero Section - Industrial Editorial */}
      <section className="hero-architectural">
        <div className="section-container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="eyebrow eyebrow-dark">
                <Sparkles size={13} /> Direct Manufacturer Export Gateway
              </div>
              <h1>High-Performance Waterproofing Systems for Global Infrastructure.</h1>
              <p className="hero-lead">
                Direct factory manufacturing of ASTM, CE & GB certified SBS/APP modified bitumen, TPO/PVC/EPDM single-ply sheets, pre-applied HDPE blindside membranes, and liquid elastomeric polymer coatings.
              </p>

              <div className="hero-btn-row">
                <button onClick={() => openQuoteModal()} className="btn btn-primary btn-lg">
                  Request Product Catalog & TDS <FileText size={16} />
                </button>
                <a href={COMPANY_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
                  <MessageCircle size={16} /> Direct Export Desk
                </a>
              </div>

              {/* 4 Metrics in One Aligned Row */}
              <div className="hero-metrics-bar">
                <div className="hero-metric-item">
                  <div className="metric-num">68,000 m²</div>
                  <div className="metric-label">Automated Base</div>
                </div>
                <div className="hero-metric-item">
                  <div className="metric-num">50M m²</div>
                  <div className="metric-label">Annual Output</div>
                </div>
                <div className="hero-metric-item">
                  <div className="metric-num">ASTM / CE / GB</div>
                  <div className="metric-label">Certified Testing</div>
                </div>
                <div className="hero-metric-item">
                  <div className="metric-num">200 km</div>
                  <div className="metric-label">To Qingdao Port</div>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Card */}
            <div className="hero-showcase-card">
              <div className="hero-showcase-header">
                <span>Production & Quality Control</span>
                <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={13} /> CNAS Tested
                </span>
              </div>
              <img
                src="/assets/images/product-bitumen.jpg"
                alt="Mingze Waterproof Factory and Material Standards"
                className="hero-showcase-img"
              />
              <div className="hero-showcase-body">
                <h3>Full-Spectrum Waterproofing Materials</h3>
                <p>
                  Containerized FOB & CIF export to 30+ countries across Southeast Asia, Middle East, Europe, South America, and Africa.
                </p>
                <div className="hero-showcase-tags">
                  <span className="hero-showcase-tag">ISO9001:2015</span>
                  <span className="hero-showcase-tag">EN 13707</span>
                  <span className="hero-showcase-tag">ASTM D6164</span>
                  <span className="hero-showcase-tag">OEM / ODM Customization</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Editorial Category Family Navigator */}
      <section className="category-family-bar">
        <div className="section-container">
          <div className="category-family-grid">
            {CATEGORIES.map((cat, idx) => (
              <div
                key={cat.id}
                className={`category-family-card ${activeTab === cat.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(cat.id);
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div>
                  <div className="category-card-top">
                    <span className="category-card-index">0{idx + 1}</span>
                    <span className="category-card-count">{cat.count} SKUs</span>
                  </div>
                  <h4 className="category-card-title">{cat.name}</h4>
                </div>
                <p className="category-card-brief">{cat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Complete Product Inventory & Catalog Section */}
      <section className="section-block" id="products">
        <div className="section-container">
          <div className="catalog-header-bar">
            <div>
              <span className="eyebrow">Material Catalog (37 SKUs)</span>
              <h2 className="section-heading">Full Technical Material Inventory</h2>
              <p className="section-desc">
                Select any material to inspect exact laboratory specifications, thickness options, and international compliance standards.
              </p>
            </div>

            <div className="catalog-search-wrap">
              <Search size={16} className="catalog-search-icon" />
              <input
                type="text"
                placeholder="Search name, code, standard..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="catalog-search-input"
              />
            </div>
          </div>

          {/* Filter Tab Chips */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '28px' }}>
            <button
              onClick={() => setActiveTab('all')}
              className={`btn btn-sm ${activeTab === 'all' ? 'btn-dark' : 'btn-outline'}`}
            >
              All Materials ({PRODUCTS.length})
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`btn btn-sm ${activeTab === cat.id ? 'btn-dark' : 'btn-outline'}`}
              >
                {cat.shortName} ({cat.count})
              </button>
            ))}
          </div>

          {/* Product Cards Grid */}
          <div className="products-grid-architectural">
            {filteredProducts.map(prod => (
              <div key={prod.id} className="product-card">
                <div className="product-card-img-frame">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    loading="lazy"
                    onError={(e) => { e.target.src = '/assets/images/placeholder.svg'; }}
                  />
                  <div className="product-code-pill">{prod.code}</div>
                  <div className="product-cat-pill">{prod.categoryName.split(' ')[0]}</div>
                </div>

                <div className="product-card-content">
                  <h3 className="product-card-title">{prod.name}</h3>
                  <p className="product-card-desc">{prod.brief}</p>

                  <div className="product-card-specs-box">
                    <div className="product-card-specs-row">
                      <span>Standard</span>
                      <span>{prod.standards}</span>
                    </div>
                    {prod.thickness && (
                      <div className="product-card-specs-row">
                        <span>Dimensions</span>
                        <span>{prod.thickness}</span>
                      </div>
                    )}
                  </div>

                  <div className="product-card-actions">
                    <button
                      onClick={() => setSelectedProduct(prod)}
                      className="btn btn-outline btn-sm"
                    >
                      <FileText size={14} /> Full TDS & Specs
                    </button>
                    <button
                      onClick={() => openQuoteModal(prod.code)}
                      className="btn btn-primary btn-sm"
                    >
                      Inquire
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '64px 24px', background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem', marginBottom: '16px' }}>
                No materials match your search keyword.
              </p>
              <button onClick={() => { setSearchQuery(''); setActiveTab('all'); }} className="btn btn-primary">
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 6. High-Contrast Architectural Solutions Section */}
      <section className="solutions-dark-section" id="solutions">
        <div className="section-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span className="eyebrow eyebrow-dark">Integrated Engineering Systems</span>
              <h2 style={{ color: '#fff', fontSize: '2.1rem', letterSpacing: '-0.03em', marginBottom: '8px' }}>
                Engineered Waterproofing Solutions
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.95rem', maxWidth: '580px', margin: 0 }}>
                Tested multi-layer system assemblies engineered for high hydrostatic pressure, extreme weather cycles, and industrial environments.
              </p>
            </div>
          </div>

          <div className="solutions-grid">
            {SOLUTIONS.map(sol => (
              <div key={sol.id} className="solution-card-dark">
                <div>
                  <div className="solution-eyebrow">{sol.subtitle}</div>
                  <h3 className="solution-title">{sol.title}</h3>
                  <p className="solution-desc">{sol.description}</p>

                  <div className="solution-layers-box">
                    <div className="solution-layers-title">Standard System Assembly:</div>
                    {sol.systemLayers.map((layer, idx) => (
                      <div key={idx} className="solution-layer-item">
                        <span className="solution-layer-num">{idx + 1}</span>
                        <span>{layer}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="solution-footer-row">
                  <div className="solution-product-chips">
                    {sol.recommendedProducts.map(pcode => (
                      <span key={pcode} className="solution-product-chip">{pcode}</span>
                    ))}
                  </div>
                  <button onClick={() => openQuoteModal(sol.title)} className="btn btn-outline btn-sm" style={{ color: '#fff', borderColor: '#334155', background: 'transparent' }}>
                    Inquire System Spec
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Standards & QA Verification Matrix */}
      <section className="section-block" id="standards">
        <div className="section-container">
          <div>
            <span className="eyebrow">Quality Assurance Protocol</span>
            <h2 className="section-heading">International Compliance & Testing Matrix</h2>
            <p className="section-desc">
              Every production batch undergoes mandatory CNAS-certified laboratory inspection with issued Mill Test Reports and Certificates of Analysis (COA).
            </p>
          </div>

          {/* 3-Step QA Pathway */}
          <div className="qa-pipeline-grid">
            <div className="qa-step-card">
              <div className="qa-step-num">01</div>
              <h4>Raw Polymer Screening</h4>
              <p>
                Incoming virgin resins, synthetic rubber, and bitumen are strictly tested for penetration index, softening point, and melt flow rate prior to compounding.
              </p>
            </div>
            <div className="qa-step-card">
              <div className="qa-step-num">02</div>
              <h4>Laser Inline Gauging</h4>
              <p>
                Automated laser thickness micrometers continuously scan the entire 2.0m - 8.0m roll width during continuous calendar and extrusion production.
              </p>
            </div>
            <div className="qa-step-card">
              <div className="qa-step-num">03</div>
              <h4>Batch COA Certification</h4>
              <p>
                Mandatory hydrostatic pressure testing at 0.7 MPa, -25°C low-temperature flex bending, and tensile break tests for every finished production lot.
              </p>
            </div>
          </div>

          {/* Standards Matrix Grid */}
          <div className="standards-matrix-grid">
            {STANDARDS_MATRIX.map((stdGroup, idx) => (
              <div key={idx} className="standards-org-card">
                <div className="standards-org-header">
                  <Award size={20} color="#1D4ED8" />
                  <h3>{stdGroup.organization}</h3>
                </div>
                <div>
                  {stdGroup.standards.map((s, sidx) => (
                    <div key={sidx} className="standard-item-row">
                      <div className="standard-code">{s.code}</div>
                      <div className="standard-title">{s.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Factory Advantages & Manufacturing Base */}
      <section className="section-block" id="about" style={{ background: '#F1F5F9', borderTop: '1px solid var(--slate-200)', borderBottom: '1px solid var(--slate-200)' }}>
        <div className="section-container">
          <div>
            <span className="eyebrow">Manufacturing Powerhouse</span>
            <h2 className="section-heading">Why Global Contractors Partner with Mingze</h2>
            <p className="section-desc">
              Direct source manufacturing, scalable capacity, and direct access to Qingdao container terminals for seamless global distribution.
            </p>
          </div>

          <div className="advantages-grid">
            {WHY_CHOOSE_US.map((item, idx) => (
              <div key={idx} className="advantage-card">
                <div className="advantage-index">0{idx + 1}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Direct Trade Channels & RFQ Conversion Suite */}
      <section className="section-block" id="contact">
        <div className="section-container">
          <div className="contact-grid">
            {/* Left Contact Info */}
            <div className="contact-channels-card">
              <span className="eyebrow">Direct Trade Desk</span>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '12px' }}>Connect with Export Sales</h2>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', marginBottom: '28px' }}>
                For instant FOB/CIF pricing, technical submittals, or sample swatches, reach out directly through official communication channels.
              </p>

              <div className="contact-channel-item">
                <div className="contact-channel-icon">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="contact-channel-label">Official Export Email</div>
                  <a href={`mailto:${COMPANY_INFO.email}`} className="contact-channel-val" style={{ color: '#1D4ED8' }}>
                    {COMPANY_INFO.email}
                  </a>
                  <a href={`mailto:${COMPANY_INFO.altEmail}`} className="contact-channel-sub" style={{ display: 'block' }}>
                    {COMPANY_INFO.altEmail}
                  </a>
                </div>
              </div>

              <div className="contact-channel-item">
                <div className="contact-channel-icon green">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <div className="contact-channel-label">24/7 WhatsApp Export Desk</div>
                  <a href={COMPANY_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" className="contact-channel-val" style={{ color: '#059669' }}>
                    {COMPANY_INFO.whatsapp}
                  </a>
                  <div className="contact-channel-sub">Instant response for technical submittals</div>
                </div>
              </div>

              <div className="contact-channel-item">
                <div className="contact-channel-icon" style={{ background: '#F1F5F9', color: '#334155' }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="contact-channel-label">Manufacturing Plant & Headquarters</div>
                  <div className="contact-channel-val" style={{ fontSize: '0.88rem' }}>{COMPANY_INFO.address}</div>
                  <div className="contact-channel-sub">Export Port: Qingdao Port (200 km)</div>
                </div>
              </div>

              <div style={{ marginTop: '28px', display: 'flex', gap: '12px' }}>
                <a href={COMPANY_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp" style={{ flex: 1 }}>
                  <MessageCircle size={16} /> WhatsApp Chat
                </a>
              </div>
            </div>

            {/* Right RFQ Form */}
            <div className="rfq-form-card">
              <h3 style={{ fontSize: '1.3rem', marginBottom: '6px' }}>Submit Request for Quotation (RFQ)</h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--slate-600)', marginBottom: '20px' }}>
                Formal FOB/CIF quotation, packing list breakdown, and complete TDS package sent within 6 hours.
              </p>

              {formSubmitted ? (
                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 'var(--radius-sm)', padding: '28px', textAlign: 'center' }}>
                  <CheckCircle2 size={40} color="#059669" style={{ margin: '0 auto 12px' }} />
                  <h4 style={{ color: '#065F46', fontSize: '1.1rem', marginBottom: '6px' }}>Inquiry Submitted Successfully</h4>
                  <p style={{ color: '#047857', fontSize: '0.86rem', margin: 0 }}>
                    Our sales engineer has received your request and will provide the formal quotation to your email shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit}>
                  <div className="form-group-title">1. Contact Details</div>
                  <div className="form-row-2">
                    <div className="form-field" style={{ margin: 0 }}>
                      <label>Contact Name *</label>
                      <input type="text" required placeholder="John Smith" />
                    </div>
                    <div className="form-field" style={{ margin: 0 }}>
                      <label>Work Email *</label>
                      <input type="email" required placeholder="john@company.com" />
                    </div>
                  </div>

                  <div className="form-group-title" style={{ marginTop: '16px' }}>2. Project & Logistics</div>
                  <div className="form-row-2">
                    <div className="form-field" style={{ margin: 0 }}>
                      <label>WhatsApp / Phone</label>
                      <input type="text" placeholder="+1..." />
                    </div>
                    <div className="form-field" style={{ margin: 0 }}>
                      <label>Destination Port</label>
                      <input type="text" placeholder="e.g. Dubai / Hamburg / Santos" />
                    </div>
                  </div>

                  <div className="form-field" style={{ marginTop: '14px' }}>
                    <label>Product of Interest</label>
                    <select>
                      <option value="">-- Mixed Full Container Load (FCL) --</option>
                      {PRODUCTS.map(p => (
                        <option key={p.code} value={p.code}>{p.code}: {p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Specifications / Estimated Volume</label>
                    <textarea
                      rows="3"
                      placeholder="Please specify thickness, roll dimensions, estimated quantity (e.g. 1x20' GP container), or special testing requirements..."
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '44px' }}>
                    <Send size={15} /> Submit RFQ for Priority Processing
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 10. Pre-Footer Call to Action Banner */}
      <section className="pre-footer-cta">
        <div className="section-container">
          <div className="pre-footer-inner">
            <div>
              <h2>Planning an Infrastructure or Roofing Project?</h2>
              <p>
                Get direct factory technical data submittals, custom roll dimension quotes, and Qingdao Port shipping schedules.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => openQuoteModal()} className="btn btn-primary btn-lg">
                Request Formal Proforma Invoice
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Refined Footer */}
      <footer className="site-footer">
        <div className="section-container">
          <div className="footer-grid">
            <div className="footer-col">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ background: 'var(--blue-600)', color: '#fff', padding: '4px 8px', borderRadius: '3px', fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>MZ</div>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>MINGZE WATERPROOF</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--slate-400)', lineHeight: 1.6, marginBottom: '14px' }}>
                Weifang Mingze Waterproof Material Co., Ltd. is a dedicated industrial manufacturer exporting high-grade waterproofing membranes and chemical coatings globally.
              </p>
              <div style={{ fontSize: '0.74rem', color: 'var(--slate-400)' }}>
                <strong>ISO9001:2015 • ISO14001:2015 • CE EN13707 • ASTM Compliant</strong>
              </div>
            </div>

            <div className="footer-col">
              <h4>Product Families</h4>
              <ul className="footer-links">
                {CATEGORIES.map(cat => (
                  <li key={cat.id}>
                    <a href="#products" onClick={() => setActiveTab(cat.id)}>
                      {cat.name} ({cat.count})
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4>Quick Navigation</h4>
              <ul className="footer-links">
                <li><a href="#products">Technical Catalog</a></li>
                <li><a href="#solutions">Engineering Solutions</a></li>
                <li><a href="#standards">QA & Testing Matrix</a></li>
                <li><a href="#about">Manufacturing Base</a></li>
                <li><a href="#contact">RFQ & Trade Desk</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Direct Trade Contacts</h4>
              <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>Email: <a href={`mailto:${COMPANY_INFO.email}`} style={{ color: '#60A5FA' }}>{COMPANY_INFO.email}</a></div>
                <div>Alt: <a href={`mailto:${COMPANY_INFO.altEmail}`} style={{ color: '#60A5FA' }}>{COMPANY_INFO.altEmail}</a></div>
                <div>WhatsApp: <a href={COMPANY_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366' }}>{COMPANY_INFO.whatsapp}</a></div>
                <div>Port: Qingdao Port (200km)</div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div>
              © {new Date().getFullYear()} Weifang Mingze Waterproof Material Co., Ltd. All Rights Reserved.
            </div>
            <div>
              Industrial B2B Export Platform | Direct Factory Supply
            </div>
          </div>
        </div>
      </footer>

      {/* 12. Floating WhatsApp Badge */}
      <a
        href={COMPANY_INFO.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp"
      >
        <MessageCircle size={20} />
        <span>Chat on WhatsApp</span>
      </a>

      {/* 13. Technical Details & TDS Modal */}
      {selectedProduct && (
        <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#60A5FA', fontWeight: 700 }}>
                  {selectedProduct.code} • {selectedProduct.categoryName}
                </div>
                <h3>{selectedProduct.name}</h3>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="modal-close-btn">
                <X size={22} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    style={{ width: '100%', height: '240px', objectFit: 'contain', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px' }}
                    onError={(e) => { e.target.src = '/assets/images/placeholder.svg'; }}
                  />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.92rem', marginBottom: '10px' }}>Key Engineering Highlights</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {selectedProduct.features.map((feat, idx) => (
                      <li key={idx} style={{ fontSize: '0.82rem', color: '#334155', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                        <CheckCircle2 size={15} color="#1D4ED8" style={{ flexShrink: 0, marginTop: '2px' }} />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px', borderRadius: '6px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div><strong>Standard:</strong> {selectedProduct.standards}</div>
                    {selectedProduct.thickness && <div><strong>Available Dimensions:</strong> {selectedProduct.thickness}</div>}
                    {selectedProduct.rollSize && <div><strong>Roll / Packaging:</strong> {selectedProduct.rollSize}</div>}
                  </div>
                </div>
              </div>

              {/* Technical Parameter Matrix Table */}
              <h4 style={{ fontSize: '0.95rem', marginBottom: '10px' }}>Technical Parameters & Test Methods</h4>
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden', marginBottom: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left' }}>
                      <th style={{ padding: '8px 12px', color: '#475569', width: '40%' }}>Technical Property</th>
                      <th style={{ padding: '8px 12px', color: '#475569' }}>Specification / Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProduct.specs.map((sp, idx) => (
                      <tr key={idx} style={{ borderBottom: idx === selectedProduct.specs.length - 1 ? 'none' : '1px solid #F1F5F9' }}>
                        <td style={{ padding: '8px 12px', fontWeight: 600, color: '#1E293B' }}>{sp.property}</td>
                        <td style={{ padding: '8px 12px', color: '#475569', fontFamily: 'var(--font-mono)' }}>{sp.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '6px', padding: '12px 16px', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.76rem', color: '#1E40AF', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>
                  Recommended Applications:
                </div>
                <div style={{ fontSize: '0.82rem', color: '#1E3A8A' }}>
                  {selectedProduct.applications}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button onClick={() => setSelectedProduct(null)} className="btn btn-outline">
                  Close
                </button>
                <button onClick={() => { const code = selectedProduct.code; setSelectedProduct(null); openQuoteModal(code); }} className="btn btn-primary">
                  Inquire FOB / CIF Pricing for {selectedProduct.code}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 14. Proforma & Quote Modal */}
      {isQuoteModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsQuoteModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <div>
                <h3>Request Official FOB / CIF Quote</h3>
                <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>Direct Factory Price Guarantee • Weifang Mingze Waterproof</span>
              </div>
              <button onClick={() => setIsQuoteModalOpen(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {formSubmitted ? (
                <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                  <CheckCircle2 size={44} color="#059669" style={{ margin: '0 auto 12px' }} />
                  <h3 style={{ color: '#065F46', marginBottom: '8px' }}>Quotation Request Received</h3>
                  <p style={{ color: '#475569', fontSize: '0.88rem' }}>
                    Our sales engineer has received your request and will contact you via email/WhatsApp shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Selected Material</label>
                    <select
                      defaultValue={quoteProductCode}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.85rem' }}
                    >
                      <option value="">-- Mixed Full Container Load (FCL) --</option>
                      {PRODUCTS.map(p => (
                        <option key={p.code} value={p.code}>{p.code}: {p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-row-2">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.76rem', fontWeight: 600, color: '#475569' }}>Contact Name *</label>
                      <input type="text" required placeholder="John Smith" style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.85rem' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.76rem', fontWeight: 600, color: '#475569' }}>Work Email *</label>
                      <input type="email" required placeholder="john@domain.com" style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.85rem' }} />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.76rem', fontWeight: 600, color: '#475569' }}>WhatsApp / Phone</label>
                      <input type="text" placeholder="+1..." style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.85rem' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.76rem', fontWeight: 600, color: '#475569' }}>Discharge Port</label>
                      <input type="text" placeholder="e.g. Jebel Ali / Rotterdam" style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.85rem' }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.76rem', fontWeight: 600, color: '#475569' }}>Estimated Volume & Specs</label>
                    <textarea rows="3" placeholder="e.g. 5,000 m² SBS 4mm Mineral Cap Sheet + 2,000 kg PU coating in 1x20' GP container" style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.85rem' }}></textarea>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                    <button type="button" onClick={() => setIsQuoteModalOpen(false)} className="btn btn-outline">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Submit for Fast Quote
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);

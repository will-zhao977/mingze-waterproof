import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import {
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
  Download,
  Package,
  ShieldCheck,
  Check,
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
import { ProductVisual } from './ProductVisual.jsx';

function App() {
  const [activeNavTab, setActiveNavTab] = useState('home'); // home | catalog | solutions | standards | factory | contact
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [quoteProductCode, setQuoteProductCode] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Filter products by category and search keyword
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchCat = activeCategory === 'all' || p.categoryId === activeCategory;
      const matchSearch = searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.standards.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.applications.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const openQuoteModal = (productCode = '') => {
    setQuoteProductCode(productCode);
    setIsQuoteModalOpen(true);
    setFormSubmitted(false);
  };

  const openSampleModal = (productCode = '') => {
    setQuoteProductCode(productCode);
    setIsSampleModalOpen(true);
    setFormSubmitted(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setIsQuoteModalOpen(false);
      setIsSampleModalOpen(false);
      setFormSubmitted(false);
    }, 2500);
  };

  return (
    <div className="site-wrapper">
      {/* 1. Global Utility Notification Bar */}
      <div className="top-utility-bar">
        <div className="top-utility-inner">
          <div className="top-utility-group">
            <span className="top-utility-item">
              <Building2 size={13} color="#60A5FA" />
              <span><strong>Manufacturing Base:</strong> Shouguang, Weifang, Shandong, China</span>
            </span>
            <span className="top-utility-item">
              <Anchor size={13} color="#10B981" />
              <span><strong>Loading Port:</strong> Qingdao Port (200 km Direct Highway)</span>
            </span>
          </div>

          <div className="top-utility-group">
            <a href={`mailto:${COMPANY_INFO.email}`} className="top-utility-item" style={{ color: '#CBD5E1' }}>
              <Mail size={12} color="#60A5FA" />
              <span>{COMPANY_INFO.email}</span>
            </a>
            <a href={COMPANY_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" className="top-utility-item" style={{ color: '#25D366', fontWeight: 600 }}>
              <MessageCircle size={13} />
              <span>WhatsApp: {COMPANY_INFO.whatsapp}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Architectural Sticky Header with View Navigation */}
      <header className="site-header">
        <div className="header-inner">
          <a href="#" className="brand-logo-area" onClick={() => setActiveNavTab('home')}>
            <div className="brand-badge">MZ</div>
            <div className="brand-text">
              <h1>MINGZE WATERPROOF</h1>
              <span>Weifang Mingze Waterproof Material Co., Ltd.</span>
            </div>
          </a>

          {/* Central Navigation Tabs */}
          <nav className="nav-tabs-group">
            <button
              onClick={() => { setActiveNavTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`nav-tab-btn ${activeNavTab === 'home' ? 'active' : ''}`}
            >
              Overview
            </button>
            <button
              onClick={() => {
                setActiveNavTab('catalog');
                document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`nav-tab-btn ${activeNavTab === 'catalog' ? 'active' : ''}`}
            >
              Materials ({PRODUCTS.length})
            </button>
            <button
              onClick={() => {
                setActiveNavTab('solutions');
                document.getElementById('solutions-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`nav-tab-btn ${activeNavTab === 'solutions' ? 'active' : ''}`}
            >
              Solutions
            </button>
            <button
              onClick={() => {
                setActiveNavTab('standards');
                document.getElementById('standards-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`nav-tab-btn ${activeNavTab === 'standards' ? 'active' : ''}`}
            >
              QA & Testing
            </button>
            <button
              onClick={() => {
                setActiveNavTab('factory');
                document.getElementById('factory-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`nav-tab-btn ${activeNavTab === 'factory' ? 'active' : ''}`}
            >
              Factory Base
            </button>
            <button
              onClick={() => {
                setActiveNavTab('contact');
                document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`nav-tab-btn ${activeNavTab === 'contact' ? 'active' : ''}`}
            >
              RFQ & Contact
            </button>
          </nav>

          <div className="header-actions">
            <button onClick={() => openSampleModal()} className="btn btn-outline btn-sm">
              <Package size={14} /> Free Sample Box
            </button>
            <button onClick={() => openQuoteModal()} className="btn btn-primary btn-sm">
              Get FOB Quote <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* 3. Hero Section - Industrial Editorial */}
      <section className="hero-editorial">
        <div className="section-container">
          <div className="hero-grid">
            <div>
              <div className="eyebrow eyebrow-dark">
                <Sparkles size={13} /> Direct Manufacturer Export Gateway
              </div>
              <h1 className="hero-title">
                High-Performance Waterproofing Systems for <span>Global Infrastructure</span>.
              </h1>
              <p className="hero-p">
                Direct industrial manufacturing of ASTM, CE & GB certified modified bitumen, single-ply TPO/PVC/EPDM sheets, pre-applied HDPE blindside membranes, and liquid elastomeric polymer coatings.
              </p>

              <div className="hero-actions-row">
                <button
                  onClick={() => {
                    setActiveNavTab('catalog');
                    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn btn-primary btn-lg"
                >
                  Explore 37 Materials <ArrowRight size={16} />
                </button>
                <button onClick={() => openSampleModal()} className="btn btn-outline btn-lg" style={{ background: 'transparent', color: '#fff', borderColor: '#334155' }}>
                  <Package size={16} /> Request Material Sample Box
                </button>
                <a href={COMPANY_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
                  <MessageCircle size={16} /> Export Desk
                </a>
              </div>

              {/* 4 Key Metrics in Single Solid Row */}
              <div className="hero-stats-band">
                <div className="hero-stat-card">
                  <div className="num">68,000 m²</div>
                  <div className="lbl">Automated Base</div>
                </div>
                <div className="hero-stat-card">
                  <div className="num">50M m²</div>
                  <div className="lbl">Annual Output</div>
                </div>
                <div className="hero-stat-card">
                  <div className="num">ASTM / CE / GB</div>
                  <div className="lbl">Certified Lab QA</div>
                </div>
                <div className="hero-stat-card">
                  <div className="num">200 km</div>
                  <div className="lbl">To Qingdao Port</div>
                </div>
              </div>
            </div>

            {/* Hero Right 3D Visual Showcase */}
            <div className="hero-visual-card">
              <div className="hero-visual-header">
                <span>Material Engineering & Lab Tested</span>
                <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={13} /> Certified 0.7 MPa Watertight
                </span>
              </div>
              <div className="hero-visual-art">
                <ProductVisual product={PRODUCTS[0]} size="hero" />
              </div>
              <div className="hero-visual-body">
                <h3>Elastomeric SBS Modified Bitumen Membrane</h3>
                <p>
                  Reinforced with heavy polyester mat, delivering extreme low-temperature flexibility down to -25°C and superior resistance to cyclic thermal fatigue.
                </p>
                <div className="hero-chips-row">
                  <span className="hero-chip">GB 18242-2008</span>
                  <span className="hero-chip">ASTM D6164</span>
                  <span className="hero-chip">EN 13707</span>
                  <span className="hero-chip">FLL Root Resistant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Five Core Material System Pillars */}
      <section className="section-block" style={{ background: '#FFFFFF', borderBottom: '1px solid var(--slate-200)' }}>
        <div className="section-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="eyebrow">Product Classification</span>
              <h2 className="section-heading">5 Core Waterproofing Material Systems</h2>
              <p className="section-desc">
                Covering complete commercial roofing, underground basement tanking, civil tunnels, exposed metal decks, and geotechnical engineering.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveCategory('all');
                document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn btn-outline btn-sm"
            >
              View Full 37 SKUs Catalog <ChevronRight size={14} />
            </button>
          </div>

          <div className="pillars-grid">
            {CATEGORIES.map((cat, idx) => {
              const repProduct = PRODUCTS.find(p => p.categoryId === cat.id) || PRODUCTS[0];
              return (
                <div
                  key={cat.id}
                  className={`pillar-card ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <div>
                    <div className="pillar-art-frame">
                      <ProductVisual product={repProduct} size="card" />
                    </div>
                    <div className="pillar-index">SYSTEM 0{idx + 1}</div>
                    <h3 className="pillar-title">{cat.name}</h3>
                    <p className="pillar-desc">{cat.description}</p>
                  </div>
                  <div className="pillar-footer">
                    <span>{cat.count} Standard SKUs</span>
                    <span>Browse System →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Full Product Catalog Suite */}
      <section className="section-block" id="catalog-section">
        <div className="section-container">
          <div>
            <span className="eyebrow">Complete Engineering Catalog</span>
            <h2 className="section-heading">37 Industrial Material Specifications</h2>
            <p className="section-desc">
              Direct factory pricing with full batch COA certificates, test compliance reports, and export container packing data.
            </p>
          </div>

          {/* Catalog Toolbar */}
          <div className="catalog-toolbar" style={{ marginTop: '24px' }}>
            <div className="catalog-tabs">
              <button
                onClick={() => setActiveCategory('all')}
                className={`catalog-tab-btn ${activeCategory === 'all' ? 'active' : ''}`}
              >
                All Materials ({PRODUCTS.length})
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`catalog-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
                >
                  {cat.shortName} ({cat.count})
                </button>
              ))}
            </div>

            <div className="catalog-search-box">
              <Search size={15} color="#94A3B8" />
              <input
                type="text"
                placeholder="Search material code, standard..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="products-grid-3">
            {filteredProducts.map(prod => (
              <div key={prod.id} className="clean-product-card">
                <div className="product-art-canvas">
                  <ProductVisual product={prod} size="card" />
                  <div className="product-code-tag">{prod.code}</div>
                  <div className="product-series-tag">{prod.categoryName.split(' ')[0]}</div>
                </div>

                <div className="product-body">
                  <h3 className="product-title">{prod.name}</h3>
                  <p className="product-brief">{prod.brief}</p>

                  <div className="product-spec-pills">
                    <div className="product-spec-row">
                      <span>Standards:</span>
                      <span>{prod.standards}</span>
                    </div>
                    {prod.thickness && (
                      <div className="product-spec-row">
                        <span>Dimensions:</span>
                        <span>{prod.thickness}</span>
                      </div>
                    )}
                  </div>

                  <div className="product-btn-row">
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
              <button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }} className="btn btn-primary">
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 6. High-Contrast Engineering Solutions */}
      <section className="solutions-section" id="solutions-section">
        <div className="section-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span className="eyebrow eyebrow-dark">System Assembly Specs</span>
              <h2 style={{ color: '#fff', fontSize: '2.25rem', letterSpacing: '-0.03em', marginBottom: '8px' }}>
                Integrated Engineering Solutions
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.95rem', maxWidth: '620px', margin: 0 }}>
                Standardized multi-layer system assemblies tested to withstand hydrostatic heads up to 70m, extreme solar UV, and aggressive soil conditions.
              </p>
            </div>
          </div>

          <div className="solutions-grid-2">
            {SOLUTIONS.map(sol => (
              <div key={sol.id} className="solution-box">
                <div>
                  <div className="solution-badge">{sol.subtitle}</div>
                  <h3 className="solution-name">{sol.title}</h3>
                  <p className="solution-para">{sol.description}</p>

                  <div className="solution-layers-container">
                    <div className="solution-layers-hdr">Typical System Build-Up:</div>
                    {sol.systemLayers.map((layer, idx) => (
                      <div key={idx} className="solution-layer-line">
                        <span className="solution-layer-badge">{idx + 1}</span>
                        <span>{layer}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="solution-card-footer">
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {sol.recommendedProducts.map(pcode => (
                      <span key={pcode} style={{ background: '#1E2D4A', color: '#93C5FD', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px' }}>
                        {pcode}
                      </span>
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

      {/* 7. QA Protocol & Standards Matrix */}
      <section className="section-block" id="standards-section">
        <div className="section-container">
          <div>
            <span className="eyebrow">Quality Assurance Protocol</span>
            <h2 className="section-heading">International Compliance & Testing Matrix</h2>
            <p className="section-desc">
              Every master batch undergoes strict CNAS-standard testing with issued Mill Test Reports and Certificates of Analysis (COA).
            </p>
          </div>

          {/* 3-Step QA Pathway */}
          <div className="qa-steps-grid">
            <div className="qa-step-item">
              <div className="qa-step-idx">01</div>
              <h4>Raw Polymer Screening</h4>
              <p>
                Incoming virgin resins, synthetic rubber, and bitumen are strictly tested for penetration index, softening point, and melt flow rate prior to compounding.
              </p>
            </div>
            <div className="qa-step-item">
              <div className="qa-step-idx">02</div>
              <h4>Laser Inline Gauging</h4>
              <p>
                Automated laser thickness micrometers continuously scan the entire 2.0m - 8.0m roll width during continuous calendar and extrusion production.
              </p>
            </div>
            <div className="qa-step-item">
              <div className="qa-step-idx">03</div>
              <h4>Batch COA Certification</h4>
              <p>
                Mandatory hydrostatic pressure testing at 0.7 MPa, -25°C low-temperature flex bending, and tensile break tests for every finished production lot.
              </p>
            </div>
          </div>

          {/* Standards Matrix Grid */}
          <div className="standards-3-grid">
            {STANDARDS_MATRIX.map((stdGroup, idx) => (
              <div key={idx} className="standards-col-card">
                <div className="standards-col-hdr">
                  <Award size={20} color="#1D4ED8" />
                  <h3>{stdGroup.organization}</h3>
                </div>
                <div>
                  {stdGroup.standards.map((s, sidx) => (
                    <div key={sidx} className="std-row">
                      <div className="std-code">{s.code}</div>
                      <div className="std-title">{s.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Factory Advantages & Manufacturing Base */}
      <section className="section-block" id="factory-section" style={{ background: '#F1F5F9', borderTop: '1px solid var(--slate-200)', borderBottom: '1px solid var(--slate-200)' }}>
        <div className="section-container">
          <div>
            <span className="eyebrow">Manufacturing Powerhouse</span>
            <h2 className="section-heading">Why Global Contractors Partner with Mingze</h2>
            <p className="section-desc">
              Direct source manufacturing, scalable capacity, and direct highway connection to Qingdao container terminals for seamless global distribution.
            </p>
          </div>

          <div className="advantages-4-grid">
            {WHY_CHOOSE_US.map((item, idx) => (
              <div key={idx} className="advantage-item">
                <div className="adv-idx">0{idx + 1}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Direct Trade Channels & RFQ Conversion Suite */}
      <section className="section-block" id="contact-section">
        <div className="section-container">
          <div className="conversion-grid">
            {/* Left Contact Card */}
            <div className="contact-card-white">
              <span className="eyebrow">Direct Trade Desk</span>
              <h2 style={{ fontSize: '1.85rem', marginBottom: '12px' }}>Connect with Export Sales</h2>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', marginBottom: '28px' }}>
                For instant FOB/CIF pricing, technical submittals, or physical sample swatch boxes, reach out directly through official communication channels.
              </p>

              <div className="channel-row">
                <div className="channel-icon-box">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="channel-lbl">Official Export Email</div>
                  <a href={`mailto:${COMPANY_INFO.email}`} className="channel-val" style={{ color: '#1D4ED8' }}>
                    {COMPANY_INFO.email}
                  </a>
                  <a href={`mailto:${COMPANY_INFO.altEmail}`} className="channel-sub" style={{ display: 'block' }}>
                    {COMPANY_INFO.altEmail}
                  </a>
                </div>
              </div>

              <div className="channel-row">
                <div className="channel-icon-box green">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <div className="channel-lbl">24/7 WhatsApp Export Desk</div>
                  <a href={COMPANY_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" className="channel-val" style={{ color: '#059669' }}>
                    {COMPANY_INFO.whatsapp}
                  </a>
                  <div className="channel-sub">Instant response for technical submittals</div>
                </div>
              </div>

              <div className="channel-row">
                <div className="channel-icon-box" style={{ background: '#F1F5F9', color: '#334155' }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="channel-lbl">Manufacturing Plant & Headquarters</div>
                  <div className="channel-val" style={{ fontSize: '0.88rem' }}>{COMPANY_INFO.address}</div>
                  <div className="channel-sub">Export Port: Qingdao Port (200 km)</div>
                </div>
              </div>

              <div style={{ marginTop: '28px', display: 'flex', gap: '12px' }}>
                <a href={COMPANY_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp" style={{ flex: 1 }}>
                  <MessageCircle size={16} /> WhatsApp Chat
                </a>
              </div>
            </div>

            {/* Right RFQ Form */}
            <div className="rfq-box-white">
              <h3 style={{ fontSize: '1.35rem', marginBottom: '6px' }}>Submit Request for Quotation (RFQ)</h3>
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
                <form onSubmit={handleFormSubmit}>
                  <div className="form-sec-title">1. Contact Details</div>
                  <div className="form-grid-2">
                    <div className="form-item" style={{ margin: 0 }}>
                      <label>Contact Name *</label>
                      <input type="text" required placeholder="John Smith" />
                    </div>
                    <div className="form-item" style={{ margin: 0 }}>
                      <label>Work Email *</label>
                      <input type="email" required placeholder="john@company.com" />
                    </div>
                  </div>

                  <div className="form-sec-title" style={{ marginTop: '16px' }}>2. Project & Logistics</div>
                  <div className="form-grid-2">
                    <div className="form-item" style={{ margin: 0 }}>
                      <label>WhatsApp / Phone</label>
                      <input type="text" placeholder="+1..." />
                    </div>
                    <div className="form-item" style={{ margin: 0 }}>
                      <label>Destination Port</label>
                      <input type="text" placeholder="e.g. Dubai / Hamburg / Santos" />
                    </div>
                  </div>

                  <div className="form-item" style={{ marginTop: '14px' }}>
                    <label>Material of Interest</label>
                    <select>
                      <option value="">-- Mixed Full Container Load (FCL) --</option>
                      {PRODUCTS.map(p => (
                        <option key={p.code} value={p.code}>{p.code}: {p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-item">
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
      <section className="pre-footer-banner">
        <div className="section-container">
          <div className="pre-footer-row">
            <div>
              <h2>Planning an Infrastructure or Roofing Project?</h2>
              <p>
                Get direct factory technical data submittals, custom roll dimension quotes, and Qingdao Port shipping schedules.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => openSampleModal()} className="btn btn-outline btn-lg" style={{ background: 'transparent', color: '#fff', borderColor: '#475569' }}>
                <Package size={16} /> Request Free Swatch Kit
              </button>
              <button onClick={() => openQuoteModal()} className="btn btn-primary btn-lg">
                Request Proforma Invoice
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Master Footer */}
      <footer className="footer-master">
        <div className="section-container">
          <div className="footer-4-grid">
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
              <ul className="footer-links-list">
                {CATEGORIES.map(cat => (
                  <li key={cat.id}>
                    <a
                      href="#catalog-section"
                      onClick={() => {
                        setActiveCategory(cat.id);
                        document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {cat.name} ({cat.count})
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4>Quick Navigation</h4>
              <ul className="footer-links-list">
                <li><a href="#catalog-section">Technical Catalog (37 SKUs)</a></li>
                <li><a href="#solutions-section">Engineering Solutions</a></li>
                <li><a href="#standards-section">QA & Testing Matrix</a></li>
                <li><a href="#factory-section">Manufacturing Base</a></li>
                <li><a href="#contact-section">RFQ & Trade Desk</a></li>
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

          <div className="footer-copyright-bar">
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
        className="whatsapp-floating-btn"
      >
        <MessageCircle size={20} />
        <span>Chat on WhatsApp</span>
      </a>

      {/* 13. Technical Details & TDS Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-dark">
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#60A5FA', fontWeight: 700 }}>
                  {selectedProduct.code} • {selectedProduct.categoryName}
                </div>
                <h3>{selectedProduct.name}</h3>
              </div>
              <button onClick={() => setSelectedProduct(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <div className="modal-body-content">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px' }}>
                  <ProductVisual product={selectedProduct} size="hero" />
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

      {/* 14. Free Sample Swatch Box Modal */}
      {isSampleModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSampleModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="modal-header-dark" style={{ background: '#065F46' }}>
              <div>
                <h3>Request Free Material Sample Swatch Box</h3>
                <span style={{ fontSize: '0.74rem', color: '#A7F3D0' }}>DHL / FedEx Express Delivery to Your Office • Factory Direct</span>
              </div>
              <button onClick={() => setIsSampleModalOpen(false)} style={{ background: 'none', border: 'none', color: '#A7F3D0', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body-content">
              {formSubmitted ? (
                <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                  <CheckCircle2 size={44} color="#059669" style={{ margin: '0 auto 12px' }} />
                  <h3 style={{ color: '#065F46', marginBottom: '8px' }}>Sample Request Dispatched</h3>
                  <p style={{ color: '#475569', fontSize: '0.88rem' }}>
                    Our dispatch team will prepare your custom sample swatch box and email you the DHL tracking number within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Target Material Swatch</label>
                    <select
                      defaultValue={quoteProductCode}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.85rem' }}
                    >
                      <option value="">-- Complete 5-Category Sample Box (All 37 Materials) --</option>
                      {PRODUCTS.map(p => (
                        <option key={p.code} value={p.code}>{p.code}: {p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-grid-2">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.76rem', fontWeight: 600, color: '#475569' }}>Recipient Name *</label>
                      <input type="text" required placeholder="John Smith" style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.85rem' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.76rem', fontWeight: 600, color: '#475569' }}>Company & Email *</label>
                      <input type="email" required placeholder="john@domain.com" style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.85rem' }} />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.76rem', fontWeight: 600, color: '#475569' }}>Mobile / WhatsApp (for DHL) *</label>
                      <input type="text" required placeholder="+1..." style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.85rem' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.76rem', fontWeight: 600, color: '#475569' }}>Country & City *</label>
                      <input type="text" required placeholder="e.g. Dubai, UAE" style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.85rem' }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.76rem', fontWeight: 600, color: '#475569' }}>Delivery Address *</label>
                    <textarea rows="2" required placeholder="Street address, building, postal code for express delivery..." style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.85rem' }}></textarea>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                    <button type="button" onClick={() => setIsSampleModalOpen(false)} className="btn btn-outline">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" style={{ background: '#059669', borderColor: '#059669' }}>
                      Dispatch Sample Kit (Free Express)
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 15. Proforma & FOB Quote Modal */}
      {isQuoteModalOpen && (
        <div className="modal-overlay" onClick={() => setIsQuoteModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="modal-header-dark">
              <div>
                <h3>Request Official FOB / CIF Quote</h3>
                <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>Direct Factory Price Guarantee • Weifang Mingze Waterproof</span>
              </div>
              <button onClick={() => setIsQuoteModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body-content">
              {formSubmitted ? (
                <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                  <CheckCircle2 size={44} color="#059669" style={{ margin: '0 auto 12px' }} />
                  <h3 style={{ color: '#065F46', marginBottom: '8px' }}>Quotation Request Received</h3>
                  <p style={{ color: '#475569', fontSize: '0.88rem' }}>
                    Our sales engineer has received your request and will contact you via email/WhatsApp shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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

                  <div className="form-grid-2">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.76rem', fontWeight: 600, color: '#475569' }}>Contact Name *</label>
                      <input type="text" required placeholder="John Smith" style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.85rem' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.76rem', fontWeight: 600, color: '#475569' }}>Work Email *</label>
                      <input type="email" required placeholder="john@domain.com" style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.85rem' }} />
                    </div>
                  </div>

                  <div className="form-grid-2">
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

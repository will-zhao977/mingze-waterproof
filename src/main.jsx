import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  Layers,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  MessageCircle,
  Clock,
  Globe2,
  Sparkles,
  Download,
  Filter,
  X,
  Send,
  Boxes,
  Award,
  Truck,
  Anchor
} from 'lucide-react';
import './styles.css';
import { COMPANY_INFO, CATEGORIES, PRODUCTS, SOLUTIONS, STANDARDS_MATRIX, WHY_CHOOSE_US } from './data.js';

function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteProductCode, setQuoteProductCode] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Filter products by category and search
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
      {/* Top Notification / Rapid Contact Bar */}
      <div className="top-bar" style={{ background: '#0B111A', color: '#94A3B8', fontSize: '0.78rem', padding: '6px var(--gutter)', borderBottom: '1px solid #1E293B' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={13} color="#2563EB" /> <strong>Factory Direct Manufacturer</strong> | Shouguang, Weifang, China
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Anchor size={13} color="#059669" /> <strong>Export Port:</strong> Qingdao Port (200km)
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href={`mailto:${COMPANY_INFO.email}`} style={{ color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Mail size={12} color="#2563EB" /> {COMPANY_INFO.email}
            </a>
            <a href={COMPANY_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MessageCircle size={13} /> WhatsApp: {COMPANY_INFO.whatsapp}
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation */}
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
            <a href="#products" className="nav-link">Products (37)</a>
            <a href="#solutions" className="nav-link">Solutions</a>
            <a href="#standards" className="nav-link">Technical & QA</a>
            <a href="#about" className="nav-link">About Factory</a>
            <a href="#contact" className="nav-link">Contact</a>
          </nav>

          <div className="header-cta-group">
            <a href={COMPANY_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
              <MessageCircle size={16} /> WhatsApp Chat
            </a>
            <button onClick={() => openQuoteModal()} className="btn btn-primary">
              Get Instant FOB Quote <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-minimal">
        <div className="hero-inner">
          <div className="hero-content-col">
            <div className="eyebrow">
              <Sparkles size={13} /> Official Manufacturer Export Gateway
            </div>
            <h1 className="hero-main-title">
              Engineered Waterproofing Systems for Global Infrastructure.
            </h1>
            <p className="hero-desc">
              Direct factory production of high-performance SBS/APP modified bitumen, TPO/PVC/EPDM single-ply sheets, pre-applied HDPE membranes, and liquid elastomeric coatings. Fully compliant with ASTM, CE, and GB standards.
            </p>

            <div className="hero-btn-row">
              <button onClick={() => openQuoteModal()} className="btn btn-primary btn-lg">
                Request Product Catalog & TDS <FileText size={17} />
              </button>
              <a href={COMPANY_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
                <MessageCircle size={17} /> Chat with Export Desk
              </a>
            </div>

            {/* Metrics Grid */}
            <div className="hero-metrics-grid">
              <div className="metric-item">
                <div className="metric-val">68,000 m²</div>
                <div className="metric-lbl">Modern Manufacturing Base</div>
              </div>
              <div className="metric-item">
                <div className="metric-val">50,000,000 m²</div>
                <div className="metric-lbl">Annual Membrane Output</div>
              </div>
              <div className="metric-item">
                <div className="metric-val">ASTM / CE</div>
                <div className="metric-lbl">Certified Global Standards</div>
              </div>
              <div className="metric-item">
                <div className="metric-val">200 km</div>
                <div className="metric-lbl">Direct to Qingdao Port</div>
              </div>
            </div>
          </div>

          <div className="hero-media-col">
            <div className="hero-showcase-frame">
              <img src="/assets/images/product-bitumen.jpg" alt="Mingze Waterproof Factory and Products" />
              <div className="showcase-caption">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#60A5FA', fontWeight: 700 }}>
                    FACTORY DIRECT EXPORT
                  </span>
                  <span style={{ background: '#059669', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                    In Stock & Custom OEM
                  </span>
                </div>
                <h3 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '4px' }}>Full-Spectrum Waterproofing Materials</h3>
                <p style={{ color: '#94A3B8', fontSize: '0.82rem', margin: 0 }}>
                  Exporting to 30+ countries across Southeast Asia, Middle East, Europe, South America, and Africa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Overview Bar */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--slate-200)', padding: '24px var(--gutter)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {CATEGORIES.map(cat => (
              <div
                key={cat.id}
                onClick={() => { setActiveTab(cat.id); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }}
                style={{
                  padding: '14px 16px',
                  background: activeTab === cat.id ? '#EFF6FF' : '#F8FAFC',
                  border: `1px solid ${activeTab === cat.id ? '#2563EB' : '#E2E8F0'}`,
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: activeTab === cat.id ? '#1D4ED8' : '#0F172A' }}>
                    {cat.shortName}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', background: '#E2E8F0', padding: '2px 6px', borderRadius: '4px', color: '#475569' }}>
                    {cat.count}
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {cat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Products Section */}
      <section className="section-block" id="products">
        <div className="section-container">
          <div className="section-title-bar">
            <div>
              <span className="eyebrow">Export Product Catalog (37 SKUs)</span>
              <h2>Complete Technical Material Inventory</h2>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search by name, standard, or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '8px 14px',
                  fontSize: '0.85rem',
                  border: '1px solid var(--slate-300)',
                  borderRadius: 'var(--radius-sm)',
                  width: '260px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="filter-tab-row" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
            <button
              onClick={() => setActiveTab('all')}
              className={`filter-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            >
              All Products ({PRODUCTS.length})
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`filter-tab-btn ${activeTab === cat.id ? 'active' : ''}`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="products-grid-minimal">
            {filteredProducts.map(prod => (
              <div key={prod.id} className="product-card-minimal">
                <div className="product-card-img-wrap">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    loading="lazy"
                    onError={(e) => { e.target.src = '/assets/images/placeholder.svg'; }}
                  />
                  <div className="product-badge-mono">{prod.code}</div>
                </div>

                <div className="product-card-body">
                  <div style={{ fontSize: '0.72rem', color: '#2563EB', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.04em' }}>
                    {prod.categoryName}
                  </div>
                  <h3 className="product-card-title">{prod.name}</h3>
                  <p className="product-card-brief">{prod.brief}</p>

                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '4px', padding: '8px 10px', margin: '12px 0', fontSize: '0.76rem' }}>
                    <div style={{ color: '#475569', marginBottom: '2px' }}>
                      <strong>Standards:</strong> {prod.standards}
                    </div>
                    {prod.thickness && (
                      <div style={{ color: '#475569' }}>
                        <strong>Thickness:</strong> {prod.thickness}
                      </div>
                    )}
                  </div>

                  <div className="product-card-actions">
                    <button
                      onClick={() => setSelectedProduct(prod)}
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1 }}
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
            <div style={{ textAlign: 'center', padding: '48px 24px', background: '#fff', borderRadius: '8px', border: '1px solid var(--slate-200)' }}>
              <p style={{ color: 'var(--slate-500)', fontSize: '1rem', marginBottom: '16px' }}>No products match your search keyword.</p>
              <button onClick={() => { setSearchQuery(''); setActiveTab('all'); }} className="btn btn-primary">
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Engineering Solutions */}
      <section className="section-block" id="solutions" style={{ background: '#0F172A', color: '#fff' }}>
        <div className="section-container">
          <div className="section-title-bar">
            <div>
              <span className="eyebrow eyebrow-light">Integrated Systems</span>
              <h2 style={{ color: '#fff' }}>Engineered Waterproofing Solutions</h2>
            </div>
            <p style={{ color: '#94A3B8', maxWidth: '480px', margin: 0, fontSize: '0.9rem' }}>
              Standardized system build-ups designed to withstand extreme hydrostatic heads, cyclic thermal movement, and corrosive soil environments.
            </p>
          </div>

          <div className="solutions-grid-minimal">
            {SOLUTIONS.map(sol => (
              <div key={sol.id} style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 'var(--radius-md)', padding: '24px' }}>
                <span style={{ color: '#60A5FA', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {sol.subtitle}
                </span>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: '8px 0 12px' }}>{sol.title}</h3>
                <p style={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '16px' }}>
                  {sol.description}
                </p>

                <div style={{ background: '#0B111A', borderRadius: '6px', padding: '14px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Typical System Build-Up:
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {sol.systemLayers.map((layer, idx) => (
                      <li key={idx} style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#2563EB', color: '#fff', fontSize: '0.68rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                          {idx + 1}
                        </span>
                        {layer}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {sol.recommendedProducts.map(pcode => (
                      <span key={pcode} style={{ background: '#334155', color: '#CBD5E1', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>
                        {pcode}
                      </span>
                    ))}
                  </div>
                  <button onClick={() => openQuoteModal(sol.title)} className="btn btn-outline btn-sm" style={{ color: '#fff', borderColor: '#475569' }}>
                    System Inquiry
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Standards & QA Section */}
      <section className="section-block" id="standards">
        <div className="section-container">
          <div className="section-title-bar">
            <div>
              <span className="eyebrow">Global Compliance</span>
              <h2>International Standards & Testing Matrix</h2>
            </div>
            <p style={{ color: 'var(--slate-600)', maxWidth: '480px', margin: 0 }}>
              Full compliance with ASTM, EN, and GB testing methodologies. Every shipment is accompanied by batch-specific Certificate of Analysis (COA) and Mill Test Reports.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            {STANDARDS_MATRIX.map((stdGroup, idx) => (
              <div key={idx} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <Award size={20} color="#2563EB" />
                  <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{stdGroup.organization}</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {stdGroup.standards.map((s, sidx) => (
                    <div key={sidx} style={{ padding: '10px 12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.82rem', color: '#2563EB' }}>
                        {s.code}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '2px' }}>
                        {s.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* QA Workflow Banner */}
          <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', color: '#fff', borderRadius: 'var(--radius-md)', padding: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            <div>
              <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="#059669" /> 1. Raw Polymer Inspection
              </h4>
              <p style={{ color: '#94A3B8', fontSize: '0.82rem', margin: 0 }}>
                100% virgin resin, synthetic rubber, and premium asphalt testing for penetration, softening point, and melt flow index before production.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="#059669" /> 2. Continuous Inline Gauging
              </h4>
              <p style={{ color: '#94A3B8', fontSize: '0.82rem', margin: 0 }}>
                Laser micrometers monitor membrane thickness and mass distribution continuously across the full 2.0m - 8.0m web width.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="#059669" /> 3. Batch COA Certification
              </h4>
              <p style={{ color: '#94A3B8', fontSize: '0.82rem', margin: 0 }}>
                Hydrostatic pressure testing at 0.7 MPa, -25°C cold bend flex tests, and tensile elongation verification for every production lot.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Factory & Core Advantages */}
      <section className="section-block" id="about" style={{ background: '#F8FAFC', borderTop: '1px solid var(--slate-200)', borderBottom: '1px solid var(--slate-200)' }}>
        <div className="section-container">
          <div className="section-title-bar">
            <div>
              <span className="eyebrow">Manufacturing Powerhouse</span>
              <h2>Why Global Contractors Partner with Mingze</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            {WHY_CHOOSE_US.map((item, idx) => (
              <div key={idx} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
                <div style={{ width: '36px', height: '36px', background: '#EFF6FF', color: '#2563EB', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: '0.9rem', marginBottom: '16px' }}>
                  0{idx + 1}
                </div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Factory Spec Summary */}
          <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', padding: '24px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Factory Location</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginTop: '4px' }}>Shouguang City, Shandong, China</div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>China's Waterproof Capital</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Total Factory Area</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginTop: '4px' }}>68,000 m² Facility</div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>4 Automated Production Lines</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Logistics & Shipping</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginTop: '4px' }}>Qingdao Port Direct</div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>200 km / 2.5h Highway Transit</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Export Experience</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginTop: '4px' }}>15+ Years Global Export</div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>FOB / CIF / CFR / DDP Terms</div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Inquiries & Contact Section */}
      <section className="section-block" id="contact">
        <div className="section-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
            <div>
              <span className="eyebrow">Direct Factory Communication</span>
              <h2>Get in Touch with Our Global Export Desk</h2>
              <p style={{ color: 'var(--slate-600)', marginBottom: '24px' }}>
                Need rapid FOB pricing, full TDS technical data sheets, physical sample swatches, or custom container consolidation? Reach out directly via email, WhatsApp, or submit the quotation form.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', flexShrink: 0 }}>
                    <Mail size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Official Business Inquiries</div>
                    <a href={`mailto:${COMPANY_INFO.email}`} style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1D4ED8', display: 'block' }}>
                      {COMPANY_INFO.email}
                    </a>
                    <a href={`mailto:${COMPANY_INFO.altEmail}`} style={{ fontSize: '0.85rem', color: '#64748B' }}>
                      {COMPANY_INFO.altEmail}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', flexShrink: 0 }}>
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Direct WhatsApp Export Desk (24/7)</div>
                    <a href={COMPANY_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#059669', display: 'block' }}>
                      {COMPANY_INFO.whatsapp}
                    </a>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Instant response for technical and price requests</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', flexShrink: 0 }}>
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Manufacturing Plant & Headquarters</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0F172A' }}>{COMPANY_INFO.address}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Export Loading Port: Qingdao Port, China</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <a href={COMPANY_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                  <MessageCircle size={16} /> Open WhatsApp Chat
                </a>
                <button onClick={() => openQuoteModal()} className="btn btn-primary">
                  Request Official Proforma Invoice
                </button>
              </div>
            </div>

            {/* Quick Inquiry Form */}
            <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Send Direct RFQ / Inquiry</h3>
              <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '20px' }}>
                We respond with full FOB/CIF pricing, technical submittals, and loading plans within 6 hours.
              </p>

              {formSubmitted ? (
                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '6px', padding: '24px', textAlign: 'center' }}>
                  <CheckCircle2 size={36} color="#059669" style={{ margin: '0 auto 12px' }} />
                  <h4 style={{ color: '#065F46', marginBottom: '6px' }}>Inquiry Submitted Successfully!</h4>
                  <p style={{ color: '#047857', fontSize: '0.85rem', margin: 0 }}>
                    Our export manager will send the formal quotation to your email shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Your Name *</label>
                      <input type="text" required placeholder="e.g. John Doe" style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.85rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Work Email *</label>
                      <input type="email" required placeholder="john@company.com" style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.85rem' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>WhatsApp / Phone</label>
                      <input type="text" placeholder="+1 (555) 000-0000" style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.85rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Destination Port</label>
                      <input type="text" placeholder="e.g. Dubai / Hamburg / Santos" style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.85rem' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Product of Interest</label>
                    <select style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.85rem' }}>
                      <option value="">-- Select Product or Whole Container Mix --</option>
                      {PRODUCTS.map(p => (
                        <option key={p.code} value={p.code}>{p.code}: {p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Project Requirements / Quantity</label>
                    <textarea rows="3" placeholder="Please specify thickness, roll dimensions, estimated quantity (e.g. 1x20' GP container), or special testing requirements..." style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.85rem' }}></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ height: '42px', fontSize: '0.9rem' }}>
                    <Send size={16} /> Submit RFQ for Priority Processing
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Minimalist Footer */}
      <footer style={{ background: '#0B111A', color: '#94A3B8', padding: '48px var(--gutter) 24px', borderTop: '1px solid #1E293B' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px', marginBottom: '40px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ background: '#2563EB', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>MZ</div>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>MINGZE WATERPROOF</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.6, marginBottom: '16px' }}>
                Weifang Mingze Waterproof Material Co., Ltd. is a dedicated industrial manufacturer exporting high-grade waterproofing membranes and chemical coatings globally.
              </p>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                <strong>ISO9001 • ISO14001 • CE • ASTM</strong>
              </div>
            </div>

            <div>
              <h4 style={{ color: '#fff', fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>Product Categories</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                {CATEGORIES.map(cat => (
                  <li key={cat.id}>
                    <a href="#products" onClick={() => setActiveTab(cat.id)} style={{ color: '#94A3B8', transition: 'color 0.2s' }}>
                      {cat.name} ({cat.count})
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ color: '#fff', fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>Quick Navigation</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                <li><a href="#products" style={{ color: '#94A3B8' }}>Technical Product Catalog</a></li>
                <li><a href="#solutions" style={{ color: '#94A3B8' }}>Engineering Solutions</a></li>
                <li><a href="#standards" style={{ color: '#94A3B8' }}>QA & Testing Standards</a></li>
                <li><a href="#about" style={{ color: '#94A3B8' }}>Factory & Manufacturing</a></li>
                <li><a href="#contact" style={{ color: '#94A3B8' }}>RFQ & Proforma Invoice</a></li>
              </ul>
            </div>

            <div>
              <h4 style={{ color: '#fff', fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>Direct Contacts</h4>
              <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>Email: <a href={`mailto:${COMPANY_INFO.email}`} style={{ color: '#60A5FA' }}>{COMPANY_INFO.email}</a></div>
                <div>Alt: <a href={`mailto:${COMPANY_INFO.altEmail}`} style={{ color: '#60A5FA' }}>{COMPANY_INFO.altEmail}</a></div>
                <div>WhatsApp: <a href={COMPANY_INFO.whatsappLink} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366' }}>{COMPANY_INFO.whatsapp}</a></div>
                <div>Port: Qingdao Port, China</div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #1E293B', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.75rem', color: '#64748B' }}>
            <div>
              © {new Date().getFullYear()} Weifang Mingze Waterproof Material Co., Ltd. All Rights Reserved.
            </div>
            <div>
              Industrial B2B Export Platform | Direct Factory Supply
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Fast WhatsApp Button */}
      <a
        href={COMPANY_INFO.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#25D366',
          color: '#fff',
          padding: '12px 18px',
          borderRadius: '50px',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 700,
          fontSize: '0.88rem',
          zIndex: 999,
          textDecoration: 'none'
        }}
      >
        <MessageCircle size={20} />
        <span>Chat on WhatsApp</span>
      </a>

      {/* Product Technical Details & TDS Modal */}
      {selectedProduct && (
        <div className="modal-backdrop" onClick={() => setSelectedProduct(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ background: '#fff', width: '100%', maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#2563EB', fontWeight: 700 }}>
                  {selectedProduct.code} • {selectedProduct.categoryName}
                </span>
                <h3 style={{ fontSize: '1.25rem', margin: '2px 0 0' }}>{selectedProduct.name}</h3>
              </div>
              <button onClick={() => setSelectedProduct(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#64748B' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    style={{ width: '100%', height: '240px', objectFit: 'contain', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px' }}
                    onError={(e) => { e.target.src = '/assets/images/placeholder.svg'; }}
                  />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.92rem', marginBottom: '8px' }}>Key Engineering Highlights</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {selectedProduct.features.map((feat, idx) => (
                      <li key={idx} style={{ fontSize: '0.82rem', color: '#334155', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                        <CheckCircle2 size={15} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <div style={{ background: '#F1F5F9', padding: '12px', borderRadius: '6px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div><strong>Standard:</strong> {selectedProduct.standards}</div>
                    {selectedProduct.thickness && <div><strong>Available Dimensions:</strong> {selectedProduct.thickness}</div>}
                    {selectedProduct.rollSize && <div><strong>Roll / Pack Unit:</strong> {selectedProduct.rollSize}</div>}
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
                      <th style={{ padding: '8px 12px', color: '#475569' }}>Measured Specification / Performance</th>
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
                <div style={{ fontSize: '0.78rem', color: '#1E40AF', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>
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

      {/* Instant Proforma & Quote Modal */}
      {isQuoteModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsQuoteModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ background: '#fff', width: '100%', maxWidth: '580px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0F172A', color: '#fff' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>Request Official FOB / CIF Quote</h3>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Direct Factory Price Guarantee • Weifang Mingze Waterproof</span>
              </div>
              <button onClick={() => setIsQuoteModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Selected Product</label>
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

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Contact Name *</label>
                      <input type="text" required placeholder="John Smith" style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.85rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Work Email *</label>
                      <input type="email" required placeholder="john@domain.com" style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.85rem' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>WhatsApp / Phone</label>
                      <input type="text" placeholder="+1..." style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.85rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Target Discharge Port</label>
                      <input type="text" placeholder="e.g. Jebel Ali / Rotterdam" style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.85rem' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Estimated Quantity & Specifications</label>
                    <textarea rows="3" placeholder="e.g. 5,000 m² SBS 4mm Mineral Cap Sheet + 2,000 kg PU coating in 1x20' GP container" style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.85rem' }}></textarea>
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

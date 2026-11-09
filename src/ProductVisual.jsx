import React from 'react';

// Specialized Architectural 3D Vector Packshots for 37 Industrial Materials
export function ProductVisual({ product, size = 'card' }) {
  const cat = product.categoryId;
  const isPail = cat === 'liquid-coatings' && !product.code.includes('MZ-CAT-26') && !product.code.includes('MZ-CAT-22');
  const isTape = cat === 'flashing-butyl';
  const isPolymer = cat === 'polymer-hdpe';
  const isGeosynthetic = cat === 'geosynthetics-aux';

  const width = size === 'hero' ? 240 : 180;
  const height = size === 'hero' ? 200 : 150;

  if (isPail) {
    return (
      <svg width={width} height={height} viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="pailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="30%" stopColor="#475569" />
            <stop offset="70%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="labelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
          <filter id="shadowPail" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#0F172A" floodOpacity="0.18" />
          </filter>
        </defs>
        {/* Pail Shadow */}
        <ellipse cx="100" cy="165" rx="55" ry="8" fill="#CBD5E1" opacity="0.6" />
        {/* Pail Body */}
        <path d="M50 48 L62 155 Q100 162 138 155 L150 48 Z" fill="url(#pailGrad)" filter="url(#shadowPail)" />
        {/* Label Band */}
        <path d="M53 72 L59 135 Q100 142 141 135 L147 72 Q100 66 53 72 Z" fill="url(#labelGrad)" />
        {/* Label Text */}
        <rect x="65" y="80" width="70" height="14" rx="2" fill="#FFFFFF" opacity="0.95" />
        <text x="100" y="90" fill="#0F172A" fontSize="7" fontWeight="800" fontFamily="sans-serif" textAnchor="middle">{product.code}</text>
        <text x="100" y="104" fill="#FFFFFF" fontSize="6.5" fontWeight="700" fontFamily="sans-serif" textAnchor="middle">INDUSTRIAL COATING</text>
        <text x="100" y="116" fill="#93C5FD" fontSize="5.5" fontWeight="600" fontFamily="monospace" textAnchor="middle">{product.standards.split('/')[0]}</text>
        <rect x="75" y="122" width="50" height="7" rx="1.5" fill="#059669" />
        <text x="100" y="127.5" fill="#FFFFFF" fontSize="4.5" fontWeight="800" fontFamily="sans-serif" textAnchor="middle">20 KG NET WEIGHT</text>
        {/* Pail Ribs & Rings */}
        <path d="M48 48 Q100 56 152 48" stroke="#64748B" strokeWidth="3" fill="none" />
        <path d="M50 44 Q100 52 150 44" stroke="#94A3B8" strokeWidth="2" fill="none" />
        {/* Pail Lid */}
        <ellipse cx="100" cy="42" rx="53" ry="10" fill="#334155" stroke="#64748B" strokeWidth="1.5" />
        <ellipse cx="100" cy="40" rx="46" ry="7" fill="#475569" />
        {/* Metal Handle */}
        <path d="M42 56 Q100 8 158 56" stroke="#94A3B8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="43" cy="56" r="3.5" fill="#64748B" />
        <circle cx="157" cy="56" r="3.5" fill="#64748B" />
      </svg>
    );
  }

  if (isTape) {
    return (
      <svg width={width} height={height} viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="tapeAlu" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="40%" stopColor="#94A3B8" />
            <stop offset="70%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
          <linearGradient id="butylCore" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>
        <ellipse cx="100" cy="155" rx="60" ry="10" fill="#E2E8F0" opacity="0.6" />
        {/* Tape Outer Cylinder */}
        <path d="M45 75 L45 125 Q100 155 155 125 L155 75 Q100 45 45 75 Z" fill="url(#tapeAlu)" stroke="#64748B" strokeWidth="1" />
        {/* Tape Top Surface */}
        <ellipse cx="100" cy="75" rx="55" ry="30" fill="url(#tapeAlu)" stroke="#94A3B8" strokeWidth="1.5" />
        {/* Inner Tape Layers */}
        <ellipse cx="100" cy="75" rx="42" ry="22" fill="#1E293B" />
        <ellipse cx="100" cy="75" rx="28" ry="14" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
        {/* Core Hole */}
        <ellipse cx="100" cy="75" rx="18" ry="9" fill="#0B111A" />
        {/* Label on Outer Face */}
        <rect x="68" y="102" width="64" height="18" rx="2" fill="#1D4ED8" />
        <text x="100" y="111" fill="#FFFFFF" fontSize="6.5" fontWeight="800" fontFamily="sans-serif" textAnchor="middle">{product.code}</text>
        <text x="100" y="117" fill="#93C5FD" fontSize="4.5" fontWeight="700" fontFamily="monospace" textAnchor="middle">BUTYL FLASHING TAPE</text>
        {/* Unrolled Tail */}
        <path d="M148 115 Q175 125 185 145" stroke="#CBD5E1" strokeWidth="12" strokeLinecap="round" fill="none" opacity="0.9" />
        <path d="M148 115 Q175 125 185 145" stroke="#1E293B" strokeWidth="2" fill="none" />
      </svg>
    );
  }

  if (isGeosynthetic) {
    return (
      <svg width={width} height={height} viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="geoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0B111A" />
          </linearGradient>
        </defs>
        <ellipse cx="100" cy="155" rx="65" ry="10" fill="#E2E8F0" opacity="0.6" />
        {/* Wide Master Roll */}
        <path d="M30 65 L30 120 Q100 150 170 120 L170 65 Q100 35 30 65 Z" fill="url(#geoGrad)" stroke="#334155" strokeWidth="1.5" />
        <ellipse cx="100" cy="65" rx="70" ry="28" fill="#1E293B" stroke="#475569" strokeWidth="1" />
        <ellipse cx="100" cy="65" rx="22" ry="9" fill="#0B111A" />
        {/* Industrial Wrap Band */}
        <path d="M30 85 L30 108 Q100 138 170 108 L170 85 Q100 115 30 85 Z" fill="#2563EB" opacity="0.95" />
        <text x="100" y="100" fill="#FFFFFF" fontSize="8" fontWeight="800" fontFamily="sans-serif" textAnchor="middle">{product.code} • GEOSYNTHETICS</text>
        <text x="100" y="106" fill="#BFDBFE" fontSize="5.5" fontWeight="600" fontFamily="monospace" textAnchor="middle">{product.standards.split('/')[0]}</text>
      </svg>
    );
  }

  // Modified Bitumen & Polymer Single-Ply Membranes (Standard 3D Engineered Roll)
  const isDarkBitumen = cat === 'bitumen-shingles';
  const rollColor = isDarkBitumen ? '#1E293B' : '#E2E8F0';
  const rollStroke = isDarkBitumen ? '#475569' : '#94A3B8';
  const tagColor = isDarkBitumen ? '#1D4ED8' : '#059669';

  return (
    <svg width={width} height={height} viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`rollGrad_${product.code}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={isDarkBitumen ? '#0F172A' : '#CBD5E1'} />
          <stop offset="40%" stopColor={isDarkBitumen ? '#334155' : '#F1F5F9'} />
          <stop offset="70%" stopColor={isDarkBitumen ? '#1E293B' : '#E2E8F0'} />
          <stop offset="100%" stopColor={isDarkBitumen ? '#0B111A' : '#94A3B8'} />
        </linearGradient>
      </defs>
      {/* Ground Shadow */}
      <ellipse cx="100" cy="158" rx="55" ry="9" fill="#CBD5E1" opacity="0.65" />
      {/* Main Roll Body */}
      <path d="M52 42 L52 140 Q100 162 148 140 L148 42 Q100 20 52 42 Z" fill={`url(#rollGrad_${product.code})`} stroke={rollStroke} strokeWidth="1.2" />
      {/* Top Ellipse Core */}
      <ellipse cx="100" cy="42" rx="48" ry="18" fill={isDarkBitumen ? '#1E293B' : '#FFFFFF'} stroke={rollStroke} strokeWidth="1.5" />
      {/* Hollow Core */}
      <ellipse cx="100" cy="42" rx="16" ry="6" fill="#0B111A" />
      {/* Corporate Label Wrap Band */}
      <path d="M52 82 L52 118 Q100 140 148 118 L148 82 Q100 104 52 82 Z" fill={tagColor} />
      <rect x="66" y="90" width="68" height="12" rx="2" fill="#FFFFFF" opacity="0.95" />
      <text x="100" y="99" fill="#0F172A" fontSize="7.5" fontWeight="800" fontFamily="sans-serif" textAnchor="middle">{product.code}</text>
      <text x="100" y="109" fill="#FFFFFF" fontSize="5.5" fontWeight="700" fontFamily="sans-serif" textAnchor="middle">{isDarkBitumen ? 'SBS / APP MEMBRANE' : 'SINGLE-PLY POLYMER'}</text>
      <text x="100" y="115" fill={isDarkBitumen ? '#93C5FD' : '#A7F3D0'} fontSize="4.8" fontWeight="600" fontFamily="monospace" textAnchor="middle">{product.thickness || '1.5mm - 4.0mm'}</text>
      {/* Woven Scrim / Granule Texture Indicator */}
      <line x1="56" y1="58" x2="144" y2="58" stroke={isDarkBitumen ? '#475569' : '#CBD5E1'} strokeWidth="1" strokeDasharray="3 3" />
      <line x1="54" y1="68" x2="146" y2="68" stroke={isDarkBitumen ? '#475569' : '#CBD5E1'} strokeWidth="1" strokeDasharray="3 3" />
      <line x1="54" y1="128" x2="146" y2="128" stroke={isDarkBitumen ? '#475569' : '#CBD5E1'} strokeWidth="1" strokeDasharray="3 3" />
    </svg>
  );
}

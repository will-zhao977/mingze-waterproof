// Weifang Mingze Waterproof Material Co., Ltd. - B2B Product & Corporate Dataset
// Complete 37 Products across 5 Core Industrial Categories

export const COMPANY_INFO = {
  name: "Weifang Mingze Waterproof Material Co., Ltd.",
  shortName: "Mingze Waterproof",
  legalNameZh: "潍坊明泽防水材料有限公司",
  tagline: "Direct Industrial Manufacturer & Exporter of Advanced Waterproofing Systems",
  established: 2008,
  facilityArea: "68,000 m²",
  annualCapacity: "50,000,000+ m² Membrane | 25,000+ Tons Coatings",
  address: "Taitou Industrial Zone, Shouguang, Weifang City, Shandong Province, China",
  port: "Qingdao Port (200 km / 2.5h Highway Transit)",
  email: "zhao@mzwaterproof.com",
  altEmail: "zhao@mingzewaterproof.com",
  whatsapp: "+86 16658506707",
  whatsappLink: "https://wa.me/8616658506707?text=Hello%20Mingze%20Waterproof%2C%20I%20am%20interested%20in%20your%20products.",
  phone: "+86-400-0563-996",
  certifications: ["ISO9001:2015", "ISO14001:2015", "ISO45001:2018", "CE (EN 13707 / EN 13956)", "ASTM Compliance"],
  targetMarkets: ["Southeast Asia", "Middle East", "Europe", "South America", "Africa", "North America", "Oceania"]
};

export const CATEGORIES = [
  {
    id: "bitumen-shingles",
    name: "Modified Bitumen & Shingles",
    shortName: "Bitumen & Shingles",
    count: 7,
    description: "SBS/APP torch-applied, self-adhesive modified bitumen membranes, glass-fiber asphalt shingles, and synthetic underlayments for commercial, civil, and slope roofing.",
    image: "/assets/images/product-bitumen.jpg"
  },
  {
    id: "polymer-hdpe",
    name: "Polymer & HDPE Pre-Applied",
    shortName: "Polymer & HDPE",
    count: 9,
    description: "TPO, PVC, and EPDM single-ply sheets for exposed roofs, plus pre-applied HDPE membranes with continuous chemical bond for blindside underground basements.",
    image: "/assets/images/product-polymer.jpg"
  },
  {
    id: "liquid-coatings",
    name: "Liquid Coatings & Slurry",
    shortName: "Liquid Coatings",
    count: 11,
    description: "Single/two-component polyurethane coatings, JS polymer-cement elastomeric slurry, acrylic metal roof coatings, transparent sealants, and spray polyurea systems.",
    image: "/assets/images/product-coating.jpg"
  },
  {
    id: "flashing-butyl",
    name: "Flashing & Butyl Tapes",
    shortName: "Flashing & Butyl",
    count: 4,
    description: "Aluminum foil reinforced butyl sealing tape, double-sided butyl joint tape, heavy-duty marine hatch cover tape, and bituminous damp proof course (DPC).",
    image: "/assets/images/product-tape.jpg"
  },
  {
    id: "geosynthetics-aux",
    name: "Geosynthetics & Auxiliaries",
    shortName: "Geosynthetics & Aux",
    count: 6,
    description: "High-density polyethylene (HDPE) geomembranes, non-woven needle-punched geotextiles, dimple drainage boards, RDP polymer powder, and rapid leak stoppers.",
    image: "/assets/images/product-epdm.jpg"
  }
];

export const PRODUCTS = [
  // --- Category 1: Modified Bitumen & Shingles (7) ---
  {
    id: "MZ-CAT-01",
    code: "MZ-CAT-01",
    name: "Elastomeric SBS Modified Bitumen Waterproof Membrane",
    categoryId: "bitumen-shingles",
    categoryName: "Modified Bitumen & Shingles",
    image: "/assets/images/products/cat-01-v2.jpg",
    brief: "Premium polyester/fiberglass reinforced SBS torch-on membrane with unmatched low-temperature flexibility down to -25°C.",
    features: [
      "Low temperature flexibility down to -20°C / -25°C",
      "High tensile strength and elongation (PY reinforcement)",
      "Excellent resistance to root puncture and cyclic thermal fatigue",
      "Available in PE film, Fine Sand (S), Mineral Slate Granule (M) surfaces"
    ],
    standards: "GB 18242-2008 / ASTM D6164 / EN 13707",
    thickness: "3.0mm, 4.0mm, 5.0mm",
    rollSize: "1.0m × 10m / roll",
    applications: "Commercial flat roofing, basements, podium decks, subways, bridge decks, cold region infrastructure.",
    specs: [
      { property: "Reinforcement", value: "Polyester (PY) / Glass Fiber (G) / Composite (PYG)" },
      { property: "Low Temp Flexibility", value: "No cracks at -20°C (I) / -25°C (II)" },
      { property: "Heat Resistance", value: "90°C (I) / 105°C (II), 2h without sliding" },
      { property: "Tensile Strength (Long./Trans.)", value: "≥ 500 / 400 N/50mm (3mm), ≥ 800 / 600 N/50mm (4mm)" },
      { property: "Elongation at Break", value: "≥ 40% (PY Reinforced)" },
      { property: "Water Impermeability", value: "0.3 MPa, 30 min watertight" }
    ]
  },
  {
    id: "MZ-CAT-02",
    code: "MZ-CAT-02",
    name: "Plastomeric APP Modified Bitumen Waterproof Membrane",
    categoryId: "bitumen-shingles",
    categoryName: "Modified Bitumen & Shingles",
    image: "/assets/images/products/cat-02-v2.jpg",
    brief: "Atactic Polypropylene modified bitumen torch-on membrane engineered for superior high-temperature stability (up to 130°C) in tropical/arid climates.",
    features: [
      "High softening point and heat resistance up to 130°C",
      "Outstanding UV and aging resistance for hot & tropical regions",
      "Superior puncture and foot-traffic durability",
      "Ideal for Middle East, Southeast Asia, South America, and Africa"
    ],
    standards: "GB 18243-2008 / ASTM D6222 / EN 13707",
    thickness: "3.0mm, 4.0mm, 5.0mm",
    rollSize: "1.0m × 10m / roll",
    applications: "Exposed tropical roofing, industrial factory decks, hot climate infrastructure, bridge piers.",
    specs: [
      { property: "Modifier Type", value: "Atactic Polypropylene (APP) / APAO Polymer" },
      { property: "Heat Resistance", value: "110°C (I) / 130°C (II), 2h no flow/drop" },
      { property: "Low Temp Flexibility", value: "-5°C (I) / -15°C (II)" },
      { property: "Tensile Strength", value: "≥ 550 / 450 N/50mm (PY)" },
      { property: "Elongation", value: "≥ 35%" }
    ]
  },
  {
    id: "MZ-CAT-03",
    code: "MZ-CAT-03",
    name: "Self-Adhesive Polymer Modified Bitumen Waterproof Membrane",
    categoryId: "bitumen-shingles",
    categoryName: "Modified Bitumen & Shingles",
    image: "/assets/images/products/cat-03-v2.png",
    brief: "Cold-applied, peel-and-stick bitumen membrane eliminating open flames, ideal for fire-restricted sites, timber roofs, and rapid basement installations.",
    features: [
      "100% Cold-applied peel-and-stick (zero open flame, zero VOC emission)",
      "High-tack self-healing capability for minor nail punctures",
      "Strong adhesion to concrete, wood, metal, and insulation boards",
      "Available in single-sided and double-sided adhesive variants"
    ],
    standards: "GB 23441-2009 / ASTM D1970",
    thickness: "1.5mm, 2.0mm, 3.0mm",
    rollSize: "1.0m × 10m, 1.0m × 20m",
    applications: "Underground substructures, timber frame roofs, oil depots, hospitals, chemical plants, renovation.",
    specs: [
      { property: "Surface Finish", value: "PE Film / Aluminum Film / Cross-Laminated Film / Double Silicon" },
      { property: "Peel Strength to Concrete", value: "≥ 1.5 N/mm (dry) / ≥ 1.2 N/mm (wet)" },
      { property: "Low Temp Flexibility", value: "No crack at -20°C" },
      { property: "Heat Resistance", value: "70°C, 2h no slide" }
    ]
  },
  {
    id: "MZ-CAT-04",
    code: "MZ-CAT-04",
    name: "Architectural Fiberglass Asphalt Roofing Shingles",
    categoryId: "bitumen-shingles",
    categoryName: "Modified Bitumen & Shingles",
    image: "/assets/images/products/cat-04-v2.jpg",
    brief: "Multi-layered decorative fiberglass reinforced asphalt shingles with natural ceramic granules for luxury residential villas and slope roofs.",
    features: [
      "Heavy-duty fiberglass core coated with oxidized weathering bitumen",
      "High-temperature ceramic coated colored mineral granules (UV fade-proof)",
      "Wind resistance up to Class F / 110 mph (177 km/h)",
      "Available styles: 3-Tab, Laminated (Architectural), Mosaic/Hexagonal, Fish Scale, Gothic"
    ],
    standards: "GB/T 20474-2015 / ASTM D3462 / EN 544",
    thickness: "2.6mm - 5.3mm (Laminated)",
    rollSize: "1000mm × 333mm / bundle (~3.1 m² / bundle)",
    applications: "Residential villas, resorts, commercial pitched roofs, timber lodges, gazebos, slope retrofits.",
    specs: [
      { property: "Granule Adhesion", value: "Mass loss ≤ 1.0 g" },
      { property: "Tear Strength", value: "≥ 1700 mN" },
      { property: "Fire Rating", value: "Class A / Class B Fire Resistant" },
      { property: "Colors Available", value: "Estate Gray, Desert Tan, Forest Green, Tuscan Red, Chateau Blue, Onyx Black" }
    ]
  },
  {
    id: "MZ-CAT-05",
    code: "MZ-CAT-05",
    name: "Breathable Synthetic Roofing Underlayment",
    categoryId: "bitumen-shingles",
    categoryName: "Modified Bitumen & Shingles",
    image: "/assets/images/products/cat-05-v2.jpg",
    brief: "High-strength woven polypropylene multi-layer breathable roof underlayment with high vapor permeability and superior slip resistance.",
    features: [
      "Micro-porous breathable membrane layer allows moisture vapor to escape",
      "Non-woven textured surface provides superior slip-resistant walking grip",
      "10x tear resistance compared to conventional #30 asphalt felt",
      "6-month UV exposure resistance during prolonged construction"
    ],
    standards: "ASTM D226 / ASTM D4869 / EN 13859-1",
    thickness: "0.45mm - 0.70mm (110 - 180 gsm)",
    rollSize: "1.2m × 50m / 1.5m × 50m",
    applications: "Underlayment beneath asphalt shingles, metal standing seam, clay & concrete tiles, slate roofs.",
    specs: [
      { property: "Vapor Permeability", value: "≥ 1200 g/m²/24h" },
      { property: "Hydrostatic Head", value: "> 2000 mm H₂O" },
      { property: "Tensile Strength (MD/CD)", value: "≥ 320 / 280 N/50mm" }
    ]
  },
  {
    id: "MZ-CAT-06",
    code: "MZ-CAT-06",
    name: "Mineral Granule Surface SBS Cap Sheet Membrane",
    categoryId: "bitumen-shingles",
    categoryName: "Modified Bitumen & Shingles",
    image: "/assets/images/products/cat-06-v2.png",
    brief: "Heavy-duty exposed top-layer SBS membrane covered with colored basalt mineral slates for robust UV shielding and mechanical walkability.",
    features: [
      "Colored mineral slate granules offer permanent UV block and solar reflection",
      "Heavy polyester fabric core withstands thermal expansion and contraction",
      "Fire retardant formulation meeting European & North American fire codes",
      "Aesthetic natural slate colors: Dark Grey, Green, Red, White Reflective"
    ],
    standards: "GB 18242-2008 / EN 13707 / ASTM D6164 Type I/II",
    thickness: "4.0mm, 4.5mm, 5.0mm",
    rollSize: "1.0m × 10m / roll",
    applications: "Top cap sheet for multi-ply built-up roofing (BUR), exposed industrial roof refurbishment.",
    specs: [
      { property: "Slate Loss Rate", value: "≤ 8% (Centrifugal wash)" },
      { property: "Tensile Strength", value: "≥ 800 N/50mm (PY)" },
      { property: "Low Temp Flexibility", value: "-25°C no cracks" }
    ]
  },
  {
    id: "MZ-CAT-07",
    code: "MZ-CAT-07",
    name: "Root Puncture Resistant SBS Green Roof Membrane",
    categoryId: "bitumen-shingles",
    categoryName: "Modified Bitumen & Shingles",
    image: "/assets/images/products/cat-07-v2.jpg",
    brief: "Specially formulated SBS membrane infused with chemical root barrier additives (imported Preventol B2) for intensive/extensive green roof systems.",
    features: [
      "Dual root defense: high-strength copper foil / polymer core + chemical root inhibitor",
      "Tested and certified to resist aggressive plant root penetration for 15+ years",
      "Non-toxic to plants and drainage run-off ecosystems",
      "High puncture resistance under heavy planting soil and gravel overburden"
    ],
    standards: "GB 18242 / FLL Root Resistance Tested / JC/T 1075-2008",
    thickness: "4.0mm, 4.5mm",
    rollSize: "1.0m × 10m / roll",
    applications: "Green roofs, rooftop gardens, landscaped podiums, underground garage roof greening.",
    specs: [
      { property: "Root Inhibitor", value: "Chemical Preventol B2 / Copper Foil Barrier" },
      { property: "FLL Test", value: "Passed 2-Year / 4-Year Root Penetration Test" },
      { property: "Hydrostatic Resistance", value: "≥ 0.3 MPa (30 min)" }
    ]
  },

  // --- Category 2: Polymer & HDPE Pre-Applied (9) ---
  {
    id: "MZ-CAT-08",
    code: "MZ-CAT-08",
    name: "Thermoplastic Polyolefin (TPO) Single-Ply Roofing Membrane",
    categoryId: "polymer-hdpe",
    categoryName: "Polymer & HDPE Pre-Applied",
    image: "/assets/images/products/cat-08-v2.jpg",
    brief: "State-of-the-art ethylene propylene diene rubber & polypropylene polymer alloy membrane, internally reinforced with polyester scrim for cool roofs.",
    features: [
      "High solar reflectance (SRI > 104) drastically lowers building cooling load",
      "Plasticizer-free formulation ensures zero brittleness over 30+ year lifecycle",
      "Hot-air welded seams creating monolithic joints stronger than the sheet itself",
      "Available types: Internally Reinforced (P), Fleece-Backed (L), Homogeneous (H)"
    ],
    standards: "GB 27789-2011 / ASTM D6878 / EN 13956",
    thickness: "1.2mm, 1.5mm, 1.8mm, 2.0mm",
    rollSize: "2.0m × 20m / roll",
    applications: "Large-span industrial steel roofs, logistics hubs, airports, commercial shopping malls, data centers.",
    specs: [
      { property: "Tensile Strength (Internal Scrim)", value: "≥ 1000 N/50mm (Type P)" },
      { property: "Solar Reflectance Index (SRI)", value: "≥ 104 (White color)" },
      { property: "Low Temp Flexibility", value: "-40°C no crack" },
      { property: "Seam Strength (Hot-Air Weld)", value: "≥ 800 N/50mm (Film break mode)" },
      { property: "Artificial Weathering (UV 2500h)", value: "No cracks, no crazing" }
    ]
  },
  {
    id: "MZ-CAT-09",
    code: "MZ-CAT-09",
    name: "Polyvinyl Chloride (PVC) Commercial Single-Ply Membrane",
    categoryId: "polymer-hdpe",
    categoryName: "Polymer & HDPE Pre-Applied",
    image: "/assets/images/products/cat-09-v2.jpg",
    brief: "Premium polyester scrim reinforced PVC waterproof sheet formulated with high-molecular plasticizers and UV stabilizers for exposed roofing.",
    features: [
      "Exceptional fire retardancy: self-extinguishing when removed from fire",
      "Hot-air weldable at high speeds for rapid rooftop installation",
      "Resistant to industrial chemical fumes, acid rain, and fungal growth",
      "High puncture and wind-uplift resistance with mechanical fasteners"
    ],
    standards: "GB 12952-2011 / ASTM D4434 Type II/III / EN 13956",
    thickness: "1.2mm, 1.5mm, 1.8mm, 2.0mm",
    rollSize: "2.0m × 20m / roll",
    applications: "Exposed roof retrofits, mechanically fastened roofs, adhere systems, tunnels, civil underground.",
    specs: [
      { property: "Tensile Strength", value: "≥ 1000 N/50mm (Reinforced)" },
      { property: "Fire Reaction", value: "UL 790 Class A / DIN 4102-B2" },
      { property: "Low Temperature Bend", value: "-25°C / -35°C no cracks" }
    ]
  },
  {
    id: "MZ-CAT-10",
    code: "MZ-CAT-10",
    name: "Ethylene Propylene Diene Monomer (EPDM) Rubber Membrane",
    categoryId: "polymer-hdpe",
    categoryName: "Polymer & HDPE Pre-Applied",
    image: "/assets/images/products/cat-10-v2.jpg",
    brief: "100% vulcanized synthetic rubber membrane offering over 50 years of proven outdoor durability, ozone resistance, and 450% ultimate elongation.",
    features: [
      "Extreme elongation (≥ 450%) effortlessly accommodates structural movements",
      "Operating temperature range from -45°C up to +120°C",
      "Zero plasticizer migration ensures permanent flexibility and elasticity",
      "Large sheet widths (up to 3.0m) minimize on-site splice seams"
    ],
    standards: "GB 18173.1-2012 / ASTM D4637 Type I",
    thickness: "1.2mm, 1.5mm, 2.0mm",
    rollSize: "1.2m / 2.0m / 3.0m × 20m",
    applications: "Water reservoirs, artificial lakes, exposed flat roofs, facade curtain wall waterproofing.",
    specs: [
      { property: "Tensile Strength", value: "≥ 9.0 MPa" },
      { property: "Elongation at Break", value: "≥ 450%" },
      { property: "Ozone Resistance (200 pphm, 168h)", value: "No cracking" }
    ]
  },
  {
    id: "MZ-CAT-11",
    code: "MZ-CAT-11",
    name: "Pre-Applied HDPE Fully-Bonded Waterproof Membrane",
    categoryId: "polymer-hdpe",
    categoryName: "Polymer & HDPE Pre-Applied",
    image: "/assets/images/products/cat-11-v2.png",
    brief: "High-density polyethylene sheet coated with pressure-sensitive adhesive and weather-resistant particulate layer for pre-applied blindside substructures.",
    features: [
      "Forms a permanent continuous chemical & mechanical bond with poured concrete",
      "Prevents lateral water tracking under the membrane even if physically damaged",
      "Loose-laid directly onto soil screed, diaphragm walls, or sheet piling without primer",
      "Withstands heavy site traffic and rebar placement without protective screed"
    ],
    standards: "GB/T 23457-2017 (Type P) / ASTM D5385",
    thickness: "1.2mm, 1.5mm, 2.0mm",
    rollSize: "1.0m / 2.0m × 20m",
    applications: "Basement raft slabs, blindside diaphragm retaining walls, subway tunnels, underground utility tunnels.",
    specs: [
      { property: "Carrier Film", value: "Virgin High Density Polyethylene (HDPE)" },
      { property: "Adhesion to Poured Concrete", value: "≥ 2.0 N/mm (Cohesive concrete failure)" },
      { property: "Hydrostatic Resistance", value: "≥ 0.7 MPa (70m water head)" },
      { property: "Lateral Water Tracking Resistance", value: "0.7 MPa, No lateral flow" }
    ]
  },
  {
    id: "MZ-CAT-12",
    code: "MZ-CAT-12",
    name: "Cross-Laminated Film Self-Adhesive Waterproof Membrane",
    categoryId: "polymer-hdpe",
    categoryName: "Polymer & HDPE Pre-Applied",
    image: "/assets/images/products/cat-12-v2.jpg",
    brief: "Biaxially cross-laminated Valéron-grade HDPE film laminated with polymer self-adhesive compound, delivering extreme tear and puncture resistance.",
    features: [
      "Special 45° angle cross-laminated film eliminates directional tearing",
      "High dimensional stability with minimal thermal expansion/contraction",
      "Superior nail-sealability and tear propagation resistance",
      "Cold-applied wet or dry with dedicated polymer cement slurry"
    ],
    standards: "GB/T 35467-2017 / GB 23441",
    thickness: "1.2mm, 1.5mm, 2.0mm",
    rollSize: "1.0m × 20m / roll",
    applications: "Basement exterior walls, podium roofs, wet-application concrete substrates, rail transit.",
    specs: [
      { property: "Nail Tear Resistance", value: "≥ 400 N" },
      { property: "Tensile Strength", value: "≥ 200 N/50mm" },
      { property: "Elongation", value: "≥ 200%" }
    ]
  },
  {
    id: "MZ-CAT-13",
    code: "MZ-CAT-13",
    name: "Non-Bituminous Polymer Self-Adhesive Film Membrane",
    categoryId: "polymer-hdpe",
    categoryName: "Polymer & HDPE Pre-Applied",
    image: "/assets/images/products/cat-13-v2.jpg",
    brief: "Bitumen-free pure synthetic polymer adhesive film with high optical clarity, excellent aging resistance, and zero oil leaching.",
    features: [
      "100% bitumen-free: no volatile plasticizer or oil bleed onto concrete",
      "Eco-friendly and odorless, suitable for enclosed potable water tanks",
      "Superior long-term weather and alkaline resistance",
      "Strong initial tack and permanent elastomeric bond"
    ],
    standards: "GB/T 23457-2017",
    thickness: "1.2mm, 1.5mm",
    rollSize: "1.0m / 2.0m × 20m",
    applications: "Drinking water reservoirs, subterranean residential spaces, cleanroom basements.",
    specs: [
      { property: "Adhesive Type", value: "Synthetic Non-Asphalt Polymeric Gel" },
      { property: "Peel Strength to Concrete", value: "≥ 2.5 N/mm" },
      { property: "Low Temp Flexibility", value: "-30°C" }
    ]
  },
  {
    id: "MZ-CAT-14",
    code: "MZ-CAT-14",
    name: "T-Ribbed HDPE Concrete Protection Geomembrane",
    categoryId: "polymer-hdpe",
    categoryName: "Polymer & HDPE Pre-Applied",
    image: "/assets/images/products/cat-14-v2.png",
    brief: "Extruded HDPE sheet with integral T-shaped continuous anchor ribs that lock physically into cast-in-place concrete structures.",
    features: [
      "Integral T-ribs provide massive mechanical pull-out resistance (> 500 N/rib)",
      "Protects concrete from severe chemical attacks (H₂S, acids, salts)",
      "Seamlessly welded joints using extrusion welding rods",
      "High impact and abrasive wear resistance"
    ],
    standards: "GRI-GM13 / GB/T 17643",
    thickness: "1.5mm, 2.0mm, 2.5mm, 3.0mm (Rib Height: 9.5mm)",
    rollSize: "2.0m × 15m / roll",
    applications: "Sewage concrete pipes, wastewater treatment basins, chemical sump pits, underground tunnels.",
    specs: [
      { property: "Rib Pullout Resistance", value: "≥ 500 N per 100mm rib" },
      { property: "Chemical Resistance", value: "Resistant to pH 1 - 13 continuous immersion" },
      { property: "Density", value: "≥ 0.940 g/cm³" }
    ]
  },
  {
    id: "MZ-CAT-15",
    code: "MZ-CAT-15",
    name: "Chlorinated Polyethylene (CPE) Waterproof Membrane",
    categoryId: "polymer-hdpe",
    categoryName: "Polymer & HDPE Pre-Applied",
    image: "/assets/images/products/cat-15-v2.png",
    brief: "Synthetic elastomeric sheet manufactured from high-grade chlorinated polyethylene with outstanding oil, chemical, and ozone resistance.",
    features: [
      "Inherent flame-retardant properties (high chlorine content)",
      "Excellent oil, fuel, and industrial grease resistance",
      "Outstanding ozone and atmospheric weather resistance",
      "Flexible and easy to fabricate around complex corners"
    ],
    standards: "GB 12953-2003",
    thickness: "1.2mm, 1.5mm, 2.0mm",
    rollSize: "1.0m / 1.2m × 20m",
    applications: "Industrial chemical plants, oil refineries, gas station containment, bridge waterproofing.",
    specs: [
      { property: "Tensile Strength", value: "≥ 8.0 MPa" },
      { property: "Elongation at Break", value: "≥ 300%" },
      { property: "Oil Resistance (No. 3 Oil, 24h)", value: "Volume change ≤ 15%" }
    ]
  },
  {
    id: "MZ-CAT-16",
    code: "MZ-CAT-16",
    name: "EVA/ECB Tunnel & Underground Waterproof Sheet",
    categoryId: "polymer-hdpe",
    categoryName: "Polymer & HDPE Pre-Applied",
    image: "/assets/images/products/cat-16-v2.png",
    brief: "Ethylene Vinyl Acetate / Ethylene Copolymer Bitumen sheet engineered specifically for tunnel lining and underground civil engineering.",
    features: [
      "High flexibility allows tight contouring to irregular shotcrete surfaces",
      "Compatible with signal layer / dual-track hot-wedge testing channels",
      "Superior resistance to microbial attack and subterranean root pressure",
      "Fast installation with thermal fixing washers"
    ],
    standards: "GB 18173.1-2012 / TB/T 3360.1-2014",
    thickness: "1.0mm, 1.2mm, 1.5mm, 2.0mm",
    rollSize: "2.0m / 3.0m × 20m / 30m",
    applications: "High-speed rail tunnels, highway mountain tunnels, culverts, subway stations, underground vaults.",
    specs: [
      { property: "Tensile Strength", value: "≥ 16 MPa" },
      { property: "Elongation", value: "≥ 550%" },
      { property: "Puncture Resistance", value: "≥ 400 N" }
    ]
  },

  // --- Category 3: Liquid Coatings & Slurry (11) ---
  {
    id: "MZ-CAT-17",
    code: "MZ-CAT-17",
    name: "Single-Component Moisture-Curing Polyurethane (PU) Coating",
    categoryId: "liquid-coatings",
    categoryName: "Liquid Coatings & Slurry",
    image: "/assets/images/products/cat-17-v2.jpg",
    brief: "High-solids elastomeric polyurethane liquid coating that reacts with ambient moisture to form a tough, seamless, rubber-like waterproof membrane.",
    features: [
      "Ready-to-use direct application without on-site ratio mixing errors",
      "Exceptional elasticity (≥ 450%) and tensile strength (≥ 2.4 MPa)",
      "Forms a 100% seamless membrane around complex penetrations and drains",
      "High solids content (≥ 85%), low VOC, and excellent water ponding resistance"
    ],
    standards: "GB/T 19250-2013 (Type I/II/III) / ASTM C836",
    thickness: "Applied at 1.5mm - 2.0mm dry film (1.8 - 2.4 kg/m²)",
    rollSize: "20 kg / 25 kg Metal Drum",
    applications: "Balconies, flat roofs, bathrooms, basements, podium decks, bridge piers, non-exposed slabs.",
    specs: [
      { property: "Solids Content", value: "≥ 85%" },
      { property: "Tensile Strength", value: "≥ 2.45 MPa" },
      { property: "Elongation at Break", value: "≥ 450%" },
      { property: "Low Temp Flexibility", value: "-35°C (Type II)" },
      { property: "Water Impermeability (0.3 MPa, 30min)", value: "Watertight" }
    ]
  },
  {
    id: "MZ-CAT-18",
    code: "MZ-CAT-18",
    name: "Two-Component Polyurethane Waterproof Coating",
    categoryId: "liquid-coatings",
    categoryName: "Liquid Coatings & Slurry",
    image: "/assets/images/products/cat-18-v2.jpg",
    brief: "Fast chemical-curing two-pack polyurethane system (Isocyanate prepolymer + Polyol blend) for thick heavy-duty waterproof elastomeric layers.",
    features: [
      "Fast curing speed independent of ambient humidity levels",
      "High film-build capability in single coats without blistering",
      "Superior chemical, oil, and alkali resistance",
      "High mechanical strength and puncture resistance"
    ],
    standards: "GB/T 19250-2013 Type I/II",
    thickness: "Applied at 1.5mm - 2.0mm",
    rollSize: "Set of 30 kg (Part A: 10 kg + Part B: 20 kg)",
    applications: "Underground basements, water reservoirs, large infrastructure, industrial flooring undercoats.",
    specs: [
      { property: "Mixing Ratio (A:B)", value: "1 : 2 by weight" },
      { property: "Tensile Strength", value: "≥ 2.0 MPa (I) / ≥ 3.0 MPa (II)" },
      { property: "Elongation at Break", value: "≥ 450%" }
    ]
  },
  {
    id: "MZ-CAT-19",
    code: "MZ-CAT-19",
    name: "JS Polymer Cementitious Elastomeric Waterproof Coating",
    categoryId: "liquid-coatings",
    categoryName: "Liquid Coatings & Slurry",
    image: "/assets/images/products/cat-19-v2.jpg",
    brief: "Two-pack flexible waterproof coating combining premium acrylic copolymer emulsion and high-grade Portland cement with active inorganic additives.",
    features: [
      "Applicable directly on damp (dry-free) concrete substrates",
      "Water-based, non-toxic, odorless: 100% green and certified for drinking water",
      "Direct tile adhesion over cured membrane without bonding agents",
      "Available grades: Type I (High Elasticity for roofs), Type II (General), Type III (Tile backing)"
    ],
    standards: "GB/T 23445-2009 (Type I/II/III) / JC 1066-2008",
    thickness: "1.5mm - 2.0mm (1.8 - 2.5 kg/m² total)",
    rollSize: "Set of 20 kg / 50 kg (Liquid Polymer + Dry Powder)",
    applications: "Bathrooms, kitchens, balconies, drinking water tanks, exterior walls, basements.",
    specs: [
      { property: "Type I Elongation / Tensile", value: "≥ 200% / ≥ 1.2 MPa" },
      { property: "Type II Elongation / Tensile", value: "≥ 80% / ≥ 1.8 MPa" },
      { property: "Adhesion to Damp Concrete", value: "≥ 1.0 MPa" }
    ]
  },
  {
    id: "MZ-CAT-20",
    code: "MZ-CAT-20",
    name: "Acrylic High-Elastic Metal Roofing Waterproof Coating",
    categoryId: "liquid-coatings",
    categoryName: "Liquid Coatings & Slurry",
    image: "/assets/images/products/cat-20-v2.jpg",
    brief: "Pure acrylic elastomeric emulsion system reinforced with stitch-bonded polyester fabric, specifically engineered for corrugated metal roofs.",
    features: [
      "Outstanding UV and thermal reflection (> 85%), reducing roof surface temps by 15-20°C",
      "350% elastic elongation accommodates metal thermal expansion and vibration",
      "Excellent adhesion to rusted steel, galvanized sheets, aluminum, and paints",
      "10-year proven outdoor weather durability without chalking"
    ],
    standards: "JG/T 375-2012 / ASTM D6083",
    thickness: "1.0mm - 1.5mm (Basecoat + Fabric + Topcoat system)",
    rollSize: "20 kg / 25 kg Plastic Pail",
    applications: "Corrugated steel roofs, metal lap seams, ridge caps, flashing gutters, fastener sealings.",
    specs: [
      { property: "Solar Reflectance", value: "≥ 85% (Bright White)" },
      { property: "Tensile Strength", value: "≥ 1.5 MPa" },
      { property: "Elongation", value: "≥ 300%" },
      { property: "Low Temp Flexibility", value: "-20°C" }
    ]
  },
  {
    id: "MZ-CAT-21",
    code: "MZ-CAT-21",
    name: "K11 Polymer Waterproof Slurry (Flexible / General)",
    categoryId: "liquid-coatings",
    categoryName: "Liquid Coatings & Slurry",
    image: "/assets/images/products/cat-21-v2.jpg",
    brief: "Two-component polymer-modified cement slurry that penetrates microscopic concrete pores while creating a tough waterproof surface barrier.",
    features: [
      "Dual action: crystallization penetration into capillaries + flexible surface barrier",
      "High positive and negative hydrostatic pressure resistance",
      "Forms an integral part of concrete substrate, will not debond or delaminate",
      "Ideal substrate foundation for subsequent ceramic tile tiling"
    ],
    standards: "JC/T 2090-2011",
    thickness: "1.2mm - 1.5mm",
    rollSize: "20 kg set / 25 kg set (Liquid + Powder)",
    applications: "Toilets, shower rooms, kitchens, basement walls, swimming pools, retaining walls.",
    specs: [
      { property: "Flexural Adhesion", value: "≥ 1.2 MPa" },
      { property: "Water Impermeability (Positive)", value: "≥ 0.8 MPa" },
      { property: "Water Impermeability (Negative)", value: "≥ 0.4 MPa" }
    ]
  },
  {
    id: "MZ-CAT-22",
    code: "MZ-CAT-22",
    name: "Cementitious Capillary Crystalline Waterproofing (CCCW)",
    categoryId: "liquid-coatings",
    categoryName: "Liquid Coatings & Slurry",
    image: "/assets/images/products/cat-22-v2.jpg",
    brief: "Active chemical crystalline powder that reacts with moisture and unhydrated cement to grow insoluble dendritic crystals deep inside concrete capillaries.",
    features: [
      "Self-healing mechanism: reactivates whenever water appears to seal micro-cracks ≤ 0.4mm",
      "Penetrates deep into concrete matrix (> 50mm over 12 months)",
      "Withstands extreme hydrostatic pressure (> 1.2 MPa)",
      "Does not require protection board against backfill damage"
    ],
    standards: "GB 18445-2012 / ACI 212.3R-10",
    thickness: "Applied as slurry coat (1.2 - 1.5 kg/m²) or Dry-Shake / Admixture",
    rollSize: "25 kg Valve Paper Bag / Plastic Drum",
    applications: "Tunnels, dams, subway stations, marine docks, water reservoirs, elevator pits.",
    specs: [
      { property: "Crack Self-Healing Ability", value: "Seals cracks up to 0.4 mm width" },
      { property: "Hydrostatic Pressure Resistance", value: "≥ 1.2 MPa (120 m water head)" },
      { property: "Depth of Crystal Penetration", value: "> 50 mm" }
    ]
  },
  {
    id: "MZ-CAT-23",
    code: "MZ-CAT-23",
    name: "Transparent Polyurethane Waterproof Sealer",
    categoryId: "liquid-coatings",
    categoryName: "Liquid Coatings & Slurry",
    image: "/assets/images/products/cat-23-v2.jpg",
    brief: "Non-yellowing crystal-clear aliphatic polyurethane liquid sealant designed for direct repair over existing tiles, marble, and glass mosaics without demolition.",
    features: [
      "100% transparent and glossy: preserves original tile appearance and color",
      "Aliphatic UV-stable polymer: zero yellowing under prolonged sunlight",
      "High abrasion and foot-traffic wear resistance",
      "Simple roller / brush application directly over existing glazed tiles and grout"
    ],
    standards: "Enterprise Standard / JC/T 984",
    thickness: "0.2mm - 0.4mm (2 - 3 coats, 0.3 - 0.5 kg/m²)",
    rollSize: "1 kg, 5 kg, 10 kg, 20 kg Plastic Can",
    applications: "Balconies with tiles, external wall mosaic leaks, glass roofs, bathrooms, marble facades.",
    specs: [
      { property: "Optical Clarity", value: "≥ 95% Light Transmittance (Crystal Clear)" },
      { property: "UV Resistance (1000h)", value: "No yellowing, ΔE < 1.0" },
      { property: "Tack-Free Time", value: "2 - 4 hours at 25°C" }
    ]
  },
  {
    id: "MZ-CAT-24",
    code: "MZ-CAT-24",
    name: "Non-Curing Rubber Bitumen Waterproof Coating",
    categoryId: "liquid-coatings",
    categoryName: "Liquid Coatings & Slurry",
    image: "/assets/images/products/cat-24-v2.png",
    brief: "High-performance hot-melt rubber modified bitumen compound that remains perpetually paste-like, self-healing, and viscous over its entire lifespan.",
    features: [
      "Never cures: maintains permanent flexible paste state (zero fatigue failure)",
      "Instant self-healing against punctures and structural cracking movements",
      "Outstanding bond strength to both concrete substrate and top bitumen/polymer membranes",
      "Can be hot-sprayed or squeegeed at 130°C - 150°C"
    ],
    standards: "JC/T 2428-2017",
    thickness: "1.5mm - 2.0mm (Composite with membrane)",
    rollSize: "20 kg / 200 kg Metal Drum",
    applications: "Composite waterproofing systems (Non-curing + SBS/HDPE membrane) for basements, subway stations, podium roofs.",
    specs: [
      { property: "Non-Volatile Content", value: "≥ 99%" },
      { property: "Self-Healing Property", value: "Instant re-closure of 2mm puncture" },
      { property: "Heat Resistance", value: "65°C no sliding" },
      { property: "Low Temp Flexibility", value: "-20°C" }
    ]
  },
  {
    id: "MZ-CAT-25",
    code: "MZ-CAT-25",
    name: "Spray Applied Polyurea Elastomer Waterproof Coating",
    categoryId: "liquid-coatings",
    categoryName: "Liquid Coatings & Slurry",
    image: "/assets/images/products/cat-25-v2.png",
    brief: "Two-component 100% solid pure polyurea elastomer processed via high-pressure plural component spray equipment, curing within 15 seconds.",
    features: [
      "Ultra-fast curing: tack-free in 15 seconds, walkable in 10 minutes",
      "Extreme tensile strength (≥ 16 MPa) and abrasion resistance",
      "100% solids, zero VOC, zero solvents, zero catalysts",
      "Seamless lining for chemical resistance, blast mitigation, and waterproofing"
    ],
    standards: "GB/T 23446-2009 / ASTM D822",
    thickness: "1.5mm - 3.0mm",
    rollSize: "Set of 420 kg (Part A: 220 kg + Part B: 200 kg drum)",
    applications: "High-speed rail concrete decks, stadium seating, theme park water rides, mining tanks, secondary containment.",
    specs: [
      { property: "Tensile Strength", value: "≥ 16.0 MPa" },
      { property: "Elongation at Break", value: "≥ 350%" },
      { property: "Gel Time", value: "5 - 15 seconds" },
      { property: "Taber Abrasion (1000g, 1000r)", value: "≤ 25 mg" }
    ]
  },
  {
    id: "MZ-CAT-26",
    code: "MZ-CAT-26",
    name: "Fast-Setting Hydrophobic Water Plug / Leak Stopper",
    categoryId: "liquid-coatings",
    categoryName: "Liquid Coatings & Slurry",
    image: "/assets/images/products/cat-26-v2.png",
    brief: "Rapid hardening inorganic hydraulic cementitious compound that sets in 60-90 seconds to instantly stop active water gushing under pressure.",
    features: [
      "Initial set in 1 - 2 minutes, final hard set in 3 - 5 minutes",
      "Stops high-pressure active running water leaks instantaneously",
      "High early compressive strength (> 15 MPa in 1 hour)",
      "Non-toxic, safe for drinking water pipelines and tanks"
    ],
    standards: "GB 23440-2009 (Type I Fast Setting / Type II Instant Plug)",
    thickness: "Spot plugging / Mortar patch",
    rollSize: "5 kg, 25 kg Bag / Plastic Drum",
    applications: "Active gushing leaks in basements, elevator pits, concrete cracks, pipe joints, tunnels.",
    specs: [
      { property: "Initial Setting Time", value: "60 - 90 seconds" },
      { property: "1-Hour Compressive Strength", value: "≥ 15.0 MPa" },
      { property: "3-Day Compressive Strength", value: "≥ 30.0 MPa" }
    ]
  },
  {
    id: "MZ-CAT-27",
    code: "MZ-CAT-27",
    name: "Water-Based Polyurethane Polymer Waterproof Emulsion",
    categoryId: "liquid-coatings",
    categoryName: "Liquid Coatings & Slurry",
    image: "/assets/images/products/cat-27-v2.jpg",
    brief: "Eco-friendly aqueous polyurethane dispersion coating with high tensile elasticity, zero toxic solvents, and exceptional wet-substrate adhesion.",
    features: [
      "Water-based green formulation with near-zero VOC",
      "High film elasticity and resilient recovery",
      "Safe and non-flammable storage and transport",
      "Excellent bonding to wood, gypsum board, concrete, and lightweight blocks"
    ],
    standards: "JC/T 1017-2006",
    thickness: "1.2mm - 1.5mm",
    rollSize: "20 kg / 25 kg Pail",
    applications: "Interior bathroom walls, lightweight partition walls, wooden structures, eco-friendly buildings.",
    specs: [
      { property: "Tensile Strength", value: "≥ 1.8 MPa" },
      { property: "Elongation at Break", value: "≥ 350%" },
      { property: "Solids Content", value: "≥ 65%" }
    ]
  },

  // --- Category 4: Flashing & Butyl Tapes (4) ---
  {
    id: "MZ-CAT-28",
    code: "MZ-CAT-28",
    name: "Aluminum Foil Reinforced Butyl Waterproof Flashing Tape",
    categoryId: "flashing-butyl",
    categoryName: "Flashing & Butyl Tapes",
    image: "/assets/images/products/cat-28-v2.jpg",
    brief: "Pure butyl rubber adhesive compounded onto heavy-duty embossed aluminum/foil facing for instant, permanent, weather-resistant flashing repairs.",
    features: [
      "Reflective metallic aluminum foil provides 100% UV and weather shielding",
      "High-tack butyl compound bonds instantly without heating or primers",
      "Maintains flexibility from -40°C to +100°C without flowing or embrittlement",
      "Surface finishes: Bright Aluminum, Plaid Embossed Foil, PET Film, Lead Look"
    ],
    standards: "JC/T 942-2004 / ASTM C771",
    thickness: "1.0mm, 1.2mm, 1.5mm, 2.0mm",
    rollSize: "Width: 5cm, 10cm, 15cm, 20cm, 30cm, 100cm; Length: 5m, 10m",
    applications: "Metal roof cracks, flashing valleys, sunroom joints, pipe penetrations, RV / camper roofs, gutter leaks.",
    specs: [
      { property: "Backing Material", value: "Pure Aluminum Foil / Reinforced PET Foil" },
      { property: "Peel Strength (to Steel/Alu)", value: "≥ 8.0 N/cm" },
      { property: "Temperature Resistance", value: "-40°C to +100°C" },
      { property: "Solids Content", value: "100% (Solvent Free)" }
    ]
  },
  {
    id: "MZ-CAT-29",
    code: "MZ-CAT-29",
    name: "Double-Sided Butyl Rubber Sealing Joint Tape",
    categoryId: "flashing-butyl",
    categoryName: "Flashing & Butyl Tapes",
    image: "/assets/images/products/cat-29-v2.jpg",
    brief: "High-cohesion double-sided butyl bonding tape designed for watertight lap sealing between metal panels, PC sunsheets, and membrane splices.",
    features: [
      "Double-sided aggressive tack for hidden compression joint sealing",
      "Compensates for joint movement, thermal expansion, and mechanical vibrations",
      "Impermeable to water, gases, and air leakage",
      "Easy release silicone paper liner for fast assembly line installation"
    ],
    standards: "JC/T 942-2004",
    thickness: "1.0mm, 1.5mm, 2.0mm, 3.0mm; Width: 10mm - 100mm",
    rollSize: "10m, 15m, 20m / roll",
    applications: "Metal building lap joints, PC sunshine board installation, windshield sealing, membrane edge splicing.",
    specs: [
      { property: "Adhesion (Steel to Steel)", value: "≥ 10 N/cm" },
      { property: "Shear Strength", value: "≥ 25 N/cm²" },
      { property: "Elongation", value: "≥ 400%" }
    ]
  },
  {
    id: "MZ-CAT-30",
    code: "MZ-CAT-30",
    name: "Heavy-Duty Marine Hatch Cover Sealing Tape",
    categoryId: "flashing-butyl",
    categoryName: "Flashing & Butyl Tapes",
    image: "/assets/images/products/cat-30-v2.png",
    brief: "Heavy-gauge bituminous rubber strip backed with reinforced woven polyethylene fabric for marine cargo ship hatch cover weatherproofing.",
    features: [
      "Withstands high seas, heavy wave wash, and extreme marine salt fog",
      "Flexible down to -20°C and heat resistant up to +80°C",
      "Tested and approved for ocean-going bulk carriers and container vessels",
      "Leaves minimal residue on steel decks during removal"
    ],
    standards: "IMO Marine Standards / ISO 17338",
    thickness: "2.0mm, 3.0mm; Width: 100mm, 150mm",
    rollSize: "20m / roll (Packed in export marine carton)",
    applications: "Cargo ship hatch covers, barge seams, marine container repair, offshore platform joints.",
    specs: [
      { property: "Adhesion to Steel (at 20°C)", value: "≥ 12 N/cm" },
      { property: "Hydrostatic Head", value: "Watertight under 2 bar dynamic water impact" },
      { property: "Temperature Range", value: "-20°C to +80°C" }
    ]
  },
  {
    id: "MZ-CAT-31",
    code: "MZ-CAT-31",
    name: "Bituminous Damp Proof Course (DPC) Strip",
    categoryId: "flashing-butyl",
    categoryName: "Flashing & Butyl Tapes",
    image: "/assets/images/products/cat-31-v2.jpg",
    brief: "Extruded bitumen/polyethylene barrier strip installed in masonry cavity walls to block rising damp from sub-structures into living spaces.",
    features: [
      "Prevents rising damp and capillary water penetration in brickwork and blockwork",
      "Textured embossed surface provides superior mortar grip and slip keying",
      "Will not extrude or deform under heavy masonry loads",
      "Permanent lifespan matching the lifetime of the brick structure"
    ],
    standards: "BS 6398 / EN 14909 / GB 18173.1",
    thickness: "0.5mm, 0.8mm, 1.0mm, 1.2mm",
    rollSize: "Width: 100mm, 150mm, 225mm, 300mm, 450mm, 900mm; Length: 30m",
    applications: "Brick cavity walls, sill flashings, masonry foundations, door and window jambs.",
    specs: [
      { property: "Compressive Load Resistance", value: "≥ 2.5 N/mm² mortar bedding" },
      { property: "Low Temp Flexibility", value: "-15°C" },
      { property: "Water Vapor Resistance", value: "> 250 MNs/g" }
    ]
  },

  // --- Category 5: Geosynthetics & Auxiliaries (6) ---
  {
    id: "MZ-CAT-32",
    code: "MZ-CAT-32",
    name: "HDPE Impermeable Smooth / Textured Geomembrane",
    categoryId: "geosynthetics-aux",
    categoryName: "Geosynthetics & Auxiliaries",
    image: "/assets/images/products/cat-32-v2.png",
    brief: "Prime 100% virgin high-density polyethylene resin liner designed for landfill waste containment, mining tailings, and municipal artificial reservoirs.",
    features: [
      "Exceptional chemical resistance against aggressive acids, alkalis, and toxic leachates",
      "High environmental stress crack resistance (ESCR > 500 hours)",
      "Available in smooth, single-textured, and double-textured friction surfaces",
      "Wide roll widths (up to 8.0m) to minimize field fusion welding"
    ],
    standards: "GRI-GM13 Standard / GB/T 17643-2011",
    thickness: "0.5mm, 0.75mm, 1.0mm, 1.5mm, 2.0mm, 2.5mm, 3.0mm",
    rollSize: "Width: 4.0m - 8.0m; Length: 50m - 100m",
    applications: "Landfill basal liners and caps, mining heap leach pads, aquaculture ponds, tailings dams, sewage lagoons.",
    specs: [
      { property: "Raw Material", value: "100% Virgin Resins + 2-3% Carbon Black" },
      { property: "Tensile Strength at Break", value: "≥ 27 MPa (Smooth, 1.5mm)" },
      { property: "Stress Crack Resistance (SP-NCTL)", value: "≥ 500 hours" },
      { property: "Carbon Black Dispersion", value: "Category 1 or 2" }
    ]
  },
  {
    id: "MZ-CAT-33",
    code: "MZ-CAT-33",
    name: "Non-Woven Needle-Punched Polyester (PET) Geotextile",
    categoryId: "geosynthetics-aux",
    categoryName: "Geosynthetics & Auxiliaries",
    image: "/assets/images/products/cat-33-v2.png",
    brief: "Continuous filament / staple fiber needle-punched geotextile fabric engineered for filtration, soil separation, drainage, and geomembrane cushion protection.",
    features: [
      "High multi-directional hydraulic water permeability and soil particle retention",
      "Superior puncture cushioning protects geomembranes against sharp stones",
      "Rot-proof, chemical-resistant, and high CBR burst strength",
      "Weights available from 100 gsm up to 1000 gsm"
    ],
    standards: "GB/T 17638-2017 / ASTM D4632 / EN ISO 13426",
    thickness: "Weight: 100g/m² - 1000g/m²",
    rollSize: "Width: 2.0m - 6.0m; Length: 50m - 100m",
    applications: "Geomembrane protective cushions, road subgrade separation, railway ballast, river embankment filtration.",
    specs: [
      { property: "CBR Puncture Strength (300gsm)", value: "≥ 2.5 kN" },
      { property: "Tensile Strength (300gsm)", value: "≥ 9.5 kN/m" },
      { property: "Permeability Coefficient", value: "10⁻¹ to 10⁻³ cm/s" }
    ]
  },
  {
    id: "MZ-CAT-34",
    code: "MZ-CAT-34",
    name: "Composite Dimple Drainage Sheet with Geotextile",
    categoryId: "geosynthetics-aux",
    categoryName: "Geosynthetics & Auxiliaries",
    image: "/assets/images/products/cat-34-v2.webp",
    brief: "High-impact polystyrene / HDPE vacuum-formed dimple core thermally bonded with non-woven filter geotextile for rapid underground water drainage.",
    features: [
      "High compressive strength (> 200 - 400 kPa) resists heavy earth backfill pressure",
      "Continuous air gap and drainage channel relieves hydrostatic pressure on walls",
      "Bonded geotextile prevents soil fines from clogging the drainage core",
      "Dimple heights: 8mm, 10mm, 12mm, 16mm, 20mm, 25mm"
    ],
    standards: "GB/T 18744-2008 / JC/T 2112",
    thickness: "Dimple Height: 8mm - 25mm; Sheet: 0.8mm - 1.5mm",
    rollSize: "Width: 2.0m / 3.0m; Length: 15m / 20m",
    applications: "Basement retaining wall drainage, podium roof garden drainage, subway tunnel linings, highway retaining walls.",
    specs: [
      { property: "Compressive Strength", value: "≥ 250 kPa" },
      { property: "Flow Capacity (i=1.0)", value: "≥ 2.5 L/(s·m)" },
      { property: "Geotextile Unit Weight", value: "100 - 150 gsm" }
    ]
  },
  {
    id: "MZ-CAT-35",
    code: "MZ-CAT-35",
    name: "Redispersible Polymer Powder (RDP / VAE) for Mortars",
    categoryId: "geosynthetics-aux",
    categoryName: "Geosynthetics & Auxiliaries",
    image: "/assets/images/products/cat-35-v2.jpg",
    brief: "Water-soluble vinyl acetate-ethylene copolymer powder manufactured by spray-drying, boosting flexible adhesion and water repellency in dry-mix mortars.",
    features: [
      "Drastically improves flexural tensile bond strength on concrete, EPS, and tiles",
      "Imparts flexibility, impact toughness, and crack resistance to dry mortars",
      "Enhances water retention and workability during trowel application",
      "Reduces water absorption coefficient of cementitious compounds"
    ],
    standards: "GB/T 29594-2013 / EN 12004",
    thickness: "Dry white free-flowing powder",
    rollSize: "25 kg Multi-layer Paper Bag / 1000 kg Big Bag",
    applications: "Waterproof tile adhesives, external thermal insulation (EIFS) basecoats, self-leveling floor screeds, repair mortars.",
    specs: [
      { property: "Polymer Base", value: "Vinyl Acetate - Ethylene (VAE)" },
      { property: "Solids Content", value: "≥ 99%" },
      { property: "Minimum Film Forming Temp (MFFT)", value: "0°C to +4°C" },
      { property: "Ash Content (1000°C)", value: "10 ± 2%" }
    ]
  },
  {
    id: "MZ-CAT-36",
    code: "MZ-CAT-36",
    name: "Reinforcing Polyester Spunbond / Fiberglass Carrier Mat",
    categoryId: "geosynthetics-aux",
    categoryName: "Geosynthetics & Auxiliaries",
    image: "/assets/images/products/cat-36-v2.png",
    brief: "Non-woven spunbond polyester and glass fiber scrim reinforcement carriers used in the continuous industrial production of modified bitumen membranes.",
    features: [
      "High tensile modulus and thermal stability through 200°C bitumen coating pans",
      "Superior asphalt bitumen impregnation and absorption velocity",
      "Uniform mass distribution ensures high burst and tear resistance",
      "Available weights: 140 gsm, 160 gsm, 180 gsm, 200 gsm, 250 gsm"
    ],
    standards: "JC/T 504-2007 / GB/T 18840",
    thickness: "140 g/m² - 250 g/m²",
    rollSize: "Width: 1.0m - 1.05m; Length: 1000m - 2000m / Master Roll",
    applications: "Internal carrier backbone for SBS, APP, self-adhesive bitumen, and polymer modified rolls.",
    specs: [
      { property: "Tensile Strength (MD/CD)", value: "≥ 550 / 450 N/50mm (180gsm)" },
      { property: "Heat Stability (200°C, 10min)", value: "Area shrinkage ≤ 1.5%" },
      { property: "Bitumen Absorption", value: "≥ 350%" }
    ]
  },
  {
    id: "MZ-CAT-37",
    code: "MZ-CAT-37",
    name: "Rapid Setting Leak Stopper Mortar & Grouting Compound",
    categoryId: "geosynthetics-aux",
    categoryName: "Geosynthetics & Auxiliaries",
    image: "/assets/images/products/cat-37-v2.jpg",
    brief: "High-strength fast-curing expanding cementitious repair mortar for anchoring, crack stitching, and filling structural voids under heavy hydrostatic pressure.",
    features: [
      "Micro-expansion properties eliminate curing shrinkage cracks",
      "Ultra-high compressive strength reaching 50+ MPa at 28 days",
      "High fluidity when grouted into complex honeycombed concrete voids",
      "Corrosion-resistant and chloride-free formula protects embedded steel rebar"
    ],
    standards: "GB/T 50448-2015",
    thickness: "10mm - 100mm per lift",
    rollSize: "25 kg Moisture-Proof Bag",
    applications: "Structural bolt anchoring, bridge bearing pads, machine base grouting, basement crack stitching.",
    specs: [
      { property: "Initial Setting", value: "15 - 30 minutes" },
      { property: "28-Day Compressive Strength", value: "≥ 55 MPa" },
      { property: "Expansion Rate", value: "+0.02% to +0.05%" }
    ]
  }
];

export const SOLUTIONS = [
  {
    id: "commercial-roofs",
    title: "Industrial & Commercial Flat Roofs",
    subtitle: "Exposed Single-Ply & Modified Bitumen Systems",
    description: "Engineered systems for mega logistics warehouses, commercial centers, and data centers. High SRI TPO/PVC cool roof membranes reduce cooling loads while hot-air welded seams guarantee 25+ years of watertight performance.",
    recommendedProducts: ["MZ-CAT-08", "MZ-CAT-09", "MZ-CAT-01", "MZ-CAT-06"],
    systemLayers: [
      "Structural Steel / Concrete Deck",
      "Vapor Barrier Membrane",
      "PIR / Mineral Wool Thermal Insulation",
      "TPO / PVC 1.5mm Membrane (Mechanically Fastened / Adhered)"
    ]
  },
  {
    id: "basement-substructures",
    title: "Underground Basements & Foundations",
    subtitle: "Pre-Applied Blindside & Fully-Bonded Systems",
    description: "Zero water-tracking pre-applied HDPE membrane systems designed for diaphragm retaining walls, raft foundations, and deep subterranean vaults under permanent hydrostatic heads up to 70m.",
    recommendedProducts: ["MZ-CAT-11", "MZ-CAT-12", "MZ-CAT-24", "MZ-CAT-17"],
    systemLayers: [
      "Soil Retaining Wall / Blinding Screed",
      "Pre-Applied HDPE 1.5mm Membrane",
      "Poured Structural Concrete (Full Chemical Bond)",
      "Composite Dimple Drainage Board"
    ]
  },
  {
    id: "metal-roofs",
    title: "Exposed Metal Roofing Refurbishment",
    subtitle: "Acrylic Elastic & Butyl Flashing Solutions",
    description: "Complete renewal solution for aged corrugated steel roofs. Seamless high-elastic acrylic coating with polyester reinforcing fabric seals seams, fasteners, and gutters without disrupting factory operations.",
    recommendedProducts: ["MZ-CAT-20", "MZ-CAT-28", "MZ-CAT-29"],
    systemLayers: [
      "Corrugated Steel Substrate Rust Treatment",
      "High-Tack Butyl Flashing Tape over Lap Seams",
      "Acrylic Basecoat + Stitch-Bonded Polyester Mesh",
      "UV-Shielding Solar Reflective Topcoat"
    ]
  },
  {
    id: "infrastructure-tunnels",
    title: "Bridges, Tunnels & Civil Infrastructure",
    subtitle: "Heavy-Duty Geomembrane & Polyurea Systems",
    description: "Heavy civil engineering solutions for high-speed rail bridge decks, mountain tunnels, mining containment, and municipal landfills meeting the world's most rigorous engineering standards.",
    recommendedProducts: ["MZ-CAT-25", "MZ-CAT-32", "MZ-CAT-16", "MZ-CAT-33"],
    systemLayers: [
      "Concrete / Shotcrete Substrate Preparation",
      "Spray Polyurea / EVA Dual-Wedge Tunnel Sheet",
      "Needle-Punched Geotextile Cushion",
      "HDPE 2.0mm Geomembrane Liner"
    ]
  }
];

export const STANDARDS_MATRIX = [
  {
    organization: "ASTM International",
    standards: [
      { code: "ASTM D6878", title: "Specification for Thermoplastic Polyolefin (TPO) Sheet Roofing" },
      { code: "ASTM D4434", title: "Specification for Poly(Vinyl Chloride) Sheet Roofing" },
      { code: "ASTM D6164", title: "Specification for SBS-Modified Bituminous Sheet (Polyester)" },
      { code: "ASTM D6222", title: "Specification for APP-Modified Bituminous Sheet" },
      { code: "ASTM C836", title: "High Solids Content Polyurethane Waterproofing" }
    ]
  },
  {
    organization: "European Standards (EN / CE)",
    standards: [
      { code: "EN 13707", title: "Flexible sheets for waterproofing - Reinforced bitumen sheets for roof waterproofing" },
      { code: "EN 13956", title: "Flexible sheets for waterproofing - Plastic and rubber sheets for roof waterproofing" },
      { code: "EN 13859-1", title: "Flexible sheets for waterproofing - Underlays for discontinuous roofing" },
      { code: "EN 14909", title: "Flexible sheets for waterproofing - Plastic and rubber damp proof courses" }
    ]
  },
  {
    organization: "Chinese National Standards (GB)",
    standards: [
      { code: "GB 18242-2008", title: "Elastomer Modified Bituminous Sheet Materials (SBS)" },
      { code: "GB 27789-2011", title: "Thermoplastic Polyolefin (TPO) Waterproof Sheets" },
      { code: "GB 12952-2011", title: "Polyvinyl Chloride (PVC) Waterproof Sheets" },
      { code: "GB/T 23457-2017", title: "Pre-applied and Wet-installed Waterproof Membrane" },
      { code: "GB/T 19250-2013", title: "Polyurethane Waterproof Coating" }
    ]
  }
];

export const WHY_CHOOSE_US = [
  {
    title: "Direct Factory Pricing & 50M m² Capacity",
    desc: "Located in China's waterproof manufacturing capital with 68,000 m² state-of-the-art automated production lines, offering direct FOB/CIF container pricing with zero middlemen markup."
  },
  {
    title: "100% Quality Assurance & Batch Testing",
    desc: "In-house CNAS-standard testing laboratory testing every master batch for low-temperature flexibility, tensile strength, hydrostatic resistance, and artificial UV aging."
  },
  {
    title: "Qingdao Port Proximity & Rapid Dispatch",
    desc: "Just 200 km (2.5 hours highway) to Qingdao Port. Dedicated logistics team guarantees container loading within 7-10 days of order confirmation."
  },
  {
    title: "OEM / ODM Custom Specifications & White Label",
    desc: "Custom roll dimensions, specialized thickness, private-label packaging, customized technical formulations (tropical/arctic grade), and full technical submittal packages (TDS, COA, MSDS)."
  }
];

export const EXPORT_FAQS = [
  {
    q: "How to choose between SBS and APP modified bitumen waterproof membranes for different climates?",
    a: "SBS (Styrene-Butadiene-Styrene) modified bitumen membrane (MZ-CAT-01) offers superior low-temperature flexibility down to -25°C and ≥40% elongation, making it ideal for cold and temperate regions. APP (Atactic Polypropylene) modified bitumen membrane (MZ-CAT-02) provides high heat resistance up to +130°C and strong UV stability, engineered for tropical and high-temperature regions such as the Middle East, Africa, Southeast Asia, and South America."
  },
  {
    q: "How many rolls of 3mm or 4mm waterproof membrane fit in a 20GP export container?",
    a: "For standard 1m × 10m modified bitumen rolls palletized at our Weifang factory: a 20GP container loads approximately 620–650 rolls (6,200–6,500 m²) of 3.0mm SBS/APP membrane, or 480–500 rolls (4,800–5,000 m²) of 4.0mm SBS/APP membrane. For 1.2mm–1.5mm Pre-Applied HDPE or TPO membranes (2m × 20m rolls), a 20GP container loads approximately 14,000–18,000 m². Standard lead time to Qingdao Port (200 km) is 7–10 days."
  },
  {
    q: "What international standards do Mingze waterproofing membranes and coatings comply with?",
    a: "Our 37 waterproofing products are manufactured under ISO 9001:2015 and ISO 14001:2015 quality systems and tested to comply with ASTM D6164 (SBS), ASTM D6222 (APP), ASTM D6878 (TPO), ASTM D4434 (PVC), ASTM D5385 (Pre-applied HDPE), ASTM C836 (Polyurethane coating), European CE standards EN 13707 / EN 13956, and Chinese GB standards. Batch-specific COA, TDS, and MSDS documents are supplied with every shipment."
  },
  {
    q: "Do you provide OEM private-label branding and free physical sample swatch boxes?",
    a: "Yes. We provide custom roll widths (1.0m / 2.0m), custom thickness, private-label PE film printing, and custom packaging for global distributors and contractors. Complimentary A4 physical membrane cuts and coating sample kits can be dispatched globally via DHL or FedEx for laboratory verification and project tender submittals."
  },
  {
    q: "Which waterproofing membrane is recommended for blindside underground basements and tunnels?",
    a: "For underground foundations, basements, and civil tunnels, we recommend Pre-Applied HDPE Self-Adhesive Waterproof Membrane (MZ-CAT-11, 1.2mm–2.0mm) compliant with ASTM D5385 and GB/T 23457, which forms a permanent chemical-mechanical bond with poured structural concrete to prevent lateral water migration, paired with EVA/ECB tunnel sheets (MZ-CAT-16) and HDPE dimple drainage boards (MZ-CAT-14 / MZ-CAT-34)."
  },
  {
    q: "How can overseas buyers request a factory FOB or CIF quotation?",
    a: "Buyers can contact our export engineering desk directly via email at zhao@mzwaterproof.com (or zhao@mingzewaterproof.com) or via WhatsApp at +86 16658506707, stating the product model (e.g., MZ-CAT-01 to MZ-CAT-37), thickness, estimated quantity, and destination port. Formal FOB Qingdao or CIF quotations are issued within 24 hours."
  }
];

export const COMPARISON_MATRIX = [
  {
    system: "SBS Modified Bitumen (MZ-CAT-01)",
    standard: "ASTM D6164 / EN 13707 / GB 18242",
    thickness: "3.0mm / 4.0mm / 5.0mm",
    tempRange: "-25°C to +90°C (Cold & Temperate)",
    application: "Roofs, Basements, Bridges (Torch-On)",
    loading20GP: "3mm: ~6,400 m² | 4mm: ~4,900 m²"
  },
  {
    system: "APP Modified Bitumen (MZ-CAT-02)",
    standard: "ASTM D6222 / EN 13707 / GB 18243",
    thickness: "3.0mm / 4.0mm / 5.0mm",
    tempRange: "-10°C to +130°C (Tropical & High UV)",
    application: "Exposed Roofs, Highway Bridges",
    loading20GP: "3mm: ~6,400 m² | 4mm: ~4,900 m²"
  },
  {
    system: "Pre-Applied HDPE (MZ-CAT-11)",
    standard: "ASTM D5385 / GB/T 23457 (Type P)",
    thickness: "1.2mm / 1.5mm / 2.0mm",
    tempRange: "-30°C to +80°C (70m Hydrostatic Head)",
    application: "Blindside Basements, Subways, Tunnels",
    loading20GP: "1.2mm: ~18,000 m² | 1.5mm: ~14,500 m²"
  },
  {
    system: "TPO Single-Ply Sheet (MZ-CAT-08)",
    standard: "ASTM D6878 / EN 13956 / GB 27789",
    thickness: "1.2mm / 1.5mm / 1.8mm / 2.0mm",
    tempRange: "-40°C to +115°C (High SRI Cool Roof)",
    application: "Exposed Steel & Concrete Industrial Roofs",
    loading20GP: "1.2mm: ~16,000 m² | 1.5mm: ~12,800 m²"
  },
  {
    system: "PVC Single-Ply Sheet (MZ-CAT-09)",
    standard: "ASTM D4434 / EN 13956 / GB 12952",
    thickness: "1.2mm / 1.5mm / 1.8mm / 2.0mm",
    tempRange: "-25°C to +95°C (Chemical Resistant)",
    application: "Commercial Flat Roofs, Green Roofs, Tunnels",
    loading20GP: "1.2mm: ~15,000 m² | 1.5mm: ~12,000 m²"
  },
  {
    system: "PU Waterproof Coating (MZ-CAT-17/18)",
    standard: "ASTM C836 / GB/T 19250",
    thickness: "1.5mm – 2.0mm Dry Film (≥450% Elongation)",
    tempRange: "-35°C to +90°C (Seamless Liquid Film)",
    application: "Wet Rooms, Balconies, Complex Roof Details",
    loading20GP: "20kg Pails: ~900 Pails (18 Metric Tons)"
  }
];



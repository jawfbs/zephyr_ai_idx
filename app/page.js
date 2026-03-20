'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Search, Heart, Bed, Bath, MapPin, SlidersHorizontal,
  List, Map, ChevronDown, X, User, Clock, Phone,
  Mail, MessageSquare, Sun, Sunset, Moon, ChevronRight,
  Home, Trees, PawPrint, Building2, Check, Sparkles,
  TrendingUp, Star, ArrowUpRight, Filter, LayoutGrid,
  Maximize2, Calendar, DollarSign, AlertCircle
} from 'lucide-react'

// ─────────────────────────────────────────────
// THEMES
// ─────────────────────────────────────────────
const THEMES = {
  nature: {
    label: 'Nature',
    icon: Trees,
    category: 'nature',
    variants: [
      {
        id: 'forest',
        name: 'Forest',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&h=180&fit=crop&q=80',
        accent: '#2d6a4f',
        accentLight: '#d8f3dc',
        accentGlow: 'rgba(45,106,79,0.25)',
        gradient: 'linear-gradient(135deg, #1b4332, #2d6a4f, #40916c)',
        cardGlow: '0 0 20px rgba(45,106,79,0.15)',
        tag: 'bg-emerald-500',
      },
      {
        id: 'ocean',
        name: 'Ocean',
        image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=300&h=180&fit=crop&q=80',
        accent: '#0077b6',
        accentLight: '#caf0f8',
        accentGlow: 'rgba(0,119,182,0.25)',
        gradient: 'linear-gradient(135deg, #03045e, #0077b6, #00b4d8)',
        cardGlow: '0 0 20px rgba(0,119,182,0.15)',
        tag: 'bg-blue-500',
      },
      {
        id: 'desert',
        name: 'Desert',
        image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=300&h=180&fit=crop&q=80',
        accent: '#e76f51',
        accentLight: '#fde8d8',
        accentGlow: 'rgba(231,111,81,0.25)',
        gradient: 'linear-gradient(135deg, #6d3b2e, #e76f51, #f4a261)',
        cardGlow: '0 0 20px rgba(231,111,81,0.15)',
        tag: 'bg-orange-500',
      },
    ],
  },
  animal: {
    label: 'Animal',
    icon: PawPrint,
    category: 'animal',
    variants: [
      {
        id: 'panther',
        name: 'Panther',
        image: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=300&h=180&fit=crop&q=80',
        accent: '#7b2d8b',
        accentLight: '#f3e8ff',
        accentGlow: 'rgba(123,45,139,0.25)',
        gradient: 'linear-gradient(135deg, #1a0533, #7b2d8b, #c77dff)',
        cardGlow: '0 0 20px rgba(123,45,139,0.15)',
        tag: 'bg-purple-600',
      },
      {
        id: 'arctic',
        name: 'Arctic Fox',
        image: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=300&h=180&fit=crop&q=80',
        accent: '#4cc9f0',
        accentLight: '#e0f7ff',
        accentGlow: 'rgba(76,201,240,0.25)',
        gradient: 'linear-gradient(135deg, #0d1b2a, #4cc9f0, #a8dadc)',
        cardGlow: '0 0 20px rgba(76,201,240,0.15)',
        tag: 'bg-cyan-400',
      },
      {
        id: 'tiger',
        name: 'Tiger',
        image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=300&h=180&fit=crop&q=80',
        accent: '#f59e0b',
        accentLight: '#fef3c7',
        accentGlow: 'rgba(245,158,11,0.25)',
        gradient: 'linear-gradient(135deg, #431407, #f59e0b, #fcd34d)',
        cardGlow: '0 0 20px rgba(245,158,11,0.15)',
        tag: 'bg-amber-500',
      },
    ],
  },
  realestate: {
    label: 'Real Estate',
    icon: Building2,
    category: 'realestate',
    variants: [
      {
        id: 'manhattan',
        name: 'Manhattan',
        image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=300&h=180&fit=crop&q=80',
        accent: '#1e3a5f',
        accentLight: '#dbeafe',
        accentGlow: 'rgba(30,58,95,0.25)',
        gradient: 'linear-gradient(135deg, #0a0f1e, #1e3a5f, #2563eb)',
        cardGlow: '0 0 20px rgba(30,58,95,0.15)',
        tag: 'bg-blue-700',
      },
      {
        id: 'luxury',
        name: 'Luxury',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&h=180&fit=crop&q=80',
        accent: '#b8860b',
        accentLight: '#fef9c3',
        accentGlow: 'rgba(184,134,11,0.3)',
        gradient: 'linear-gradient(135deg, #1a1200, #b8860b, #ffd700)',
        cardGlow: '0 0 24px rgba(184,134,11,0.2)',
        tag: 'bg-yellow-600',
      },
      {
        id: 'modern',
        name: 'Modern',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&h=180&fit=crop&q=80',
        accent: '#d92228',
        accentLight: '#fee2e2',
        accentGlow: 'rgba(217,34,40,0.25)',
        gradient: 'linear-gradient(135deg, #18181b, #d92228, #f87171)',
        cardGlow: '0 0 20px rgba(217,34,40,0.15)',
        tag: 'bg-red-500',
      },
    ],
  },
}

// ─────────────────────────────────────────────
// DEMO LISTINGS
// ─────────────────────────────────────────────
const DEMO_LISTINGS = [
  { id: '1', address: '4821 Maple Grove Dr', city: 'Austin', state: 'TX', zip: '78745', price: 485000, beds: 4, baths: 3, sqft: 2400, status: 'Active', daysOnMarket: 2, photo: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80', type: 'Single Family' },
  { id: '2', address: '2210 Lakeview Blvd', city: 'Denver', state: 'CO', zip: '80203', price: 725000, beds: 3, baths: 2, sqft: 1980, status: 'Active', daysOnMarket: 7, photo: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80', type: 'Condo' },
  { id: '3', address: '8834 Sunset Ridge Ct', city: 'Scottsdale', state: 'AZ', zip: '85251', price: 1250000, beds: 5, baths: 4, sqft: 4100, status: 'Active', daysOnMarket: 0, photo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80', type: 'Single Family' },
  { id: '4', address: '320 Harbor Point Ln', city: 'Miami', state: 'FL', zip: '33101', price: 890000, beds: 3, baths: 3, sqft: 2100, status: 'Pending', daysOnMarket: 14, photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', type: 'Townhouse' },
  { id: '5', address: '112 Elmwood Circle', city: 'Nashville', state: 'TN', zip: '37201', price: 375000, beds: 3, baths: 2, sqft: 1650, status: 'Active', daysOnMarket: 5, photo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80', type: 'Single Family' },
  { id: '6', address: '9001 Hillcrest Ave', city: 'Los Angeles', state: 'CA', zip: '90210', price: 2750000, beds: 6, baths: 5, sqft: 5800, status: 'Coming Soon', daysOnMarket: 0, photo: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&q=80', type: 'Single Family' },
  { id: '7', address: '455 River Run Pkwy', city: 'Portland', state: 'OR', zip: '97201', price: 540000, beds: 4, baths: 2, sqft: 2200, status: 'Active', daysOnMarket: 10, photo: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80', type: 'Single Family' },
  { id: '8', address: '23 Beacon Hill Rd', city: 'Boston', state: 'MA', zip: '02101', price: 995000, beds: 4, baths: 3, sqft: 2900, status: 'Active', daysOnMarket: 21, photo: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80', type: 'Townhouse' },
  { id: '9', address: '5678 Grand Oak Blvd', city: 'Atlanta', state: 'GA', zip: '30301', price: 425000, beds: 4, baths: 3, sqft: 2600, status: 'Active', daysOnMarket: 3, photo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80', type: 'Single Family' },
  { id: '10', address: '101 Westside Terrace', city: 'Seattle', state: 'WA', zip: '98101', price: 875000, beds: 3, baths: 2, sqft: 1800, status: 'Active', daysOnMarket: 6, photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', type: 'Condo' },
  { id: '11', address: '7821 Crestwood Dr', city: 'Dallas', state: 'TX', zip: '75201', price: 650000, beds: 5, baths: 4, sqft: 3400, status: 'Active', daysOnMarket: 1, photo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80', type: 'Single Family' },
  { id: '12', address: '900 Magnolia Way', city: 'Charlotte', state: 'NC', zip: '28201', price: 320000, beds: 3, baths: 2, sqft: 1500, status: 'Active', daysOnMarket: 12, photo: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&q=80', type: 'Single Family' },
]

function formatPrice(price) {
  if (!price) return 'N/A'
  const n = parseInt(price)
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`
  if (n >= 1000) return `$${Math.round(n / 1000)}K`
  return `$${n.toLocaleString()}`
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function Home() {
  // ── State ──────────────────────────────────
  const [colorMode, setColorMode] = useState('dark')   // 'light' | 'mellow' | 'dark'
  const [activeTheme, setActiveTheme] = useState(THEMES.realestate.variants[2]) // default: Modern
  const [themeOpen, setThemeOpen] = useState(false)
  const [themeCategory, setThemeCategory] = useState('realestate')
  const [accordionOpen, setAccordionOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState([])
  const [viewMode, setViewMode] = useState('grid')
  const [listings, setListings] = useState(DEMO_LISTINGS)
  const [loading, setLoading] = useState(false)
  const [activeNav, setActiveNav] = useState('Buy')
  const [priceOpen, setPriceOpen] = useState(false)
  const [bedsOpen, setBedsOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [filterBeds, setFilterBeds] = useState('')
  const [filterPriceMin, setFilterPriceMin] = useState('')
  const [filterPriceMax, setFilterPriceMax] = useState('')
  const [filterType, setFilterType] = useState('')
  const [typeOpen, setTypeOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [sortBy, setSortBy] = useState('price_desc')
  const [hoveredCard, setHoveredCard] = useState(null)
  const themeRef = useRef(null)
  const accordionRef = useRef(null)
  const contactRef = useRef(null)

  // ── Color Mode Styles ──────────────────────
  const cm = {
    light: {
      bg: '#f8fafc',
      surface: '#ffffff',
      surfaceAlt: '#f1f5f9',
      border: 'rgba(0,0,0,0.08)',
      text: '#0f172a',
      textMuted: '#64748b',
      textFaint: '#94a3b8',
      headerBg: '#ffffff',
      cardBg: '#ffffff',
      inputBg: '#f8fafc',
      pillBg: '#f1f5f9',
      pillBorder: '#e2e8f0',
      overlay: 'rgba(248,250,252,0.95)',
      searchShadow: '0 4px 24px rgba(0,0,0,0.08)',
    },
    mellow: {
      bg: '#1e1e2e',
      surface: '#27273a',
      surfaceAlt: '#2e2e42',
      border: 'rgba(255,255,255,0.08)',
      text: '#e2e8f0',
      textMuted: '#94a3b8',
      textFaint: '#64748b',
      headerBg: '#1a1a2e',
      cardBg: '#27273a',
      inputBg: '#2e2e42',
      pillBg: '#2e2e42',
      pillBorder: 'rgba(255,255,255,0.1)',
      overlay: 'rgba(30,30,46,0.97)',
      searchShadow: '0 4px 24px rgba(0,0,0,0.3)',
    },
    dark: {
      bg: '#0a0a0f',
      surface: '#111118',
      surfaceAlt: '#18181f',
      border: 'rgba(255,255,255,0.06)',
      text: '#f1f5f9',
      textMuted: '#94a3b8',
      textFaint: '#475569',
      headerBg: '#0a0a0f',
      cardBg: '#111118',
      inputBg: '#18181f',
      pillBg: '#18181f',
      pillBorder: 'rgba(255,255,255,0.07)',
      overlay: 'rgba(10,10,15,0.98)',
      searchShadow: '0 4px 32px rgba(0,0,0,0.5)',
    },
  }
  const c = cm[colorMode]
  const t = activeTheme

  // ── Cycle color mode ───────────────────────
  const cycleMode = () => {
    setColorMode(prev =>
      prev === 'light' ? 'mellow' : prev === 'mellow' ? 'dark' : 'light'
    )
  }

  const ModeIcon = colorMode === 'light' ? Sun : colorMode === 'mellow' ? Sunset : Moon
  const modeLabel = colorMode === 'light' ? 'Light' : colorMode === 'mellow' ? 'Mellow' : 'Dark'

  // ── Close dropdowns on outside click ──────
  useEffect(() => {
    const handler = (e) => {
      if (themeRef.current && !themeRef.current.contains(e.target)) setThemeOpen(false)
      if (accordionRef.current && !accordionRef.current.contains(e.target)) setAccordionOpen(false)
      if (contactRef.current && !contactRef.current.contains(e.target)) setContactOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── Search ─────────────────────────────────
  const handleSearch = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      const filtered = DEMO_LISTINGS.filter(l =>
        !query ||
        l.city.toLowerCase().includes(query.toLowerCase()) ||
        l.address.toLowerCase().includes(query.toLowerCase()) ||
        l.zip.includes(query) ||
        l.state.toLowerCase().includes(query.toLowerCase())
      )
      setListings(filtered.length > 0 ? filtered : DEMO_LISTINGS)
      setLoading(false)
    }, 500)
  }

  // ── Filter + Sort ──────────────────────────
  const displayed = listings
    .filter(l => {
      if (filterBeds && l.beds < parseInt(filterBeds)) return false
      if (filterType && l.type !== filterType) return false
      if (filterPriceMin) {
        const v = filterPriceMin.includes('M')
          ? parseFloat(filterPriceMin) * 1000000
          : parseInt(filterPriceMin.replace(/\D/g, '')) * 1000
        if (l.price < v) return false
      }
      if (filterPriceMax) {
        const v = filterPriceMax.includes('M')
          ? parseFloat(filterPriceMax) * 1000000
          : parseInt(filterPriceMax.replace(/\D/g, '')) * 1000
        if (l.price > v) return false
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'price_desc') return b.price - a.price
      if (sortBy === 'price_asc') return a.price - b.price
      if (sortBy === 'newest') return a.daysOnMarket - b.daysOnMarket
      if (sortBy === 'sqft') return b.sqft - a.sqft
      return 0
    })

  const navItems = ['Buy', 'Rent', 'Sell', 'Agents', 'Mortgage']
  const propertyTypes = ['Single Family', 'Condo', 'Townhouse', 'Multi-Family', 'Land']
  const sortOptions = [
    { value: 'price_desc', label: 'Price: High → Low' },
    { value: 'price_asc', label: 'Price: Low → High' },
    { value: 'newest', label: 'Newest Listed' },
    { value: 'sqft', label: 'Largest First' },
  ]

  // ── Shared pill style ──────────────────────
  const pill = (active) => ({
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '7px 14px',
    border: `1px solid ${active ? t.accent : c.pillBorder}`,
    borderRadius: '24px',
    background: active ? `${t.accent}20` : c.pillBg,
    cursor: 'pointer', fontSize: '13px',
    color: active ? t.accent : c.text,
    fontWeight: 500, whiteSpace: 'nowrap',
    transition: 'all 0.2s',
  })

  const dropdownBase = {
    position: 'absolute', top: '100%', left: 0, marginTop: '8px',
    backgroundColor: c.surface,
    border: `1px solid ${c.border}`,
    borderRadius: '14px',
    boxShadow: `0 16px 48px rgba(0,0,0,0.3), 0 0 0 1px ${c.border}`,
    padding: '16px', zIndex: 200,
  }

  // ── Status badge color ─────────────────────
  const statusBg = (s) => ({
    'Active': '#16a34a',
    'Pending': '#ea580c',
    'Coming Soon': t.accent,
    'Active Under Contract': '#ca8a04',
  }[s] || '#6b7280')

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', fontFamily: '"Inter", system-ui, sans-serif', backgroundColor: c.bg, color: c.text, transition: 'background 0.3s, color 0.3s' }}>

      {/* ══════════════════════════════════════
          HEADER
      ══════════════════════════════════════ */}
      <header style={{ backgroundColor: c.headerBg, borderBottom: `1px solid ${c.border}`, padding: '0 20px', height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, zIndex: 100, backdropFilter: 'blur(12px)', position: 'relative' }}>

        {/* Left: Logo + Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: t.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 16px ${t.accentGlow}` }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: '18px', letterSpacing: '-1px' }}>Z</span>
            </div>
            <div style={{ lineHeight: 1.1 }}>
              <div style={{ fontWeight: 800, fontSize: '15px', color: c.text, letterSpacing: '-0.3px' }}>ZephyrAI</div>
              <div style={{ fontWeight: 700, fontSize: '10px', color: t.accent, letterSpacing: '1.5px', textTransform: 'uppercase' }}>IDX Platform</div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ display: 'flex', gap: '2px' }}>
            {navItems.map(item => (
              <button key={item} onClick={() => setActiveNav(item)}
                style={{ padding: '6px 14px', fontSize: '13px', fontWeight: 600, border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', background: activeNav === item ? `${t.accent}18` : 'transparent', color: activeNav === item ? t.accent : c.textMuted }}>
                {item}
              </button>
            ))}
          </nav>
        </div>

        {/* Right: Mode + Contact + Accordion */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

          {/* ── Color Mode Toggle ── */}
          <button onClick={cycleMode} title={`Switch mode (${modeLabel})`}
            style={{ width: '38px', height: '38px', borderRadius: '10px', border: `1px solid ${c.border}`, background: c.surfaceAlt, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.accent, transition: 'all 0.2s', position: 'relative' }}
            onMouseEnter={e => { e.currentTarget.style.background = `${t.accent}20`; e.currentTarget.style.borderColor = t.accent }}
            onMouseLeave={e => { e.currentTarget.style.background = c.surfaceAlt; e.currentTarget.style.borderColor = c.border }}>
            <ModeIcon size={17} />
            {/* tooltip */}
            <span style={{ position: 'absolute', top: '110%', left: '50%', transform: 'translateX(-50%)', background: c.surface, border: `1px solid ${c.border}`, borderRadius: '6px', padding: '3px 8px', fontSize: '10px', fontWeight: 600, color: c.textMuted, whiteSpace: 'nowrap', pointerEvents: 'none', marginTop: '4px', opacity: 0.9 }}>
              {modeLabel}
            </span>
          </button>

          {/* ── Contact Button ── */}
          <div style={{ position: 'relative' }} ref={contactRef}>
            <button onClick={() => { setContactOpen(!contactOpen); setAccordionOpen(false); setThemeOpen(false) }}
              style={{ width: '38px', height: '38px', borderRadius: '10px', border: `1px solid ${contactOpen ? t.accent : c.border}`, background: contactOpen ? `${t.accent}15` : c.surfaceAlt, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: contactOpen ? t.accent : c.textMuted, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent }}
              onMouseLeave={e => { if (!contactOpen) { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textMuted } }}>
              <MessageSquare size={17} />
            </button>

            {contactOpen && (
              <div style={{ ...dropdownBase, left: 'auto', right: 0, width: '300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: t.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageSquare size={18} color="#fff" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '14px', color: c.text }}>Contact Us</p>
                    <p style={{ fontSize: '12px', color: c.textMuted }}>We typically reply within 1 hour</p>
                  </div>
                </div>
                {[
                  { icon: Phone, label: 'Call Us', sub: '+1 (800) 555-0199', color: '#16a34a' },
                  { icon: Mail, label: 'Email Us', sub: 'hello@zephyrai.idx', color: t.accent },
                  { icon: MessageSquare, label: 'Live Chat', sub: 'Start a conversation', color: '#7c3aed' },
                ].map(({ icon: Icon, label, sub, color }) => (
                  <button key={label} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer', marginBottom: '4px', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = c.surfaceAlt}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={16} style={{ color }} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: c.text, margin: 0 }}>{label}</p>
                      <p style={{ fontSize: '12px', color: c.textMuted, margin: 0 }}>{sub}</p>
                    </div>
                    <ArrowUpRight size={14} style={{ color: c.textFaint, marginLeft: 'auto' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Accordion Menu ── */}
          <div style={{ position: 'relative' }} ref={accordionRef}>
            <button onClick={() => { setAccordionOpen(!accordionOpen); setContactOpen(false); setThemeOpen(false) }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 14px', borderRadius: '10px', border: `1px solid ${accordionOpen ? t.accent : c.border}`, background: accordionOpen ? `${t.accent}15` : c.surfaceAlt, cursor: 'pointer', transition: 'all 0.2s', color: accordionOpen ? t.accent : c.text, fontSize: '13px', fontWeight: 600 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5px' }}>
                <span style={{ display: 'block', width: '16px', height: '1.5px', background: 'currentColor', borderRadius: '2px' }} />
                <span style={{ display: 'block', width: '12px', height: '1.5px', background: 'currentColor', borderRadius: '2px' }} />
                <span style={{ display: 'block', width: '16px', height: '1.5px', background: 'currentColor', borderRadius: '2px' }} />
              </div>
              <User size={15} />
            </button>

            {accordionOpen && (
              <div style={{ ...dropdownBase, left: 'auto', right: 0, width: '280px', padding: '8px' }}>
                {/* User profile header */}
                <div style={{ padding: '12px', borderRadius: '10px', background: c.surfaceAlt, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: t.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 12px ${t.accentGlow}` }}>
                    <User size={18} color="#fff" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '14px', color: c.text, margin: 0 }}>Welcome Back</p>
                    <p style={{ fontSize: '12px', color: c.textMuted, margin: 0 }}>Sign in to save homes</p>
                  </div>
                </div>

                {/* Accordion sections */}
                {[
                  {
                    label: '🏠 My Listings', items: ['Saved Homes', 'Recent Searches', 'Home Alerts', 'Visited Homes']
                  },
                  {
                    label: '⚙️ Settings', items: ['Account Settings', 'Notifications', 'Privacy', 'Appearance']
                  },
                  {
                    label: '🎨 Theme', isTheme: true
                  },
                ].map((section) => (
                  <AccordionSection key={section.label} section={section} c={c} t={t}
                    themeOpen={themeOpen} setThemeOpen={setThemeOpen}
                    themeCategory={themeCategory} setThemeCategory={setThemeCategory}
                    activeTheme={activeTheme} setActiveTheme={setActiveTheme}
                    THEMES={THEMES}
                  />
                ))}

                <div style={{ borderTop: `1px solid ${c.border}`, marginTop: '8px', paddingTop: '8px' }}>
                  <button style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: 'none', background: `${t.accent}15`, color: t.accent, cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
                    Sign In / Register
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════
          SEARCH + FILTERS
      ══════════════════════════════════════ */}
      <div style={{ backgroundColor: c.surface, borderBottom: `1px solid ${c.border}`, padding: '14px 20px 12px', flexShrink: 0, boxShadow: c.searchShadow, position: 'relative', zIndex: 90 }}>

        {/* Search Row */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0', maxWidth: '720px', marginBottom: '12px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <MapPin size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: c.textFaint, pointerEvents: 'none' }} />
            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="City, Zip, Neighborhood, Address, MLS#"
              style={{ width: '100%', padding: '11px 14px 11px 40px', border: `1px solid ${c.border}`, borderRight: 'none', borderRadius: '10px 0 0 10px', fontSize: '14px', background: c.inputBg, color: c.text, outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s' }}
              onFocus={e => { e.target.style.borderColor = t.accent; e.target.style.boxShadow = `0 0 0 3px ${t.accentGlow}` }}
              onBlur={e => { e.target.style.borderColor = c.border; e.target.style.boxShadow = 'none' }}
            />
          </div>
          <button type="submit"
            style={{ padding: '11px 22px', background: t.gradient, color: '#fff', border: 'none', borderRadius: '0 10px 10px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', fontWeight: 700, fontSize: '14px', boxShadow: `0 4px 16px ${t.accentGlow}`, transition: 'all 0.2s', letterSpacing: '0.2px' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            <Search size={16} /> Search
          </button>
        </form>

        {/* Filter Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>

          {/* Price */}
          <div style={{ position: 'relative' }}>
            <button style={pill(filterPriceMin || filterPriceMax)} onClick={() => { setPriceOpen(!priceOpen); setBedsOpen(false); setTypeOpen(false); setSortOpen(false); setMoreOpen(false) }}>
              <DollarSign size={13} />
              {filterPriceMin || filterPriceMax ? `${filterPriceMin || 'Any'} – ${filterPriceMax || 'Any'}` : 'Price'}
              <ChevronDown size={12} style={{ transform: priceOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {priceOpen && (
              <div style={{ ...dropdownBase, width: '270px' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: c.text, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <DollarSign size={14} style={{ color: t.accent }} /> Price Range
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[['Min', filterPriceMin, setFilterPriceMin, ['', '$100K', '$200K', '$300K', '$500K', '$750K', '$1M']], ['Max', filterPriceMax, setFilterPriceMax, ['', '$200K', '$300K', '$500K', '$750K', '$1M', '$1.5M', '$2M+']]].map(([label, val, setter, opts]) => (
                    <div key={label}>
                      <label style={{ fontSize: '11px', color: c.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '5px' }}>{label}</label>
                      <select value={val} onChange={e => setter(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', border: `1px solid ${c.border}`, borderRadius: '8px', fontSize: '13px', background: c.inputBg, color: c.text, outline: 'none', cursor: 'pointer' }}>
                        {opts.map(p => <option key={p} value={p} style={{ background: c.surface }}>{p || `No ${label}`}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <button onClick={() => setPriceOpen(false)}
                  style={{ marginTop: '12px', width: '100%', padding: '9px', background: t.gradient, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, boxShadow: `0 4px 12px ${t.accentGlow}` }}>
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Beds */}
          <div style={{ position: 'relative' }}>
            <button style={pill(filterBeds)} onClick={() => { setBedsOpen(!bedsOpen); setPriceOpen(false); setTypeOpen(false); setSortOpen(false); setMoreOpen(false) }}>
              <Bed size={13} />
              {filterBeds ? `${filterBeds}+ Beds` : 'Beds'}
              <ChevronDown size={12} style={{ transform: bedsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {bedsOpen && (
              <div style={{ ...dropdownBase, width: '230px' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: c.text, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Bed size={14} style={{ color: t.accent }} /> Bedrooms
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['Any', '1', '2', '3', '4', '5+'].map(b => (
                    <button key={b} onClick={() => { setFilterBeds(b === 'Any' ? '' : b.replace('+', '')); setBedsOpen(false) }}
                      style={{ padding: '8px 16px', borderRadius: '8px', border: `1px solid ${(b === 'Any' && !filterBeds) || filterBeds === b.replace('+', '') ? t.accent : c.border}`, background: (b === 'Any' && !filterBeds) || filterBeds === b.replace('+', '') ? t.accent : 'transparent', color: (b === 'Any' && !filterBeds) || filterBeds === b.replace('+', '') ? '#fff' : c.text, cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'all 0.15s' }}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Home Type */}
          <div style={{ position: 'relative' }}>
            <button style={pill(filterType)} onClick={() => { setTypeOpen(!typeOpen); setPriceOpen(false); setBedsOpen(false); setSortOpen(false); setMoreOpen(false) }}>
              <Home size={13} />
              {filterType || 'Home Type'}
              <ChevronDown size={12} style={{ transform: typeOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {typeOpen && (
              <div style={{ ...dropdownBase, width: '220px', padding: '8px' }}>
                {['All Types', ...propertyTypes].map(type => (
                  <button key={type} onClick={() => { setFilterType(type === 'All Types' ? '' : type); setTypeOpen(false) }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px', color: c.text, fontWeight: filterType === type || (type === 'All Types' && !filterType) ? 700 : 400, transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = c.surfaceAlt}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {type}
                    {(filterType === type || (type === 'All Types' && !filterType)) && <Check size={14} style={{ color: t.accent }} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort */}
          <div style={{ position: 'relative' }}>
            <button style={pill(false)} onClick={() => { setSortOpen(!sortOpen); setPriceOpen(false); setBedsOpen(false); setTypeOpen(false); setMoreOpen(false) }}>
              <TrendingUp size={13} />
              {sortOptions.find(s => s.value === sortBy)?.label || 'Sort'}
              <ChevronDown size={12} style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {sortOpen && (
              <div style={{ ...dropdownBase, width: '210px', padding: '8px' }}>
                {sortOptions.map(opt => (
                  <button key={opt.value} onClick={() => { setSortBy(opt.value); setSortOpen(false) }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px', color: c.text, fontWeight: sortBy === opt.value ? 700 : 400, transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = c.surfaceAlt}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {opt.label}
                    {sortBy === opt.value && <Check size={14} style={{ color: t.accent }} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* More Filters */}
          <button style={pill(false)} onClick={() => { setMoreOpen(!moreOpen); setPriceOpen(false); setBedsOpen(false); setTypeOpen(false); setSortOpen(false) }}>
            <SlidersHorizontal size={13} /> More
          </button>

          {/* Clear Filters */}
          {(filterBeds || filterPriceMin || filterPriceMax || filterType) && (
            <button onClick={() => { setFilterBeds(''); setFilterPriceMin(''); setFilterPriceMax(''); setFilterType('') }}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', borderRadius: '24px', border: `1px solid rgba(239,68,68,0.4)`, background: 'rgba(239,68,68,0.1)', cursor: 'pointer', fontSize: '13px', color: '#ef4444', fontWeight: 600 }}>
              <X size={12} /> Clear
            </button>
          )}

          {/* Right side: count + view toggle */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '20px', background: `${t.accent}15`, border: `1px solid ${t.accent}40` }}>
              <Sparkles size={12} style={{ color: t.accent }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: t.accent }}>{displayed.length} homes</span>
            </div>
            {/* View Toggle */}
            <div style={{ display: 'flex', border: `1px solid ${c.border}`, borderRadius: '10px', overflow: 'hidden', background: c.surfaceAlt }}>
              {[
                { mode: 'grid', icon: LayoutGrid },
                { mode: 'list', icon: List },
                { mode: 'split', icon: Map },
              ].map(({ mode, icon: Icon }) => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  style={{ padding: '7px 11px', border: 'none', borderLeft: mode !== 'grid' ? `1px solid ${c.border}` : 'none', background: viewMode === mode ? t.accent : 'transparent', color: viewMode === mode ? '#fff' : c.textMuted, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Listings Panel */}
        <div style={{ width: viewMode === 'split' ? '58%' : '100%', overflowY: 'auto', padding: '20px', backgroundColor: c.bg, transition: 'width 0.3s' }}>

          {/* Results header */}
          {!loading && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: c.text, letterSpacing: '-0.5px', margin: 0 }}>
                  {displayed.length} Homes For Sale
                </h1>
                <p style={{ fontSize: '12px', color: c.textMuted, marginTop: '3px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Sparkles size={11} style={{ color: t.accent }} />
                  Powered by ZephyrAI IDX · SparkAPI (FBS)
                </p>
              </div>
              {/* Theme pill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 10px 5px 6px', borderRadius: '20px', background: c.surfaceAlt, border: `1px solid ${c.border}`, fontSize: '12px', color: c.textMuted, fontWeight: 500 }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: t.gradient, flexShrink: 0, boxShadow: `0 0 8px ${t.accentGlow}` }} />
                {t.name} Theme
              </div>
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'list' ? '1fr' : 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ background: c.cardBg, borderRadius: '14px', overflow: 'hidden', border: `1px solid ${c.border}`, animation: 'pulse 1.5s infinite' }}>
                  <div style={{ height: viewMode === 'list' ? '120px' : '185px', background: c.surfaceAlt }} />
                  <div style={{ padding: '14px' }}>
                    <div style={{ height: '14px', background: c.surfaceAlt, borderRadius: '4px', marginBottom: '8px', width: '60%' }} />
                    <div style={{ height: '12px', background: c.surfaceAlt, borderRadius: '4px', width: '80%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : displayed.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: c.textMuted }}>
              <AlertCircle size={48} style={{ color: c.textFaint, marginBottom: '16px' }} />
              <p style={{ fontSize: '16px', fontWeight: 600, color: c.text }}>No listings found</p>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>Try adjusting your search or filters</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'list' ? '1fr' : 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
              {displayed.map(listing => {
                const isHovered = hoveredCard === listing.id
                const isSaved = saved.includes(listing.id)
                const isNew = listing.daysOnMarket <= 2

                return (
                  <div key={listing.id}
                    onMouseEnter={() => setHoveredCard(listing.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      background: c.cardBg, borderRadius: '16px', overflow: 'hidden',
                      border: `1px solid ${isHovered ? t.accent + '60' : c.border}`,
                      cursor: 'pointer', transition: 'all 0.25s',
                      boxShadow: isHovered ? `${t.cardGlow}, 0 8px 32px rgba(0,0,0,0.15)` : '0 1px 4px rgba(0,0,0,0.06)',
                      transform: isHovered ? 'translateY(-3px)' : 'none',
                      display: viewMode === 'list' ? 'flex' : 'block',
                    }}>

                    {/* Image */}
                    <div style={{ position: 'relative', height: viewMode === 'list' ? '100%' : '190px', width: viewMode === 'list' ? '220px' : '100%', flexShrink: 0, overflow: 'hidden', background: c.surfaceAlt }}>
                      <img src={listing.photo} alt={listing.address}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', transform: isHovered ? 'scale(1.05)' : 'scale(1)', display: 'block' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />

                      {/* Status + New badge */}
                      <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '5px' }}>
                        <span style={{ background: statusBg(listing.status), color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px', letterSpacing: '0.3px' }}>
                          {listing.status}
                        </span>
                        {isNew && (
                          <span style={{ background: t.accent, color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '3px', boxShadow: `0 0 8px ${t.accentGlow}` }}>
                            <Star size={9} fill="#fff" /> NEW
                          </span>
                        )}
                      </div>

                      {/* Save button */}
                      <button onClick={(e) => { e.stopPropagation(); setSaved(prev => prev.includes(listing.id) ? prev.filter(x => x !== listing.id) : [...prev, listing.id]) }}
                        style={{ position: 'absolute', top: '10px', right: '10px', width: '32px', height: '32px', borderRadius: '50%', background: isSaved ? `${t.accent}` : 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: isSaved ? `0 0 12px ${t.accentGlow}` : 'none' }}>
                        <Heart size={15} style={{ fill: isSaved ? '#fff' : 'none', color: isSaved ? '#fff' : '#fff' }} />
                      </button>

                      {/* Price */}
                      <div style={{ position: 'absolute', bottom: '10px', left: '12px' }}>
                        <span style={{ color: '#fff', fontWeight: 900, fontSize: '22px', letterSpacing: '-0.5px', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                          {formatPrice(listing.price)}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div style={{ padding: '14px', flex: 1 }}>
                      {/* Stats row */}
                      <div style={{ display: 'flex', gap: '14px', marginBottom: '10px' }}>
                        {[
                          { icon: Bed, val: listing.beds, unit: 'bd' },
                          { icon: Bath, val: listing.baths, unit: 'ba' },
                          { icon: Maximize2, val: listing.sqft.toLocaleString(), unit: 'ft²' },
                        ].map(({ icon: Icon, val, unit }) => (
                          <div key={unit} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Icon size={13} style={{ color: t.accent }} />
                            <span style={{ fontSize: '13px', fontWeight: 700, color: c.text }}>{val}</span>
                            <span style={{ fontSize: '11px', color: c.textFaint }}>{unit}</span>
                          </div>
                        ))}
                      </div>

                      {/* Address */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '5px', marginBottom: '10px' }}>
                        <MapPin size={13} style={{ color: t.accent, marginTop: '2px', flexShrink: 0 }} />
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: 700, color: c.text, margin: 0, lineHeight: 1.3 }}>{listing.address}</p>
                          <p style={{ fontSize: '12px', color: c.textMuted, margin: '2px 0 0 0' }}>{listing.city}, {listing.state} {listing.zip}</p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: `1px solid ${c.border}` }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '6px', background: `${t.accent}15`, color: t.accent, fontSize: '11px', fontWeight: 600, border: `1px solid ${t.accent}30` }}>
                          {listing.type}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: c.textFaint }}>
                          <Clock size={11} />
                          {listing.daysOnMarket === 0 ? 'Just listed' : `${listing.daysOnMarket}d on market`}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Map Panel ── */}
        {viewMode === 'split' && (
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: colorMode === 'dark' ? '#0d1117' : colorMode === 'mellow' ? '#1a1a2e' : '#e8f4f8' }}>
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
              <defs>
                <pattern id="mapgrid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke={colorMode === 'light' ? '#94a3b8' : '#334155'} strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mapgrid)" opacity="0.5" />
              <line x1="0" y1="38%" x2="100%" y2="36%" stroke={colorMode === 'light' ? '#64748b' : '#475569'} strokeWidth="4" opacity="0.3" />
              <line x1="0" y1="62%" x2="100%" y2="60%" stroke={colorMode === 'light' ? '#64748b' : '#475569'} strokeWidth="3" opacity="0.2" />
              <line x1="28%" y1="0" x2="26%" y2="100%" stroke={colorMode === 'light' ? '#64748b' : '#475569'} strokeWidth="4" opacity="0.3" />
              <line x1="65%" y1="0" x2="67%" y2="100%" stroke={colorMode === 'light' ? '#64748b' : '#475569'} strokeWidth="3" opacity="0.2" />
              <ellipse cx="75%" cy="20%" rx="9%" ry="6%" fill={t.accent} opacity="0.1" />
              <ellipse cx="15%" cy="75%" rx="7%" ry="5%" fill="#4ade80" opacity="0.15" />
              <ellipse cx="85%" cy="70%" rx="10%" ry="7%" fill="#60a5fa" opacity="0.15" />
            </svg>

            {/* Price pins */}
            {displayed.slice(0, 12).map((listing, i) => {
              const positions = [
                { left: '18%', top: '22%' }, { left: '42%', top: '28%' }, { left: '68%', top: '18%' },
                { left: '28%', top: '48%' }, { left: '55%', top: '52%' }, { left: '78%', top: '42%' },
                { left: '12%', top: '68%' }, { left: '48%', top: '72%' }, { left: '80%', top: '60%' },
                { left: '35%', top: '82%' }, { left: '70%', top: '80%' }, { left: '22%', top: '35%' },
              ]
              const pos = positions[i % positions.length]
              return (
                <div key={listing.id} style={{ position: 'absolute', ...pos, transform: 'translate(-50%, -50%)', zIndex: 10, cursor: 'pointer' }}>
                  <div
                    style={{ background: t.gradient, color: '#fff', fontSize: '11px', fontWeight: 800, padding: '5px 10px', borderRadius: '20px', boxShadow: `0 4px 16px ${t.accentGlow}`, whiteSpace: 'nowrap', letterSpacing: '-0.2px', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.15)'; e.currentTarget.style.boxShadow = `0 6px 24px ${t.accentGlow}` }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = `0 4px 16px ${t.accentGlow}` }}>
                    {formatPrice(listing.price)}
                  </div>
                  <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `7px solid ${t.accent}`, margin: '0 auto' }} />
                </div>
              )
            })}

            {/* Map UI chrome */}
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: `${c.surface}ee`, backdropFilter: 'blur(8px)', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', color: c.textMuted, fontWeight: 600, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={13} style={{ color: t.accent }} /> ZephyrAI IDX Map
            </div>
            <div style={{ position: 'absolute', right: '16px', bottom: '60px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {['+', '−'].map(s => (
                <button key={s} style={{ width: '34px', height: '34px', background: `${c.surface}ee`, backdropFilter: 'blur(8px)', border: `1px solid ${c.border}`, borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 700, color: c.text, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = t.accent}
                  onMouseLeave={e => e.currentTarget.style.borderColor = c.border}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════
          GLOBAL STYLES
      ══════════════════════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${t.accent}50; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: ${t.accent}; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        select option { background: #1a1a2e; color: #f1f5f9; }
      `}</style>
    </div>
  )
}

// ─────────────────────────────────────────────
// ACCORDION SECTION SUB-COMPONENT
// ─────────────────────────────────────────────
function AccordionSection({ section, c, t, themeOpen, setThemeOpen, themeCategory, setThemeCategory, activeTheme, setActiveTheme, THEMES }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ marginBottom: '4px' }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '8px', border: 'none', background: open ? c.surfaceAlt : 'transparent', cursor: 'pointer', fontSize: '13px', color: c.text, fontWeight: 600, transition: 'background 0.15s' }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = c.surfaceAlt }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'transparent' }}>
        {section.label}
        <ChevronRight size={14} style={{ color: c.textFaint, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <div style={{ paddingLeft: '12px', paddingBottom: '4px' }}>
          {section.isTheme ? (
            // ── Theme Picker ──
            <div>
              {/* Category tabs */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '10px', padding: '4px 0' }}>
                {Object.entries(THEMES).map(([key, cat]) => {
                  const Icon = cat.icon
                  return (
                    <button key={key} onClick={() => setThemeCategory(key)}
                      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', padding: '7px 4px', borderRadius: '8px', border: `1px solid ${themeCategory === key ? t.accent : c.border}`, background: themeCategory === key ? `${t.accent}15` : 'transparent', cursor: 'pointer', color: themeCategory === key ? t.accent : c.textMuted, fontSize: '10px', fontWeight: 600, transition: 'all 0.15s' }}>
                      <Icon size={14} />
                      {cat.label}
                    </button>
                  )
                })}
              </div>
              {/* Variants */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {THEMES[themeCategory].variants.map(variant => (
                  <button key={variant.id} onClick={() => setActiveTheme(variant)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '10px', border: `1px solid ${activeTheme.id === variant.id ? t.accent : c.border}`, background: activeTheme.id === variant.id ? `${variant.accent}15` : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ width: '52px', height: '36px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                      <img src={variant.image} alt={variant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: variant.gradient, opacity: 0.6 }} />
                    </div>
                    <div style={{ textAlign: 'left', flex: 1 }}>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: c.text, margin: 0 }}>{variant.name}</p>
                      <div style={{ display: 'flex', gap: '4px', marginTop: '3px' }}>
                        {[variant.accent, variant.accentLight].map((clr, i) => (
                          <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: clr, border: `1px solid ${c.border}` }} />
                        ))}
                      </div>
                    </div>
                    {activeTheme.id === variant.id && (
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: variant.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Check size={11} color="#fff" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            section.items.map(item => (
              <button key={item}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px', color: c.textMuted, transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = c.surfaceAlt; e.currentTarget.style.color = c.text }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = c.textMuted }}>
                {item}
                <ChevronRight size={13} style={{ color: c.textFaint }} />
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

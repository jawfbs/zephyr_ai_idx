'use client'

import { useState, useEffect } from 'react'
import { Search, Heart, Bed, Bath, MapPin, SlidersHorizontal, List, Map, ChevronDown, X, User, Bell, Camera, Clock } from 'lucide-react'

const DEMO_LISTINGS = [
  { id: '1', address: '4821 Maple Grove Dr', city: 'Austin', state: 'TX', zip: '78745', price: 485000, beds: 4, baths: 3, sqft: 2400, status: 'Active', daysOnMarket: 2, photo: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80' },
  { id: '2', address: '2210 Lakeview Blvd', city: 'Denver', state: 'CO', zip: '80203', price: 725000, beds: 3, baths: 2, sqft: 1980, status: 'Active', daysOnMarket: 7, photo: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80' },
  { id: '3', address: '8834 Sunset Ridge Ct', city: 'Scottsdale', state: 'AZ', zip: '85251', price: 1250000, beds: 5, baths: 4, sqft: 4100, status: 'Active', daysOnMarket: 0, photo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80' },
  { id: '4', address: '320 Harbor Point Ln', city: 'Miami', state: 'FL', zip: '33101', price: 890000, beds: 3, baths: 3, sqft: 2100, status: 'Pending', daysOnMarket: 14, photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80' },
  { id: '5', address: '112 Elmwood Circle', city: 'Nashville', state: 'TN', zip: '37201', price: 375000, beds: 3, baths: 2, sqft: 1650, status: 'Active', daysOnMarket: 5, photo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80' },
  { id: '6', address: '9001 Hillcrest Ave', city: 'Los Angeles', state: 'CA', zip: '90210', price: 2750000, beds: 6, baths: 5, sqft: 5800, status: 'Coming Soon', daysOnMarket: 0, photo: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&q=80' },
  { id: '7', address: '455 River Run Pkwy', city: 'Portland', state: 'OR', zip: '97201', price: 540000, beds: 4, baths: 2, sqft: 2200, status: 'Active', daysOnMarket: 10, photo: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80' },
  { id: '8', address: '23 Beacon Hill Rd', city: 'Boston', state: 'MA', zip: '02101', price: 995000, beds: 4, baths: 3, sqft: 2900, status: 'Active', daysOnMarket: 21, photo: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80' },
  { id: '9', address: '5678 Grand Oak Blvd', city: 'Atlanta', state: 'GA', zip: '30301', price: 425000, beds: 4, baths: 3, sqft: 2600, status: 'Active', daysOnMarket: 3, photo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80' },
  { id: '10', address: '101 Westside Terrace', city: 'Seattle', state: 'WA', zip: '98101', price: 875000, beds: 3, baths: 2, sqft: 1800, status: 'Active', daysOnMarket: 6, photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80' },
  { id: '11', address: '7821 Crestwood Dr', city: 'Dallas', state: 'TX', zip: '75201', price: 650000, beds: 5, baths: 4, sqft: 3400, status: 'Active', daysOnMarket: 1, photo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80' },
  { id: '12', address: '900 Magnolia Way', city: 'Charlotte', state: 'NC', zip: '28201', price: 320000, beds: 3, baths: 2, sqft: 1500, status: 'Active', daysOnMarket: 12, photo: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&q=80' },
]

function formatPrice(price) {
  if (!price) return 'Price N/A'
  const num = parseInt(price)
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`
  if (num >= 1000) return `$${Math.round(num / 1000)}K`
  return `$${num.toLocaleString()}`
}

const STATUS_COLORS = {
  'Active': 'bg-green-500',
  'Pending': 'bg-orange-500',
  'Coming Soon': 'bg-blue-500',
  'Active Under Contract': 'bg-yellow-500',
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState([])
  const [viewMode, setViewMode] = useState('list')
  const [activeNav, setActiveNav] = useState('Buy')
  const [listings, setListings] = useState(DEMO_LISTINGS)
  const [loading, setLoading] = useState(false)
  const [priceOpen, setPriceOpen] = useState(false)
  const [bedsOpen, setBedsOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [filterBeds, setFilterBeds] = useState('')
  const [filterPriceMin, setFilterPriceMin] = useState('')
  const [filterPriceMax, setFilterPriceMax] = useState('')

  const navItems = ['Buy', 'Rent', 'Sell', 'Agents', 'Mortgage']

  const toggleSaved = (id) => {
    setSaved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

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
    }, 600)
  }

  const applyFilters = (list) => {
    return list.filter(l => {
      if (filterBeds) {
        const min = parseInt(filterBeds)
        if (l.beds < min) return false
      }
      if (filterPriceMin) {
        const min = parseInt(filterPriceMin.replace(/\D/g, '')) * (filterPriceMin.includes('K') ? 1000 : filterPriceMin.includes('M') ? 1000000 : 1)
        if (l.price < min) return false
      }
      if (filterPriceMax) {
        const max = parseInt(filterPriceMax.replace(/\D/g, '')) * (filterPriceMax.includes('K') ? 1000 : filterPriceMax.includes('M') ? 1000000 : 1)
        if (l.price > max) return false
      }
      return true
    })
  }

  const displayed = applyFilters(listings)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#fff' }}>

      {/* HEADER */}
      <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 16px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#d92228', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: '16px' }}>Z</span>
            </div>
            <div style={{ lineHeight: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#111' }}>ZephyrAI</div>
              <div style={{ fontWeight: 600, fontSize: '11px', color: '#d92228' }}>IDX</div>
            </div>
          </div>
          {/* Nav */}
          <nav style={{ display: 'flex', gap: '4px' }}>
            {navItems.map(item => (
              <button key={item} onClick={() => setActiveNav(item)} style={{ padding: '6px 12px', fontSize: '14px', fontWeight: 500, border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeNav === item ? '2px solid #d92228' : '2px solid transparent', color: activeNav === item ? '#d92228' : '#374151' }}>
                {item}
              </button>
            ))}
          </nav>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px', color: '#374151' }}>
            <Heart size={15} /> Saved ({saved.length})
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', backgroundColor: '#d92228', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
            <User size={14} /> Sign In
          </button>
        </div>
      </header>

      {/* SEARCH BAR */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', padding: '12px 16px', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0', maxWidth: '700px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <MapPin size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="City, Zip, Neighborhood, Address, MLS#"
              style={{ width: '100%', padding: '10px 10px 10px 38px', border: '1px solid #d1d5db', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: '14px', outline: 'none', color: '#111', boxSizing: 'border-box' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#d92228', color: '#fff', border: 'none', borderRadius: '0 8px 8px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '14px' }}>
            <Search size={16} /> Search
          </button>
        </form>

        {/* FILTER BAR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>

          {/* Price Filter */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => { setPriceOpen(!priceOpen); setBedsOpen(false); setMoreOpen(false) }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '20px', background: filterPriceMin || filterPriceMax ? '#eff6ff' : '#fff', cursor: 'pointer', fontSize: '13px', color: filterPriceMin || filterPriceMax ? '#1d4ed8' : '#374151', fontWeight: 500 }}>
              {filterPriceMin || filterPriceMax ? `${filterPriceMin || 'Any'} – ${filterPriceMax || 'Any'}` : 'Price'} <ChevronDown size={13} />
            </button>
            {priceOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '6px', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', padding: '16px', zIndex: 100, width: '260px' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: '#111' }}>Price Range</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Min</label>
                    <select value={filterPriceMin} onChange={e => setFilterPriceMin(e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px' }}>
                      {['', '$100K', '$200K', '$300K', '$400K', '$500K', '$750K', '$1M'].map(p => <option key={p} value={p}>{p || 'No Min'}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Max</label>
                    <select value={filterPriceMax} onChange={e => setFilterPriceMax(e.target.value)} style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px' }}>
                      {['', '$200K', '$300K', '$400K', '$500K', '$750K', '$1M', '$2M'].map(p => <option key={p} value={p}>{p || 'No Max'}</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={() => setPriceOpen(false)} style={{ marginTop: '12px', width: '100%', padding: '8px', backgroundColor: '#d92228', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Apply</button>
              </div>
            )}
          </div>

          {/* Beds Filter */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => { setBedsOpen(!bedsOpen); setPriceOpen(false); setMoreOpen(false) }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '20px', background: filterBeds ? '#eff6ff' : '#fff', cursor: 'pointer', fontSize: '13px', color: filterBeds ? '#1d4ed8' : '#374151', fontWeight: 500 }}>
              {filterBeds ? `${filterBeds}+ Beds` : 'Beds'} <ChevronDown size={13} />
            </button>
            {bedsOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '6px', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', padding: '16px', zIndex: 100, width: '220px' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: '#111' }}>Bedrooms</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['Any', '1', '2', '3', '4', '5'].map(b => (
                    <button key={b} onClick={() => { setFilterBeds(b === 'Any' ? '' : b); setBedsOpen(false) }} style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid', borderColor: (b === 'Any' && !filterBeds) || filterBeds === b ? '#1d4ed8' : '#d1d5db', backgroundColor: (b === 'Any' && !filterBeds) || filterBeds === b ? '#1d4ed8' : '#fff', color: (b === 'Any' && !filterBeds) || filterBeds === b ? '#fff' : '#374151', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Home Type */}
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '20px', background: '#fff', cursor: 'pointer', fontSize: '13px', color: '#374151', fontWeight: 500 }}>
            Home Type <ChevronDown size={13} />
          </button>

          {/* More */}
          <button onClick={() => { setMoreOpen(!moreOpen); setPriceOpen(false); setBedsOpen(false) }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '20px', background: '#fff', cursor: 'pointer', fontSize: '13px', color: '#374151', fontWeight: 500 }}>
            <SlidersHorizontal size={13} /> More Filters
          </button>

          {/* Clear */}
          {(filterBeds || filterPriceMin || filterPriceMax) && (
            <button onClick={() => { setFilterBeds(''); setFilterPriceMin(''); setFilterPriceMax('') }} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', border: '1px solid #fca5a5', borderRadius: '20px', background: '#fef2f2', cursor: 'pointer', fontSize: '13px', color: '#dc2626', fontWeight: 500 }}>
              <X size={12} /> Clear
            </button>
          )}

          {/* Spacer */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>{displayed.length} homes</span>
            {/* View Toggle */}
            <div style={{ display: 'flex', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
              <button onClick={() => setViewMode('list')} style={{ padding: '6px 10px', border: 'none', background: viewMode === 'list' ? '#111' : '#fff', color: viewMode === 'list' ? '#fff' : '#6b7280', cursor: 'pointer' }}>
                <List size={15} />
              </button>
              <button onClick={() => setViewMode('split')} style={{ padding: '6px 10px', border: 'none', borderLeft: '1px solid #e5e7eb', background: viewMode === 'split' ? '#111' : '#fff', color: viewMode === 'split' ? '#fff' : '#6b7280', cursor: 'pointer' }}>
                <Map size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* LISTINGS */}
        <div style={{ width: viewMode === 'split' ? '55%' : '100%', overflowY: 'auto', backgroundColor: '#f9fafb', padding: '16px' }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                  <div style={{ height: '180px', backgroundColor: '#e5e7eb', animation: 'pulse 1.5s infinite' }} />
                  <div style={{ padding: '12px' }}>
                    <div style={{ height: '16px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '8px' }} />
                    <div style={{ height: '12px', backgroundColor: '#e5e7eb', borderRadius: '4px', width: '70%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111' }}>{displayed.length} Homes For Sale</h2>
                <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>Powered by ZephyrAI IDX</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                {displayed.map(listing => {
                  const statusColor = STATUS_COLORS[listing.status] || 'bg-gray-500'
                  const isNew = listing.daysOnMarket <= 2
                  const isSavedListing = saved.includes(listing.id)
                  return (
                    <div key={listing.id} style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                      {/* Image */}
                      <div style={{ position: 'relative', height: '190px', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                        <img src={listing.photo} alt={listing.address} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {/* Gradient overlay */}
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)' }} />
                        {/* Status */}
                        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                          <span style={{ backgroundColor: listing.status === 'Active' ? '#16a34a' : listing.status === 'Pending' ? '#ea580c' : listing.status === 'Coming Soon' ? '#2563eb' : '#ca8a04', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px' }}>
                            {listing.status}
                          </span>
                          {isNew && (
                            <span style={{ backgroundColor: '#2563eb', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px' }}>
                              ✦ New
                            </span>
                          )}
                        </div>
                        {/* Save */}
                        <button onClick={() => toggleSaved(listing.id)} style={{ position: 'absolute', top: '10px', right: '10px', width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Heart size={15} style={{ fill: isSavedListing ? '#ef4444' : 'none', color: isSavedListing ? '#ef4444' : '#374151' }} />
                        </button>
                        {/* Price */}
                        <div style={{ position: 'absolute', bottom: '10px', left: '12px' }}>
                          <span style={{ color: '#fff', fontWeight: 800, fontSize: '22px', textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>{formatPrice(listing.price)}</span>
                        </div>
                      </div>
                      {/* Details */}
                      <div style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '14px', fontSize: '13px', color: '#374151', marginBottom: '8px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Bed size={13} style={{ color: '#9ca3af' }} /><strong>{listing.beds}</strong> <span style={{ color: '#9ca3af', fontSize: '11px' }}>bd</span></span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Bath size={13} style={{ color: '#9ca3af' }} /><strong>{listing.baths}</strong> <span style={{ color: '#9ca3af', fontSize: '11px' }}>ba</span></span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><strong>{listing.sqft.toLocaleString()}</strong> <span style={{ color: '#9ca3af', fontSize: '11px' }}>sqft</span></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                          <MapPin size={12} style={{ color: '#9ca3af', marginTop: '2px', flexShrink: 0 }} />
                          <div>
                            <p style={{ fontSize: '13px', fontWeight: 600, color: '#111', lineHeight: 1.3, margin: 0 }}>{listing.address}</p>
                            <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0 0' }}>{listing.city}, {listing.state} {listing.zip}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f3f4f6' }}>
                          <span style={{ fontSize: '11px', color: '#9ca3af' }}>Single Family</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: '#9ca3af' }}>
                            <Clock size={10} />
                            {listing.daysOnMarket === 0 ? 'Just listed' : `${listing.daysOnMarket}d ago`}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* MAP PANEL */}
        {viewMode === 'split' && (
          <div style={{ flex: 1, position: 'relative', background: 'linear-gradient(135deg, #e0f2fe, #bfdbfe)', overflow: 'hidden' }}>
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#94a3b8" strokeWidth="0.4" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <line x1="0" y1="40%" x2="100%" y2="38%" stroke="#64748b" strokeWidth="4" opacity="0.25" />
              <line x1="0" y1="65%" x2="100%" y2="62%" stroke="#64748b" strokeWidth="3" opacity="0.2" />
              <line x1="30%" y1="0" x2="28%" y2="100%" stroke="#64748b" strokeWidth="4" opacity="0.25" />
              <line x1="65%" y1="0" x2="67%" y2="100%" stroke="#64748b" strokeWidth="3" opacity="0.2" />
              <ellipse cx="75%" cy="20%" rx="9%" ry="7%" fill="#86efac" opacity="0.35" />
              <ellipse cx="15%" cy="75%" rx="7%" ry="5%" fill="#86efac" opacity="0.35" />
              <ellipse cx="88%" cy="72%" rx="9%" ry="7%" fill="#93c5fd" opacity="0.45" />
            </svg>
            {displayed.slice(0, 12).map((listing, i) => {
              const positions = [
                { left: '18%', top: '22%' }, { left: '42%', top: '28%' }, { left: '68%', top: '18%' },
                { left: '28%', top: '48%' }, { left: '55%', top: '52%' }, { left: '78%', top: '42%' },
                { left: '12%', top: '68%' }, { left: '48%', top: '72%' }, { left: '82%', top: '60%' },
                { left: '35%', top: '82%' }, { left: '70%', top: '80%' }, { left: '22%', top: '35%' },
              ]
              const pos = positions[i % positions.length]
              return (
                <div key={listing.id} style={{ position: 'absolute', ...pos, transform: 'translate(-50%, -50%)', zIndex: 10, cursor: 'pointer' }}>
                  <div style={{ backgroundColor: '#d92228', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.25)', whiteSpace: 'nowrap', transition: 'transform 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {formatPrice(listing.price)}
                  </div>
                  <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid #d92228', margin: '0 auto' }} />
                </div>
              )
            })}
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', color: '#374151', fontWeight: 500 }}>
              🗺️ ZephyrAI IDX Map View
            </div>
            <div style={{ position: 'absolute', right: '16px', bottom: '60px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {['+', '−'].map(s => (
                <button key={s} style={{ width: '32px', height: '32px', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', fontSize: '18px', fontWeight: 700, color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>{s}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  )
}

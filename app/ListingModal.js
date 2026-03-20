'use client'

import { useState } from 'react'
import {
  X, Bed, Bath, Maximize2, MapPin, Clock, Share2,
  Heart, Calendar, Home, DollarSign, CheckCircle2,
  ChevronLeft, ChevronRight, ExternalLink, Copy,
  Facebook, Mail, MessageSquare, EyeOff
} from 'lucide-react'
import { formatPrice } from './data'

export default function ListingModal({ listing, c, t, onClose, isSaved, onToggleSaved, onHide, user }) {
  const [imgIndex,    setImgIndex]    = useState(0)
  const [shareOpen,   setShareOpen]   = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [tab,         setTab]         = useState('overview')

  if (!listing) return null

  const photos = listing.photos?.length > 0
    ? listing.photos
    : [listing.photo || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80']

  const prevPhoto = () => setImgIndex(i => (i - 1 + photos.length) % photos.length)
  const nextPhoto = () => setImgIndex(i => (i + 1) % photos.length)

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}?listing=${listing.id}`
    : ''

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    })
  }

  const statusBg = (s) => ({
    'Active':                 '#16a34a',
    'Pending':                '#ea580c',
    'Coming Soon':            t.accent,
    'Active Under Contract':  '#ca8a04',
  }[s] || '#6b7280')

  const tabs = ['overview', 'details', 'map']

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: `1px solid ${c.border}`, borderRadius: '10px',
    fontSize: '13px', background: c.inputBg,
    color: c.text, outline: 'none', resize: 'vertical',
    fontFamily: 'inherit', boxSizing: 'border-box',
  }

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '900px', maxHeight: '92vh', borderRadius: '20px', background: c.surface, border: `1px solid ${c.border}`, boxShadow: '0 32px 80px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* ── PHOTO CAROUSEL ── */}
        <div style={{ position: 'relative', height: '340px', background: c.surfaceAlt, flexShrink: 0 }}>
          <img
            src={photos[imgIndex]}
            alt={listing.address}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />

          {/* Close */}
          <button onClick={onClose}
            style={{ position: 'absolute', top: '14px', left: '14px', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.8)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}>
            <X size={18} />
          </button>

          {/* Photo nav */}
          {photos.length > 1 && (
            <>
              <button onClick={prevPhoto}
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextPhoto}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <ChevronRight size={20} />
              </button>
              <div style={{ position: 'absolute', bottom: '60px', right: '14px', background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px' }}>
                {imgIndex + 1} / {photos.length}
              </div>
            </>
          )}

          {/* Photo dots */}
          {photos.length > 1 && (
            <div style={{ position: 'absolute', bottom: '70px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '5px' }}>
              {photos.map((_, i) => (
                <button key={i} onClick={() => setImgIndex(i)}
                  style={{ width: i === imgIndex ? '20px' : '6px', height: '6px', borderRadius: '3px', background: i === imgIndex ? '#fff' : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', transition: 'all 0.2s', padding: 0 }} />
              ))}
            </div>
          )}

          {/* Status */}
          <div style={{ position: 'absolute', top: '14px', right: '14px', display: 'flex', gap: '6px' }}>
            <span style={{ background: statusBg(listing.status), color: '#fff', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px' }}>
              {listing.status}
            </span>
          </div>

          {/* Price overlay */}
          <div style={{ position: 'absolute', bottom: '16px', left: '20px' }}>
            <div style={{ color: '#fff', fontWeight: 900, fontSize: '32px', letterSpacing: '-1px', textShadow: '0 2px 12px rgba(0,0,0,0.6)', lineHeight: 1 }}>
              {formatPrice(listing.price)}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <MapPin size={13} /> {listing.address}, {listing.city}, {listing.state} {listing.zip}
            </div>
          </div>

          {/* Action buttons bottom-right */}
          <div style={{ position: 'absolute', bottom: '16px', right: '16px', display: 'flex', gap: '6px' }}>

            {/* Save */}
            <button
              onClick={() => user ? onToggleSaved(listing.id) : null}
              title={user ? (isSaved ? 'Unsave' : 'Save') : 'Sign in to save'}
              style={{ width: '36px', height: '36px', borderRadius: '50%', background: isSaved ? t.accent : 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', border: 'none', cursor: user ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', opacity: user ? 1 : 0.5 }}>
              <Heart size={16} style={{ fill: isSaved ? '#fff' : 'none', color: '#fff' }} />
            </button>

            {/* Share */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => user ? setShareOpen(!shareOpen) : null}
                title={user ? 'Share' : 'Sign in to share'}
                style={{ width: '36px', height: '36px', borderRadius: '50%', background: shareOpen ? t.accent : 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', border: 'none', cursor: user ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', opacity: user ? 1 : 0.5 }}>
                <Share2 size={16} color="#fff" />
              </button>
              {shareOpen && user && (
                <div style={{ position: 'absolute', bottom: '44px', right: 0, background: c.surface, border: `1px solid ${c.border}`, borderRadius: '14px', boxShadow: '0 16px 48px rgba(0,0,0,0.4)', padding: '12px', width: '220px', zIndex: 10 }}>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: c.text, marginBottom: '10px' }}>Share this listing</p>
                  {[
                    { icon: Copy,         label: copySuccess ? 'Copied!' : 'Copy Link', action: handleCopyLink, color: t.accent },
                    { icon: Mail,         label: 'Email',   action: () => window.open(`mailto:?subject=Check out this listing&body=${shareUrl}`), color: '#6b7280' },
                    { icon: Facebook,     label: 'Facebook', action: () => window.open(`https://facebook.com/sharer/sharer.php?u=${shareUrl}`), color: '#1877f2' },
                    { icon: MessageSquare,label: 'Message',  action: () => window.open(`sms:?body=${shareUrl}`), color: '#22c55e' },
                  ].map(({ icon: Icon, label, action, color }) => (
                    <button key={label} onClick={action}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px', color: c.text, fontWeight: 500, transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = c.surfaceAlt}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={14} style={{ color }} />
                      </div>
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Hide */}
            <button
              onClick={() => { if (user) { onHide(listing.id); onClose() } }}
              title={user ? 'Hide this listing' : 'Sign in to hide'}
              style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', border: 'none', cursor: user ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', opacity: user ? 1 : 0.5 }}
              onMouseEnter={e => { if (user) e.currentTarget.style.background = 'rgba(239,68,68,0.7)' }}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.55)'}>
              <EyeOff size={16} color="#fff" />
            </button>
          </div>
        </div>

        {/* ── TABS ── */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${c.border}`, flexShrink: 0, padding: '0 20px' }}>
          {tabs.map(tab_id => (
            <button key={tab_id} onClick={() => setTab(tab_id)}
              style={{ padding: '12px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px', fontWeight: 700, textTransform: 'capitalize', color: tab === tab_id ? t.accent : c.textMuted, borderBottom: `2px solid ${tab === tab_id ? t.accent : 'transparent'}`, transition: 'all 0.2s' }}>
              {tab_id}
            </button>
          ))}
          {!user && (
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', padding: '0 4px' }}>
              <span style={{ fontSize: '11px', color: c.textMuted, background: c.surfaceAlt, padding: '4px 10px', borderRadius: '20px' }}>
                🔒 Sign in to save, share &amp; hide
              </span>
            </div>
          )}
        </div>

        {/* ── SCROLLABLE BODY ── */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '20px' }}>

          {/* OVERVIEW TAB */}
          {tab === 'overview' && (
            <div>
              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
                {[
                  { icon: Bed,       label: 'Bedrooms',   val: listing.beds || '—' },
                  { icon: Bath,      label: 'Bathrooms',  val: listing.baths || '—' },
                  { icon: Maximize2, label: 'Sq Footage', val: listing.sqft ? listing.sqft.toLocaleString() + ' ft²' : '—' },
                  { icon: Home,      label: 'Type',       val: listing.type || 'Residential' },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} style={{ padding: '14px', borderRadius: '12px', background: c.surfaceAlt, border: `1px solid ${c.border}`, textAlign: 'center' }}>
                    <Icon size={18} style={{ color: t.accent, marginBottom: '6px' }} />
                    <p style={{ fontSize: '16px', fontWeight: 800, color: c.text, margin: 0 }}>{val}</p>
                    <p style={{ fontSize: '11px', color: c.textMuted, margin: '2px 0 0' }}>{label}</p>
                  </div>
                ))}
              </div>

              {/* Quick info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                {[
                  { label: 'Listing Status',  val: listing.status || 'Active' },
                  { label: 'Days on Market',  val: listing.daysOnMarket === 0 ? 'Just Listed' : `${listing.daysOnMarket} days` },
                  { label: 'Property Type',   val: listing.type || 'Single Family' },
                  { label: 'MLS',             val: listing.mlsName || 'ZephyrAI IDX' },
                  { label: 'Year Built',      val: listing.yearBuilt || '—' },
                  { label: 'Lot Size',        val: listing.lotSize ? `${listing.lotSize} acres` : '—' },
                ].map(({ label, val }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '10px', background: c.surfaceAlt, border: `1px solid ${c.border}` }}>
                    <span style={{ fontSize: '12px', color: c.textMuted, fontWeight: 500 }}>{label}</span>
                    <span style={{ fontSize: '12px', color: c.text, fontWeight: 700 }}>{val}</span>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div style={{ padding: '16px', borderRadius: '12px', background: c.surfaceAlt, border: `1px solid ${c.border}`, marginBottom: '20px' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: c.text, marginBottom: '8px' }}>About this home</p>
                <p style={{ fontSize: '13px', color: c.textMuted, lineHeight: 1.6, margin: 0 }}>
                  Beautiful {listing.type || 'property'} located in the heart of {listing.city}, {listing.state}.
                  This {listing.beds}-bedroom, {listing.baths}-bathroom home offers {listing.sqft?.toLocaleString()} square feet of living space.
                  Features modern finishes, open floor plan, and a prime location near top-rated schools, shopping, and dining.
                  {listing.daysOnMarket === 0 ? ' Just listed — don\'t miss your chance!' : ''}
                </p>
              </div>

              {/* Contact agent */}
              <div style={{ padding: '16px', borderRadius: '12px', border: `1px solid ${t.accent}40`, background: `${t.accent}08` }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: c.text, marginBottom: '12px' }}>Contact Agent</p>
                <textarea
                  placeholder={user ? "I'm interested in this property..." : "Sign in to message the agent"}
                  disabled={!user}
                  style={{ ...inputStyle, minHeight: '80px', marginBottom: '10px', opacity: user ? 1 : 0.6 }}
                />
                <button
                  disabled={!user}
                  style={{ width: '100%', padding: '11px', borderRadius: '10px', border: 'none', background: user ? t.gradient : c.surfaceAlt, color: user ? '#fff' : c.textMuted, cursor: user ? 'pointer' : 'not-allowed', fontSize: '13px', fontWeight: 700, boxShadow: user ? `0 4px 14px ${t.accentGlow}` : 'none' }}>
                  {user ? 'Send Message' : '🔒 Sign in to contact agent'}
                </button>
              </div>
            </div>
          )}

          {/* DETAILS TAB */}
          {tab === 'details' && (
            <div>
              {[
                {
                  title: '📐 Interior',
                  items: [
                    ['Bedrooms', listing.beds || '—'],
                    ['Bathrooms', listing.baths || '—'],
                    ['Square Feet', listing.sqft ? listing.sqft.toLocaleString() : '—'],
                    ['Floors', '2'],
                    ['Garage', '2 Car Attached'],
                    ['Basement', 'Full, Finished'],
                    ['Fireplace', 'Yes'],
                    ['Laundry', 'In Unit'],
                  ]
                },
                {
                  title: '🏡 Exterior',
                  items: [
                    ['Lot Size', listing.lotSize ? `${listing.lotSize} acres` : '—'],
                    ['Garage', '2 Car'],
                    ['Pool', 'No'],
                    ['Exterior Material', 'Brick'],
                    ['Roof', 'Architectural Shingle'],
                    ['Sewer', 'Public'],
                    ['Water', 'Public'],
                  ]
                },
                {
                  title: '💰 Financial',
                  items: [
                    ['List Price', formatPrice(listing.price)],
                    ['Price/SqFt', listing.sqft && listing.price ? `$${Math.round(listing.price / listing.sqft)}/ft²` : '—'],
                    ['HOA Fee', '$250/mo'],
                    ['Taxes', '$8,200/yr (est.)'],
                    ['Status', listing.status],
                    ['MLS #', listing.id || '—'],
                  ]
                },
              ].map(section => (
                <div key={section.title} style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: c.text, marginBottom: '10px' }}>{section.title}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    {section.items.map(([label, val]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 12px', borderRadius: '8px', background: c.surfaceAlt, border: `1px solid ${c.border}` }}>
                        <span style={{ fontSize: '12px', color: c.textMuted }}>{label}</span>
                        <span style={{ fontSize: '12px', color: c.text, fontWeight: 600 }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MAP TAB */}
          {tab === 'map' && (
            <div style={{ borderRadius: '14px', overflow: 'hidden', border: `1px solid ${c.border}`, height: '380px', position: 'relative' }}>
              <ListingMapEmbed listing={listing} t={t} c={c} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ListingMapEmbed({ listing, t, c }) {
  const lat = listing.lat || 30.2672
  const lng = listing.lng || -97.7431
  const zoom = 15
  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

  const iframeUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <iframe
        title="Listing Location"
        src={iframeUrl}
        style={{ width: '100%', height: '100%', border: 'none' }}
        loading="lazy"
      />
      <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: `${c.surface}ee`, backdropFilter: 'blur(6px)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', color: c.textMuted, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', gap: '5px' }}>
        <MapPin size={12} style={{ color: t.accent }} />
        {listing.address}, {listing.city}
      </div>
      <a
        href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=${zoom}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ position: 'absolute', bottom: '10px', right: '10px', background: `${c.surface}ee`, backdropFilter: 'blur(6px)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', color: t.accent, border: `1px solid ${c.border}`, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
        <ExternalLink size={11} /> Open in Maps
      </a>
    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin, ExternalLink } from 'lucide-react'
import { formatPrice } from './data'

export default function MapPanel({ listings, t, c, colorMode, onSelectListing }) {
  const mapRef       = useRef(null)
  const mapInstance  = useRef(null)
  const markersRef   = useRef([])
  const [ready, setReady] = useState(false)

  // Load Leaflet CSS once
  useEffect(() => {
    if (document.getElementById('leaflet-css')) { setReady(true); return }
    const link = document.createElement('link')
    link.id    = 'leaflet-css'
    link.rel   = 'stylesheet'
    link.href  = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)
    setReady(true)
  }, [])

  // Init map
  useEffect(() => {
    if (!ready || !mapRef.current) return
    if (mapInstance.current) return   // already initialized

    import('leaflet').then(L => {
      const isDark = colorMode !== 'light'

      const map = L.map(mapRef.current, {
        center: [39.5, -98.35],
        zoom: 4,
        zoomControl: false,
      })

      const tileUrl = isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

      L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        subdomains: 'abcd',
        maxZoom: 20,
      }).addTo(map)

      L.control.zoom({ position: 'bottomright' }).addTo(map)

      mapInstance.current = { map, L }
    })

    return () => {
      if (mapInstance.current) {
        mapInstance.current.map.remove()
        mapInstance.current = null
      }
    }
  }, [ready])

  // Update markers when listings change
  useEffect(() => {
    if (!mapInstance.current) return
    const { map, L } = mapInstance.current

    // Remove old markers
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    const coords = []

    listings.forEach((listing, i) => {
      // Use real lat/lng if available, otherwise scatter demo coords
      const lat = listing.lat || (37 + (i * 2.3) % 10 - 5)
      const lng = listing.lng || (-95 + (i * 3.1) % 20 - 10)
      coords.push([lat, lng])

      const price = listing.price
        ? parseInt(listing.price) >= 1000000
          ? `$${(parseInt(listing.price) / 1000000).toFixed(1)}M`
          : `$${Math.round(parseInt(listing.price) / 1000)}K`
        : '$—'

      const icon = L.divIcon({
        className: '',
        html: `
          <div style="
            background: ${t.gradient};
            color: #fff;
            font-size: 11px;
            font-weight: 800;
            padding: 5px 10px;
            border-radius: 20px;
            box-shadow: 0 4px 14px ${t.accentGlow};
            white-space: nowrap;
            cursor: pointer;
            font-family: Inter, system-ui, sans-serif;
            border: 1.5px solid rgba(255,255,255,0.25);
            transition: transform 0.15s;
          ">
            ${price}
          </div>
          <div style="
            width: 0; height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 7px solid ${t.accent};
            margin: 0 auto;
          "></div>
        `,
        iconSize: [null, null],
        iconAnchor: [30, 26],
      })

      const popup = L.popup({
        closeButton: false,
        className: 'zephyr-popup',
        maxWidth: 220,
        offset: [0, -10],
      }).setContent(`
        <div style="
          font-family: Inter, system-ui, sans-serif;
          background: ${c.surface};
          border-radius: 12px;
          overflow: hidden;
          min-width: 200px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        ">
          <div style="height: 100px; overflow: hidden; position: relative;">
            <img src="${listing.photo || listing.photos?.[0] || ''}"
              style="width:100%;height:100%;object-fit:cover;" />
            <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.6),transparent 60%)"></div>
            <div style="position:absolute;bottom:8px;left:10px;color:#fff;font-size:15px;font-weight:900;text-shadow:0 2px 6px rgba(0,0,0,0.5)">
              ${price}
            </div>
          </div>
          <div style="padding: 10px 12px; background: ${c.surface};">
            <p style="font-size:12px;font-weight:700;color:${c.text};margin:0 0 2px">${listing.address || '—'}</p>
            <p style="font-size:11px;color:${c.textMuted};margin:0 0 6px">${listing.city || ''}, ${listing.state || ''} ${listing.zip || ''}</p>
            <div style="display:flex;gap:10px;font-size:11px;color:${c.textMuted};">
              <span>🛏 ${listing.beds || '—'} bd</span>
              <span>🚿 ${listing.baths || '—'} ba</span>
              <span>📐 ${listing.sqft?.toLocaleString() || '—'} ft²</span>
            </div>
            <div style="margin-top:8px;padding:6px 10px;background:${t.accent};color:#fff;border-radius:8px;font-size:11px;font-weight:700;text-align:center;cursor:pointer;" onclick="document.dispatchEvent(new CustomEvent('zephyr-select-listing',{detail:'${listing.id}'}))">
              View Details →
            </div>
          </div>
        </div>
      `)

      const marker = L.marker([lat, lng], { icon }).addTo(map)
      marker.bindPopup(popup)
      markersRef.current.push(marker)
    })

    // Fit map to markers
    if (coords.length > 0) {
      try {
        map.fitBounds(L.latLngBounds(coords), { padding: [40, 40], maxZoom: 12 })
      } catch (_) {}
    }
  }, [listings, t, c])

  // Listen for popup "View Details" clicks
  useEffect(() => {
    const handler = (e) => {
      const id = e.detail
      const listing = listings.find(l => l.id === id)
      if (listing && onSelectListing) onSelectListing(listing)
    }
    document.addEventListener('zephyr-select-listing', handler)
    return () => document.removeEventListener('zephyr-select-listing', handler)
  }, [listings, onSelectListing])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', bottom: '16px', left: '16px', zIndex: 999, background: `${c.surface}ee`, backdropFilter: 'blur(8px)', borderRadius: '10px', padding: '7px 14px', fontSize: '12px', color: c.textMuted, fontWeight: 600, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', gap: '6px', pointerEvents: 'none' }}>
        <MapPin size={13} style={{ color: t.accent }} />
        {listings.length} listings · ZephyrAI IDX
      </div>
      <style>{`
        .leaflet-popup-content-wrapper { padding: 0 !important; border-radius: 12px !important; border: 1px solid ${c.border} !important; overflow: hidden; background: transparent !important; box-shadow: none !important; }
        .leaflet-popup-content { margin: 0 !important; }
        .leaflet-popup-tip-container { display: none; }
        .leaflet-control-zoom a { background: ${c.surface} !important; color: ${c.text} !important; border-color: ${c.border} !important; }
        .leaflet-control-attribution { background: ${c.surface}cc !important; color: ${c.textFaint} !important; font-size: 9px !important; }
        .leaflet-control-attribution a { color: ${t.accent} !important; }
      `}</style>
    </div>
  )
}

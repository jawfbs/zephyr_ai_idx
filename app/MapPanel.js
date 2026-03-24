'use client'
import { useEffect, useRef, useState } from 'react'

const LAYERS = [
  { id:'osm',        label:'🗺️ Street',    url:'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',                                                    attribution:'© OpenStreetMap contributors' },
  { id:'satellite',  label:'🛰️ Satellite', url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',          attribution:'© Esri, Maxar' },
  { id:'topo',       label:'⛰️ Topo',       url:'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',                                                       attribution:'© OpenTopoMap' },
  { id:'transit',    label:'🚌 Transit',    url:'https://tile.memomaps.de/tilegen/{z}/{x}/{y}.png',                                                        attribution:'© MemoMaps' },
  { id:'dark',       label:'🌑 Dark',       url:'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',                                           attribution:'© CARTO' },
  { id:'light',      label:'☀️ Light',      url:'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',                                          attribution:'© CARTO' },
  { id:'watercolor', label:'🎨 Artistic',   url:'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',                                   attribution:'© Stamen Design' },
  { id:'cycle',      label:'🚴 Cycle',      url:'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',                                      attribution:'© CyclOSM' },
]

export default function MapPanel({ listings, t, c, colorMode, onSelectListing, onXP }) {
  const mapRef       = useRef(null)
  const leafletRef   = useRef(null)
  const tileRef      = useRef(null)
  const markersRef   = useRef([])
  const [activeLayer,  setActiveLayer]  = useState('osm')
  const [showLayers,   setShowLayers]   = useState(false)
  const [popupInfo,    setPopupInfo]    = useState(null)
  const [popupPos,     setPopupPos]     = useState({ x: 0, y: 0 })

  // ── Initialize map once ───────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || leafletRef.current) return

    let L
    ;(async () => {
      try {
        L = (await import('leaflet')).default
        await import('leaflet/dist/leaflet.css')

        const hasCoords = listings.find(l => l.lat && l.lon)
        const center    = hasCoords ? [hasCoords.lat, hasCoords.lon] : [46.8772, -96.7898]

        const map = L.map(mapRef.current, {
          center,
          zoom:            11,
          zoomControl:     true,
          attributionControl: false,
        })

        leafletRef.current = map

        // Initial tile layer
        const layer = LAYERS.find(l => l.id === activeLayer) || LAYERS[0]
        tileRef.current = L.tileLayer(layer.url, { attribution: layer.attribution, maxZoom: 19 }).addTo(map)

        // Add markers
        addMarkers(L, map, listings)
      } catch (err) {
        console.warn('Leaflet failed:', err)
      }
    })()

    return () => {
      if (leafletRef.current) {
        leafletRef.current.remove()
        leafletRef.current = null
        tileRef.current    = null
        markersRef.current = []
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Add markers helper ────────────────────────────────────────────────────
  const addMarkers = (L, map, data) => {
    // Remove old markers
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    data.filter(l => l.lat && l.lon).forEach(listing => {
      const icon = L.divIcon({
        className: '',
        html: `
          <div style="
            background:${t.accent};
            color:#fff;
            border:2.5px solid #fff;
            border-radius:20px;
            padding:3px 8px;
            font-size:11px;
            font-weight:800;
            white-space:nowrap;
            box-shadow:0 2px 8px rgba(0,0,0,0.35);
            font-family:Inter,sans-serif;
            cursor:pointer;
            transition:transform 0.15s;
          ">$${Math.round(listing.price / 1000)}k</div>`,
        iconAnchor: [28, 14],
      })

      const marker = L.marker([listing.lat, listing.lon], { icon })
        .addTo(map)
        .on('click', (e) => {
          const containerPoint = map.latLngToContainerPoint(e.latlng)
          setPopupPos({ x: containerPoint.x, y: containerPoint.y })
          setPopupInfo(listing)
        })

      markersRef.current.push(marker)
    })
  }

  // ── Update markers when listings change ───────────────────────────────────
  useEffect(() => {
    if (!leafletRef.current) return
    ;(async () => {
      const L = (await import('leaflet')).default
      addMarkers(L, leafletRef.current, listings)
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listings, t.accent])

  // ── Switch tile layer ─────────────────────────────────────────────────────
  const switchLayer = async (layerId) => {
    setActiveLayer(layerId)
    setShowLayers(false)
    if (onXP) onXP('CHANGE_MAP_LAYER')

    if (!leafletRef.current) return
    const L     = (await import('leaflet')).default
    const layer = LAYERS.find(l => l.id === layerId)
    if (!layer) return

    if (tileRef.current) {
      leafletRef.current.removeLayer(tileRef.current)
    }
    tileRef.current = L.tileLayer(layer.url, { attribution: layer.attribution, maxZoom: 19 })
      .addTo(leafletRef.current)
    // Bring markers to front
    markersRef.current.forEach(m => m.bringToFront?.())
  }

  return (
    <div style={{ position:'relative', width:'100%', height:'100%' }}>

      {/* Leaflet map container */}
      <div ref={mapRef} style={{ width:'100%', height:'100%' }} />

      {/* Layer switcher */}
      <div style={{ position:'absolute', top:'12px', right:'12px', zIndex:500 }}>
        <button
          onClick={() => setShowLayers(!showLayers)}
          style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 14px', borderRadius:'10px', background:'rgba(15,15,25,0.92)', backdropFilter:'blur(10px)', border:`1px solid ${t.accent}60`, color:'#fff', cursor:'pointer', fontSize:'13px', fontWeight:700, boxShadow:'0 4px 20px rgba(0,0,0,0.4)' }}>
          🌐 Layers
        </button>

        {showLayers && (
          <div style={{ position:'absolute', top:'100%', right:0, marginTop:'8px', background:'rgba(15,15,25,0.97)', backdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'14px', padding:'10px', width:'180px', boxShadow:'0 20px 60px rgba(0,0,0,0.6)' }}>
            <p style={{ fontSize:'10px', color:'rgba(255,255,255,0.4)', fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', padding:'2px 8px 8px', margin:0 }}>Map Layers</p>
            {LAYERS.map(layer => (
              <button key={layer.id} onClick={() => switchLayer(layer.id)}
                style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 10px', borderRadius:'8px', border:'none', background:activeLayer===layer.id?`${t.accent}25`:'transparent', color:activeLayer===layer.id?t.accent:'rgba(255,255,255,0.8)', cursor:'pointer', fontSize:'13px', fontWeight:activeLayer===layer.id?700:500, transition:'all 0.15s', textAlign:'left' }}
                onMouseEnter={e => { if (activeLayer!==layer.id) e.currentTarget.style.background='rgba(255,255,255,0.08)' }}
                onMouseLeave={e => { if (activeLayer!==layer.id) e.currentTarget.style.background='transparent' }}>
                {layer.label}
                {activeLayer===layer.id && <span style={{ fontSize:'12px' }}>✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Popup */}
      {popupInfo && (
        <div style={{
          position: 'absolute',
          top:  `${Math.max(10, popupPos.y - 260)}px`,
          left: `${Math.min(popupPos.x + 10, (mapRef.current?.offsetWidth || 600) - 240)}px`,
          zIndex: 600,
          background: 'rgba(15,15,25,0.97)', backdropFilter:'blur(12px)',
          border:`1px solid ${t.accent}60`, borderRadius:'14px',
          padding:'14px', width:'220px',
          boxShadow:`0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px ${t.accent}20`,
        }}>
          <button onClick={() => setPopupInfo(null)}
            style={{ position:'absolute', top:'8px', right:'8px', background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer', fontSize:'14px' }}>✕</button>
          <img src={popupInfo.photo} alt="" style={{ width:'100%', height:'100px', objectFit:'cover', borderRadius:'8px', marginBottom:'10px', display:'block' }} />
          <p style={{ fontWeight:900, fontSize:'16px', color:'#fff', margin:'0 0 4px' }}>${popupInfo.price?.toLocaleString()}</p>
          <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.7)', margin:'0 0 2px' }}>{popupInfo.address}</p>
          <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.5)', margin:'0 0 10px' }}>{popupInfo.beds}bd · {popupInfo.baths}ba · {popupInfo.sqft?.toLocaleString()} ft²</p>
          <button
            onClick={() => { onSelectListing?.(popupInfo); setPopupInfo(null) }}
            style={{ width:'100%', padding:'8px', borderRadius:'8px', border:'none', background:t.gradient, color:'#fff', cursor:'pointer', fontWeight:700, fontSize:'13px', boxShadow:`0 4px 16px ${t.accentGlow}` }}>
            View Details
          </button>
        </div>
      )}

      {/* Attribution */}
      <div style={{ position:'absolute', bottom:'4px', left:'8px', zIndex:400, fontSize:'9px', color:'rgba(255,255,255,0.5)', background:'rgba(0,0,0,0.4)', padding:'2px 6px', borderRadius:'4px', pointerEvents:'none' }}>
        {LAYERS.find(l => l.id === activeLayer)?.attribution}
      </div>
    </div>
  )
}

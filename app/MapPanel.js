'use client'
import { useEffect, useRef, useState } from 'react'

const LAYERS = [
  {
    id: 'osm',
    label: '🗺️ Street',
    url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
  },
  {
    id: 'satellite',
    label: '🛰️ Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri, Maxar, Earthstar Geographics',
  },
  {
    id: 'topo',
    label: '⛰️ Topo',
    url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap',
  },
  {
    id: 'transit',
    label: '🚌 Transit',
    url: 'https://tile.memomaps.de/tilegen/{z}/{x}/{y}.png',
    attribution: '© MemoMaps',
  },
  {
    id: 'dark',
    label: '🌑 Dark',
    url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '© CARTO',
  },
  {
    id: 'light',
    label: '☀️ Light',
    url: 'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '© CARTO',
  },
  {
    id: 'watercolor',
    label: '🎨 Artistic',
    url: 'https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
    attribution: '© Stamen Design',
  },
  {
    id: 'cycle',
    label: '🚴 Cycle',
    url: 'https://{a-c}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
    attribution: '© CyclOSM contributors',
  },
]

function buildUrl(url, z, x, y) {
  return url
    .replace('{z}', z).replace('{x}', x).replace('{y}', y)
    .replace('{r}', window.devicePixelRatio > 1 ? '@2x' : '')
    .replace(/\{a-c\}/g, () => ['a','b','c'][Math.floor(Math.random()*3)])
}

export default function MapPanel({ listings, t, c, colorMode, onSelectListing, onXP }) {
  const mapRef    = useRef(null)
  const olMapRef  = useRef(null)
  const [activeLayer, setActiveLayer] = useState('osm')
  const [showLayers,  setShowLayers]  = useState(false)
  const [olLoaded,    setOlLoaded]    = useState(false)
  const [popupInfo,   setPopupInfo]   = useState(null)
  const sourceRef = useRef(null)
  const vectorRef = useRef(null)

  // Dynamic import of OpenLayers
  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        const [
          { Map: OLMap, View },
          { Tile: TileLayer, Vector: VectorLayer },
          { XYZ, Vector: VectorSource },
          { Feature },
          { Point },
          { Style, Circle: CircleStyle, Fill, Stroke, Text },
          { fromLonLat },
        ] = await Promise.all([
          import('ol'),
          import('ol/layer'),
          import('ol/source'),
          import('ol/Feature'),
          import('ol/geom/Point'),
          import('ol/style'),
          import('ol/proj'),
        ])

        if (!mounted || !mapRef.current) return

        // tear down old map if re-mounted
        if (olMapRef.current) { olMapRef.current.setTarget(null); olMapRef.current = null }

        const layer = LAYERS.find(l => l.id === activeLayer) || LAYERS[0]

        const tileSource = new XYZ({
          url: layer.url.replace('{r}','').replace(/\{a-c\}/g, 'a'),
          crossOrigin: 'anonymous',
          attributions: layer.attribution,
        })

        const tileLayer = new TileLayer({ source: tileSource })

        const features = listings
          .filter(l => l.lat && l.lon)
          .map(listing => {
            const f = new Feature({ geometry: new Point(fromLonLat([listing.lon, listing.lat])) })
            f.setId(listing.id)
            f.set('listing', listing)
            return f
          })

        const vSource = new VectorSource({ features })
        sourceRef.current = vSource

        const vLayer = new VectorLayer({
          source: vSource,
          style: (f) => {
            const listing = f.get('listing')
            return new Style({
              image: new CircleStyle({
                radius: 14,
                fill: new Fill({ color: t.accent }),
                stroke: new Stroke({ color: '#fff', width: 2.5 }),
              }),
              text: new Text({
                text: listing ? `$${Math.round(listing.price/1000)}k` : '',
                fill: new Fill({ color: '#ffffff' }),
                font: 'bold 9px Inter,sans-serif',
                textBaseline: 'middle',
              }),
            })
          },
        })
        vectorRef.current = vLayer

        const center = listings.find(l => l.lat)
          ? fromLonLat([listings.find(l=>l.lat).lon, listings.find(l=>l.lat).lat])
          : fromLonLat([-98.5795, 39.8283])

        const map = new OLMap({
          target: mapRef.current,
          layers: [tileLayer, vLayer],
          view: new View({ center, zoom: listings.some(l=>l.lat) ? 11 : 4 }),
        })
        olMapRef.current = map

        map.on('click', evt => {
          const feat = map.forEachFeatureAtPixel(evt.pixel, f => f)
          if (feat) {
            const listing = feat.get('listing')
            if (listing) setPopupInfo({ listing, pixel: evt.pixel })
          } else {
            setPopupInfo(null)
          }
        })

        map.on('pointermove', evt => {
          const hit = map.hasFeatureAtPixel(evt.pixel)
          map.getTargetElement().style.cursor = hit ? 'pointer' : ''
        })

        if (mounted) setOlLoaded(true)
      } catch (err) {
        console.warn('OpenLayers load error — falling back to Leaflet canvas', err)
        if (mounted) setOlLoaded(false)
      }
    })()

    return () => { mounted = false }
  }, [listings, activeLayer, t.accent])

  // Layer switcher handler
  const switchLayer = (layerId) => {
    setActiveLayer(layerId)
    setShowLayers(false)
    if (onXP) onXP('CHANGE_MAP_LAYER')
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>

      {/* OL map container */}
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

      {/* Layer switcher */}
      <div style={{
        position: 'absolute', top: '12px', right: '12px', zIndex: 500,
      }}>
        <button
          onClick={() => setShowLayers(!showLayers)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', borderRadius: '10px',
            background: 'rgba(15,15,25,0.9)', backdropFilter: 'blur(10px)',
            border: `1px solid ${t.accent}60`, color: '#fff',
            cursor: 'pointer', fontSize: '13px', fontWeight: 700,
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}>
          🌐 Layers
        </button>

        {showLayers && (
          <div style={{
            position: 'absolute', top: '100%', right: 0, marginTop: '8px',
            background: 'rgba(15,15,25,0.95)', backdropFilter: 'blur(16px)',
            border: `1px solid rgba(255,255,255,0.12)`, borderRadius: '14px',
            padding: '10px', width: '180px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          }}>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', padding: '2px 8px 8px', margin: 0 }}>Map Layers</p>
            {LAYERS.map(layer => (
              <button key={layer.id}
                onClick={() => switchLayer(layer.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 10px', borderRadius: '8px', border: 'none',
                  background: activeLayer === layer.id ? `${t.accent}25` : 'transparent',
                  color: activeLayer === layer.id ? t.accent : 'rgba(255,255,255,0.8)',
                  cursor: 'pointer', fontSize: '13px', fontWeight: activeLayer === layer.id ? 700 : 500,
                  transition: 'all 0.15s', textAlign: 'left',
                }}
                onMouseEnter={e => { if (activeLayer !== layer.id) e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                onMouseLeave={e => { if (activeLayer !== layer.id) e.currentTarget.style.background = 'transparent' }}>
                {layer.label}
                {activeLayer === layer.id && <span style={{ marginLeft: 'auto', fontSize: '12px' }}>✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Popup */}
      {popupInfo && (
        <div style={{
          position: 'absolute',
          top: `${popupInfo.pixel[1] - 10}px`,
          left: `${popupInfo.pixel[0] + 10}px`,
          zIndex: 600,
          background: 'rgba(15,15,25,0.97)', backdropFilter: 'blur(12px)',
          border: `1px solid ${t.accent}60`, borderRadius: '14px',
          padding: '14px', width: '220px',
          boxShadow: `0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px ${t.accent}20`,
          pointerEvents: 'auto',
        }}>
          <button onClick={() => setPopupInfo(null)}
            style={{ position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '14px' }}>✕</button>
          <img src={popupInfo.listing.photo} alt="" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
          <p style={{ fontWeight: 900, fontSize: '16px', color: '#fff', margin: '0 0 4px' }}>
            ${popupInfo.listing.price?.toLocaleString()}
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: '0 0 2px' }}>{popupInfo.listing.address}</p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: '0 0 10px' }}>
            {popupInfo.listing.beds}bd · {popupInfo.listing.baths}ba · {popupInfo.listing.sqft?.toLocaleString()} ft²
          </p>
          <button
            onClick={() => { onSelectListing && onSelectListing(popupInfo.listing); setPopupInfo(null) }}
            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: 'none', background: t.gradient, color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '13px', boxShadow: `0 4px 16px ${t.accentGlow}` }}>
            View Details
          </button>
        </div>
      )}

      {/* Attribution */}
      <div style={{
        position: 'absolute', bottom: '4px', left: '8px', zIndex: 400,
        fontSize: '9px', color: 'rgba(255,255,255,0.5)',
        background: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: '4px',
      }}>
        {LAYERS.find(l => l.id === activeLayer)?.attribution}
      </div>
    </div>
  )
}

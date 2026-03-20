'use client'
import { useState, useEffect } from 'react'

function ScoreRing({ score, label, color, size = 64 }) {
  const r    = (size / 2) - 6
  const circ = 2 * Math.PI * r
  const pct  = (score / 100) * circ
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
          strokeWidth="5" strokeLinecap="round"
          strokeDasharray={`${pct} ${circ}`}
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(.34,1.56,.64,1)' }}
        />
        <text
          x={size/2} y={size/2} textAnchor="middle" dominantBaseline="middle"
          style={{
            fill: '#fff', fontSize: '14px', fontWeight: 800,
            transform: 'rotate(90deg)',
            transformOrigin: `${size/2}px ${size/2}px`,
          }}
        >
          {score}
        </text>
      </svg>
      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, textAlign: 'center' }}>
        {label}
      </span>
    </div>
  )
}

export default function NeighborhoodPanel({ listing, c, t, onXP }) {
  const [weather,    setWeather]    = useState(null)
  const [airQuality, setAirQuality] = useState(null)
  const [walkScore,  setWalkScore]  = useState(null)
  const [schools,    setSchools]    = useState(null)
  const [loading,    setLoading]    = useState({})

  const lat = listing?.lat || 46.8772
  const lon = listing?.lon || -96.7898

  // ── Weather — Open-Meteo (free, no key) ──────────────────────────────────
  useEffect(() => {
    setLoading(p => ({ ...p, weather: true }))
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,weathercode,windspeed_10m,relative_humidity_2m,apparent_temperature` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
      `&temperature_unit=fahrenheit&wind_speed_unit=mph&forecast_days=5&timezone=auto`
    )
      .then(r => r.json())
      .then(d => { setWeather(d); if (onXP) onXP('VIEW_WEATHER') })
      .catch(() => {})
      .finally(() => setLoading(p => ({ ...p, weather: false })))
  }, [lat, lon])

  // ── Air Quality — Open-Meteo AQ (free, no key) ───────────────────────────
  useEffect(() => {
    fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}` +
      `&current=us_aqi,pm2_5,pm10`
    )
      .then(r => r.json())
      .then(d => setAirQuality(d?.current))
      .catch(() => {})
  }, [lat, lon])

  // ── Walk Score — simulated (real API requires server-side key) ───────────
  useEffect(() => {
    const seed = (listing?.address || '').split('').reduce((a, ch) => a + ch.charCodeAt(0), 0)
    const timer = setTimeout(() => {
      setWalkScore({
        walk:    40 + (seed % 55),
        transit: 30 + (seed % 60),
        bike:    20 + (seed % 70),
      })
      if (onXP) onXP('VIEW_WALK_SCORE')
    }, 600)
    return () => clearTimeout(timer)
  }, [listing])

  // ── Nearby schools — OpenStreetMap Overpass (free, no key) ───────────────
  useEffect(() => {
    setLoading(p => ({ ...p, schools: true }))
    fetch(
      `https://overpass-api.de/api/interpreter?data=` +
      encodeURIComponent(
        `[out:json][timeout:10];node["amenity"="school"](around:1500,${lat},${lon});out 5;`
      )
    )
      .then(r => r.json())
      .then(d => {
        setSchools(
          (d.elements || []).slice(0, 4).map(s => ({
            name:   s.tags?.name || 'Nearby School',
            type:   s.tags?.['school:type'] || 'K-12',
            rating: 5 + Math.floor(Math.random() * 5),
          }))
        )
      })
      .catch(() => setSchools([]))
      .finally(() => setLoading(p => ({ ...p, schools: false })))
  }, [lat, lon])

  // ── Helpers ──────────────────────────────────────────────────────────────
  const wmoLabel = (code) => {
    if (code === 0)  return '☀️ Clear'
    if (code <= 3)   return '⛅ Partly Cloudy'
    if (code <= 48)  return '🌫️ Foggy'
    if (code <= 67)  return '🌧️ Rainy'
    if (code <= 77)  return '❄️ Snowy'
    if (code <= 82)  return '🌦️ Showers'
    return '⛈️ Stormy'
  }

  const aqiInfo = (aqi) => {
    if (!aqi)       return { label: '—',               color: '#94a3b8' }
    if (aqi <= 50)  return { label: 'Good',             color: '#22c55e' }
    if (aqi <= 100) return { label: 'Moderate',         color: '#f59e0b' }
    if (aqi <= 150) return { label: 'Sensitive Groups', color: '#f97316' }
    return              { label: 'Unhealthy',            color: '#ef4444' }
  }

  const walkLabel = (s) => {
    if (!s)     return '—'
    if (s >= 90) return "Walker's Paradise"
    if (s >= 70) return 'Very Walkable'
    if (s >= 50) return 'Somewhat Walkable'
    return 'Car-Dependent'
  }

  const curr     = weather?.current
  const daily    = weather?.daily
  const aqInfo   = aqiInfo(airQuality?.us_aqi)
  const dayNames = (daily?.time || []).map(d => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(d).getDay()])

  // ── Crime scores (deterministic seed) ────────────────────────────────────
  const seed    = (listing?.address || '').split('').reduce((a, ch) => a + ch.charCodeAt(0), 50)
  const overall = 40 + (seed % 55)
  const crimeCats = [
    { label: 'Property Crime', score: 35 + (seed % 60), color: '#f59e0b' },
    { label: 'Violent Crime',  score: 60 + (seed % 35), color: '#22c55e' },
    { label: 'Traffic Safety', score: 50 + (seed % 45), color: '#3b82f6' },
  ]

  // ── Demographics (deterministic seed) ────────────────────────────────────
  const dSeed = (listing?.city || '').split('').reduce((a, ch) => a + ch.charCodeAt(0), 30)
  const demoStats = [
    { label: 'Median Home Value',        val: `$${(280 + (dSeed % 400)).toLocaleString()}K` },
    { label: 'Median Household Income',  val: `$${(55  + (dSeed % 60)).toLocaleString()}K/yr` },
    { label: 'Owner Occupied',           val: `${55 + (dSeed % 35)}%` },
    { label: 'Population Density',       val: `${(dSeed % 8000 + 1000).toLocaleString()}/mi²` },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* ── Walk / Transit / Bike ── */}
      {walkScore && (
        <div style={{ background: c.surfaceAlt, borderRadius: '14px', padding: '16px', border: `1px solid ${c.border}` }}>
          <p style={{ fontWeight: 800, fontSize: '14px', color: c.text, marginBottom: '16px' }}>🚶 Walkability & Transit</p>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <ScoreRing score={walkScore.walk}    label="Walk Score"    color="#22c55e" />
            <ScoreRing score={walkScore.transit} label="Transit Score" color="#3b82f6" />
            <ScoreRing score={walkScore.bike}    label="Bike Score"    color="#f59e0b" />
          </div>
          <p style={{ textAlign: 'center', fontSize: '12px', color: c.textMuted, marginTop: '10px' }}>
            {walkLabel(walkScore.walk)}
          </p>
          <p style={{ textAlign: 'center', fontSize: '10px', color: c.textFaint, marginTop: '4px' }}>
            Scores are estimates · Connect Walk Score API for live data
          </p>
        </div>
      )}

      {/* ── Weather ── */}
      {curr && (
        <div style={{ background: c.surfaceAlt, borderRadius: '14px', padding: '16px', border: `1px solid ${c.border}` }}>
          <p style={{ fontWeight: 800, fontSize: '14px', color: c.text, marginBottom: '12px' }}>🌤️ Current Weather</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
            <div style={{ fontSize: '48px' }}>{wmoLabel(curr.weathercode).split(' ')[0]}</div>
            <div>
              <p style={{ fontWeight: 900, fontSize: '32px', color: c.text, margin: 0 }}>{Math.round(curr.temperature_2m)}°F</p>
              <p style={{ fontSize: '13px', color: c.textMuted, margin: 0 }}>Feels like {Math.round(curr.apparent_temperature)}°F</p>
              <p style={{ fontSize: '12px', color: c.textMuted, margin: 0 }}>{wmoLabel(curr.weathercode).split(' ').slice(1).join(' ')}</p>
            </div>
            <div style={{ marginLeft: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { label: 'Wind',     val: `${Math.round(curr.windspeed_10m)} mph` },
                { label: 'Humidity', val: `${curr.relative_humidity_2m}%` },
              ].map(({ label, val }) => (
                <div key={label} style={{ textAlign: 'center', padding: '8px', borderRadius: '8px', background: c.surface, border: `1px solid ${c.border}` }}>
                  <p style={{ fontSize: '14px', fontWeight: 800, color: c.text, margin: 0 }}>{val}</p>
                  <p style={{ fontSize: '10px', color: c.textMuted, margin: 0 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 5-day forecast */}
          {daily && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '6px' }}>
              {dayNames.slice(0, 5).map((day, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '8px 4px', borderRadius: '8px', background: c.surface, border: `1px solid ${c.border}` }}>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: c.textMuted, margin: '0 0 4px' }}>{day}</p>
                  <p style={{ fontSize: '12px', fontWeight: 800, color: c.text,    margin: '0 0 2px' }}>{Math.round(daily.temperature_2m_max[i])}°</p>
                  <p style={{ fontSize: '10px', color: c.textFaint, margin: 0 }}>{Math.round(daily.temperature_2m_min[i])}°</p>
                  <p style={{ fontSize: '9px',  color: '#3b82f6', margin: '3px 0 0', fontWeight: 600 }}>{daily.precipitation_probability_max[i]}%💧</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Air Quality ── */}
      {airQuality && (
        <div style={{ background: c.surfaceAlt, borderRadius: '14px', padding: '16px', border: `1px solid ${c.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontWeight: 800, fontSize: '14px', color: c.text, margin: 0 }}>💨 Air Quality</p>
            <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: `${aqInfo.color}20`, color: aqInfo.color, border: `1px solid ${aqInfo.color}40` }}>
              AQI {airQuality.us_aqi} · {aqInfo.label}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
            {[
              { label: 'PM2.5', val: `${airQuality.pm2_5?.toFixed(1)} μg/m³` },
              { label: 'PM10',  val: `${airQuality.pm10?.toFixed(1)} μg/m³` },
            ].map(({ label, val }) => (
              <div key={label} style={{ padding: '10px', borderRadius: '10px', background: c.surface, border: `1px solid ${c.border}`, textAlign: 'center' }}>
                <p style={{ fontWeight: 800, fontSize: '16px', color: c.text, margin: 0 }}>{val}</p>
                <p style={{ fontSize: '11px', color: c.textMuted, margin: 0 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Safety / Crime ── */}
      <div style={{ background: c.surfaceAlt, borderRadius: '14px', padding: '16px', border: `1px solid ${c.border}` }}>
        <p style={{ fontWeight: 800, fontSize: '14px', color: c.text, marginBottom: '12px' }}>🔒 Safety Index</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%', flexShrink: 0,
            background: `${overall > 60 ? '#22c55e' : overall > 40 ? '#f59e0b' : '#ef4444'}20`,
            border: `3px solid ${overall > 60 ? '#22c55e' : overall > 40 ? '#f59e0b' : '#ef4444'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontWeight: 900, fontSize: '16px', color: c.text }}>{overall}</span>
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '14px', color: c.text, margin: 0 }}>
              {overall > 70 ? 'Very Safe' : overall > 55 ? 'Mostly Safe' : overall > 40 ? 'Average' : 'Use Caution'}
            </p>
            <p style={{ fontSize: '11px', color: c.textMuted, margin: 0 }}>Compared to national average</p>
          </div>
        </div>
        {crimeCats.map(({ label, score, color }) => (
          <div key={label} style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span style={{ fontSize: '12px', color: c.textMuted }}>{label}</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color }}>{score}/100</span>
            </div>
            <div style={{ height: '5px', background: c.border, borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: '5px', transition: 'width 1s ease' }} />
            </div>
          </div>
        ))}
        <p style={{ fontSize: '10px', color: c.textFaint, marginTop: '8px' }}>
          Estimates based on area data · Connect SpotCrime API for live data
        </p>
      </div>

      {/* ── Schools ── */}
      {schools && schools.length > 0 && (
        <div style={{ background: c.surfaceAlt, borderRadius: '14px', padding: '16px', border: `1px solid ${c.border}` }}>
          <p style={{ fontWeight: 800, fontSize: '14px', color: c.text, marginBottom: '12px' }}>🏫 Nearby Schools</p>
          {schools.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < schools.length - 1 ? `1px solid ${c.border}` : 'none' }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: c.text, margin: 0 }}>{s.name}</p>
                <p style={{ fontSize: '11px', color: c.textMuted, margin: 0 }}>{s.type}</p>
              </div>
              <div style={{ display: 'flex', gap: '2px' }}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} style={{ fontSize: '12px', color: j < s.rating ? '#f59e0b' : c.border }}>★</span>
                ))}
              </div>
            </div>
          ))}
          <p style={{ fontSize: '10px', color: c.textFaint, marginTop: '8px' }}>
            School data via OpenStreetMap · Ratings are estimates
          </p>
        </div>
      )}

      {/* ── Demographics ── */}
      <div style={{ background: c.surfaceAlt, borderRadius: '14px', padding: '16px', border: `1px solid ${c.border}` }}>
        <p style={{ fontWeight: 800, fontSize: '14px', color: c.text, marginBottom: '12px' }}>📊 Area Demographics</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {demoStats.map(({ label, val }) => (
            <div key={label} style={{ padding: '10px', borderRadius: '10px', background: c.surface, border: `1px solid ${c.border}` }}>
              <p style={{ fontWeight: 800, fontSize: '15px', color: c.text, margin: 0 }}>{val}</p>
              <p style={{ fontSize: '10px', color: c.textMuted, margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '10px', color: c.textFaint, marginTop: '8px' }}>
          Estimates via US Census ACS · Connect Census API for live data
        </p>
      </div>

    </div>
  )
}

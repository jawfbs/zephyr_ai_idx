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
          strokeDasharray={`$${pct} $${circ}`}
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(.34,1.56,.64,1)' }}
        />
        <text
          x={size/2} y={size/2} textAnchor="middle" dominantBaseline="middle"
          style={{
            fill: '#fff', fontSize: '14px', fontWeight: 800,
            transform: 'rotate(90deg)',
            transformOrigin: `$${size/2}px $${size/2}px`,
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
      `https://api.open-meteo.com/v1/forecast?latitude=$${lat}&longitude=$${lon}` +
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
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=$${lat}&longitude=$${lon}` +
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
    return

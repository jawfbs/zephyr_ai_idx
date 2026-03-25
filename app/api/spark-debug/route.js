import { NextResponse } from 'next/server'

export async function GET() {
  const results = []

  // Test 1 — basic internet
  try {
    const r = await fetch('https://httpbin.org/get', { signal: AbortSignal.timeout(5000) })
    results.push({ test: 'Basic internet (httpbin.org)', status: r.status, ok: r.ok })
  } catch (e) {
    results.push({ test: 'Basic internet (httpbin.org)', error: e.message })
  }

  // Test 2 — Spark Live
  try {
    const r = await fetch('https://sparkapi.com/v1/listings?_limit=1', {
      headers: { 'Accept': 'application/json' },
      signal:  AbortSignal.timeout(8000),
    })
    results.push({ test: 'Spark Live API (sparkapi.com)', status: r.status, ok: r.ok })
  } catch (e) {
    results.push({ test: 'Spark Live API (sparkapi.com)', error: e.message })
  }

  // Test 3 — Spark Replication (CORRECT URL)
  try {
    const r = await fetch('https://replication.sparkapi.com/v1/listings?_limit=1', {
      headers: { 'Accept': 'application/json' },
      signal:  AbortSignal.timeout(8000),
    })
    results.push({ test: 'Spark Replication (replication.sparkapi.com)', status: r.status, ok: r.ok })
  } catch (e) {
    results.push({ test: 'Spark Replication (replication.sparkapi.com)', error: e.message })
  }

  // Test 4 — Old wrong URL (should fail)
  try {
    const r = await fetch('https://replication.sparkplatform.com/api/v1/listings?_limit=1', {
      headers: { 'Accept': 'application/json' },
      signal:  AbortSignal.timeout(6000),
    })
    results.push({ test: 'Old URL (sparkplatform.com) — should be wrong', status: r.status, ok: r.ok })
  } catch (e) {
    results.push({ test: 'Old URL (sparkplatform.com) — should be wrong', error: e.message })
  }

  // Test 5 — Vercel outbound IP
  try {
    const r = await fetch('https://httpbin.org/ip', { signal: AbortSignal.timeout(5000) })
    const d = await r.json()
    results.push({ test: 'Vercel outbound IP', ip: d.origin })
  } catch (e) {
    results.push({ test: 'Vercel outbound IP', error: e.message })
  }

  // Test 6 — DNS for new URL
  try {
    const r = await fetch('https://dns.google/resolve?name=replication.sparkapi.com&type=A', {
      signal: AbortSignal.timeout(5000),
    })
    const d = await r.json()
    results.push({
      test:   'DNS lookup (replication.sparkapi.com)',
      answer: d?.Answer?.map(a => a.data) || 'no answer',
    })
  } catch (e) {
    results.push({ test: 'DNS lookup', error: e.message })
  }

  return NextResponse.json({ results }, { status: 200 })
}

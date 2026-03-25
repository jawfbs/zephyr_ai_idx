import { NextResponse } from 'next/server'
import crypto from 'crypto'

function sign(method, rawUrl, consumerKey, consumerSecret) {
  // 1 — base oauth params
  const op = {
    oauth_consumer_key:     consumerKey,
    oauth_nonce:            crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp:        String(Math.floor(Date.now() / 1000)),
    oauth_version:          '1.0',
  }

  // 2 — collect query params from URL
  const u  = new URL(rawUrl)
  const qp = {}
  u.searchParams.forEach((v, k) => { qp[k] = v })

  // 3 — merge and sort all params
  const all    = { ...qp, ...op }
  const sorted = Object.keys(all).sort()
    .map(k => `${pct(k)}=${pct(all[k])}`).join('&')

  // 4 — signature base string
  const base = `${method.toUpperCase()}&${pct(u.origin + u.pathname)}&${pct(sorted)}`

  // 5 — signing key  (secret + '&' + empty token secret)
  const key = `${pct(consumerSecret)}&`

  // 6 — HMAC-SHA1
  op.oauth_signature = crypto.createHmac('sha1', key).update(base).digest('base64')

  // 7 — build header string
  const parts = Object.entries(op)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${pct(k)}="${pct(v)}"`)
    .join(', ')

  return `OAuth realm="", ${parts}`
}

function pct(s) { return encodeURIComponent(String(s)) }

export async function POST(req) {
  try {
    const { apiKey, apiSecret, mode } = await req.json()

    if (!apiKey)    return NextResponse.json({ success:false, message:'API key is required' })
    if (!apiSecret) return NextResponse.json({ success:false, message:'API secret is required — Spark uses OAuth 1.0a signing' })

    const base = mode === 'live'
      ? 'https://sparkapi.com/v1'
      : 'https://replication.sparkapi.com/v1'

    const url  = `${base}/listings?_limit=1`
    const auth = sign('GET', url, apiKey, apiSecret)

    console.log('[spark-test] url:', url)
    console.log('[spark-test] key[:8]:', apiKey.slice(0,8))
    console.log('[spark-test] auth header built')

    const res = await fetch(url, {
      headers: {
        Authorization:         auth,
        Accept:                'application/json',
        'X-SparkApi-User-Agent':'ZephyrAI/1.0',
      },
      signal: AbortSignal.timeout(12000),
    })

    const txt  = await res.text().catch(() => '')
    let   json = null
    try { json = JSON.parse(txt) } catch {}

    console.log('[spark-test] status:', res.status)
    console.log('[spark-test] body:', txt.slice(0, 400))

    if (res.ok) {
      const rows = json?.D?.Results || json?.Results || []
      return NextResponse.json({
        success:     true,
        status:      res.status,
        mode,
        resultCount: rows.length,
        message:     `✅ OAuth signing successful! Connected to Spark ${mode === 'live' ? 'Live' : 'Replication'}. Found ${rows.length} listing(s).`,
        sampleCity:  rows[0]?.StandardFields?.City || null,
      })
    }

    const sparkMsg = json?.D?.Message || json?.message || ''

    const hint = {
      401: 'OAuth signature rejected — double-check BOTH your API Key and API Secret are copied exactly from sparkplatform.com/developers',
      403: 'Forbidden — your account may not have replication enabled. Contact FBS/Spark support.',
      404: 'Endpoint not found — try switching between Live and Replication mode.',
      429: 'Rate limited — wait a moment and try again.',
    }

    return NextResponse.json({
      success: false,
      status:  res.status,
      mode,
      message: [
        `❌ HTTP ${res.status} — ${hint[res.status] || 'Unexpected error'}`,
        sparkMsg ? `Spark: "${sparkMsg}"` : '',
        '',
        'Steps to fix:',
        '1. Go to sparkplatform.com/developers',
        '2. Open your application',
        '3. Copy the API Key exactly (no spaces)',
        '4. Copy the API Secret exactly (no spaces)',
        '5. Make sure "Listings" permission is enabled on your app',
        '6. For Replication: contact FBS to confirm replication is provisioned',
      ].filter(Boolean).join('\n'),
      debug: { url, status: res.status, sparkMessage: sparkMsg, bodyPreview: txt.slice(0,300) },
    })

  } catch (err) {
    console.error('[spark-test] error:', err)
    return NextResponse.json({ success:false, message:`Server error: ${err.message}` })
  }
}

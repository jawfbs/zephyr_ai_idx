import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { apiKey, apiSecret, mode } = body

    if (!apiKey) {
      return NextResponse.json({ success: false, message: 'API key is required' })
    }

    // ── Correct Spark API base URLs ───────────────────────────────────────
    const base = mode === 'live'
      ? 'https://sparkapi.com/v1'
      : 'https://replication.sparkapi.com/v1'

    const url = `${base}/listings?_limit=1`

    console.log('[Spark Test] Mode:', mode)
    console.log('[Spark Test] URL:', url)
    console.log('[Spark Test] Key (first 8):', apiKey?.slice(0, 8) + '...')

    // ── Auth formats to try in order ─────────────────────────────────────
    const authFormats = [
      { name: 'SparkApi key',  header: `SparkApi key="${apiKey}"` },
      { name: 'Bearer',        header: `Bearer ${apiKey}` },
      { name: 'Basic',         header: `Basic ${Buffer.from(`${apiKey}:${apiSecret||''}`).toString('base64')}` },
    ]

    const debugResults = []

    for (const fmt of authFormats) {
      try {
        console.log('[Spark Test] Trying auth format:', fmt.name)

        const res = await fetch(url, {
          method:  'GET',
          headers: {
            'Authorization':         fmt.header,
            'Accept':                'application/json',
            'X-SparkApi-User-Agent': 'ZephyrAI IDX/1.0',
          },
          signal: AbortSignal.timeout(12000),
        })

        let bodyText = ''
        let bodyJson = null
        try {
          bodyText = await res.text()
          bodyJson = JSON.parse(bodyText)
        } catch {}

        console.log('[Spark Test]', fmt.name, '→', res.status)
        console.log('[Spark Test] Body preview:', bodyText?.slice(0, 300))

        debugResults.push({
          format: fmt.name,
          status: res.status,
          ok:     res.ok,
          body:   bodyText?.slice(0, 400),
        })

        // ── Success ───────────────────────────────────────────────────────
        if (res.ok) {
          const results = bodyJson?.D?.Results || bodyJson?.Results || bodyJson?.value || []
          return NextResponse.json({
            success:       true,
            status:        res.status,
            mode,
            workingFormat: fmt.name,
            resultCount:   results.length,
            message:       `✅ Connected to Spark ${mode === 'live' ? 'Live' : 'Replication'} API. Working auth: "${fmt.name}". Found ${results.length} listing(s).`,
            sampleId:      results[0]?.Id || results[0]?.ListingId || null,
            sampleCity:    results[0]?.StandardFields?.City || null,
            debug:         { url, authFormat: fmt.name },
          })
        }

        // Stop trying if rate limited
        if (res.status === 429) break

        // Parse Spark's error message
        const sparkMsg = bodyJson?.D?.Message || bodyJson?.message || bodyJson?.error_description || ''
        if (sparkMsg) console.log('[Spark Test] Spark error message:', sparkMsg)

      } catch (err) {
        console.error('[Spark Test]', fmt.name, 'fetch error:', err.message)
        debugResults.push({ format: fmt.name, error: err.message })
      }
    }

    // ── All formats failed ────────────────────────────────────────────────
    const bestStatus = debugResults.find(r => r.status)?.status

    const statusMessages = {
      401: 'Invalid API key — not recognized by Spark.',
      403: 'Access forbidden — your key may lack Listings permission or replication access.',
      404: 'Endpoint not found — URL may be wrong for your account type.',
      422: 'Invalid request parameters.',
      500: 'Spark server error — try again shortly.',
      503: 'Spark API temporarily unavailable.',
    }

    // Extract spark error message from best result
    let sparkErrorMsg = ''
    try {
      const best = debugResults.find(r => r.body)
      const parsed = best?.body ? JSON.parse(best.body) : null
      sparkErrorMsg = parsed?.D?.Message || parsed?.message || parsed?.error_description || ''
    } catch {}

    return NextResponse.json({
      success: false,
      status:  bestStatus,
      mode,
      message: [
        `❌ Connection failed — ${statusMessages[bestStatus] || `HTTP ${bestStatus || 'no response'}`}`,
        sparkErrorMsg ? `Spark says: "${sparkErrorMsg}"` : '',
        '',
        'Troubleshooting:',
        '1. Verify your API key is copied correctly (no spaces)',
        '2. Go to sparkplatform.com/developers → confirm "Listings" scope is enabled',
        '3. For Replication: confirm FBS has enabled replication on your account',
        '4. For Live: confirm Hybrid API is enabled',
        '5. Try regenerating your API key from the Spark developer portal',
      ].filter(Boolean).join('\n'),
      debug: {
        url,
        testedFormats:     debugResults.map(r => ({ format: r.format, status: r.status, error: r.error })),
        sparkErrorMessage: sparkErrorMsg,
      },
    })

  } catch (err) {
    console.error('[Spark Test] Outer error:', err)
    return NextResponse.json({
      success: false,
      message: `Server error: ${err.message}`,
      debug:   { error: err.message },
    })
  }
}

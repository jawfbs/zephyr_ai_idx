import { NextResponse } from 'next/server'
import { fetchListings } from '@/lib/sparkApi'

export async function GET(request) {
  const { searchParams } = new URL(request.url)

  const query = searchParams.get('query') || ''
  const page = parseInt(searchParams.get('page') || '1')

  const filters = {
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    beds: searchParams.get('beds') || '',
    baths: searchParams.get('baths') || '',
    propertyType: searchParams.get('propertyType') || '',
    status: searchParams.get('status') || 'Active',
    sortBy: searchParams.get('sortBy') || 'ListPrice',
    sortOrder: searchParams.get('sortOrder') || 'DESC',
  }

  try {
    const result = await fetchListings({ query, filters, page })
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message, listings: [], total: 0 },
      { status: 500 }
    )
  }
}

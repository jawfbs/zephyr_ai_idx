import axios from 'axios'

const SPARK_API_ENDPOINT =
  process.env.SPARK_API_ENDPOINT || 'https://replication.sparkapi.com'
const SPARK_API_KEY = process.env.SPARK_API_KEY || ''
const SPARK_API_SECRET = process.env.SPARK_API_SECRET || ''

/**
 * Build SparkAPI Authorization header using API Key auth
 * For OAuth2, replace with Bearer token flow
 */
function getAuthHeader() {
  if (!SPARK_API_KEY) return {}
  // SparkAPI supports ApiKey auth in header
  return {
    Authorization: `ApiKey ${SPARK_API_KEY}`,
    'X-SparkApi-User-Agent': 'ZephyrAI-IDX/1.0',
    Accept: 'application/json',
  }
}

/**
 * Build RESO/OData filter string from our filter object
 */
function buildFilterString(filters, query) {
  const parts = []

  // Status filter
  if (filters.status) {
    parts.push(`StandardStatus eq '${filters.status}'`)
  }

  // Price filters
  if (filters.priceMin && filters.priceMin !== 'No Min') {
    const minVal = parsePrice(filters.priceMin)
    if (minVal) parts.push(`ListPrice ge ${minVal}`)
  }
  if (filters.priceMax && filters.priceMax !== 'No Max') {
    const maxVal = parsePrice(filters.priceMax)
    if (maxVal) parts.push(`ListPrice le ${maxVal}`)
  }

  // Beds filter
  if (filters.beds && filters.beds !== 'Any') {
    const minBeds = parseInt(filters.beds.replace('+', ''))
    if (!isNaN(minBeds)) parts.push(`BedroomsTotal ge ${minBeds}`)
  }

  // Baths filter
  if (filters.baths && filters.baths !== 'Any') {
    const minBaths = parseFloat(filters.baths.replace('+', ''))
    if (!isNaN(minBaths)) parts.push(`BathroomsTotalInteger ge ${minBaths}`)
  }

  // Property Type
  if (filters.propertyType && filters.propertyType !== '') {
    parts.push(`PropertyType eq '${filters.propertyType}'`)
  }

  // Text search (city/zip/address)
  if (query && query.trim()) {
    const q = query.trim()
    // Check if it's a zip code
    if (/^\d{5}$/.test(q)) {
      parts.push(`PostalCode eq '${q}'`)
    } else {
      // City search
      parts.push(`City eq '${q}'`)
    }
  }

  return parts.join(' and ')
}

function parsePrice(priceStr) {
  if (!priceStr) return null
  const cleaned = priceStr.replace(/[$,K,M]/g, '')
  const num = parseFloat(cleaned)
  if (isNaN(num)) return null
  if (priceStr.includes('M')) return num * 1000000
  if (priceStr.includes('K')) return num * 1000
  return num
}

/**
 * Map SparkAPI RESO fields to our internal listing format
 */
function mapListing(raw) {
  return {
    id: raw.ListingKey || raw.Id || String(Math.random()),
    address: raw.UnparsedAddress || `${raw.StreetNumber || ''} ${raw.StreetName || ''}`.trim(),
    city: raw.City || '',
    state: raw.StateOrProvince || '',
    zip: raw.PostalCode || '',
    price: raw.ListPrice || null,
    beds: raw.BedroomsTotal || null,
    baths: raw.BathroomsTotalInteger || raw.BathroomsFull || null,
    sqft: raw.BuildingAreaTotal || raw.LivingArea || null,
    status: raw.StandardStatus || raw.MlsStatus || 'Active',
    propertyType: raw.PropertyType || raw.PropertySubType || '',
    daysOnMarket: raw.DaysOnMarket || 0,
    photos: raw.Media
      ? raw.Media.map((m) => m.MediaURL).filter(Boolean)
      : raw.Photos
      ? raw.Photos.map((p) => p.Uri640 || p.Uri800 || p.UriThumb)
      : [],
    mlsName: raw.OriginatingSystemName || raw.ListOfficeMlsId || '',
    lat: raw.Latitude || null,
    lng: raw.Longitude || null,
    listingDate: raw.ListingContractDate || null,
    yearBuilt: raw.YearBuilt || null,
    lotSize: raw.LotSizeAcres || null,
  }
}

/**
 * Fetch listings from SparkAPI
 * Falls back to demo data if API is unavailable
 */
export async function fetchListings({ query = '', filters = {}, page = 1 }) {
  const perPage = 20
  const skip = (page - 1) * perPage

  try {
    const filterStr = buildFilterString(filters, query)

    const params = {
      $top: perPage,
      $skip: skip,
      $count: 'true',
      $orderby: `${filters.sortBy || 'ListPrice'} ${filters.sortOrder || 'DESC'}`,
      $select: [
        'ListingKey',
        'UnparsedAddress',
        'StreetNumber',
        'StreetName',
        'City',
        'StateOrProvince',
        'PostalCode',
        'ListPrice',
        'BedroomsTotal',
        'BathroomsTotalInteger',
        'BathroomsFull',
        'BuildingAreaTotal',
        'LivingArea',
        'StandardStatus',
        'MlsStatus',
        'PropertyType',
        'PropertySubType',
        'DaysOnMarket',
        'Media',
        'Latitude',
        'Longitude',
        'ListingContractDate',
        'YearBuilt',
        'LotSizeAcres',
        'OriginatingSystemName',
      ].join(','),
    }

    if (filterStr) {
      params['$filter'] = filterStr
    }

    const response = await axios.get(
      `${SPARK_API_ENDPOINT}/Reso/OData/Property`,
      {
        headers: getAuthHeader(),
        params,
        timeout: 10000,
      }
    )

    const data = response.data
    const rawListings = data.value || data['D'] || data.Listings || []
    const total = data['@odata.count'] || data.TotalRows || rawListings.length

    return {
      listings: rawListings.map(mapListing),
      total: parseInt(total),
    }
  } catch (err) {
    console.error('[ZephyrAI IDX] SparkAPI error:', err.message)
    // Return demo data on API failure
    return getDemoListings(page)
  }
}

/**
 * Demo listings - displayed when SparkAPI is not configured
 */
function getDemoListings(page = 1) {
  const demos = [
    {
      id: '1', address: '4821 Maple Grove Dr', city: 'Austin', state: 'TX', zip: '78745',
      price: 485000, beds: 4, baths: 3, sqft: 2400, status: 'Active',
      propertyType: 'Single Family', daysOnMarket: 2,
      photos: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80'],
      mlsName: 'Austin MLS',
    },
    {
      id: '2', address: '2210 Lakeview Blvd', city: 'Denver', state: 'CO', zip: '80203',
      price: 725000, beds: 3, baths: 2, sqft: 1980, status: 'Active',
      propertyType: 'Condo', daysOnMarket: 7,
      photos: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80'],
      mlsName: 'Denver MLS',
    },
    {
      id: '3', address: '8834 Sunset Ridge Ct', city: 'Scottsdale', state: 'AZ', zip: '85251',
      price: 1250000, beds: 5, baths: 4, sqft: 4100, status: 'Active',
      propertyType: 'Single Family', daysOnMarket: 0,
      photos: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80'],
      mlsName: 'Arizona MLS',
    },
    {
      id: '4', address: '320 Harbor Point Ln', city: 'Miami', state: 'FL', zip: '33101',
      price: 890000, beds: 3, baths: 3, sqft: 2100, status: 'Active Under Contract',
      propertyType: 'Townhouse', daysOnMarket: 14,
      photos: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80'],
      mlsName: 'Miami MLS',
    },
    {
      id: '5', address: '112 Elmwood Circle', city: 'Nashville', state: 'TN', zip: '37201',
      price: 375000, beds: 3, baths: 2, sqft: 1650, status: 'Active',
      propertyType: 'Single Family', daysOnMarket: 5,
      photos: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80'],
      mlsName: 'Nashville MLS',
    },
    {
      id: '6', address: '9001 Hillcrest Ave', city: 'Los Angeles', state: 'CA', zip: '90210',
      price: 2750000, beds: 6, baths: 5, sqft: 5800, status: 'Coming Soon',
      propertyType: 'Single Family', daysOnMarket: 0,
      photos: ['https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&q=80'],
      mlsName: 'LA MLS',
    },
    {
      id: '7', address: '455 River Run Pkwy', city: 'Portland', state: 'OR', zip: '97201',
      price: 540000, beds: 4, baths: 2, sqft: 2200, status: 'Active',
      propertyType: 'Single Family', daysOnMarket: 10,
      photos: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80'],
      mlsName: 'Portland MLS',
    },
    {
      id: '8', address: '23 Beacon Hill Rd', city: 'Boston', state: 'MA', zip: '02101',
      price: 995000, beds: 4, baths: 3, sqft: 2900, status: 'Pending',
      propertyType: 'Townhouse', daysOnMarket: 21,
      photos: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80'],
      mlsName: 'Boston MLS',
    },
    {
      id: '9', address: '5678 Grand Oak Blvd', city: 'Atlanta', state: 'GA', zip: '30301',
      price: 425000, beds: 4, baths: 3, sqft: 2600, status: 'Active',
      propertyType: 'Single Family', daysOnMarket: 3,
      photos: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80'],
      mlsName: 'Atlanta MLS',
    },
    {
      id: '10', address: '101 Westside Terrace', city: 'Seattle', state: 'WA', zip: '98101',
      price: 875000, beds: 3, baths: 2, sqft: 1800, status: 'Active',
      propertyType: 'Condo', daysOnMarket: 6,
      photos: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80'],
      mlsName: 'Seattle MLS',
    },
    {
      id: '11', address: '7821 Crestwood Dr', city: 'Dallas', state: 'TX', zip: '75201',
      price: 650000, beds: 5, baths: 4, sqft: 3400, status: 'Active',
      propertyType: 'Single Family', daysOnMarket: 1,
      photos: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80'],
      mlsName: 'Dallas MLS',
    },
    {
      id: '12', address: '900 Magnolia Way', city: 'Charlotte', state: 'NC', zip: '28201',
      price: 320000, beds: 3, baths: 2, sqft: 1500, status: 'Active',
      propertyType: 'Single Family', daysOnMarket: 12,
      photos: ['https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&q=80'],
      mlsName: 'Charlotte MLS',
    },
  ]

  return {
    listings: demos,
    total: demos.length,
  }
}

export const DEMO_LISTINGS = [
  { id: '1', address: '4821 Maple Grove Dr', city: 'Austin', state: 'TX', zip: '78745', price: 485000, beds: 4, baths: 3, sqft: 2400, status: 'Active', daysOnMarket: 2, photo: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80', type: 'Single Family' },
  { id: '2', address: '2210 Lakeview Blvd', city: 'Denver', state: 'CO', zip: '80203', price: 725000, beds: 3, baths: 2, sqft: 1980, status: 'Active', daysOnMarket: 7, photo: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80', type: 'Condo' },
  { id: '3', address: '8834 Sunset Ridge Ct', city: 'Scottsdale', state: 'AZ', zip: '85251', price: 1250000, beds: 5, baths: 4, sqft: 4100, status: 'Active', daysOnMarket: 0, photo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80', type: 'Single Family' },
  { id: '4', address: '320 Harbor Point Ln', city: 'Miami', state: 'FL', zip: '33101', price: 890000, beds: 3, baths: 3, sqft: 2100, status: 'Pending', daysOnMarket: 14, photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', type: 'Townhouse' },
  { id: '5', address: '112 Elmwood Circle', city: 'Nashville', state: 'TN', zip: '37201', price: 375000, beds: 3, baths: 2, sqft: 1650, status: 'Active', daysOnMarket: 5, photo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80', type: 'Single Family' },
  { id: '6', address: '9001 Hillcrest Ave', city: 'Los Angeles', state: 'CA', zip: '90210', price: 2750000, beds: 6, baths: 5, sqft: 5800, status: 'Coming Soon', daysOnMarket: 0, photo: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&q=80', type: 'Single Family' },
  { id: '7', address: '455 River Run Pkwy', city: 'Portland', state: 'OR', zip: '97201', price: 540000, beds: 4, baths: 2, sqft: 2200, status: 'Active', daysOnMarket: 10, photo: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80', type: 'Single Family' },
  { id: '8', address: '23 Beacon Hill Rd', city: 'Boston', state: 'MA', zip: '02101', price: 995000, beds: 4, baths: 3, sqft: 2900, status: 'Active', daysOnMarket: 21, photo: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80', type: 'Townhouse' },
  { id: '9', address: '5678 Grand Oak Blvd', city: 'Atlanta', state: 'GA', zip: '30301', price: 425000, beds: 4, baths: 3, sqft: 2600, status: 'Active', daysOnMarket: 3, photo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80', type: 'Single Family' },
  { id: '10', address: '101 Westside Terrace', city: 'Seattle', state: 'WA', zip: '98101', price: 875000, beds: 3, baths: 2, sqft: 1800, status: 'Active', daysOnMarket: 6, photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', type: 'Condo' },
  { id: '11', address: '7821 Crestwood Dr', city: 'Dallas', state: 'TX', zip: '75201', price: 650000, beds: 5, baths: 4, sqft: 3400, status: 'Active', daysOnMarket: 1, photo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80', type: 'Single Family' },
  { id: '12', address: '900 Magnolia Way', city: 'Charlotte', state: 'NC', zip: '28201', price: 320000, beds: 3, baths: 2, sqft: 1500, status: 'Active', daysOnMarket: 12, photo: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&q=80', type: 'Single Family' },
]

export function formatPrice(price) {
  if (!price) return 'N/A'
  const n = parseInt(price)
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`
  if (n >= 1000) return `$${Math.round(n / 1000)}K`
  return `$${n.toLocaleString()}`
}

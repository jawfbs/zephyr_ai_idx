'use client'

import { MapPin, Navigation } from 'lucide-react'

export default function MapView({ listings }) {
  return (
    <div className="w-full h-full map-placeholder relative flex flex-col items-center justify-center">
      {/* Map Placeholder - Replace with Google Maps or Mapbox */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-teal-50 to-blue-100">
        {/* Grid lines to simulate map */}
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="0.5"
              />
            </pattern>
            <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="0.3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#smallGrid)" />
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Simulated roads */}
          <line x1="0" y1="30%" x2="100%" y2="35%" stroke="#94a3b8" strokeWidth="3" opacity="0.4" />
          <line x1="0" y1="55%" x2="100%" y2="50%" stroke="#94a3b8" strokeWidth="3" opacity="0.4" />
          <line x1="0" y1="75%" x2="100%" y2="72%" stroke="#94a3b8" strokeWidth="2" opacity="0.3" />
          <line x1="25%" y1="0" x2="22%" y2="100%" stroke="#94a3b8" strokeWidth="3" opacity="0.4" />
          <line x1="60%" y1="0" x2="63%" y2="100%" stroke="#94a3b8" strokeWidth="3" opacity="0.4" />
          <line x1="80%" y1="0" x2="82%" y2="100%" stroke="#94a3b8" strokeWidth="2" opacity="0.3" />
          {/* Major road */}
          <line x1="0" y1="45%" x2="100%" y2="42%" stroke="#64748b" strokeWidth="5" opacity="0.3" />
          <line x1="42%" y1="0" x2="45%" y2="100%" stroke="#64748b" strokeWidth="5" opacity="0.3" />
          {/* Green areas */}
          <ellipse cx="70%" cy="25%" rx="8%" ry="6%" fill="#86efac" opacity="0.4" />
          <ellipse cx="15%" cy="65%" rx="6%" ry="5%" fill="#86efac" opacity="0.4" />
          {/* Water */}
          <ellipse cx="85%" cy="70%" rx="10%" ry="8%" fill="#93c5fd" opacity="0.5" />
        </svg>

        {/* Fake Listing Pins */}
        {listings.slice(0, 15).map((listing, i) => {
          const positions = [
            { left: '20%', top: '25%' },
            { left: '45%', top: '30%' },
            { left: '65%', top: '20%' },
            { left: '30%', top: '50%' },
            { left: '55%', top: '55%' },
            { left: '75%', top: '40%' },
            { left: '15%', top: '70%' },
            { left: '50%', top: '70%' },
            { left: '80%', top: '65%' },
            { left: '35%', top: '80%' },
            { left: '70%', top: '80%' },
            { left: '25%', top: '38%' },
            { left: '60%', top: '42%' },
            { left: '40%', top: '60%' },
            { left: '85%', top: '30%' },
          ]
          const pos = positions[i % positions.length]
          const price = listing.price
            ? parseInt(listing.price) >= 1000000
              ? `$${(parseInt(listing.price) / 1000000).toFixed(1)}M`
              : `$${Math.round(parseInt(listing.price) / 1000)}K`
            : `$${(300 + i * 50)}K`

          return (
            <div
              key={listing.id || i}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
              style={pos}
            >
              <div className="bg-realtor-red text-white text-xs font-bold px-2 py-1 rounded-full shadow-md hover:bg-red-700 hover:scale-110 transition-all whitespace-nowrap">
                {price}
              </div>
              <div className="absolute left-1/2 -bottom-1.5 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-realtor-red" />

              {/* Popup on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-white rounded-lg shadow-xl border border-gray-200 p-2 hidden group-hover:block z-20">
                <p className="text-xs font-bold text-gray-900">{price}</p>
                <p className="text-xs text-gray-500 truncate">
                  {listing.address || '123 Main Street'}
                </p>
                <div className="flex gap-2 text-xs text-gray-600 mt-1">
                  <span>{listing.beds || 3} bd</span>
                  <span>{listing.baths || 2} ba</span>
                  {listing.sqft && <span>{parseInt(listing.sqft).toLocaleString()} sqft</span>}
                </div>
              </div>
            </div>
          )
        })}

        {/* No listings state */}
        {listings.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="bg-white bg-opacity-90 rounded-xl p-6 text-center shadow-lg">
              <MapPin size={32} className="text-realtor-red mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">
                Map View
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Listings will appear as pins
              </p>
            </div>
          </div>
        )}

        {/* Map Controls */}
        <div className="absolute right-4 bottom-8 flex flex-col gap-2">
          <button className="w-8 h-8 bg-white rounded-md shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 font-bold text-lg">
            +
          </button>
          <button className="w-8 h-8 bg-white rounded-md shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 font-bold text-lg">
            −
          </button>
          <button className="w-8 h-8 bg-white rounded-md shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50">
            <Navigation size={14} />
          </button>
        </div>

        {/* Map Type Toggle */}
        <div className="absolute left-4 bottom-8 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <button className="px-3 py-1.5 text-xs font-medium bg-gray-900 text-white">
            Map
          </button>
          <button className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">
            Satellite
          </button>
        </div>

        {/* Attribution */}
        <div className="absolute bottom-2 right-2">
          <p className="text-xs text-gray-400">
            ZephyrAI IDX Map View
          </p>
        </div>
      </div>
    </div>
  )
}

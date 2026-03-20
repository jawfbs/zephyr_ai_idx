'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Heart,
  Bed,
  Bath,
  Maximize2,
  Camera,
  Clock,
  Star,
  MapPin,
} from 'lucide-react'

const STATUS_COLORS = {
  Active: 'bg-green-600',
  'Active Under Contract': 'bg-yellow-500',
  Pending: 'bg-orange-500',
  'Coming Soon': 'bg-blue-600',
  Sold: 'bg-gray-600',
}

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
  'https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&q=80',
]

function formatPrice(price) {
  if (!price) return 'Price N/A'
  const num = parseInt(price)
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`
  if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`
  return `$${num.toLocaleString()}`
}

function formatSqft(sqft) {
  if (!sqft) return null
  return parseInt(sqft).toLocaleString()
}

export default function ListingCard({ listing, isSaved, onToggleSaved }) {
  const [imgError, setImgError] = useState(false)
  const [imgIndex, setImgIndex] = useState(0)

  const imageUrl =
    !imgError && listing.photos && listing.photos.length > 0
      ? listing.photos[imgIndex]
      : PLACEHOLDER_IMAGES[parseInt(listing.id || '0') % PLACEHOLDER_IMAGES.length]

  const statusColor = STATUS_COLORS[listing.status] || 'bg-gray-600'
  const daysOnMarket = listing.daysOnMarket || 0
  const isNew = daysOnMarket <= 3

  return (
    <div className="listing-card bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-md cursor-pointer group">
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <Image
          src={imageUrl}
          alt={listing.address || 'Property'}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImgError(true)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Overlay */}
        <div className="listing-image-overlay absolute inset-0" />

        {/* Status Badge */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span
            className={`${statusColor} text-white text-xs font-semibold px-2 py-0.5 rounded-full`}
          >
            {listing.status || 'Active'}
          </span>
          {isNew && (
            <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <Star size={10} fill="white" />
              New
            </span>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onToggleSaved(listing.id)
          }}
          className="absolute top-2 right-2 p-1.5 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all shadow-sm"
        >
          <Heart
            size={16}
            className={isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}
          />
        </button>

        {/* Photo Count */}
        {listing.photos && listing.photos.length > 1 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
            <Camera size={11} />
            <span>{listing.photos.length}</span>
          </div>
        )}

        {/* Price */}
        <div className="absolute bottom-2 left-2">
          <span className="text-white font-bold text-xl price-badge">
            {formatPrice(listing.price)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Beds/Baths/Sqft */}
        <div className="flex items-center gap-3 text-sm text-gray-700 mb-2">
          {listing.beds && (
            <span className="flex items-center gap-1">
              <Bed size={14} className="text-gray-400" />
              <strong>{listing.beds}</strong>
              <span className="text-gray-400 text-xs">bd</span>
            </span>
          )}
          {listing.baths && (
            <span className="flex items-center gap-1">
              <Bath size={14} className="text-gray-400" />
              <strong>{listing.baths}</strong>
              <span className="text-gray-400 text-xs">ba</span>
            </span>
          )}
          {listing.sqft && (
            <span className="flex items-center gap-1">
              <Maximize2 size={12} className="text-gray-400" />
              <strong>{formatSqft(listing.sqft)}</strong>
              <span className="text-gray-400 text-xs">sqft</span>
            </span>
          )}
        </div>

        {/* Address */}
        <div className="flex items-start gap-1">
          <MapPin size={13} className="text-gray-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-1">
              {listing.address || 'Address Not Available'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {[listing.city, listing.state, listing.zip]
                .filter(Boolean)
                .join(', ')}
            </p>
          </div>
        </div>

        {/* Property Type & Days on Market */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {listing.propertyType || 'Residential'}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={11} />
            {daysOnMarket === 0
              ? 'Just listed'
              : `${daysOnMarket}d ago`}
          </span>
        </div>

        {/* MLS Attribution */}
        {listing.mlsName && (
          <p className="text-xs text-gray-300 mt-1 truncate">
            MLS: {listing.mlsName}
          </p>
        )}
      </div>
    </div>
  )
}

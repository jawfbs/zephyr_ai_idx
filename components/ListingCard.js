'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Bed, Bath, Square, MapPin, Home, Clock } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

export function ListingCard({ listing, viewMode = 'grid', onToggleFavorite, isFavorite }) {
  const { isSignedIn } = useAuth();
  const [localFavorite, setLocalFavorite] = useState(isFavorite);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setLocalFavorite(isFavorite);
  }, [isFavorite]);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      alert('Please sign in to save favorites');
      return;
    }

    setLocalFavorite(!localFavorite);
    if (onToggleFavorite) {
      onToggleFavorite(listing);
    }
  };

  const address = listing.Address || {};
  const details = listing.Details || {};
  const price = listing.ListingPrice || 0;
  const daysOnMarket = listing.DaysOnMarket || Math.floor(Math.random() * 30) + 1;

  const propertyImage = listing.Media?.[0]?.MediaURL || 
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800';

  return (
    <article
      className={`group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ${
        viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
      }`}
    >
      {/* Image Container */}
      <Link
        href={`/property/${listing.ListingId}`}
        className={`relative block overflow-hidden ${
          viewMode === 'list' ? 'md:w-80 flex-shrink-0' : 'aspect-[4/3]'
        }`}
        aria-label={`View details for ${address.Full || 'this property'}`}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" aria-hidden="true" />
        )}
        <img
          src={propertyImage}
          alt={`${address.Full || 'Property'} - ${details.Bedrooms || 3} bed, ${
            details.Bathrooms || 2
          } bath home`}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {listing.IsNew && (
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
              New
            </span>
          )}
          {daysOnMarket <= 7 && (
            <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" aria-hidden="true" />
              New Listing
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
            localFavorite
              ? 'bg-red-500 text-white'
              : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500'
          }`}
          aria-label={localFavorite ? 'Remove from favorites' : 'Save to favorites'}
          aria-pressed={localFavorite}
        >
          <Heart className={`w-5 h-5 ${localFavorite ? 'fill-current' : ''}`} aria-hidden="true" />
        </button>

        {/* Price Tag */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-lg font-bold text-gray-900 shadow-sm">
            ${price.toLocaleString()}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        {/* Address */}
        <Link href={`/property/${listing.ListingId}`} className="block group/link">
          <h3 className="font-semibold text-lg text-gray-900 group-hover/link:text-blue-600 transition-colors line-clamp-1">
            {address.Full || 'Address Not Available'}
          </h3>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>
              {address.City || ''}, {address.StateOrProvince || ''} {address.PostalCode || ''}
            </span>
          </p>
        </Link>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600" role="list" aria-label="Property details">
          <div className="flex items-center gap-1" role="listitem">
            <Bed className="w-4 h-4" aria-hidden="true" />
            <span>{details.Bedrooms || details.Beds || '—'} beds</span>
          </div>
          <div className="flex items-center gap-1" role="listitem">
            <Bath className="w-4 h-4" aria-hidden="true" />
            <span>{details.Bathrooms || details.Baths || '—'} baths</span>
          </div>
          <div className="flex items-center gap-1" role="listitem">
            <Square className="w-4 h-4" aria-hidden="true" />
            <span>
              {details.BuildingAreaTotal?.toLocaleString() || 
               details.Sqft?.toLocaleString() || 
               '—'} sqft
            </span>
          </div>
        </div>

        {/* Property Type */}
        <div className="flex items-center gap-2 mt-3">
          <Home className="w-4 h-4 text-gray-400" aria-hidden="true" />
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {details.PropertyType || details.HomeType || 'Single Family'}
          </span>
        </div>

        {/* MLS Number & Days on Market */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t text-xs text-gray-500">
          <span>MLS® #{listing.ListingId}</span>
          <span>{daysOnMarket} days on market</span>
        </div>
      </div>
    </article>
  );
}

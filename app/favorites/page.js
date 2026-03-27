'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft, Share2 } from 'lucide-react';
import { ListingCard } from '@/components/ListingCard';
import { useAuth } from '@clerk/nextjs';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const { isSignedIn, user } = useAuth();

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
  }, []);

  const handleToggleFavorite = (listing) => {
    const isCurrentlyFavorite = favorites.some((f) => f.ListingId === listing.ListingId);
    let newFavorites;

    if (isCurrentlyFavorite) {
      newFavorites = favorites.filter((f) => f.ListingId !== listing.ListingId);
    } else {
      newFavorites = [...favorites, listing];
    }

    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all favorites?')) {
      setFavorites([]);
      localStorage.setItem('favorites', JSON.stringify([]));
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-blue-600" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign in to view your favorites</h1>
          <p className="text-gray-600 mb-6">
            Create a free account to save your favorite listings and get alerts when prices drop.
          </p>
          <Link
            href="/sign-in"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <main className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-4"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back to search
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Heart className="w-8 h-8 fill-red-500 text-red-500" aria-hidden="true" />
              Saved Homes
              <span className="text-lg font-normal text-gray-500">({favorites.length})</span>
            </h1>
          </div>
          
          {favorites.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-gray-500 hover:text-red-600 text-sm"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-gray-400" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No saved homes yet</h2>
            <p className="text-gray-500 mb-6">
              Start browsing and tap the heart icon to save homes you love.
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Homes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((listing) => (
              <ListingCard
                key={listing.ListingId}
                listing={listing}
                viewMode="grid"
                isFavorite={true}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}

        {/* Email Alerts CTA */}
        {favorites.length > 0 && (
          <section className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center" aria-labelledby="alerts-heading">
            <h2 id="alerts-heading" className="text-2xl font-bold text-gray-900 mb-2">
              Never miss a price change
            </h2>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Set up email alerts for your saved searches and get notified instantly when prices drop or new homes match.
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Set Up Price Alerts
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

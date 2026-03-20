'use client'

import ListingCard from './ListingCard'
import SkeletonCard from './SkeletonCard'
import { AlertCircle, Home } from 'lucide-react'

const ITEMS_PER_PAGE = 20

export default function ListingsGrid({
  listings,
  loading,
  error,
  totalCount,
  currentPage,
  onPageChange,
  savedListings,
  onToggleSaved,
  viewMode,
}) {
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-8 text-center">
        <AlertCircle size={40} className="text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Unable to Load Listings
        </h3>
        <p className="text-sm text-gray-500 max-w-md">{error}</p>
        <p className="text-xs text-gray-400 mt-2">
          Showing demo listings below
        </p>
      </div>
    )
  }

  return (
    <div className="p-4">
      {/* Results Header */}
      {!loading && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {totalCount > 0
                ? `${totalCount.toLocaleString()} Homes For Sale`
                : 'No Results Found'}
            </h2>
            {totalCount > 0 && (
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages || 1}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Grid */}
      <div
        className={`grid gap-4 ${
          viewMode === 'split'
            ? 'grid-cols-1 sm:grid-cols-2'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}
      >
        {loading
          ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
          : listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                isSaved={savedListings.includes(listing.id)}
                onToggleSaved={onToggleSaved}
              />
            ))}
      </div>

      {/* No Results */}
      {!loading && listings.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Home size={48} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No listings found
          </h3>
          <p className="text-sm text-gray-400">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 pb-4">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let page
            if (totalPages <= 5) {
              page = i + 1
            } else if (currentPage <= 3) {
              page = i + 1
            } else if (currentPage >= totalPages - 2) {
              page = totalPages - 4 + i
            } else {
              page = currentPage - 2 + i
            }
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-9 h-9 text-sm rounded-lg border transition-colors ${
                  currentPage === page
                    ? 'bg-realtor-red text-white border-realtor-red'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            )
          })}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from './Header'
import SearchBar from './SearchBar'
import FilterBar from './FilterBar'
import ListingsGrid from './ListingsGrid'
import MapView from './MapView'
import { fetchListings } from '@/lib/sparkApi'

export default function SearchPage() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('list') // 'list' | 'map' | 'split'
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    beds: '',
    baths: '',
    propertyType: '',
    status: 'Active',
    sqftMin: '',
    sqftMax: '',
    sortBy: 'ListPrice',
    sortOrder: 'DESC',
  })
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [savedListings, setSavedListings] = useState([])
  const [activeDropdown, setActiveDropdown] = useState(null)

  const loadListings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchListings({
        query: searchQuery,
        filters,
        page: currentPage,
      })
      setListings(result.listings || [])
      setTotalCount(result.total || 0)
    } catch (err) {
      setError(err.message)
      setListings([])
    } finally {
      setLoading(false)
    }
  }, [searchQuery, filters, currentPage])

  useEffect(() => {
    loadListings()
  }, [loadListings])

  const handleSearch = (query) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setCurrentPage(1)
  }

  const toggleSaved = (listingId) => {
    setSavedListings((prev) =>
      prev.includes(listingId)
        ? prev.filter((id) => id !== listingId)
        : [...prev, listingId]
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      {/* Top Header */}
      <Header />

      {/* Search Bar */}
      <div className="search-header-shadow bg-white z-30 border-b border-gray-200">
        <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalCount={totalCount}
          loading={loading}
          activeDropdown={activeDropdown}
          setActiveDropdown={setActiveDropdown}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Listings Panel */}
        {(viewMode === 'list' || viewMode === 'split') && (
          <div
            className={`${
              viewMode === 'split' ? 'w-1/2' : 'w-full'
            } overflow-y-auto bg-realtor-light`}
          >
            <ListingsGrid
              listings={listings}
              loading={loading}
              error={error}
              totalCount={totalCount}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              savedListings={savedListings}
              onToggleSaved={toggleSaved}
              viewMode={viewMode}
            />
          </div>
        )}

        {/* Map Panel */}
        {(viewMode === 'map' || viewMode === 'split') && (
          <div
            className={`${
              viewMode === 'split' ? 'w-1/2' : 'w-full'
            } relative`}
          >
            <MapView listings={listings} />
          </div>
        )}
      </div>
    </div>
  )
}

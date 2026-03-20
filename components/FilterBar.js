'use client'

import { useState } from 'react'
import {
  ChevronDown,
  SlidersHorizontal,
  List,
  Map,
  LayoutTemplate,
  X,
  Check,
} from 'lucide-react'

const propertyTypes = [
  'Single Family',
  'Condo',
  'Townhouse',
  'Multi-Family',
  'Land',
  'Mobile/Manufactured',
]

const bedsOptions = ['Any', '1+', '2+', '3+', '4+', '5+']
const bathsOptions = ['Any', '1+', '1.5+', '2+', '3+', '4+']

const priceRanges = {
  min: ['No Min', '$50K', '$100K', '$150K', '$200K', '$250K', '$300K', '$400K', '$500K', '$750K', '$1M'],
  max: ['No Max', '$100K', '$150K', '$200K', '$250K', '$300K', '$400K', '$500K', '$750K', '$1M', '$1.5M', '$2M+'],
}

const sortOptions = [
  { label: 'Price (High-Low)', value: 'ListPrice_DESC' },
  { label: 'Price (Low-High)', value: 'ListPrice_ASC' },
  { label: 'Newest', value: 'ListingDate_DESC' },
  { label: 'Sq Ft (Largest)', value: 'BuildingAreaTotal_DESC' },
  { label: 'Lot Size', value: 'LotSizeArea_DESC' },
]

export default function FilterBar({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  totalCount,
  loading,
  activeDropdown,
  setActiveDropdown,
}) {
  const [tempFilters, setTempFilters] = useState({})

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name)
  }

  const closeAll = () => setActiveDropdown(null)

  const applyFilters = (updates) => {
    onFilterChange(updates)
    setTempFilters({})
    closeAll()
  }

  const bedsLabel =
    filters.beds && filters.beds !== '' ? `${filters.beds} bd` : 'Beds'
  const bathsLabel =
    filters.baths && filters.baths !== '' ? `${filters.baths} ba` : 'Baths'

  const priceLabel = () => {
    if (filters.priceMin && filters.priceMax)
      return `${filters.priceMin} - ${filters.priceMax}`
    if (filters.priceMin) return `${filters.priceMin}+`
    if (filters.priceMax) return `Up to ${filters.priceMax}`
    return 'Price'
  }

  const typeLabel =
    filters.propertyType && filters.propertyType !== ''
      ? filters.propertyType
      : 'Home Type'

  const currentSort =
    sortOptions.find(
      (s) => s.value === `${filters.sortBy}_${filters.sortOrder}`
    )?.label || 'Sort'

  return (
    <div className="flex items-center justify-between px-4 pb-3 gap-2 overflow-x-auto scrollbar-hide">
      {/* Left: Filters */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Price Filter */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('price')}
            className={`filter-pill ${
              filters.priceMin || filters.priceMax ? 'active' : ''
            }`}
          >
            <span>{priceLabel()}</span>
            <ChevronDown
              size={14}
              className={`transition-transform ${activeDropdown === 'price' ? 'rotate-180' : ''}`}
            />
          </button>
          {activeDropdown === 'price' && (
            <div className="dropdown-menu p-4 w-64">
              <p className="text-sm font-semibold text-gray-800 mb-3">Price Range</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Min Price</label>
                  <select
                    className="w-full border border-gray-200 rounded-md py-1.5 px-2 text-sm"
                    value={filters.priceMin}
                    onChange={(e) => onFilterChange({ priceMin: e.target.value })}
                  >
                    {priceRanges.min.map((p) => (
                      <option key={p} value={p === 'No Min' ? '' : p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Max Price</label>
                  <select
                    className="w-full border border-gray-200 rounded-md py-1.5 px-2 text-sm"
                    value={filters.priceMax}
                    onChange={(e) => onFilterChange({ priceMax: e.target.value })}
                  >
                    {priceRanges.max.map((p) => (
                      <option key={p} value={p === 'No Max' ? '' : p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={closeAll}
                className="mt-3 w-full bg-realtor-red text-white text-sm py-2 rounded-md hover:bg-red-700"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Beds Filter */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('beds')}
            className={`filter-pill ${filters.beds ? 'active' : ''}`}
          >
            <span>{bedsLabel}</span>
            <ChevronDown
              size={14}
              className={`transition-transform ${activeDropdown === 'beds' ? 'rotate-180' : ''}`}
            />
          </button>
          {activeDropdown === 'beds' && (
            <div className="dropdown-menu p-4 w-56">
              <p className="text-sm font-semibold text-gray-800 mb-3">Bedrooms</p>
              <div className="flex flex-wrap gap-2">
                {bedsOptions.map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      onFilterChange({ beds: b === 'Any' ? '' : b })
                      closeAll()
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      (b === 'Any' && !filters.beds) || filters.beds === b
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 text-gray-700 hover:border-gray-500'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Baths Filter */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('baths')}
            className={`filter-pill ${filters.baths ? 'active' : ''}`}
          >
            <span>{bathsLabel}</span>
            <ChevronDown
              size={14}
              className={`transition-transform ${activeDropdown === 'baths' ? 'rotate-180' : ''}`}
            />
          </button>
          {activeDropdown === 'baths' && (
            <div className="dropdown-menu p-4 w-56">
              <p className="text-sm font-semibold text-gray-800 mb-3">Bathrooms</p>
              <div className="flex flex-wrap gap-2">
                {bathsOptions.map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      onFilterChange({ baths: b === 'Any' ? '' : b })
                      closeAll()
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      (b === 'Any' && !filters.baths) || filters.baths === b
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 text-gray-700 hover:border-gray-500'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Home Type Filter */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('type')}
            className={`filter-pill hidden md:flex ${filters.propertyType ? 'active' : ''}`}
          >
            <span>{typeLabel}</span>
            <ChevronDown
              size={14}
              className={`transition-transform ${activeDropdown === 'type' ? 'rotate-180' : ''}`}
            />
          </button>
          {activeDropdown === 'type' && (
            <div className="dropdown-menu p-4 w-60">
              <p className="text-sm font-semibold text-gray-800 mb-3">Home Type</p>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onFilterChange({ propertyType: '' })
                    closeAll()
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm hover:bg-gray-50"
                >
                  <span>All Types</span>
                  {!filters.propertyType && <Check size={14} className="text-blue-600" />}
                </button>
                {propertyTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      onFilterChange({ propertyType: type })
                      closeAll()
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm hover:bg-gray-50"
                  >
                    <span>{type}</span>
                    {filters.propertyType === type && (
                      <Check size={14} className="text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* More Filters */}
        <button
          onClick={() => toggleDropdown('more')}
          className="filter-pill hidden lg:flex"
        >
          <SlidersHorizontal size={14} />
          <span>More</span>
          <ChevronDown
            size={14}
            className={`transition-transform ${activeDropdown === 'more' ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Sort */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('sort')}
            className="filter-pill hidden md:flex"
          >
            <span>{currentSort}</span>
            <ChevronDown
              size={14}
              className={`transition-transform ${activeDropdown === 'sort' ? 'rotate-180' : ''}`}
            />
          </button>
          {activeDropdown === 'sort' && (
            <div className="dropdown-menu">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    const [sortBy, sortOrder] = opt.value.split('_')
                    onFilterChange({ sortBy, sortOrder })
                    closeAll()
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                >
                  <span>{opt.label}</span>
                  {`${filters.sortBy}_${filters.sortOrder}` === opt.value && (
                    <Check size={14} className="text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Results Count + View Toggle */}
      <div className="flex items-center gap-3 shrink-0">
        {!loading && (
          <span className="text-sm text-gray-500 hidden sm:block">
            {totalCount.toLocaleString()} homes
          </span>
        )}

        {/* View Mode Toggle */}
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => onViewModeChange('list')}
            title="List View"
            className={`p-2 transition-colors ${
              viewMode === 'list'
                ? 'bg-gray-900 text-white'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <List size={16} />
          </button>
          <button
            onClick={() => onViewModeChange('split')}
            title="Split View"
            className={`p-2 border-l border-gray-200 transition-colors ${
              viewMode === 'split'
                ? 'bg-gray-900 text-white'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <LayoutTemplate size={16} />
          </button>
          <button
            onClick={() => onViewModeChange('map')}
            title="Map View"
            className={`p-2 border-l border-gray-200 transition-colors ${
              viewMode === 'map'
                ? 'bg-gray-900 text-white'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Map size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

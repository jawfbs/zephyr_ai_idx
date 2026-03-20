'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X, MapPin, TrendingUp } from 'lucide-react'

const suggestions = [
  { type: 'city', label: 'New York, NY', icon: MapPin },
  { type: 'city', label: 'Los Angeles, CA', icon: MapPin },
  { type: 'city', label: 'Chicago, IL', icon: MapPin },
  { type: 'city', label: 'Houston, TX', icon: MapPin },
  { type: 'city', label: 'Phoenix, AZ', icon: MapPin },
  { type: 'city', label: 'Philadelphia, PA', icon: MapPin },
  { type: 'city', label: 'San Antonio, TX', icon: MapPin },
  { type: 'city', label: 'San Diego, CA', icon: MapPin },
  { type: 'trend', label: 'Homes with pool', icon: TrendingUp },
  { type: 'trend', label: 'Waterfront homes', icon: TrendingUp },
]

export default function SearchBar({ onSearch, initialQuery }) {
  const [query, setQuery] = useState(initialQuery || '')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filtered, setFiltered] = useState([])
  const inputRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (query.length > 0) {
      setFiltered(
        suggestions.filter((s) =>
          s.label.toLowerCase().includes(query.toLowerCase())
        )
      )
    } else {
      setFiltered(suggestions.slice(0, 6))
    }
  }, [query])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.label)
    onSearch(suggestion.label)
    setShowSuggestions(false)
  }

  const clearSearch = () => {
    setQuery('')
    onSearch('')
    inputRef.current?.focus()
  }

  return (
    <div className="px-4 py-3" ref={containerRef}>
      <div className="relative max-w-3xl">
        <form onSubmit={handleSubmit} className="flex items-center">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <MapPin size={18} className="text-gray-400" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="City, Zip, Neighborhood, Address, MLS#"
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-l-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute inset-y-0 right-2 flex items-center p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-realtor-red text-white font-medium text-sm rounded-r-lg hover:bg-red-700 transition-colors flex items-center gap-2 border border-realtor-red"
          >
            <Search size={17} />
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="p-2">
              <p className="text-xs text-gray-400 px-2 py-1 font-medium uppercase tracking-wide">
                {query ? 'Suggestions' : 'Popular Searches'}
              </p>
              {filtered.map((suggestion, idx) => {
                const Icon = suggestion.icon
                return (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center gap-3 px-2 py-2.5 rounded-md hover:bg-gray-50 text-left transition-colors"
                  >
                    <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                      <Icon size={14} className="text-gray-500" />
                    </div>
                    <div>
                      <span className="text-sm text-gray-800 font-medium">
                        {suggestion.label}
                      </span>
                      <span className="ml-2 text-xs text-gray-400 capitalize">
                        {suggestion.type}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

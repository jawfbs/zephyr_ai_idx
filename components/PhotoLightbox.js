'use client';

import { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

export function PhotoLightbox({
  isOpen,
  onClose,
  photos = [],
  currentIndex = 0,
  onIndexChange,
  propertyAddress = 'Property'
}) {
  const goToPrevious = useCallback(() => {
    onIndexChange(currentIndex === 0 ? photos.length - 1 : currentIndex - 1);
  }, [currentIndex, photos.length, onIndexChange]);

  const goToNext = useCallback(() => {
    onIndexChange(currentIndex === photos.length - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, photos.length, onIndexChange]);

  const downloadPhoto = async () => {
    try {
      const response = await fetch(photos[currentIndex]);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${propertyAddress.replace(/\s+/g, '_')}_photo_${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, goToPrevious, goToNext]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo gallery for ${propertyAddress}`}
    >
      {/* Header */}
      <header className="flex items-center justify-between p-4 text-white">
        <div className="flex items-center gap-4">
          <span className="text-lg">
            {currentIndex + 1} / {photos.length}
          </span>
          <span className="text-sm text-gray-300 truncate max-w-md">
            {propertyAddress}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={downloadPhoto}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Download current photo"
            title="Download photo"
          >
            <Download className="w-6 h-6" aria-hidden="true" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close photo gallery"
            title="Close (Esc)"
          >
            <X className="w-8 h-8" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center relative">
        {/* Previous Button */}
        {photos.length > 1 && (
          <button
            onClick={goToPrevious}
            className="absolute left-4 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-8 h-8" aria-hidden="true" />
          </button>
        )}

        {/* Current Image */}
        <img
          src={photos[currentIndex]}
          alt={`${propertyAddress} - Photo ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain"
          style={{ maxHeight: 'calc(100vh - 160px)' }}
        />

        {/* Next Button */}
        {photos.length > 1 && (
          <button
            onClick={goToNext}
            className="absolute right-4 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Next photo"
          >
            <ChevronRight className="w-8 h-8" aria-hidden="true" />
          </button>
        )}
      </main>

      {/* Thumbnail Strip */}
      {photos.length > 1 && (
        <footer className="p-4">
          <div
            className="flex items-center justify-center gap-2 overflow-x-auto pb-2"
            role="tablist"
            aria-label="Photo thumbnails"
          >
            {photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => onIndexChange(index)}
                className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-white opacity-100'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`Go to photo ${index + 1}`}
              >
                <img
                  src={photo}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </footer>
      )}
    </div>
  );
}

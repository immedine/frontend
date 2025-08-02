"use client";

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CarouselModal({ images, startIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  if (!images?.length) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80" style={{ zIndex: 1000 }}>
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black"
      >
        <X size={24} />
      </button>

      {/* Left arrow */}
      <button
        onClick={goPrev}
        className="absolute left-4 text-white bg-black/50 p-2 rounded-full hover:bg-black"
      >
        <ChevronLeft size={32} />
      </button>

      {/* Image */}
      <div className="max-w-3xl w-full flex justify-center items-center px-4">
        <img
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="max-h-[80vh] w-auto object-contain rounded-lg shadow-lg"
        />
      </div>

      {/* Right arrow */}
      <button
        onClick={goNext}
        className="absolute right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black"
      >
        <ChevronRight size={32} />
      </button>

      <div className="absolute bottom-6 flex justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-3 h-3 rounded-full ${
              i === currentIndex ? 'bg-white' : 'bg-white/40'
            } hover:bg-white/60 transition`}
          />
        ))}
      </div>
    </div>
  );
}

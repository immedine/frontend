"use client";
import React, { useState } from 'react';

export function Carousel({ items, openModal }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="w-full relative h-80">
      {/* Slides */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {items.map((item, idx) => (
            <div key={idx} className="min-w-full h-80 flex-shrink-0">
              <img
                src={item}
                alt={item.alt || `Slide ${idx + 1}`}
                className="w-full h-full object-cover"
                onClick={() => openModal(activeIndex)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-3 space-x-2 absolute left-1/2 bottom-6">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            className={`w-3 h-3 rounded-full transition ${
              idx === activeIndex ? 'bg-blue-600 scale-125' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

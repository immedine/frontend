"use client";
import React, { useState } from 'react';

export default function SearchModal({ open, onClose, search, updateText, text }) {
  if (!open) return null;


  return (
    <div className="fixed top-0 left-0 w-full z-50 flex items-center justify-center h-screen bg-black bg-opacity-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div className="absolute top-0 left-0 bg-white shadow-xl w-full max-w-md p-6 z-10">
        <input
          type="text"
          value={text}
          onChange={e => updateText(e.target.value)}
          placeholder="Type to search..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500"
        />
        <button
            type="button"
            className="bg-primary mt-6 mr-6 flex items-center px-3 py-3 text-white rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500 absolute right-0 top-0"
            onClick={() => search(text)}
        >
            <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" />
            </svg>
        </button>
      </div>
    </div>
  );
}

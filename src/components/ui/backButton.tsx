"use client";

import { useRouter } from "next/navigation";

const BackButton = ({href}) => {
  const router = useRouter();

  return <button
    className="absolute top-4 left-4 z-20 bg-white bg-opacity-70 rounded-full p-2 shadow-md"
    onClick={!href ? () => router.back() : () => router.push(href)}
    aria-label="Go back"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-black">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  </button>
};

export default BackButton;
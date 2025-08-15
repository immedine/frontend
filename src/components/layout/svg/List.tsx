import React from 'react';

const ListIcon: React.FC = ({
  width = "w-4", height = "h-4"
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`${height} ${width}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <rect x="4" y="6" width="16" height="2" rx="1" stroke="currentColor" strokeWidth="2" />
    <rect x="4" y="11" width="16" height="2" rx="1" stroke="currentColor" strokeWidth="2" />
    <rect x="4" y="16" width="16" height="2" rx="1" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export default ListIcon;
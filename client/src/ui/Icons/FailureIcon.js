import React from 'react';

export default ({ size = '30px' }) => (
  <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
    <circle cx="25" cy="25" r="25" fill="#d75a4a" />
    <polyline
      points="16,34 25,25 34,16"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeMiterlimit="10"
    />
    <polyline
      points="16,16 25,25 34,34"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeMiterlimit="10"
    />
  </svg>
);

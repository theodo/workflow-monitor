import React from 'react';

export default ({ size = '30px', color = 'black' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 225.000000 225.000000"
  >
    <path
      fill={color}
      d="M276 2124 c-57 -21 -102 -58 -133 -112 l-28 -47 -3 -824 c-3 -931 -6 -887 73 -966 78 -78 36 -75 945 -75 908 0 867 -3 945 75 78 78 75 37 75 940 0 907 3 873 -74 949 -79 80 -36 76 -950 75 -678 0 -817 -3 -850 -15z m655 -279 c16 -9 39 -30 49 -48 19 -31 20 -55 20 -652 0 -604 -1 -621 -20 -653 -35 -58 -65 -63 -310 -60 -204 3 -221 4 -247 24 -15 11 -33 36 -40 55 -9 25 -12 197 -12 637 -1 665 -2 653 61 692 30 18 50 20 251 20 177 0 224 -3 248 -15z m900 -8 c58 -39 60 -59 57 -460 l-3 -359 -37 -34 -38 -34 -235 0 c-202 0 -239 2 -261 16 -53 35 -54 44 -54 434 0 399 1 402 63 440 29 18 51 20 253 20 214 0 222 -1 255 -23z"
      transform="matrix(.1 0 0 -.1 0 225)"
    />
  </svg>
);

'use client';

export default function DiamondIcon({ size = 16, className, style }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      {/* Outer contour with soft faceted gemstone tint */}
      <path d="M6 3h12l4 6-10 12L2 9z" fill="rgba(191, 219, 254, 0.22)" />
      {/* Horizontal girdle line */}
      <line x1="2" y1="9" x2="22" y2="9" />
      {/* Crown facets */}
      <line x1="10" y1="3" x2="8" y2="9" />
      <line x1="14" y1="3" x2="16" y2="9" />
      {/* Lower pavilion facets converging to bottom point */}
      <line x1="8" y1="9" x2="12" y2="21" />
      <line x1="16" y1="9" x2="12" y2="21" />
      {/* Center vertical seam */}
      <line x1="12" y1="9" x2="12" y2="21" />
    </svg>
  );
}

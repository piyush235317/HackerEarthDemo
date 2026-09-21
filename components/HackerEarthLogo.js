'use client';

export default function HackerEarthLogo({ text = 'H', size = 32, className }) {
  return (
    <div
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderRadius: '4px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontWeight: '600',
        fontSize: `${Math.round(size * 0.48)}px`,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        lineHeight: 1,
        letterSpacing: '-0.2px',
        flexShrink: 0,
        userSelect: 'none',
        boxSizing: 'border-box',
      }}
    >
      {text}
    </div>
  );
}

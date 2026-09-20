'use client';

export default function HackerEarthLogo({ text = 'H', size = 22, className }) {
  return (
    <div
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: 'rgba(255, 255, 255, 0.22)',
        borderRadius: '6px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontWeight: '700',
        fontSize: `${Math.round(size * 0.58)}px`,
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        lineHeight: 1,
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {text}
    </div>
  );
}

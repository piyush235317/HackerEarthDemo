'use client';

import styles from './ActionButton.module.css';

export default function ActionButton({
  children,
  variant = 'primary',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}) {
  const variantClass = styles[variant] || styles.primary;

  return (
    <button
      type={type}
      className={`${styles.button} ${variantClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

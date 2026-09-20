'use client';

import HackerEarthLogo from '@/components/HackerEarthLogo';
import styles from './TopBar.module.css';

export default function TopBar({ logoText = 'H', testName = 'EXL Digital Campus Test' }) {
  return (
    <header className={styles.topBar}>
      <div className={styles.leftSection}>
        <HackerEarthLogo text={logoText} size={22} />
        {testName && <span className={styles.testName}>{testName}</span>}
      </div>
      <div className={styles.rightSection}>
        <button className={styles.themeBtn} aria-label="Theme">
          <svg className={styles.sunIcon} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4" fill="currentColor" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}

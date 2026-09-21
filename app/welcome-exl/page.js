'use client';

import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function WelcomeExlPage() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/test-instruction');
  };

  const handleDownload = () => {
    // Simulate smart browser download
    alert('HackerEarth Smart Browser download started.');
  };

  return (
    <div className={styles.container}>
      <main className={styles.content}>
        {/* EXL Logo Badge */}
        <div className={styles.logoWrapper}>
          <div className={styles.logoBadge}>E</div>
        </div>

        {/* Title & Subtitle */}
        <h1 className={styles.title}>
          EXL Digital Campus Test - IIIT Allahabad [21-SEP-2026]
        </h1>
        <div className={styles.subtitle}>
          <span>By EXL Analytics &amp; Digital - Campus</span>
          <span className={styles.clockSpan}>
            <svg className={styles.clockIcon} viewBox="0 0 24 24">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
            </svg>
            1 hr 15 mins
          </span>
        </div>

        {/* Card 1: Download Smart Browser */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>1. Download and install the Smart Browser</h2>
          <p className={styles.cardDesc}>
            This test requires the HackerEarth Smart Browser for proctoring and security.{' '}
            <a href="#" className={styles.link} onClick={(e) => e.preventDefault()}>
              Learn more about Smart Browser..
            </a>
          </p>

          <button className={styles.primaryBtn} onClick={handleDownload}>
            <svg className={styles.windowsIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
            </svg>
            <span>Download for Windows</span>
          </button>

          <div className={styles.osNote}>
            Using a different operating system?{' '}
            <a href="#" className={styles.link} onClick={(e) => e.preventDefault()}>
              Download from here
            </a>
          </div>
        </div>

        {/* Card 2: Start test */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>2. Start your test</h2>
          <p className={styles.cardDesc}>
            Once you have installed the Smart Browser, click Start to begin the test
          </p>

          <button className={styles.primaryBtn} onClick={handleStart}>
            Start
          </button>
        </div>

        {/* Footer Support Info */}
        <footer className={styles.footer}>
          For more information, kindly contact Sheeba at{' '}
          <a href="mailto:Sheeba.Rizvi@exlservice.com" className={styles.emailLink}>
            Sheeba.Rizvi@exlservice.com
          </a>
        </footer>
      </main>
    </div>
  );
}

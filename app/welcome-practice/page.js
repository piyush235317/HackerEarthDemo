'use client';

import { useRouter } from 'next/navigation';
import TopBar from '@/components/TopBar';
import styles from './page.module.css';

export default function WelcomePracticePage() {
  const router = useRouter();

  const handleSetUpTest = () => {
    router.push('/setup/terms');
  };

  return (
    <div className={styles.container}>
      <TopBar logoText="H" testName="EXL Digital Campus Test" />
      <main className={styles.content}>
        <div className={styles.card}>
          <h1 className={styles.title}>Welcome to the EXL Digital Campus Test</h1>
          <p className={styles.subtitle}>
            Yatnish Manik, you&apos;re invited by HackerEarth to take this test and show what you can do!
          </p>

          <div className={styles.infoTable}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Test name</span>
              <span className={styles.infoValue}>EXL Digital Campus Test</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Duration</span>
              <span className={styles.infoValue}>1 hr 15 mins</span>
            </div>
          </div>

          <div className={styles.helpCard}>
            <div className={styles.helpTitle}>Need more help?</div>
            <div className={styles.helpContact}>Contact HackerEarth Support at</div>
            <a href="mailto:support@hackerearth.com" className={styles.helpEmail}>
              support@hackerearth.com
            </a>
          </div>

          <button className={styles.setupBtn} onClick={handleSetUpTest}>
            Set Up Test
          </button>
        </div>
      </main>
    </div>
  );
}

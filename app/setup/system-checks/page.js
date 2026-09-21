'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setState } from '@/lib/store';
import styles from './page.module.css';

function detectOS() {
  if (typeof window === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  if (ua.indexOf('Win') !== -1) return 'Windows';
  if (ua.indexOf('Mac') !== -1) return 'macOS';
  if (ua.indexOf('Linux') !== -1) return 'Linux';
  if (ua.indexOf('Android') !== -1) return 'Android';
  if (ua.indexOf('iOS') !== -1) return 'iOS';
  return 'Unknown';
}

function detectBrowser() {
  if (typeof window === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  if (ua.indexOf('Chrome') !== -1 && ua.indexOf('Edg') === -1) return 'Chrome';
  if (ua.indexOf('Firefox') !== -1) return 'Firefox';
  if (ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1) return 'Safari';
  if (ua.indexOf('Edg') !== -1) return 'Edge';
  return 'Unknown';
}

function checkCookies() {
  if (typeof window === 'undefined') return false;
  return navigator.cookieEnabled;
}

export default function SystemChecksPage() {
  const router = useRouter();
  const [checks, setChecks] = useState({
    os: '...',
    browser: '...',
    cookies: '...',
    firebase: '...',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setChecks({
        os: detectOS(),
        browser: detectBrowser(),
        cookies: checkCookies() ? 'Enabled' : 'Disabled',
        firebase: 'Enabled',
      });
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    setState({ systemChecksCompleted: true, currentStep: 3 });
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch (e) {}
    router.push('/setup/proctoring');
  };

  const handleBack = () => {
    router.push('/setup/terms');
  };

  return (
    <>
      <h1 className={styles.pageTitle}>System checks</h1>
      <p className={styles.description}>
        Make sure your device, browser, and webcam meet the requirements before starting the assessment.
      </p>

      <div className={styles.checksList}>
        <div className={styles.checkRow}>
          <span className={styles.checkLabel}>Operating system</span>
          <span className={styles.checkValue}>
            <span className={styles.greenCheck}>
              <span className={styles.greenCheckInner}>✓</span>
            </span>
            {checks.os}
          </span>
        </div>
        <div className={styles.checkRow}>
          <span className={styles.checkLabel}>Browser</span>
          <span className={styles.checkValue}>
            <span className={styles.greenCheck}>
              <span className={styles.greenCheckInner}>✓</span>
            </span>
            {checks.browser}
          </span>
        </div>
        <div className={styles.checkRow}>
          <span className={styles.checkLabel}>Cookies</span>
          <span className={styles.checkValue}>
            <span className={styles.greenCheck}>
              <span className={styles.greenCheckInner}>✓</span>
            </span>
            {checks.cookies}
          </span>
        </div>
        <div className={styles.checkRow}>
          <span className={styles.checkLabel}>Firebase</span>
          <span className={styles.checkValue}>
            <span className={styles.greenCheck}>
              <span className={styles.greenCheckInner}>✓</span>
            </span>
            {checks.firebase}
          </span>
        </div>
        <div className={styles.checkRow}>
          <span className={styles.checkLabel}>Webcam</span>
          <span className={styles.checkValue}>
            <span className={styles.greenCheck}>
              <span className={styles.greenCheckInner}>✓</span>
            </span>
            Connected
          </span>
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.backBtn} onClick={handleBack}>
          Back
        </button>
        <button className={styles.nextBtn} onClick={handleNext}>
          Next
        </button>
      </div>
    </>
  );
}

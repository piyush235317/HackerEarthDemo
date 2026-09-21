'use client';

import { useState, useEffect } from 'react';
import { getState, setState } from '@/lib/store';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function ProctoringPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(45);
  const [canStart, setCanStart] = useState(false);
  const [questionCount, setQuestionCount] = useState('5');
  const [showWatermark, setShowWatermark] = useState(true);

  useEffect(() => {
    const saved = getState();
    if (saved?.questionCount) {
      setQuestionCount(String(saved.questionCount));
    }
    if (saved?.showWatermark !== undefined) {
      setShowWatermark(Boolean(saved.showWatermark));
    }
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      setCanStart(true);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanStart(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTest = () => {
    const parsed = parseInt(questionCount.toString().trim(), 10);
    const count = !isNaN(parsed) && parsed > 0 ? Math.min(parsed, 100) : 5;
    setState({ proctoringReviewed: true, testStarted: true, questionCount: count, showWatermark });
    try {
      document.documentElement.requestFullscreen?.();
    } catch (e) {
      // Fullscreen may not be supported
    }
    router.push('/test');
  };

  const handleBack = () => {
    router.push('/setup/system-checks');
  };

  const parsedCount = parseInt(questionCount, 10);
  const displayCount = !isNaN(parsedCount) && parsedCount > 0 ? parsedCount : 5;
  const displayScore = displayCount === 5 ? 12 : displayCount * 2;

  return (
    <div className={styles.pageWrapper}>
      <h1 className={styles.pageTitle}>Proctoring and test instructions</h1>

      <div className={styles.scrollableContent}>
        {/* Amber Warning Countdown Banner matching reference Image 5 */}
        <div className={styles.countdownBanner}>
          <div className={styles.clockIcon}>
            <svg className={styles.clockSvg} viewBox="0 0 24 24">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
            </svg>
          </div>
          <div className={styles.countdownContent}>
            <div className={styles.countdownTitle}>
              You can start the test in {formatTime(countdown)}
            </div>
            <div className={styles.countdownText}>
              We are still setting up the test environment. Please wait for a moment.
            </div>
          </div>
        </div>

        <h2 className={styles.sectionTitle}>About this test</h2>
        <p className={styles.aboutText}>
          The practice test is set up to make you familiar with the test environment before you take the original test. This test is designed based on the same question format as the original test. The number of questions that are added in the test and duration of the test can be different from the original test.
        </p>

        <h2 className={styles.instructionsTitle}>Test instructions</h2>
        <div className={styles.instructionsList}>
          <div className={styles.instructionItem}>
            <span className={styles.bullet}>•</span>
            <span>This test contains {displayCount} MCQ questions.</span>
          </div>
          <div className={styles.instructionItem}>
            <span className={styles.bullet}>•</span>
            <span>Total number of questions: {displayCount}, Total score: {displayScore}.</span>
          </div>
          <div className={styles.instructionItem}>
            <span className={styles.bullet}>•</span>
            <span>The duration of this test is 45 mins. Your time will start when you see the questions.</span>
          </div>
          <div className={styles.instructionItem}>
            <span className={styles.bullet}>•</span>
            <span>
              We take plagiarism seriously and do not entertain activities that are against the spirit of learning and programming. Violations can lead to account suspension or permanent blacklisting from HackerEarth.
            </span>
          </div>
          <div className={styles.instructionItem}>
            <span className={styles.bullet}>•</span>
            <span>The duration of this test is 45 minutes.</span>
          </div>
          <div className={styles.instructionItem}>
            <span className={styles.bullet}>•</span>
            <span>The proctoring settings are not enabled for this test.</span>
          </div>
          <div className={styles.instructionItem}>
            <span className={styles.bullet}>•</span>
            <span>You can attempt this test multiple times.</span>
          </div>
          <div className={styles.instructionItem}>
            <span className={styles.bullet}>•</span>
            <span>You cannot pause while attempting the test.</span>
          </div>
          <div className={styles.instructionItem}>
            <span className={styles.bullet}>•</span>
            <span>Do not close the browser window or tab of the test interface before you submit your final answers.</span>
          </div>
          <div className={styles.instructionItem}>
            <span className={styles.bullet}>•</span>
            <span>Close all other windows and tabs before attempting the test.</span>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.backBtn} onClick={handleBack}>
          Back
        </button>
        <button className={styles.startBtn} onClick={handleStartTest}>
          Start test
        </button>
      </div>
    </div>
  );
}

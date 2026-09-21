'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import styles from './FullscreenManager.module.css';

export default function FullscreenManager() {
  const pathname = usePathname();
  const [showWarning, setShowWarning] = useState(false);
  const [warningCount, setWarningCount] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Routes requiring strict fullscreen proctoring
  const fullscreenRoutes = [
    '/setup/system-checks',
    '/setup/proctoring',
    '/test',
  ];

  const shouldBeFullscreen = fullscreenRoutes.some((route) => pathname?.startsWith(route));

  const isCurrentFullscreen = () => {
    if (typeof document === 'undefined') return true;
    return Boolean(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  };

  const enterFullscreen = useCallback(() => {
    if (typeof document === 'undefined') return;
    try {
      const el = document.documentElement;
      const request =
        el.requestFullscreen ||
        el.webkitRequestFullscreen ||
        el.mozRequestFullScreen ||
        el.msRequestFullscreen;

      if (request) {
        const promise = request.call(el);
        if (promise && promise.then) {
          promise
            .then(() => {
              setShowWarning(false);
            })
            .catch(() => {
              // Direct user gesture required
            });
        }
      }
    } catch (e) {
      // Ignored
    }
  }, []);

  // Listen for test completion so warning never shows after submitting
  useEffect(() => {
    const handleSubmitted = () => {
      setIsSubmitted(true);
      setShowWarning(false);
    };

    window.addEventListener('test-submitted', handleSubmitted);
    return () => {
      window.removeEventListener('test-submitted', handleSubmitted);
    };
  }, []);

  // Monitor fullscreen state on protected routes
  useEffect(() => {
    if (!shouldBeFullscreen || isSubmitted) {
      setShowWarning(false);
      return;
    }

    // Try to enter immediately
    enterFullscreen();

    const handleFullscreenChange = () => {
      const inFullscreen = isCurrentFullscreen();
      if (!inFullscreen) {
        setShowWarning(true);
        setWarningCount((prev) => prev + 1);
      } else {
        setShowWarning(false);
      }
    };

    // First interaction attempt fallback
    const handleFirstGesture = () => {
      if (!isCurrentFullscreen()) {
        enterFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });

    // Check current state after small delay for route navigation
    const checkTimer = setTimeout(() => {
      if (!isCurrentFullscreen() && shouldBeFullscreen && !isSubmitted) {
        setShowWarning(true);
      }
    }, 800);

    return () => {
      clearTimeout(checkTimer);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, [pathname, shouldBeFullscreen, isSubmitted, enterFullscreen]);

  if (!shouldBeFullscreen || isSubmitted || !showWarning) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} onClick={enterFullscreen}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Eyebrow Header */}
        <div className={styles.eyebrowHeader}>PROCTORING ALERT</div>

        {/* Warning Icon Circle Badge */}
        <div className={styles.iconCircleBadge}>
          <svg
            className={styles.iconSvg}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        </div>

        {/* Modal Title */}
        <h2 className={styles.modalTitle}>FULL-SCREEN MODE REQUIRED</h2>

        {/* Modal Subtitle */}
        <p className={styles.modalSubtitle}>
          You have exited full-screen mode or switched away from the assessment.
          This test requires full-screen mode at all times for proctoring integrity.
        </p>

        {/* Warning Notice Card */}
        <div className={styles.warningNoticeCard}>
          <div className={styles.warningNoticeIcon}>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" />
            </svg>
          </div>
          <div className={styles.warningNoticeContent}>
            <div className={styles.warningNoticeTitle}>WARNING #{warningCount}</div>
            <div className={styles.warningNoticeDesc}>
              Exiting full-screen mode is monitored and logged in your test audit report.
            </div>
          </div>
        </div>

        {/* Return to Full Screen Action Button */}
        <button
          type="button"
          className={styles.actionButton}
          onClick={enterFullscreen}
          autoFocus
        >
          <svg
            className={styles.buttonIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
          <span>Return to full screen</span>
        </button>

        <div className={styles.hintText}>
          Click anywhere or press Enter to return to full-screen mode
        </div>
      </div>
    </div>
  );
}

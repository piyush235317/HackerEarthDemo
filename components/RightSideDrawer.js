'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './RightSideDrawer.module.css';

export default function RightSideDrawer() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showExitNotice, setShowExitNotice] = useState(false);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-session-menu', handleOpen);
    return () => {
      window.removeEventListener('open-session-menu', handleOpen);
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleExitClick = () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch (e) {}

    // Attempt to close the browser window / tab
    window.close();

    try {
      window.open('', '_self', '');
      window.close();
    } catch (e) {}

    // In case browser prevents automatic tab closure, inform user
    setTimeout(() => {
      setShowExitNotice(true);
    }, 250);
  };

  return (
    <>
      {/* Collapsed Tab (when not open) */}
      {!isOpen && (
        <button
          type="button"
          className={styles.floatingTab}
          onClick={() => setIsOpen(true)}
          title="Session menu"
          aria-label="Open session menu"
        >
          <span className={styles.blueBar} />
          <span className={styles.handleIcon}>
            <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
              <rect x="0" y="1.5" width="10" height="1.8" rx="0.9" />
              <rect x="0" y="5.1" width="10" height="1.8" rx="0.9" />
              <rect x="0" y="8.7" width="10" height="1.8" rx="0.9" />
            </svg>
          </span>
        </button>
      )}

      {/* Backdrop for outside click */}
      {isOpen && (
        <div className={styles.backdrop} onClick={() => setIsOpen(false)} />
      )}

      {/* Expanded Session Card (Matches user screenshot) */}
      {isOpen && (
        <div className={styles.sessionCard}>
          {/* Glowing blue vertical bar on the left */}
          <div className={styles.cardBlueBar} />

          {/* Menu contents */}
          <div className={styles.cardContent}>
            {/* SESSION Header */}
            <div className={styles.sessionTitle}>SESSION</div>

            {/* Refresh page row */}
            <button
              type="button"
              className={styles.refreshRow}
              onClick={handleRefresh}
              title="Refresh current page"
            >
              <div className={styles.refreshLeft}>
                <svg
                  className={styles.refreshIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                <span>Refresh page</span>
              </div>

              {/* Close handle icon docked right */}
              <span
                className={styles.cardHandleIcon}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                title="Collapse menu"
              >
                <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                  <rect x="0" y="1.5" width="10" height="1.8" rx="0.9" />
                  <rect x="0" y="5.1" width="10" height="1.8" rx="0.9" />
                  <rect x="0" y="8.7" width="10" height="1.8" rx="0.9" />
                </svg>
              </span>
            </button>

            {/* Exit session red button */}
            <button
              type="button"
              className={styles.exitBtn}
              onClick={handleExitClick}
              title="Exit current session"
            >
              <svg
                className={styles.exitIcon}
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Exit session</span>
            </button>
          </div>
        </div>
      )}

      {/* Exit Notice Modal if browser blocks window.close */}
      {showExitNotice && (
        <div className={styles.modalOverlay} onClick={() => setShowExitNotice(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Session Exited</h3>
            <p className={styles.modalDesc}>
              You have successfully exited the session. Please close this browser tab or window.
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.confirmExitBtn}
                onClick={() => {
                  window.close();
                  try {
                    window.open('', '_self', '');
                    window.close();
                  } catch (e) {}
                  router.push('/test-instruction');
                }}
              >
                Close Tab
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

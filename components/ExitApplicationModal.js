'use client';

import { useState, useEffect } from 'react';
import styles from './ExitApplicationModal.module.css';

export default function ExitApplicationModal({ isOpen, onClose, onConfirm }) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!isOpen) return;

    setCountdown(10);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose(); // Automatically close dialog when timer reaches zero
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Session Control Eyebrow */}
        <div className={styles.sessionControlHeader}>SESSION CONTROL</div>

        {/* Exit Icon Circle Badge */}
        <div className={styles.iconCircleBadge}>
          <svg
            className={styles.exitIconSvg}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </div>

        {/* Title */}
        <h2 className={styles.modalTitle}>EXIT APPLICATION</h2>

        {/* Description Subtitle */}
        <p className={styles.modalSubtitle}>
          Confirm whether you want to leave SmartBrowser and end<br />your active session.
        </p>

        {/* Countdown Timer Row */}
        <div className={styles.timerRow}>
          <div className={styles.countdownBox}>
            <span className={styles.countdownDigit}>{countdown}</span>
          </div>
          <div className={styles.timerInfoCol}>
            <div className={styles.timerInfoTitle}>seconds remaining</div>
            <div className={styles.timerInfoDesc}>
              Dialog closes automatically when the timer<br />reaches zero
            </div>
          </div>
        </div>

        {/* Closing SmartBrowser Notice Card */}
        <div className={styles.infoCard}>
          Closing SmartBrowser will end your current session and return<br />you to your desktop.
        </div>

        {/* Audit Notice Glowing Warning Card */}
        <div className={styles.auditNoticeCard}>
          <div className={styles.auditIconArea}>
            <svg
              className={styles.warningTriangleIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" />
            </svg>
          </div>
          <div className={styles.auditContentCol}>
            <div className={styles.auditTitle}>AUDIT NOTICE</div>
            <div className={styles.auditDesc}>
              This action will be logged for audit purposes.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.buttonRow}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={styles.exitApplicationBtn} onClick={onConfirm}>
            Exit application
          </button>
        </div>
      </div>
    </div>
  );
}

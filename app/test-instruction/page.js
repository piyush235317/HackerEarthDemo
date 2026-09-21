'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function TestInstructionPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAccept = () => {
    if (agreed) {
      router.push('/setup/terms');
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.content}>
        <div className={styles.card}>
          {/* Header */}
          <div className={styles.headerSection}>
            <div className={styles.iconWrapper}>
              <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <line x1="10" y1="9" x2="8" y2="9"></line>
              </svg>
            </div>
            <h1 className={styles.title}>Test Instructions & Agreement</h1>
            <p className={styles.subtitle}>
              Please review the guidelines and monitoring policies before you begin.
            </p>
          </div>

          {/* Instruction Boundary Box */}
          <div className={styles.boundaryBox}>
            {/* Guidelines Grid */}
            <div className={styles.guidelinesGrid}>
              <div className={styles.guidelineItem}>
                <span className={styles.guidelineBullet}>•</span>
                <span>Remain in the test window at all times</span>
              </div>
              <div className={styles.guidelineItem}>
                <span className={styles.guidelineBullet}>•</span>
                <span>Do not switch tabs or open other applications</span>
              </div>
              <div className={styles.guidelineItem}>
                <span className={styles.guidelineBullet}>•</span>
                <span>Avoid keyboard shortcuts like <strong className={styles.boldText}>Alt+Tab</strong> or <strong className={styles.boldText}>Cmd+Tab</strong></span>
              </div>
              <div className={styles.guidelineItem}>
                <span className={styles.guidelineBullet}>•</span>
                <span>Do not disconnect or use external displays</span>
              </div>
              <div className={styles.guidelineItem}>
                <span className={styles.guidelineBullet}>•</span>
                <span>Your activity is monitored for test integrity</span>
              </div>
            </div>

            {/* Monitoring Policies */}
            <div className={styles.sectionLabel}>MONITORING POLICIES</div>
            <div className={styles.policiesGrid}>
              <div className={styles.policyCard}>
                <div className={styles.policyIcon}>
                  <svg className={styles.policyIconSvg} viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M8 16h8"></path>
                  </svg>
                </div>
                <div className={styles.policyContent}>
                  <div className={styles.policyTitle}>Keyboard Shortcuts</div>
                  <div className={styles.policyDesc}>
                    System shortcuts are monitored. Using Alt+Tab, the Windows key, or Command+Space may trigger warnings.
                  </div>
                </div>
              </div>
              <div className={styles.policyCard}>
                <div className={styles.policyIcon}>
                  <svg className={styles.policyIconSvg} viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </div>
                <div className={styles.policyContent}>
                  <div className={styles.policyTitle}>Activity Monitoring</div>
                  <div className={styles.policyDesc}>
                    Focus changes and tab switching are tracked. Please stay in the test window throughout the test.
                  </div>
                </div>
              </div>
              <div className={styles.policyCard}>
                <div className={styles.policyIcon}>
                  <svg className={styles.policyIconSvg} viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
                <div className={styles.policyContent}>
                  <div className={styles.policyTitle}>External Applications</div>
                  <div className={styles.policyDesc}>
                    Other programs are not permitted during the test and may be detected and reported.
                  </div>
                </div>
              </div>
              <div className={styles.policyCard}>
                <div className={styles.policyIcon}>
                  <svg className={styles.policyIconSvg} viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
                <div className={styles.policyContent}>
                  <div className={styles.policyTitle}>Browser Tabs</div>
                  <div className={styles.policyDesc}>
                    Opening additional tabs or windows outside the test environment is not allowed.
                  </div>
                </div>
              </div>
              <div className={styles.policyCard}>
                <div className={styles.policyIcon}>
                  <svg className={styles.policyIconSvg} viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2"></rect>
                    <line x1="6" y1="21" x2="18" y2="21"></line>
                  </svg>
                </div>
                <div className={styles.policyContent}>
                  <div className={styles.policyTitle}>External Displays</div>
                  <div className={styles.policyDesc}>
                    External displays and screen-sharing tools are monitored and not permitted during the test.
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Note */}
            <div className={styles.privacyNote}>
              <svg className={styles.shieldIconSvg} viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <polyline points="9 12 11 14 15 10"></polyline>
              </svg>
              <span>
                These measures protect the integrity of the test. Your privacy is respected — monitoring is limited to test-related activities only.
              </span>
            </div>
          </div>

          {/* Agreement Row */}
          <div className={styles.agreementRow}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                suppressHydrationWarning
              />
              <span>
                I have read and understood the instructions. I agree to follow the test guidelines.
              </span>
            </label>
            <button
              className={styles.acceptBtn}
              onClick={handleAccept}
              disabled={!agreed}
              suppressHydrationWarning
            >
              <svg className={styles.checkIconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Accept & Start Test
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

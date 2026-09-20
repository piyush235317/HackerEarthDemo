'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function TestInstructionPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  const handleAccept = () => {
    if (agreed) {
      router.push('/welcome-exl');
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.content}>
        <div className={styles.card}>
          {/* Header */}
          <div className={styles.headerSection}>
            <div className={styles.iconWrapper}>
              <svg className={styles.iconSvg} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zM8 13h8v2H8v-2zm0 4h8v2H8v-2zm0-8h4v2H8V9z"/>
              </svg>
            </div>
            <h1 className={styles.title}>Test Instructions & Agreement</h1>
            <p className={styles.subtitle}>
              Please review the guidelines and monitoring policies before you begin.
            </p>
          </div>

          {/* Instruction Boundary Box */}
          <div className={styles.boundaryBox}>
            {/* Important Guidelines */}
            <div className={styles.sectionLabel}>IMPORTANT GUIDELINES</div>
            <div className={styles.guidelinesGrid}>
              <div className={styles.guidelineItem}>
                <span className={styles.guidelineBullet}>●</span>
                <span>Remain in the test window at all times</span>
              </div>
              <div className={styles.guidelineItem}>
                <span className={styles.guidelineBullet}>●</span>
                <span>Do not switch tabs or open other applications</span>
              </div>
              <div className={styles.guidelineItem}>
                <span className={styles.guidelineBullet}>●</span>
                <span>Avoid keyboard shortcuts like Alt+Tab or Cmd+Tab</span>
              </div>
              <div className={styles.guidelineItem}>
                <span className={styles.guidelineBullet}>●</span>
                <span>Do not disconnect or use external displays</span>
              </div>
              <div className={styles.guidelineItem}>
                <span className={styles.guidelineBullet}>●</span>
                <span>Your activity is monitored for test integrity</span>
              </div>
            </div>

            {/* Monitoring Policies */}
            <div className={styles.sectionLabel}>MONITORING POLICIES</div>
            <div className={styles.policiesGrid}>
              <div className={styles.policyCard}>
                <div className={styles.policyIcon}>
                  <svg className={styles.policyIconSvg} viewBox="0 0 24 24"><path d="M20 5H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zM7 17v-2h10v2H7zm8-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"/></svg>
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
                  <svg className={styles.policyIconSvg} viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
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
                  <svg className={styles.policyIconSvg} viewBox="0 0 24 24"><path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/></svg>
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
                  <svg className={styles.policyIconSvg} viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h10v4h8v10zM4 15h2v2H4v-2zm0-4h2v2H4v-2zm0-4h2v2H4V7zm14 8h2v2h-2v-2zm0-4h2v2h-2v-2z"/></svg>
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
                  <svg className={styles.policyIconSvg} viewBox="0 0 24 24"><path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>
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
              <svg className={styles.shieldIconSvg} viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
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
              />
              <span>
                I have read and understood the instructions. I agree to follow the test guidelines.
              </span>
            </label>
            <button
              className={styles.acceptBtn}
              onClick={handleAccept}
              disabled={!agreed}
            >
              <svg className={styles.checkIconSvg} viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
              Accept & Start Test
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

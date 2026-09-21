'use client';

import { usePathname } from 'next/navigation';
import HackerEarthLogo from '@/components/HackerEarthLogo';
import styles from './layout.module.css';

const steps = [
  { label: 'Terms and conditions', path: '/setup/terms' },
  { label: 'System checks', path: '/setup/system-checks' },
  { label: 'Proctoring and test instructions', path: '/setup/proctoring' },
];

export default function SetupLayout({ children }) {
  const pathname = usePathname();

  // Determine current and completed steps based on route
  let currentStepIndex = steps.findIndex((s) => s.path === pathname);
  if (currentStepIndex === -1) currentStepIndex = 0;

  const completedSteps = [];
  for (let i = 0; i < currentStepIndex; i++) {
    completedSteps.push(i);
  }

  return (
    <div className={styles.setupLayout}>
      {/* Top Bar */}
      <header className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <HackerEarthLogo size={24} />
          <span className={styles.topBarDivider} />
          <span className={styles.testName}>Practice test</span>
        </div>
        <button
          className={styles.settingsBtn}
          aria-label="Settings"
          title="Settings"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('open-session-menu'));
            }
          }}
        >
          <svg className={styles.gearIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
          </svg>
        </button>
      </header>

      {/* Body: Centered Container */}
      <div className={styles.body}>
        <div className={styles.container}>
          {/* Sidebar Stepper */}
          <aside className={styles.sidebar}>
            <h2 className={styles.sidebarTitle}>Test set up</h2>
            <div className={styles.stepList}>
              {steps.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = completedSteps.includes(index);

                return (
                  <div
                    key={index}
                    className={`${styles.stepItem} ${isActive ? styles.stepItemActive : ''}`}
                  >
                    <div className={styles.stepIndicator}>
                      {isCompleted ? (
                        <span className={styles.completedCircle}>✓</span>
                      ) : isActive ? (
                        index === 1 ? (
                          /* Step 2 (System checks active): blue circle with checkmark ✓ */
                          <span className={styles.activeCheckCircle}>✓</span>
                        ) : (
                          <span className={styles.activeCircle}>{index + 1}</span>
                        )
                      ) : (
                        <span className={styles.inactiveCircle}>{index + 1}</span>
                      )}
                    </div>
                    <span
                      className={`${styles.stepLabel} ${
                        isActive
                          ? styles.stepLabelActive
                          : isCompleted
                          ? styles.stepLabelCompleted
                          : styles.stepLabelInactive
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Main Content Area */}
          <main className={styles.content}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

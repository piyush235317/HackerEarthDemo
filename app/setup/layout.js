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
          <HackerEarthLogo size={22} />
          <span className={styles.testName}>Practice test</span>
        </div>
        <button className={styles.themeBtn} aria-label="Theme">
          <svg className={styles.sunIcon} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4" fill="currentColor" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
                        <span className={styles.completedCheck}>✓</span>
                      ) : isActive ? (
                        <span className={styles.activeCircle}>{index + 1}</span>
                      ) : (
                        <span className={styles.inactiveNum}>{index + 1}</span>
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

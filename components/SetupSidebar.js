'use client';

import styles from './SetupSidebar.module.css';

const steps = [
  'Terms and conditions',
  'System checks',
  'Proctoring and test instructions',
];

export default function SetupSidebar({ currentStep = 1, completedSteps = [] }) {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Test set up</h2>
      <div className={styles.stepList}>
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = completedSteps.includes(stepNumber);

          let indicatorClass = styles.stepDefault;
          let labelClass = styles.labelDefault;

          if (isActive) {
            indicatorClass = styles.stepActive;
            labelClass = styles.labelActive;
          } else if (isCompleted) {
            indicatorClass = styles.stepCompleted;
            labelClass = styles.labelCompleted;
          }

          return (
            <div key={stepNumber} className={styles.stepItem}>
              <div className={`${styles.stepIndicator} ${indicatorClass}`}>
                {isCompleted ? (
                  <span className={styles.checkmark}>✓</span>
                ) : (
                  stepNumber
                )}
              </div>
              <span className={`${styles.stepLabel} ${labelClass}`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

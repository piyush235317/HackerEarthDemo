'use client';

import { useRouter } from 'next/navigation';
import { setState } from '@/lib/store';
import styles from './page.module.css';

export default function TermsPage() {
  const router = useRouter();

  const handleAccept = () => {
    setState({ termsAccepted: true, currentStep: 2 });
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch (e) {}
    router.push('/setup/system-checks');
  };

  const handleDecline = () => {
    router.push('/welcome-practice');
  };

  return (
    <>
      <h1 className={styles.pageTitle}>Terms and conditions</h1>

      <p className={styles.introText}>
        I understand that by agreeing to take this test or interview, I will be required to give my consent to the following:
      </p>

      <div className={styles.termsList}>
        <div className={styles.termItem}>
          <span className={styles.bullet}>•</span>
          <span>
            I agree to share any personal information that may be required by HackerEarth on behalf of the <strong className={styles.companyBold}>Company*</strong> (the organization which is conducting this test/interview) including, but not limited to, the following: first name, last name, e-mail ID, permanent residential address, education qualifications, work experience, age, cookies, browsing and usage data, and any other data that may be required.
          </span>
        </div>
        <div className={styles.termItem}>
          <span className={styles.bullet}>•</span>
          <span>
            I understand that HackerEarth does not take any responsibility and is not liable for any damage because of errors, omissions, negligence, or any inaccuracies in the HackerEarth platform.
          </span>
        </div>
        <div className={styles.termItem}>
          <span className={styles.bullet}>•</span>
          <span>
            If it is applicable to this test/interview, I may be required to grant access to my webcam and/or microphone. In that case, I give my explicit consent to HackerEarth to take any snapshots, record video, record audio, and capture keystrokes, if required for specific tests/interviews. I also understand and agree that when a snapshot is taken or audio is recorded, the associated background data will also be saved automatically.
          </span>
        </div>
        <div className={styles.termItem}>
          <span className={styles.bullet}>•</span>
          <span>
            I understand and agree that all data that is collected by HackerEarth on behalf of the Company will only be used internally for reviews. This information will not be shared with a third party unless required by a court of law or any other regulatory/statutory authority.
          </span>
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.declineBtn} onClick={handleDecline}>
          Decline
        </button>
        <button className={styles.acceptBtn} onClick={handleAccept}>
          Accept & Next
        </button>
      </div>
    </>
  );
}

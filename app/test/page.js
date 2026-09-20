'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import HackerEarthLogo from '@/components/HackerEarthLogo';
import { problemsData } from '@/data/problemsData';
import { getState } from '@/lib/store';
import styles from './page.module.css';

export default function TestPage() {
  const router = useRouter();

  // Mode: 'list' or 'solve'
  const [viewMode, setViewMode] = useState('list');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Question 1 by default
  const [answers, setAnswers] = useState({});
  const [isTimerVisible, setIsTimerVisible] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(75 * 60); // 75 mins (4500 seconds)
  const [showEndTestModal, setShowEndTestModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [splitPercent, setSplitPercent] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [questionLimit, setQuestionLimit] = useState(100);
  const panesWrapperRef = useRef(null);
  const activeQuestionRef = useRef(null);
  const sideQuestionListRef = useRef(null);

  useEffect(() => {
    const saved = getState();
    if (saved?.questionCount) {
      const parsed = parseInt(saved.questionCount, 10);
      if (!isNaN(parsed) && parsed > 0) {
        setQuestionLimit(Math.min(parsed, problemsData.length));
      }
    }
  }, []);

  const activeProblems = problemsData.slice(0, questionLimit);

  useEffect(() => {
    if (sideQuestionListRef.current && activeQuestionRef.current) {
      const container = sideQuestionListRef.current;
      const activeEl = activeQuestionRef.current;
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();

      if (activeRect.top < containerRect.top) {
        container.scrollTop -= (containerRect.top - activeRect.top);
      } else if (activeRect.bottom > containerRect.bottom) {
        container.scrollTop += (activeRect.bottom - containerRect.bottom);
      }
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      if (!panesWrapperRef.current) return;
      const rect = panesWrapperRef.current.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      if (clientX === undefined) return;

      const offset = clientX - rect.left;
      const percent = (offset / rect.width) * 100;
      const constrained = Math.min(Math.max(percent, 20), 80);
      setSplitPercent(constrained);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const solvedCount = Object.keys(answers).filter((k) => answers[k] !== undefined).length;
  const totalScore = activeProblems.reduce((sum, p) => sum + parseFloat(p.score || 0), 0).toFixed(2);
  const currentProblem = activeProblems[currentQuestionIndex] || activeProblems[0] || {};

  const handleSelectOption = (idx) => {
    setAnswers((prev) => ({
      ...prev,
      [currentProblem.id]: idx
    }));
  };

  const handleResetAnswer = () => {
    setAnswers((prev) => {
      const updated = { ...prev };
      delete updated[currentProblem.id];
      return updated;
    });
  };

  const handleEndTest = () => {
    setShowEndTestModal(false);
    setIsSubmitted(true);
    // Turn off camera hardware immediately
    window.dispatchEvent(new CustomEvent('test-submitted'));
  };

  // Submitted Successfully Screen
  if (isSubmitted) {
    return (
      <div className={styles.submittedWrapper}>
        {/* Top Bar with same logo as previous pages */}
        <header className={styles.submittedTopBar}>
          <div className={styles.submittedTopBarLeft}>
            <HackerEarthLogo size={32} />
          </div>
          <div className={styles.submittedTopBarRight}>
            <div className={styles.userAvatar}>Y</div>
          </div>
        </header>

        {/* Content canvas with horizontally centered success message */}
        <main className={styles.submittedMain}>
          <div className={styles.submittedStatus}>
            <div className={styles.submittedCheckCircle}>
              <svg className={styles.submittedCheckIcon} viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span>Your test is submitted successfully</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`${styles.pageWrapper} ${viewMode === 'solve' ? styles.pageWrapperSolve : ''}`}>
      {/* Top Bar */}
      <header className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <HackerEarthLogo size={32} />

          <div className={styles.metrics}>
            <div className={styles.metricItem}>
              {/* Clock / Solved Count */}
              <svg className={styles.clockIcon} viewBox="0 0 24 24">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
              </svg>
              <span>{solvedCount}/{activeProblems.length}</span>
            </div>

            <div className={styles.metricItem}>
              {/* Diamond total score */}
              <svg className={styles.diamondIcon} viewBox="0 0 512 512">
                <path d="M168.5 72L256 165l87.5-93-175 0zM383.9 99.1L311.5 176l129 0L383.9 99.1zm50 124.9L256 224 78.1 224 256 420.3 433.9 224zM71.5 176l129 0L128.1 99.1 71.5 176zm434.3 40.1l-232 256c-4.5 5-11 7.9-17.8 7.9s-13.2-2.9-17.8-7.9l-232-256c-7.7-8.5-8.3-21.2-1.5-30.4l112-152c4.5-6.1 11.7-9.8 19.3-9.8l240 0c7.6 0 14.8 3.6 19.3 9.8l112 152c6.8 9.2 6.1 21.9-1.5 30.4z" />
              </svg>
              <span>{parseInt(totalScore, 10)}</span>
            </div>

            <div className={styles.metricItem}>
              {/* Green Wifi signal - bordered tile */}
              <div className={styles.wifiTile}>
                <svg className={styles.wifiIcon} viewBox="0 0 24 24">
                  <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 3.5c3.62 0 6.94 1.34 9.48 3.58L12 19.34 2.52 11.08C5.06 8.84 8.38 7.5 12 7.5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Center Timer / Toggle */}
        <div className={styles.topBarCenter}>
          {!isTimerVisible ? (
            <button
              className={styles.showTimerBtn}
              onClick={() => setIsTimerVisible(true)}
              title="Click to show timer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>Show timer</span>
            </button>
          ) : (
            <div
              className={styles.timerPill}
              onClick={() => setIsTimerVisible(false)}
              title="Click to hide timer"
            >
              <span className={styles.timerText}>{formatTimer(secondsLeft)}</span>
              <button
                type="button"
                className={styles.eyeToggleBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTimerVisible(false);
                }}
                title="Hide timer"
                aria-label="Hide timer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
                  <circle cx="12" cy="12" r="3" />
                  <line x1="3" y1="21" x2="21" y2="3" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* End test button on list view */}
        {viewMode === 'list' ? (
          <button className={styles.endTestBtn} onClick={() => setShowEndTestModal(true)}>
            <svg className={styles.exitIcon} viewBox="0 0 24 24">
              <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
            </svg>
            <span>End test</span>
          </button>
        ) : (
          <div></div>
        )}
      </header>

      {/* VIEW MODE 1: PROBLEMS LIST */}
      {viewMode === 'list' && (
        <main className={styles.mainContainer}>
          <div className={styles.headerRow}>
            <div>
              <div className={styles.problemsCount}>{activeProblems.length} problems</div>
              <h1 className={styles.pageTitle}>Practice test : Problems list</h1>
            </div>

            <div className={styles.totalScoreInfo}>
              <span>Total score: {totalScore}</span>
              <svg className={styles.infoIcon} viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
            </div>
          </div>

          <div className={styles.problemsList}>
            {activeProblems.map((problem, index) => {
              const isAnswered = answers[problem.id] !== undefined;

              return (
                <div key={problem.id} className={styles.problemCard}>
                  <div className={styles.problemLeft}>
                    <div className={styles.numberCircle}>{problem.id}</div>
                    <div className={styles.problemContent}>
                      <div className={styles.problemTitle}>
                        {problem.title}
                        {problem.snippet && (
                          <div className={styles.codeSnippet}>{problem.snippet}</div>
                        )}
                      </div>
                      <div className={styles.tagsRow}>
                        <span className={styles.mcqBadge}>{problem.type}</span>
                        <div className={styles.scoreBadge}>
                          <svg className={styles.cardDiamond} viewBox="0 0 512 512">
                            <path d="M168.5 72L256 165l87.5-93-175 0zM383.9 99.1L311.5 176l129 0L383.9 99.1zm50 124.9L256 224 78.1 224 256 420.3 433.9 224zM71.5 176l129 0L128.1 99.1 71.5 176zm434.3 40.1l-232 256c-4.5 5-11 7.9-17.8 7.9s-13.2-2.9-17.8-7.9l-232-256c-7.7-8.5-8.3-21.2-1.5-30.4l112-152c4.5-6.1 11.7-9.8 19.3-9.8l240 0c7.6 0 14.8 3.6 19.3 9.8l112 152c6.8 9.2 6.1 21.9-1.5 30.4z" />
                          </svg>
                          <span>{problem.score}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    className={`${styles.solveBtn} ${isAnswered ? styles.solveBtnSolved : ''}`}
                    onClick={() => {
                      setCurrentQuestionIndex(index);
                      setViewMode('solve');
                    }}
                  >
                    {isAnswered ? 'Review' : 'Solve'}
                  </button>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* VIEW MODE 2: SPLIT SOLVE VIEW (MATCHES USER SCREENSHOT) */}
      {viewMode === 'solve' && (
        <div className={styles.solveContainer}>
          {/* Left Navigation Rail */}
          <aside className={styles.sideRail}>
            <div className={styles.sideRailTop}>
              {/* Back to problems list button */}
              <button
                className={styles.problemsListIconBtn}
                onClick={() => setViewMode('list')}
                title="Back to Problems List"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                </svg>
              </button>

              {/* Questions vertical list */}
              <div className={styles.sideQuestionList} ref={sideQuestionListRef}>
                {activeProblems.map((p, idx) => {
                  const isActive = idx === currentQuestionIndex;
                  const isSolved = answers[p.id] !== undefined;

                  return (
                    <div
                      key={p.id}
                      ref={isActive ? activeQuestionRef : null}
                      className={`${styles.sideQuestionNum} ${
                        isActive ? styles.sideQuestionNumActive : ''
                      } ${isSolved ? styles.sideQuestionNumSolved : ''}`}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      title={`Question ${p.id}`}
                    >
                      {p.id}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom tools on side rail */}
            <div className={styles.sideRailBottom}>
              <button className={styles.sideRailBtn} title="Theme">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>

              <button className={styles.sideRailBtn} title="Help">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
                </svg>
              </button>

              <button
                className={styles.sideRailEndBtn}
                title="End test"
                onClick={() => setShowEndTestModal(true)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                </svg>
              </button>
            </div>
          </aside>

          {/* Split Panes Area */}
          <div className={styles.splitArea}>
            <div className={styles.panesWrapper} ref={panesWrapperRef}>
              {/* Question Left Pane */}
              <div
                className={styles.questionPane}
                style={{ width: `${splitPercent}%`, flex: 'none' }}
              >
                <div className={styles.questionScrollArea}>
                  {/* Watermark */}
                  <div className={styles.watermarkContainer}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className={styles.watermarkItem}>
                        <div>mde2025011@iiita.ac.in</div>
                        <div>2026-09-19 14:09 • UTC</div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.questionHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={styles.mcqBadge}>{currentProblem.type}</span>
                    </div>
                    <div className={styles.questionHeaderRight}>
                      {/* Score badge cell */}
                      <div className={styles.scorePanelCell}>
                        <svg className={styles.cardDiamond} viewBox="0 0 512 512">
                          <path d="M168.5 72L256 165l87.5-93-175 0zM383.9 99.1L311.5 176l129 0L383.9 99.1zm50 124.9L256 224 78.1 224 256 420.3 433.9 224zM71.5 176l129 0L128.1 99.1 71.5 176zm434.3 40.1l-232 256c-4.5 5-11 7.9-17.8 7.9s-13.2-2.9-17.8-7.9l-232-256c-7.7-8.5-8.3-21.2-1.5-30.4l112-152c4.5-6.1 11.7-9.8 19.3-9.8l240 0c7.6 0 14.8 3.6 19.3 9.8l112 152c6.8 9.2 6.1 21.9-1.5 30.4z" />
                        </svg>
                        <span>{currentProblem.score}</span>
                      </div>
                      {/* Vertical divider */}
                      <div className={styles.questionHeaderDivider} />
                      {/* Bug / Settings icon cell */}
                      <div className={styles.bugIconCell}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 8h-1.81c-.45-.78-1.07-1.45-1.82-1.96l.93-.93a.996.996 0 1 0-1.41-1.41l-1.47 1.47C12.78 5.06 12.06 5 11.3 5c-.76 0-1.48.06-2.12.17L7.71 3.7a.996.996 0 1 0-1.41 1.41l.93.93c-.75.51-1.37 1.18-1.82 1.96H3.5a1 1 0 1 0 0 2h1.61c-.07.32-.11.66-.11 1v1H3.5a1 1 0 1 0 0 2H5v1c0 .34.04.68.11 1H3.5a1 1 0 1 0 0 2h1.91c.62 1.09 1.55 1.97 2.68 2.5l-.8 1.6a1 1 0 1 0 1.79.89l1-2c.69.13 1.4.21 2.12.21.72 0 1.43-.08 2.12-.21l1 2a1 1 0 1 0 1.79-.89l-.8-1.6c1.13-.53 2.06-1.41 2.68-2.5h1.91a1 1 0 1 0 0-2h-1.61c.07-.32.11-.66.11-1v-1h1.5a1 1 0 1 0 0-2h-1.5v-1c0-.34-.04-.68-.11-1h1.61a1 1 0 1 0 0-2zM12 17c-2.76 0-5-2.24-5-5v-2h10v2c0 2.76-2.24 5-5 5z"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className={styles.questionBody}>
                    {currentProblem.title}
                    {currentProblem.snippet && (
                      <div className={styles.questionPassageBox}>
                        {currentProblem.snippet}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Navigation Bar inside Question Section */}
                <div className={styles.questionBottomNav}>
                  <button
                    className={styles.navBtn}
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  >
                    &lt; Previous
                  </button>

                  <span className={styles.questionIndexIndicator}>
                    {currentQuestionIndex + 1}/{activeProblems.length}
                  </span>

                  <button
                    className={styles.navBtn}
                    disabled={currentQuestionIndex >= activeProblems.length - 1}
                    onClick={() => setCurrentQuestionIndex((prev) => Math.min(activeProblems.length - 1, prev + 1))}
                  >
                    Next &gt;
                  </button>
                </div>
              </div>

              {/* Resizer Divider with centered handle on the line */}
              <div
                className={`${styles.resizerDivider} ${isDragging ? styles.resizerDragging : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onTouchStart={() => setIsDragging(true)}
                title="Drag left or right to resize layout"
              >
                <div className={styles.dividerLine} />
                <div className={styles.dividerHandle}>
                  <svg width="6" height="12" viewBox="0 0 6 12" fill="currentColor">
                    <circle cx="1.5" cy="2" r="0.9" />
                    <circle cx="4.5" cy="2" r="0.9" />
                    <circle cx="1.5" cy="6" r="0.9" />
                    <circle cx="4.5" cy="6" r="0.9" />
                    <circle cx="1.5" cy="10" r="0.9" />
                    <circle cx="4.5" cy="10" r="0.9" />
                  </svg>
                </div>
              </div>

              {/* Answer Right Pane */}
              <div
                className={styles.answerPane}
                style={{ width: `${100 - splitPercent}%`, flex: 'none' }}
              >
                {/* Watermark */}
                <div className={styles.watermarkContainer}>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className={styles.watermarkItem}>
                      <div>mde2025011@iiita.ac.in</div>
                      <div>2026-09-19 14:09 • UTC</div>
                    </div>
                  ))}
                </div>

                <div className={styles.answerTitle}>
                  Select your answer to the problem below
                </div>

                <div className={styles.optionsStack}>
                  {currentProblem.options.map((opt, idx) => {
                    const isSelected = answers[currentProblem.id] === idx;

                    return (
                      <div
                        key={idx}
                        className={`${styles.optionCard} ${
                          isSelected ? styles.optionCardSelected : ''
                        }`}
                        onClick={() => handleSelectOption(idx)}
                      >
                        <div
                          className={`${styles.radioCircle} ${
                            isSelected ? styles.radioCircleSelected : ''
                          }`}
                        />
                        <span className={styles.optionLabel}>{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Reset Answer Button */}
                {answers[currentProblem.id] !== undefined && (
                  <button className={styles.resetAnswerBtn} onClick={handleResetAnswer}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 4v6h-6M1 20v-6h6"/>
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                    </svg>
                    <span>Reset Answer</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* End Test Modal */}
      {showEndTestModal && (
        <div className={styles.modalOverlay} onClick={() => setShowEndTestModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>End Test Confirmation</h3>
            <p className={styles.modalQuestion}>
              Are you sure you want to end the test? You have answered {solvedCount} out of {activeProblems.length} problems.
            </p>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowEndTestModal(false)}>
                Cancel
              </button>
              <button className={styles.endTestBtn} onClick={handleEndTest}>
                Confirm & End Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

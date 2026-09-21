'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import HackerEarthLogo from '@/components/HackerEarthLogo';
import DiamondIcon from '@/components/DiamondIcon';
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
  const [isFullscreenWarning, setIsFullscreenWarning] = useState(false);

  const [splitPercent, setSplitPercent] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [questionLimit, setQuestionLimit] = useState(100);
  const [showWatermark, setShowWatermark] = useState(true);
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
    if (saved?.showWatermark !== undefined) {
      setShowWatermark(Boolean(saved.showWatermark));
    }
  }, []);

  // Fullscreen enforcement
  useEffect(() => {
    const handleFsChange = () => {
      const isFs = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreenWarning(!isFs);
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        setIsFullscreenWarning(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    document.addEventListener('mozfullscreenchange', handleFsChange);
    document.addEventListener('msfullscreenchange', handleFsChange);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
      document.removeEventListener('mozfullscreenchange', handleFsChange);
      document.removeEventListener('msfullscreenchange', handleFsChange);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const handleReturnFullscreen = () => {
    const el = document.documentElement;
    const req =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullscreen;
    if (req) req.call(el).catch(() => {});
    setIsFullscreenWarning(false);
  };

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

      {/* Fullscreen Warning Overlay */}
      {isFullscreenWarning && (
        <div className={styles.fsOverlay}>
          <div className={styles.fsCard}>
            <div className={styles.fsIconRing}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h2 className={styles.fsTitle}>Fullscreen Required</h2>
            <p className={styles.fsMessage}>
              You have exited fullscreen mode. Please return to fullscreen to continue your test.
              Leaving fullscreen may be flagged as a violation.
            </p>
            <button className={styles.fsBtn} onClick={handleReturnFullscreen}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
              Return to Fullscreen
            </button>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <header className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <div className={styles.topBarLogoArea}>
            <HackerEarthLogo size={32} />
            <div className={styles.topBarDivider} />
          </div>

          <div className={styles.metrics}>
            <div className={styles.metricItem}>
              {/* Checkmark Circle / Solved Count */}
              <svg className={`${styles.checkCircleIcon} ${solvedCount > 0 ? styles.checkCircleIconSolved : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              <span>{solvedCount}/{activeProblems.length}</span>
            </div>

            <div className={styles.metricItem}>
              {/* Diamond total score */}
              <DiamondIcon size={16} className={styles.diamondIcon} />
              <span>{parseInt(totalScore, 10)}</span>
            </div>

            <div className={styles.metricItem}>
              {/* Green Wifi signal - bordered tile */}
              <div className={styles.wifiTile}>
                <svg className={styles.wifiIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                  <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                  <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
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
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" y1="2" x2="22" y2="22" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* End test button on list view */}
        {viewMode === 'list' ? (
          <button className={styles.endTestBtn} onClick={() => setShowEndTestModal(true)}>
            <svg className={styles.exitIcon} viewBox="0 0 24 24">
              <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
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
              <h1 className={styles.pageTitle}>EXL Digital Campus Test : Problems list</h1>
            </div>

            <div className={styles.totalScoreInfo}>
              <span>Total score: {totalScore}</span>
              <svg className={styles.infoIcon} viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </div>
          </div>

          <div className={styles.problemsList}>
            {activeProblems.map((problem, index) => {
              const isAnswered = answers[problem.id] !== undefined;

              return (
                <div key={problem.id} className={styles.problemCard}>
                  <div className={styles.problemLeft}>
                    <div className={`${styles.numberCircle} ${isAnswered ? styles.numberCircleSolved : ''}`}>
                      {problem.id}
                    </div>
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
                          <DiamondIcon size={15} className={styles.cardDiamond} />
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
              {/* Back to problems list button in aligned header */}
              <div className={styles.sideRailHeader}>
                <button
                  className={styles.problemsListIconBtn}
                  onClick={() => setViewMode('list')}
                  title="Back to Problems List"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                    <polyline points="13 9 16 12 13 15" />
                  </svg>
                </button>
                <div className={styles.sideRailDivider} />
              </div>

              {/* Questions vertical list */}
              <div className={styles.sideQuestionList} ref={sideQuestionListRef}>
                {activeProblems.map((p, idx) => {
                  const isActive = idx === currentQuestionIndex;
                  const isSolved = answers[p.id] !== undefined;

                  return (
                    <div
                      key={p.id}
                      ref={isActive ? activeQuestionRef : null}
                      className={`${styles.sideQuestionNum} ${isActive ? styles.sideQuestionNumActive : ''
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
                  <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
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
                  {showWatermark && (
                    <div className={styles.watermarkContainer}>
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={styles.watermarkItem}>
                          <div>anandbhansinghchouhan@gmail.com</div>
                          <div>2026-09-21 19:11 • UTC</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className={styles.questionHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={styles.mcqBadge}>{currentProblem.type}</span>
                    </div>
                    <div className={styles.questionHeaderRight}>
                      {/* Score badge cell */}
                      <div className={styles.scorePanelCell}>
                        <DiamondIcon size={14} className={styles.cardDiamond} />
                        <span>{currentProblem.score}</span>
                      </div>
                      {/* Vertical divider */}
                      <div className={styles.questionHeaderDivider} />
                      {/* Bug / Report icon cell */}
                      <div className={styles.bugIconCell} title="Report an issue">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className={styles.questionBody}>
                    {currentProblem.snippet ? (
                      <>
                        <div className={styles.passageInstructionText}>
                          {currentProblem.passageHeader || "Study the provided information and answer the following questions:"}
                        </div>
                        <div className={styles.questionPassageBox}>
                          {currentProblem.snippet}
                        </div>
                        <div className={styles.questionPromptTitle}>
                          {currentProblem.title}
                        </div>
                      </>
                    ) : (
                      currentProblem.title
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
                    <svg width="8" height="12" viewBox="0 0 8 13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={styles.navBtnIcon}>
                      <path d="M6 2L2 6.5L6 11" />
                    </svg>
                    <span>Previous</span>
                  </button>

                  <span className={styles.questionIndexIndicator}>
                    {currentQuestionIndex + 1}/{activeProblems.length}
                  </span>

                  <button
                    className={styles.navBtn}
                    disabled={currentQuestionIndex >= activeProblems.length - 1}
                    onClick={() => setCurrentQuestionIndex((prev) => Math.min(activeProblems.length - 1, prev + 1))}
                  >
                    <span>Next</span>
                    <svg width="8" height="12" viewBox="0 0 8 13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={styles.navBtnIcon}>
                      <path d="M2 2L6 6.5L2 11" />
                    </svg>
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
                {showWatermark && (
                  <div className={styles.watermarkContainer}>
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={styles.watermarkItem}>
                        <div>anandbhansinghchouhan@gmail.com</div>
                        <div>2026-09-21 19:11 • UTC</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className={styles.answerTitle}>
                  Select your answer to the problem below
                </div>

                <div className={styles.optionsSection}>
                  <div className={styles.optionsStack}>
                    {currentProblem.options.map((opt, idx) => {
                      const isSelected = answers[currentProblem.id] === idx;

                      return (
                        <div
                          key={idx}
                          className={`${styles.optionCard} ${isSelected ? styles.optionCardSelected : ''
                            }`}
                          onClick={() => handleSelectOption(idx)}
                        >
                          <div
                            className={`${styles.radioCircle} ${isSelected ? styles.radioCircleSelected : ''
                              }`}
                          />
                          <span className={styles.optionLabel}>{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reset Answer Button positioned directly below the options */}
                  <div className={styles.resetAnswerRow}>
                    <button className={styles.resetAnswerBtn} onClick={handleResetAnswer}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 4v6h-6M1 20v-6h6" />
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                      </svg>
                      <span>Reset Answer</span>
                    </button>
                  </div>
                </div>
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

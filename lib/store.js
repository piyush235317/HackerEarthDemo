// localStorage helper for assessment state management

const STORAGE_KEY = 'exl_assessment_state';

const defaultState = {
  currentStep: 0,
  termsAccepted: false,
  systemChecksCompleted: false,
  proctoringReviewed: false,
  testStarted: false,
  userName: 'Yatnish Manik',
  questionCount: 100,
};

export function getState() {
  if (typeof window === 'undefined') return defaultState;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultState, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Error reading state:', e);
  }
  return { ...defaultState };
}

export function setState(updates) {
  if (typeof window === 'undefined') return;
  try {
    const current = getState();
    const newState = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    return newState;
  } catch (e) {
    console.error('Error saving state:', e);
  }
}

export function resetState() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

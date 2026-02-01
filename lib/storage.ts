// lib/storage.ts
// Lưu & đọc trạng thái Begin Right từ localStorage

export type Level = "beginner" | "beginner_plus";
export type SessionLength = 15 | 25 | 40;
export type FitnessGrade = "A" | "B" | "C" | "D";

export type OnboardingAnswers = {
  sessionLength: SessionLength;
  levelSelfCheck: "ok" | "not_ok";
  healthGroup: "healthy" | "knee" | "back" | "other";

  // Tự đánh giá nhanh để chọn nhịp an toàn (MVP)
  fitnessCheck: {
    squat: FitnessGrade;
    push: FitnessGrade;
    balance: FitnessGrade;
  };
};

export type OnboardingDecision =
  | {
      resultType: "training";
      level: Level;
      healthPreset: "normal" | "knee_safe" | "back_safe";
      reason: string;
    }
  | {
      resultType: "safety";
      reason: string;
    }
  | {
      resultType: "stop";
      reason: string;
    };

export type BeginRightState = {
  onboarding?: {
    answers: OnboardingAnswers;
    decision: OnboardingDecision;
  };
  progress: {
    dayIndex: number;
    completedDays: number[];
  };
  updatedAt: number;
};

const STORAGE_KEY = "begin-right-state";

export function loadState(): BeginRightState {
  if (typeof window === "undefined") {
    return defaultState();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return JSON.parse(raw) as BeginRightState;
  } catch {
    return defaultState();
  }
}

export function saveState(state: BeginRightState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function defaultState(): BeginRightState {
  return {
    progress: {
      dayIndex: 1,
      completedDays: [],
    },
    updatedAt: Date.now(),
  };
}

export function setOnboarding(answers: OnboardingAnswers, decision: OnboardingDecision) {
  const next: BeginRightState = {
    onboarding: { answers, decision },
    progress: { dayIndex: 1, completedDays: [] },
    updatedAt: Date.now(),
  };
  saveState(next);
  return next;
}

export function markDayComplete(day: number) {
  const s = loadState();
  const completed = new Set(s.progress.completedDays);
  completed.add(day);

  const next: BeginRightState = {
    ...s,
    progress: {
      dayIndex: Math.min(day + 1, 14),
      completedDays: Array.from(completed),
    },
    updatedAt: Date.now(),
  };

  saveState(next);
  return next;
}

export function resetAll() {
  const s = defaultState();
  saveState(s);
  return s;
}

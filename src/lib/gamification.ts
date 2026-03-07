// Gamification: Bookmarks, Streaks, XP, Levels

const BOOKMARKS_KEY = "sat-ace-pro-bookmarks";
const STREAK_KEY = "sat-ace-pro-streak";
const XP_KEY = "sat-ace-pro-xp";

// --- Bookmarks ---
export function getBookmarks(): number[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function toggleBookmark(questionId: number): boolean {
  const bm = getBookmarks();
  const idx = bm.indexOf(questionId);
  if (idx >= 0) {
    bm.splice(idx, 1);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bm));
    return false;
  }
  bm.push(questionId);
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bm));
  return true;
}

export function isBookmarked(questionId: number): boolean {
  return getBookmarks().includes(questionId);
}

// --- Streaks ---
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string | null;
}

export function getStreakData(): StreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    return raw ? JSON.parse(raw) : { currentStreak: 0, longestStreak: 0, lastPracticeDate: null };
  } catch { return { currentStreak: 0, longestStreak: 0, lastPracticeDate: null }; }
}

const PRACTICE_DAYS_KEY = "sat-ace-pro-practice-days";

export function getPracticeDays(): string[] {
  try {
    const raw = localStorage.getItem(PRACTICE_DAYS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function savePracticeDay(date: string) {
  const days = getPracticeDays();
  if (!days.includes(date)) {
    days.push(date);
    // Keep last 365 days
    localStorage.setItem(PRACTICE_DAYS_KEY, JSON.stringify(days.slice(-365)));
  }
}

export function recordPracticeDay(): StreakData {
  const data = getStreakData();
  const today = new Date().toISOString().split("T")[0];
  savePracticeDay(today);
  
  if (data.lastPracticeDate === today) return data;
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];
  
  if (data.lastPracticeDate === yesterdayStr) {
    data.currentStreak += 1;
  } else {
    data.currentStreak = 1;
  }
  
  data.longestStreak = Math.max(data.longestStreak, data.currentStreak);
  data.lastPracticeDate = today;
  localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  return data;
}

export function getStreakBadges(streak: number): { label: string; earned: boolean }[] {
  return [
    { label: "🔥 3-Day Streak", earned: streak >= 3 },
    { label: "⚡ 7-Day Streak", earned: streak >= 7 },
    { label: "🏆 30-Day Streak", earned: streak >= 30 },
  ];
}

// --- XP & Levels ---
export interface XPData {
  totalXP: number;
  level: string;
}

const LEVELS = [
  { min: 0, label: "Beginner" },
  { min: 200, label: "Learner" },
  { min: 500, label: "Intermediate" },
  { min: 1000, label: "Advanced" },
  { min: 2000, label: "Expert" },
  { min: 5000, label: "Master" },
];

export function getXPData(): XPData {
  try {
    const raw = localStorage.getItem(XP_KEY);
    const totalXP = raw ? JSON.parse(raw) : 0;
    const level = LEVELS.slice().reverse().find(l => totalXP >= l.min)?.label || "Beginner";
    return { totalXP, level };
  } catch { return { totalXP: 0, level: "Beginner" }; }
}

export function addXP(amount: number): XPData {
  const current = getXPData();
  const newTotal = current.totalXP + amount;
  localStorage.setItem(XP_KEY, JSON.stringify(newTotal));
  const level = LEVELS.slice().reverse().find(l => newTotal >= l.min)?.label || "Beginner";
  return { totalXP: newTotal, level };
}

export function calculateTestXP(correct: number, total: number, isPerfect: boolean): number {
  let xp = correct * 10; // 10 XP per correct answer
  if (isPerfect) xp += 50; // bonus for perfect score
  xp += 20; // completion bonus
  return xp;
}

export function getNextLevel(totalXP: number): { label: string; xpNeeded: number } | null {
  const next = LEVELS.find(l => l.min > totalXP);
  return next ? { label: next.label, xpNeeded: next.min - totalXP } : null;
}

// --- Score Badges ---
export interface ScoreBadge {
  id: string;
  label: string;
  emoji: string;
  minPct: number;
  color: string; // tailwind token-friendly class
}

const SCORE_BADGES: ScoreBadge[] = [
  { id: "master", label: "Master", emoji: "👑", minPct: 90, color: "text-yellow-500" },
  { id: "gold", label: "Gold", emoji: "🥇", minPct: 75, color: "text-amber-500" },
  { id: "silver", label: "Silver", emoji: "🥈", minPct: 60, color: "text-slate-400" },
  { id: "bronze", label: "Bronze", emoji: "🥉", minPct: 40, color: "text-orange-700" },
  { id: "practice", label: "Keep Practicing", emoji: "💪", minPct: 0, color: "text-muted-foreground" },
];

export function getBadgeForScore(pct: number): ScoreBadge {
  return SCORE_BADGES.find(b => pct >= b.minPct) || SCORE_BADGES[SCORE_BADGES.length - 1];
}

// --- Badge History ---
const BADGES_HISTORY_KEY = "sat-ace-pro-badges";

export interface EarnedBadge {
  badgeId: string;
  label: string;
  emoji: string;
  score: number;
  total: number;
  pct: number;
  section: string;
  date: string;
}

export function getEarnedBadges(): EarnedBadge[] {
  try {
    const raw = localStorage.getItem(BADGES_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveEarnedBadge(correct: number, total: number, section: string): EarnedBadge {
  const pct = Math.round((correct / total) * 100);
  const badge = getBadgeForScore(pct);
  const entry: EarnedBadge = {
    badgeId: badge.id,
    label: badge.label,
    emoji: badge.emoji,
    score: correct,
    total,
    pct,
    section,
    date: new Date().toISOString(),
  };
  const history = getEarnedBadges();
  history.push(entry);
  // keep last 100
  localStorage.setItem(BADGES_HISTORY_KEY, JSON.stringify(history.slice(-100)));
  return entry;
}

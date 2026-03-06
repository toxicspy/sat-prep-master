/**
 * Smart Mistake Tracking System
 * Stores, analyzes, and manages incorrectly answered questions.
 * Uses localStorage for persistence — designed for easy backend migration.
 */

import { Difficulty, Topic } from "@/data/questions";

/** Stored mistake record */
export interface MistakeRecord {
  question_id: number;
  question_text: string;
  options: string[];
  selected_answer: number;
  correct_answer: number;
  explanation: string;
  topic: Topic;
  section: string;
  difficulty: Difficulty;
  time_spent: number; // seconds
  date_attempted: string; // ISO string
  correct_streak: number; // times answered correctly in retake
  is_cleared: boolean; // auto-cleared after 3 correct retakes
  passage?: string;
}

/** Analytics summary */
export interface MistakeAnalytics {
  totalMistakes: number;
  activeMistakes: number;
  clearedMistakes: number;
  weakestTopic: string | null;
  topicCounts: Record<string, number>;
  hardestDifficulty: Difficulty | null;
  difficultyCounts: Record<string, number>;
  avgTimeOnMistakes: number;
  improvementRate: number; // percentage of cleared vs total
  carelessCount: number; // fast wrong answers
  guessWarning: boolean;
}

const STORAGE_KEY = "sat_mistakes";
const CARELESS_THRESHOLD = 5; // seconds
const CLEAR_AFTER_CORRECT = 3;

// ─── CRUD Operations ─────────────────────────────────────

/** Get all mistake records from storage */
export function getMistakes(): MistakeRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Save mistakes array to storage */
function saveMistakes(mistakes: MistakeRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mistakes));
}

/** Record a single incorrect answer immediately */
export function recordSingleMistake(
  q: { id: number; question: string; options: string[]; correct: number; explanation: string; topic: Topic; section: string; difficulty: Difficulty; passage?: string },
  selectedAnswer: number,
  timeSpent: number
): void {
  const existing = getMistakes();
  const idx = existing.findIndex((m) => m.question_id === q.id);

  if (idx !== -1) {
    // Update existing mistake
    existing[idx].selected_answer = selectedAnswer;
    existing[idx].time_spent = timeSpent;
    existing[idx].date_attempted = new Date().toISOString();
    existing[idx].correct_streak = 0;
    existing[idx].is_cleared = false;
  } else {
    existing.push({
      question_id: q.id,
      question_text: q.question,
      options: q.options,
      selected_answer: selectedAnswer,
      correct_answer: q.correct,
      explanation: q.explanation,
      topic: q.topic,
      section: q.section,
      difficulty: q.difficulty,
      time_spent: timeSpent,
      date_attempted: new Date().toISOString(),
      correct_streak: 0,
      is_cleared: false,
      passage: q.passage,
    });
  }

  saveMistakes(existing);
}

/** Record incorrect answers from a test submission (batch — kept for backward compat) */
export function recordMistakes(
  answers: Record<number, number>,
  questions: { id: number; question: string; options: string[]; correct: number; explanation: string; topic: Topic; section: string; difficulty: Difficulty; passage?: string }[],
  questionTimes: Record<number, number>
): void {
  questions.forEach((q) => {
    const selectedAnswer = answers[q.id];
    if (selectedAnswer === undefined || selectedAnswer === q.correct) return;
    recordSingleMistake(q, selectedAnswer, questionTimes[q.id] ?? 0);
  });
}

/** Record a correct retake answer — increment streak, auto-clear at threshold */
export function recordCorrectRetake(questionId: number): boolean {
  const mistakes = getMistakes();
  const idx = mistakes.findIndex((m) => m.question_id === questionId);
  if (idx === -1) return false;

  mistakes[idx].correct_streak += 1;
  if (mistakes[idx].correct_streak >= CLEAR_AFTER_CORRECT) {
    mistakes[idx].is_cleared = true;
  }
  saveMistakes(mistakes);
  return mistakes[idx].is_cleared;
}

/** Remove a single mistake by question ID */
export function removeMistake(questionId: number): void {
  const mistakes = getMistakes().filter((m) => m.question_id !== questionId);
  saveMistakes(mistakes);
}

/** Clear all mistakes */
export function clearAllMistakes(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** Get only active (non-cleared) mistakes */
export function getActiveMistakes(): MistakeRecord[] {
  return getMistakes().filter((m) => !m.is_cleared);
}

// ─── Analytics ────────────────────────────────────────────

/** Compute mistake analytics summary */
export function getMistakeAnalytics(): MistakeAnalytics {
  const all = getMistakes();
  const active = all.filter((m) => !m.is_cleared);
  const cleared = all.filter((m) => m.is_cleared);

  // Topic counts
  const topicCounts: Record<string, number> = {};
  active.forEach((m) => {
    topicCounts[m.topic] = (topicCounts[m.topic] || 0) + 1;
  });
  const weakestTopic = Object.entries(topicCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  // Difficulty counts
  const difficultyCounts: Record<string, number> = {};
  active.forEach((m) => {
    difficultyCounts[m.difficulty] = (difficultyCounts[m.difficulty] || 0) + 1;
  });
  const hardestDifficulty = Object.entries(difficultyCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as Difficulty | null;

  // Average time on mistakes
  const avgTimeOnMistakes = active.length > 0
    ? Math.round(active.reduce((s, m) => s + m.time_spent, 0) / active.length)
    : 0;

  // Careless mistakes (fast wrong answers)
  const carelessCount = active.filter((m) => m.time_spent > 0 && m.time_spent < CARELESS_THRESHOLD).length;

  // Improvement rate
  const improvementRate = all.length > 0 ? Math.round((cleared.length / all.length) * 100) : 0;

  return {
    totalMistakes: all.length,
    activeMistakes: active.length,
    clearedMistakes: cleared.length,
    weakestTopic,
    topicCounts,
    hardestDifficulty,
    difficultyCounts,
    avgTimeOnMistakes,
    improvementRate,
    carelessCount,
    guessWarning: carelessCount >= 3,
  };
}

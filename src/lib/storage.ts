import { Topic } from "@/data/questions";

export interface TestAttempt {
  id: string;
  date: string;
  section: string;
  correct: number;
  total: number;
  percentage: number;
  difficulty: string;
  topicScores: Record<string, { correct: number; total: number }>;
  timeUsed?: number; // seconds
}

const STORAGE_KEY = "sat-ace-pro-attempts";

export function getAttempts(): TestAttempt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAttempt(attempt: TestAttempt): void {
  const attempts = getAttempts();
  attempts.unshift(attempt);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts.slice(0, 100)));
}

export function getStats() {
  const attempts = getAttempts();
  if (attempts.length === 0) {
    return { totalTests: 0, avgScore: 0, highestScore: 0, accuracyRate: 0, recentAttempts: [] };
  }
  const totalTests = attempts.length;
  const avgScore = Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / totalTests);
  const highestScore = Math.max(...attempts.map((a) => a.percentage));
  const totalCorrect = attempts.reduce((s, a) => s + a.correct, 0);
  const totalQuestions = attempts.reduce((s, a) => s + a.total, 0);
  const accuracyRate = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  return { totalTests, avgScore, highestScore, accuracyRate, recentAttempts: attempts.slice(0, 10) };
}

export function getTopicStats(): Record<string, { correct: number; total: number; pct: number }> {
  const attempts = getAttempts();
  const topics: Record<string, { correct: number; total: number }> = {};
  attempts.forEach((a) => {
    Object.entries(a.topicScores).forEach(([topic, score]) => {
      if (!topics[topic]) topics[topic] = { correct: 0, total: 0 };
      topics[topic].correct += score.correct;
      topics[topic].total += score.total;
    });
  });
  const result: Record<string, { correct: number; total: number; pct: number }> = {};
  Object.entries(topics).forEach(([t, s]) => {
    result[t] = { ...s, pct: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0 };
  });
  return result;
}

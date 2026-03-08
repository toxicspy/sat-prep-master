import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import QuestionCard from "@/components/QuestionCard";
import Timer, { clearTimerStorage } from "@/components/Timer";
import DifficultyFilter from "@/components/DifficultyFilter";
import { allQuestions, Question, Difficulty } from "@/data/questions";
import { saveAttempt, TestAttempt } from "@/lib/storage";
import { recordPracticeDay, addXP, calculateTestXP } from "@/lib/gamification";
import { recordSingleMistake } from "@/lib/mistakes";
import { Shuffle, Clock, Play, Zap, Pause, RotateCcw } from "lucide-react";
import MotivationalPopup, { shouldShowMotivational } from "@/components/MotivationalPopup";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TIMER_SECONDS = 35 * 60;
const DIFFICULTY_ORDER: Difficulty[] = ["easy", "medium", "hard"];
const PAUSE_KEY = "sat-ace-pro-mock-pause";

interface SavedState {
  questions: Question[];
  current: number;
  score: number;
  difficulty: Difficulty | "mixed";
  adaptive: boolean;
  topicScores: Record<string, { correct: number; total: number }>;
  answers: Record<number, number>;
  questionTimes: Record<number, number>;
  elapsed: number;
  currentDifficulty: Difficulty;
  consecutive: number;
}

function loadSavedState(): SavedState | null {
  try {
    const raw = localStorage.getItem(PAUSE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function clearSavedState() {
  localStorage.removeItem(PAUSE_KEY);
}

const MockTest = () => {
  const saved = useRef(loadSavedState());
  const [difficulty, setDifficulty] = useState<Difficulty | "mixed">(saved.current?.difficulty ?? "mixed");
  const [adaptive, setAdaptive] = useState(saved.current?.adaptive ?? true);
  const [started, setStarted] = useState(!!saved.current);
  const [questions, setQuestions] = useState<Question[]>(saved.current?.questions ?? []);
  const [current, setCurrent] = useState(saved.current?.current ?? 0);
  const [score, setScore] = useState(saved.current?.score ?? 0);
  const [finished, setFinished] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showMotivational, setShowMotivational] = useState(false);
  const topicScores = useRef<Record<string, { correct: number; total: number }>>(saved.current?.topicScores ?? {});
  const answersRef = useRef<Record<number, number>>(saved.current?.answers ?? {});
  const questionTimesRef = useRef<Record<number, number>>(saved.current?.questionTimes ?? {});
  const elapsedRef = useRef(saved.current?.elapsed ?? 0);
  const currentDifficultyRef = useRef<Difficulty>(saved.current?.currentDifficulty ?? "medium");
  const consecutiveRef = useRef(saved.current?.consecutive ?? 0);
  const navigate = useNavigate();

  // Clear saved state after loading
  useEffect(() => { if (saved.current) saved.current = null; }, []);

  const saveProgress = useCallback(() => {
    const state: SavedState = {
      questions,
      current,
      score,
      difficulty,
      adaptive,
      topicScores: { ...topicScores.current },
      answers: { ...answersRef.current },
      questionTimes: { ...questionTimesRef.current },
      elapsed: elapsedRef.current,
      currentDifficulty: currentDifficultyRef.current,
      consecutive: consecutiveRef.current,
    };
    localStorage.setItem(PAUSE_KEY, JSON.stringify(state));
    setPaused(true);
  }, [questions, current, score, difficulty, adaptive]);

  const resumeTest = () => {
    setPaused(false);
  };

  const getAdaptiveQuestion = (pool: Question[], usedIds: Set<number>): Question | null => {
    const targetDiff = currentDifficultyRef.current;
    const available = pool.filter((q) => !usedIds.has(q.id));
    const sameDiff = available.filter((q) => q.difficulty === targetDiff);
    if (sameDiff.length > 0) return sameDiff[Math.floor(Math.random() * sameDiff.length)];
    return available.length > 0 ? available[Math.floor(Math.random() * available.length)] : null;
  };

  const startTest = () => {
    clearSavedState();
    let pool = [...allQuestions];
    if (difficulty !== "mixed") pool = pool.filter((q) => q.difficulty === difficulty);

    let selected: Question[];
    if (adaptive && difficulty === "mixed") {
      const usedIds = new Set<number>();
      selected = [];
      currentDifficultyRef.current = "medium";
      consecutiveRef.current = 0;
      const first = getAdaptiveQuestion(pool, usedIds);
      if (first) { selected.push(first); usedIds.add(first.id); }
      const remaining = shuffle(pool.filter((q) => !usedIds.has(q.id))).slice(0, 19);
      selected.push(...remaining);
      selected = selected.slice(0, 20);
    } else {
      selected = shuffle(pool).slice(0, Math.min(20, pool.length));
    }

    setQuestions(selected);
    topicScores.current = {};
    answersRef.current = {};
    questionTimesRef.current = {};
    setScore(0);
    setCurrent(0);
    setFinished(false);
    setStarted(true);
  };

  const adaptDifficulty = (correct: boolean) => {
    if (!adaptive || difficulty !== "mixed") return;
    if (correct) {
      consecutiveRef.current = Math.max(1, consecutiveRef.current + 1);
    } else {
      consecutiveRef.current = Math.min(-1, consecutiveRef.current - 1);
    }
    const currentIdx = DIFFICULTY_ORDER.indexOf(currentDifficultyRef.current);
    if (consecutiveRef.current >= 2 && currentIdx < DIFFICULTY_ORDER.length - 1) {
      currentDifficultyRef.current = DIFFICULTY_ORDER[currentIdx + 1];
      consecutiveRef.current = 0;
    } else if (consecutiveRef.current <= -2 && currentIdx > 0) {
      currentDifficultyRef.current = DIFFICULTY_ORDER[currentIdx - 1];
      consecutiveRef.current = 0;
    }
    const nextIdx = current + 1;
    if (nextIdx < questions.length) {
      const usedIds = new Set(questions.slice(0, nextIdx + 1).map((q) => q.id));
      const newQ = getAdaptiveQuestion(allQuestions, usedIds);
      if (newQ) {
        setQuestions((prev) => {
          const updated = [...prev];
          updated[nextIdx] = newQ;
          return updated;
        });
      }
    }
  };

  const recordAnswer = (q: Question, correct: boolean, selectedIndex: number) => {
    if (!topicScores.current[q.topic]) topicScores.current[q.topic] = { correct: 0, total: 0 };
    topicScores.current[q.topic].total += 1;
    answersRef.current[q.id] = selectedIndex;
    if (correct) {
      topicScores.current[q.topic].correct += 1;
      setScore((s) => s + 1);
    } else {
      recordSingleMistake(q, selectedIndex, questionTimesRef.current[q.id] ?? 0);
    }
    adaptDifficulty(correct);
  };

  const handleTimeSpent = (questionId: number, seconds: number) => {
    questionTimesRef.current[questionId] = seconds;
  };

  const finishTest = useCallback((finalScore?: number) => {
    clearSavedState();
    const s = finalScore ?? score;
    const isPerfect = s === questions.length;
    const xpEarned = calculateTestXP(s, questions.length, isPerfect);
    addXP(xpEarned);
    recordPracticeDay();

    const attempt: TestAttempt = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      section: "Mock Test",
      correct: s,
      total: questions.length,
      percentage: Math.round((s / questions.length) * 100),
      difficulty,
      topicScores: { ...topicScores.current },
      timeUsed: elapsedRef.current,
      questionTimes: { ...questionTimesRef.current },
    };
    saveAttempt(attempt);
    const topicParam = encodeURIComponent(JSON.stringify(topicScores.current));
    const answersParam = encodeURIComponent(JSON.stringify(answersRef.current));
    const timesParam = encodeURIComponent(JSON.stringify(questionTimesRef.current));
    navigate(`/score?correct=${s}&total=${questions.length}&section=Mock%20Test&topics=${topicParam}&answers=${answersParam}&times=${timesParam}&xp=${xpEarned}`);
  }, [score, questions.length, difficulty, navigate]);

  const handleNext = () => {
    if (current >= questions.length - 1) {
      finishTest(score);
    } else {
      if (shouldShowMotivational(current, questions.length)) {
        setShowMotivational(true);
      } else {
        setCurrent((c) => c + 1);
      }
    }
  };

  const handleMotivationalClose = () => {
    setShowMotivational(false);
    setCurrent((c) => c + 1);
  };

  const handleTimeUp = useCallback(() => {
    finishTest(score);
  }, [finishTest, score]);

  if (!started) {
    return (
      <Layout>
        <div className="container max-w-2xl py-16 text-center">
          <Shuffle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-3">Randomized Mock Test</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Take a timed 20-question mock test with randomized questions. You have 35 minutes to complete the section.
          </p>
          <div className="mb-6 flex justify-center">
            <DifficultyFilter selected={difficulty} onChange={setDifficulty} />
          </div>
          <label className="flex items-center justify-center gap-2 text-sm cursor-pointer mb-8">
            <input
              type="checkbox"
              checked={adaptive}
              onChange={(e) => setAdaptive(e.target.checked)}
              className="rounded"
              disabled={difficulty !== "mixed"}
            />
            <Zap className="w-4 h-4 text-primary" />
            Adaptive difficulty (adjusts based on performance)
          </label>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-8">
            <span className="inline-flex items-center gap-1"><Clock className="w-4 h-4" /> 35 minutes</span>
            <span className="inline-flex items-center gap-1"><Shuffle className="w-4 h-4" /> 20 questions</span>
          </div>
          <button
            onClick={startTest}
            className="inline-flex items-center gap-2 px-8 py-3 hero-gradient text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            <Play className="w-4 h-4" /> Start Mock Test
          </button>
        </div>
      </Layout>
    );
  }

  if (paused) {
    return (
      <Layout>
        <div className="container max-w-md py-16 text-center">
          <Pause className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-3">Test Paused</h1>
          <p className="text-muted-foreground mb-6">
            Your progress has been saved. You can resume anytime or start over.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Question {current + 1} of {questions.length} • Score: {score}/{Object.keys(answersRef.current).length}
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={resumeTest}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 hero-gradient text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <Play className="w-4 h-4" /> Resume Test
            </button>
            <button
              onClick={() => { clearSavedState(); setStarted(false); setPaused(false); }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border rounded-lg font-medium text-sm hover:bg-muted transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Start Over
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-3xl py-6">
        <div className="flex items-center justify-between mb-6 sticky top-16 z-40 bg-background/95 backdrop-blur py-2 -mx-4 px-4">
          <h1 className="text-xl font-bold font-sans">Mock Test</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={saveProgress}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg hover:bg-muted transition-colors"
            >
              <Pause className="w-3.5 h-3.5" /> Pause
            </button>
            <Timer
              totalSeconds={TIMER_SECONDS - elapsedRef.current}
              onTimeUp={handleTimeUp}
              onElapsed={(s) => { elapsedRef.current = (loadSavedState()?.elapsed ?? 0) + s; }}
              storageKey="sat-mock-test-timer"
            />
          </div>
        </div>
        <div className="p-6 md:p-8 rounded-xl border bg-card card-shadow">
          <QuestionCard
            key={current}
            question={questions[current]}
            index={current}
            total={questions.length}
            onAnswer={(correct, selectedIndex) => recordAnswer(questions[current], correct, selectedIndex)}
            onNext={handleNext}
            isLast={current >= questions.length - 1}
            onTimeSpent={handleTimeSpent}
          />
        </div>
        <MotivationalPopup
          currentIndex={current}
          total={questions.length}
          open={showMotivational}
          onClose={handleMotivationalClose}
        />
      </div>
    </Layout>
  );
};

export default MockTest;

import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import QuestionCard from "@/components/QuestionCard";
import Timer from "@/components/Timer";
import DifficultyFilter from "@/components/DifficultyFilter";
import { allQuestions, Question, Difficulty } from "@/data/questions";
import { saveAttempt, TestAttempt } from "@/lib/storage";
import { recordPracticeDay, addXP, calculateTestXP } from "@/lib/gamification";
import { Shuffle, Clock, Play, Zap } from "lucide-react";

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

const MockTest = () => {
  const [difficulty, setDifficulty] = useState<Difficulty | "mixed">("mixed");
  const [adaptive, setAdaptive] = useState(true);
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const topicScores = useRef<Record<string, { correct: number; total: number }>>({});
  const answersRef = useRef<Record<number, number>>({});
  const elapsedRef = useRef(0);
  const currentDifficultyRef = useRef<Difficulty>("medium");
  const consecutiveRef = useRef(0);
  const navigate = useNavigate();

  const getAdaptiveQuestion = (pool: Question[], usedIds: Set<number>): Question | null => {
    const targetDiff = currentDifficultyRef.current;
    const available = pool.filter((q) => !usedIds.has(q.id));
    const sameDiff = available.filter((q) => q.difficulty === targetDiff);
    if (sameDiff.length > 0) return sameDiff[Math.floor(Math.random() * sameDiff.length)];
    return available.length > 0 ? available[Math.floor(Math.random() * available.length)] : null;
  };

  const startTest = () => {
    let pool = [...allQuestions];
    if (difficulty !== "mixed") pool = pool.filter((q) => q.difficulty === difficulty);

    let selected: Question[];
    if (adaptive && difficulty === "mixed") {
      // Build adaptively: start with first question at medium
      const usedIds = new Set<number>();
      selected = [];
      currentDifficultyRef.current = "medium";
      consecutiveRef.current = 0;
      const first = getAdaptiveQuestion(pool, usedIds);
      if (first) {
        selected.push(first);
        usedIds.add(first.id);
      }
      // Pre-fill remaining slots with shuffled pool as fallback
      const remaining = shuffle(pool.filter((q) => !usedIds.has(q.id))).slice(0, 19);
      selected.push(...remaining);
      selected = selected.slice(0, 20);
    } else {
      selected = shuffle(pool).slice(0, Math.min(20, pool.length));
    }

    setQuestions(selected);
    topicScores.current = {};
    answersRef.current = {};
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

    // Replace next unanswered question with adaptive one
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
    }
    adaptDifficulty(correct);
  };

  const finishTest = useCallback((finalScore?: number) => {
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
    };
    saveAttempt(attempt);
    const topicParam = encodeURIComponent(JSON.stringify(topicScores.current));
    const answersParam = encodeURIComponent(JSON.stringify(answersRef.current));
    navigate(`/score?correct=${s}&total=${questions.length}&section=Mock%20Test&topics=${topicParam}&answers=${answersParam}&xp=${xpEarned}`);
  }, [score, questions.length, difficulty, navigate]);

  const handleNext = () => {
    if (current >= questions.length - 1) {
      finishTest(score);
    } else {
      setCurrent((c) => c + 1);
    }
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

  return (
    <Layout>
      <div className="container max-w-3xl py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold font-sans">Mock Test</h1>
          <Timer
            totalSeconds={TIMER_SECONDS}
            onTimeUp={handleTimeUp}
            onElapsed={(s) => { elapsedRef.current = s; }}
          />
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
          />
        </div>
      </div>
    </Layout>
  );
};

export default MockTest;

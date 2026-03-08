import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import QuestionCard from "@/components/QuestionCard";
import DifficultyFilter from "@/components/DifficultyFilter";
import Timer, { clearTimerStorage } from "@/components/Timer";
import ModeSelector, { TestMode } from "@/components/ModeSelector";
import { readingQuestions, Difficulty, Question } from "@/data/questions";
import { saveAttempt, TestAttempt } from "@/lib/storage";
import { recordPracticeDay, addXP, calculateTestXP } from "@/lib/gamification";
import { recordSingleMistake } from "@/lib/mistakes";
import { FileText } from "lucide-react";
import MotivationalPopup, { shouldShowMotivational } from "@/components/MotivationalPopup";

const TIMER_SECONDS = 35 * 60;
const TIMER_KEY = "sat-rw-practice-timer";

const ReadingPractice = () => {
  const [difficulty, setDifficulty] = useState<Difficulty | "mixed">("mixed");
  const [mode, setMode] = useState<TestMode>("practice");
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const topicScores = useRef<Record<string, { correct: number; total: number }>>({});
  const answersRef = useRef<Record<number, number>>({});
  const questionTimesRef = useRef<Record<number, number>>({});
  const elapsedRef = useRef(0);
  const [showMotivational, setShowMotivational] = useState(false);
  const navigate = useNavigate();

  const filtered = difficulty === "mixed" ? readingQuestions : readingQuestions.filter((q) => q.difficulty === difficulty);

  const handleStart = () => {
    setCurrent(0);
    setScore(0);
    topicScores.current = {};
    answersRef.current = {};
    questionTimesRef.current = {};
    clearTimerStorage(TIMER_KEY);
    setStarted(true);
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
  };

  const finish = (finalScore?: number) => {
    const s = finalScore ?? score;
    const isPerfect = s === filtered.length;
    addXP(calculateTestXP(s, filtered.length, isPerfect));
    recordPracticeDay();

    const attempt: TestAttempt = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      section: "Reading & Writing",
      correct: s,
      total: filtered.length,
      percentage: Math.round((s / filtered.length) * 100),
      difficulty,
      topicScores: { ...topicScores.current },
      timeUsed: elapsedRef.current,
      questionTimes: { ...questionTimesRef.current },
    };
    saveAttempt(attempt);
    const topicParam = encodeURIComponent(JSON.stringify(topicScores.current));
    const answersParam = encodeURIComponent(JSON.stringify(answersRef.current));
    const timesParam = encodeURIComponent(JSON.stringify(questionTimesRef.current));
    const xp = calculateTestXP(s, filtered.length, isPerfect);
    navigate(`/score?correct=${s}&total=${filtered.length}&section=Reading%20%26%20Writing&topics=${topicParam}&answers=${answersParam}&times=${timesParam}&xp=${xp}`);
  };

  const handleNext = () => {
    if (current >= filtered.length - 1) {
      finish(score);
    } else {
      if (shouldShowMotivational(current, filtered.length)) {
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

  if (!started) {
    return (
      <Layout>
        <div className="container max-w-2xl py-16">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Reading & Writing Practice</h1>
          </div>
          <p className="text-muted-foreground mb-6">Practice SAT-style passage-based questions with instant feedback.</p>
          <div className="space-y-4 mb-8">
            <DifficultyFilter selected={difficulty} onChange={setDifficulty} />
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={timerEnabled} onChange={(e) => setTimerEnabled(e.target.checked)} className="rounded" />
              <Clock className="w-4 h-4 text-muted-foreground" />
              Enable 35-minute timer
            </label>
          </div>
          <p className="text-sm text-muted-foreground mb-6">{filtered.length} questions available</p>
          <button onClick={handleStart} className="px-6 py-3 hero-gradient text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Start Practice
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-3xl py-6">
        <div className="flex items-center justify-between mb-6 sticky top-16 z-40 bg-background/95 backdrop-blur py-2 -mx-4 px-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold font-sans">Reading & Writing</h1>
          </div>
          {timerEnabled && (
            <Timer totalSeconds={TIMER_SECONDS} onTimeUp={() => finish(score)} onElapsed={(s) => { elapsedRef.current = s; }} />
          )}
        </div>
        <div className="p-6 md:p-8 rounded-xl border bg-card card-shadow">
          <QuestionCard
            key={current}
            question={filtered[current]}
            index={current}
            total={filtered.length}
            onAnswer={(correct, selectedIndex) => recordAnswer(filtered[current], correct, selectedIndex)}
            onNext={handleNext}
            isLast={current >= filtered.length - 1}
            onTimeSpent={(id, s) => { questionTimesRef.current[id] = s; }}
          />
        </div>
        <MotivationalPopup
          currentIndex={current}
          total={filtered.length}
          open={showMotivational}
          onClose={handleMotivationalClose}
        />
      </div>
    </Layout>
  );
};

export default ReadingPractice;

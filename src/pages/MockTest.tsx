import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import QuestionCard from "@/components/QuestionCard";
import Timer from "@/components/Timer";
import DifficultyFilter from "@/components/DifficultyFilter";
import { allQuestions, Question, Difficulty } from "@/data/questions";
import { saveAttempt, TestAttempt } from "@/lib/storage";
import { Shuffle, Clock, Play } from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TIMER_SECONDS = 35 * 60; // 35 minutes

const MockTest = () => {
  const [difficulty, setDifficulty] = useState<Difficulty | "mixed">("mixed");
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const topicScores = useRef<Record<string, { correct: number; total: number }>>({});
  const elapsedRef = useRef(0);
  const navigate = useNavigate();

  const startTest = () => {
    let pool = [...allQuestions];
    if (difficulty !== "mixed") pool = pool.filter((q) => q.difficulty === difficulty);
    const selected = shuffle(pool).slice(0, Math.min(20, pool.length));
    setQuestions(selected);
    topicScores.current = {};
    setScore(0);
    setCurrent(0);
    setFinished(false);
    setStarted(true);
  };

  const recordAnswer = (q: Question, correct: boolean) => {
    if (!topicScores.current[q.topic]) topicScores.current[q.topic] = { correct: 0, total: 0 };
    topicScores.current[q.topic].total += 1;
    if (correct) {
      topicScores.current[q.topic].correct += 1;
      setScore((s) => s + 1);
    }
  };

  const finishTest = useCallback((finalScore?: number) => {
    const s = finalScore ?? score;
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
    navigate(`/score?correct=${s}&total=${questions.length}&section=Mock%20Test&topics=${topicParam}`);
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
          <div className="mb-8 flex justify-center">
            <DifficultyFilter selected={difficulty} onChange={setDifficulty} />
          </div>
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
            onAnswer={(correct) => recordAnswer(questions[current], correct)}
            onNext={handleNext}
            isLast={current >= questions.length - 1}
          />
        </div>
      </div>
    </Layout>
  );
};

export default MockTest;

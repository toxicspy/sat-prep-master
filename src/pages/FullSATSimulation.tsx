import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import QuestionCard from "@/components/QuestionCard";
import Timer from "@/components/Timer";
import { mathQuestions, readingQuestions, Question, Difficulty } from "@/data/questions";
import { saveAttempt, TestAttempt } from "@/lib/storage";
import { recordPracticeDay, addXP, calculateTestXP } from "@/lib/gamification";
import { recordSingleMistake } from "@/lib/mistakes";
import { Play, BookOpen, Calculator, Coffee, ChevronRight } from "lucide-react";
import MotivationalPopup, { shouldShowMotivational } from "@/components/MotivationalPopup";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = "intro" | "reading" | "break" | "math" | "results";

const SECTION_TIME = 32 * 60; // 32 minutes per section
const BREAK_TIME = 10; // 10-minute break (shortened for demo)

function scaleScore(readingPct: number, mathPct: number): { reading: number; math: number; total: number } {
  // Simulate 200-800 per section scaling
  const reading = Math.round(200 + readingPct * 6);
  const math = Math.round(200 + mathPct * 6);
  return { reading, math, total: reading + math };
}

const FullSATSimulation = () => {
  const [phase, setPhase] = useState<Phase>("intro");
  const [readingQs] = useState(() => shuffle(readingQuestions).slice(0, 15));
  const [mathQs] = useState(() => shuffle(mathQuestions).slice(0, 15));
  const [current, setCurrent] = useState(0);
  const [readingScore, setReadingScore] = useState(0);
  const [mathScore, setMathScore] = useState(0);
  const readingTopics = useRef<Record<string, { correct: number; total: number }>>({});
  const mathTopics = useRef<Record<string, { correct: number; total: number }>>({});
  const elapsedRef = useRef(0);
  const [showMotivational, setShowMotivational] = useState(false);
  const navigate = useNavigate();

  const currentQuestions = phase === "reading" ? readingQs : mathQs;
  const currentTopics = phase === "reading" ? readingTopics : mathTopics;

  const recordAnswer = (q: Question, correct: boolean, selectedIndex?: number) => {
    if (!currentTopics.current[q.topic]) currentTopics.current[q.topic] = { correct: 0, total: 0 };
    currentTopics.current[q.topic].total += 1;
    if (correct) {
      currentTopics.current[q.topic].correct += 1;
      if (phase === "reading") setReadingScore((s) => s + 1);
      else setMathScore((s) => s + 1);
    } else if (selectedIndex !== undefined) {
      recordSingleMistake(q, selectedIndex, 0);
    }
  };

  const finishSection = useCallback(() => {
    if (phase === "reading") {
      const attempt: TestAttempt = {
        id: `sat-rw-${Date.now()}`,
        date: new Date().toISOString(),
        section: "SAT Reading & Writing",
        correct: readingScore,
        total: readingQs.length,
        percentage: Math.round((readingScore / readingQs.length) * 100),
        difficulty: "mixed",
        topicScores: { ...readingTopics.current },
        timeUsed: elapsedRef.current,
      };
      saveAttempt(attempt);
      setCurrent(0);
      elapsedRef.current = 0;
      setPhase("break");
    } else if (phase === "math") {
      const attempt: TestAttempt = {
        id: `sat-math-${Date.now()}`,
        date: new Date().toISOString(),
        section: "SAT Math",
        correct: mathScore,
        total: mathQs.length,
        percentage: Math.round((mathScore / mathQs.length) * 100),
        difficulty: "mixed",
        topicScores: { ...mathTopics.current },
        timeUsed: elapsedRef.current,
      };
      saveAttempt(attempt);

      const xp = calculateTestXP(readingScore + mathScore, readingQs.length + mathQs.length, false);
      addXP(xp);
      recordPracticeDay();
      setPhase("results");
    }
  }, [phase, readingScore, mathScore, readingQs.length, mathQs.length]);

  const handleNext = () => {
    if (current >= currentQuestions.length - 1) {
      finishSection();
    } else {
      if (shouldShowMotivational(current, currentQuestions.length)) {
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
    finishSection();
  }, [finishSection]);

  // --- INTRO ---
  if (phase === "intro") {
    return (
      <Layout>
        <div className="container max-w-2xl py-16 text-center">
          <BookOpen className="w-14 h-14 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-3">Full SAT Simulation</h1>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Experience a realistic SAT simulation with two timed sections, a break, and a scaled score (400–1600).
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-8 text-sm">
            <div className="p-3 rounded-lg border bg-card">
              <BookOpen className="w-5 h-5 text-primary mx-auto mb-1" />
              <div className="font-semibold">Section 1</div>
              <div className="text-muted-foreground text-xs">Reading & Writing</div>
              <div className="text-muted-foreground text-xs">15 questions · 32 min</div>
            </div>
            <div className="p-3 rounded-lg border bg-card">
              <Coffee className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
              <div className="font-semibold">Break</div>
              <div className="text-muted-foreground text-xs">10 minutes</div>
            </div>
            <div className="p-3 rounded-lg border bg-card">
              <Calculator className="w-5 h-5 text-primary mx-auto mb-1" />
              <div className="font-semibold">Section 2</div>
              <div className="text-muted-foreground text-xs">Math</div>
              <div className="text-muted-foreground text-xs">15 questions · 32 min</div>
            </div>
          </div>
          <button
            onClick={() => setPhase("reading")}
            className="inline-flex items-center gap-2 px-8 py-3 hero-gradient text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            <Play className="w-4 h-4" /> Begin Simulation
          </button>
        </div>
      </Layout>
    );
  }

  // --- BREAK ---
  if (phase === "break") {
    return (
      <Layout>
        <div className="container max-w-2xl py-16 text-center">
          <Coffee className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Break Time</h2>
          <p className="text-muted-foreground mb-4">Section 1 complete! Take a short break before Math.</p>
          <p className="text-sm text-muted-foreground mb-2">
            Reading & Writing score: {readingScore}/{readingQs.length} ({Math.round((readingScore / readingQs.length) * 100)}%)
          </p>
          <Timer
            totalSeconds={BREAK_TIME}
            onTimeUp={() => setPhase("math")}
            onElapsed={() => {}}
          />
          <button
            onClick={() => setPhase("math")}
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 hero-gradient text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Skip Break & Start Math <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </Layout>
    );
  }

  // --- RESULTS ---
  if (phase === "results") {
    const readingPct = readingQs.length > 0 ? (readingScore / readingQs.length) * 100 : 0;
    const mathPct = mathQs.length > 0 ? (mathScore / mathQs.length) * 100 : 0;
    const scaled = scaleScore(readingPct, mathPct);

    return (
      <Layout>
        <div className="container max-w-2xl py-12 text-center">
          <h1 className="text-3xl font-bold mb-2">SAT Simulation Results</h1>
          <p className="text-muted-foreground mb-8">Your estimated scaled score</p>

          <div className="text-7xl font-bold text-primary mb-2">{scaled.total}</div>
          <p className="text-muted-foreground mb-8">out of 1600</p>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
            <div className="p-4 rounded-xl border bg-card">
              <BookOpen className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{scaled.reading}</div>
              <div className="text-xs text-muted-foreground">Reading & Writing</div>
              <div className="text-xs text-muted-foreground">{readingScore}/{readingQs.length} correct</div>
            </div>
            <div className="p-4 rounded-xl border bg-card">
              <Calculator className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{scaled.math}</div>
              <div className="text-xs text-muted-foreground">Math</div>
              <div className="text-xs text-muted-foreground">{mathScore}/{mathQs.length} correct</div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={() => { setPhase("intro"); setCurrent(0); setReadingScore(0); setMathScore(0); readingTopics.current = {}; mathTopics.current = {}; }}
              className="px-5 py-2.5 border rounded-lg font-medium text-sm hover:bg-muted transition-colors">
              Retake
            </button>
            <button onClick={() => navigate("/dashboard")}
              className="px-5 py-2.5 hero-gradient text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity">
              Dashboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // --- TEST (reading or math) ---
  const sectionLabel = phase === "reading" ? "Reading & Writing" : "Math";
  return (
    <Layout>
      <div className="container max-w-3xl py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold font-sans">SAT Simulation</h1>
            <span className="text-xs text-muted-foreground">Section: {sectionLabel}</span>
          </div>
          <Timer
            totalSeconds={SECTION_TIME}
            onTimeUp={handleTimeUp}
            onElapsed={(s) => { elapsedRef.current = s; }}
          />
        </div>
        <div className="p-6 md:p-8 rounded-xl border bg-card card-shadow">
          <QuestionCard
            key={`${phase}-${current}`}
            question={currentQuestions[current]}
            index={current}
            total={currentQuestions.length}
            onAnswer={(correct, selectedIndex) => recordAnswer(currentQuestions[current], correct, selectedIndex)}
            onNext={handleNext}
            isLast={current >= currentQuestions.length - 1}
          />
        </div>
        <MotivationalPopup
          currentIndex={current}
          total={currentQuestions.length}
          open={showMotivational}
          onClose={handleMotivationalClose}
        />
      </div>
    </Layout>
  );
};

export default FullSATSimulation;

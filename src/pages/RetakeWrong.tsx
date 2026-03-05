import { useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import QuestionCard from "@/components/QuestionCard";
import { allQuestions, Question } from "@/data/questions";
import { recordPracticeDay, addXP, calculateTestXP } from "@/lib/gamification";
import { saveAttempt, TestAttempt } from "@/lib/storage";
import { recordCorrectRetake } from "@/lib/mistakes";
import { RefreshCw, Award } from "lucide-react";

const RetakeWrong = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const topicScores = useRef<Record<string, { correct: number; total: number }>>({});
  const answersRef = useRef<Record<number, number>>({});
  const questionTimesRef = useRef<Record<number, number>>({});
  const [clearedIds, setClearedIds] = useState<number[]>([]);

  let ids: number[] = [];
  try {
    const raw = params.get("ids");
    if (raw) ids = JSON.parse(decodeURIComponent(raw));
  } catch {}

  const questions = ids
    .map((id) => allQuestions.find((q) => q.id === id))
    .filter(Boolean) as Question[];

  if (questions.length === 0) {
    return (
      <Layout>
        <div className="container max-w-2xl py-16 text-center">
          <h1 className="text-3xl font-bold mb-3">No Questions to Retake</h1>
          <p className="text-muted-foreground mb-6">Great job — or take a test first!</p>
        </div>
      </Layout>
    );
  }

  const recordAnswer = (q: Question, correct: boolean, selectedIndex: number) => {
    if (!topicScores.current[q.topic]) topicScores.current[q.topic] = { correct: 0, total: 0 };
    topicScores.current[q.topic].total += 1;
    answersRef.current[q.id] = selectedIndex;
    if (correct) {
      topicScores.current[q.topic].correct += 1;
      setScore((s) => s + 1);
      // Track correct retake for auto-improvement
      const wasCleared = recordCorrectRetake(q.id);
      if (wasCleared) setClearedIds((prev) => [...prev, q.id]);
    }
  };

  const finish = () => {
    const isPerfect = score === questions.length;
    const xpEarned = calculateTestXP(score, questions.length, isPerfect);
    addXP(xpEarned);
    recordPracticeDay();

    const attempt: TestAttempt = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      section: "Retake Wrong",
      correct: score,
      total: questions.length,
      percentage: Math.round((score / questions.length) * 100),
      difficulty: "mixed",
      topicScores: { ...topicScores.current },
      questionTimes: { ...questionTimesRef.current },
    };
    saveAttempt(attempt);
    const topicParam = encodeURIComponent(JSON.stringify(topicScores.current));
    const answersParam = encodeURIComponent(JSON.stringify(answersRef.current));
    const timesParam = encodeURIComponent(JSON.stringify(questionTimesRef.current));
    navigate(`/score?correct=${score}&total=${questions.length}&section=Retake%20Wrong&topics=${topicParam}&answers=${answersParam}&times=${timesParam}&xp=${xpEarned}`);
  };

  const handleNext = () => {
    if (current >= questions.length - 1) {
      finish();
    } else {
      setCurrent((c) => c + 1);
    }
  };

  return (
    <Layout>
      <div className="container max-w-3xl py-6">
        <div className="flex items-center gap-3 mb-6">
          <RefreshCw className="w-6 h-6 text-destructive" />
          <h1 className="text-xl font-bold font-sans">Practice Mistakes ({questions.length} questions)</h1>
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
            onTimeSpent={(id, s) => { questionTimesRef.current[id] = s; }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default RetakeWrong;

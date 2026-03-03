import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import StudyRecommendations from "@/components/StudyRecommendations";
import MistakePatterns from "@/components/MistakePatterns";
import TimeAnalysis from "@/components/TimeAnalysis";
import { allQuestions, Question, topicLabels, Topic } from "@/data/questions";
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, Home, RefreshCw, Clock } from "lucide-react";

const ReviewTest = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "correct" | "wrong">("all");

  let answers: Record<number, number> = {};
  let topicScores: Record<string, { correct: number; total: number }> = {};
  let questionTimes: Record<number, number> = {};
  try {
    const rawA = params.get("answers");
    if (rawA) answers = JSON.parse(decodeURIComponent(rawA));
    const rawT = params.get("topics");
    if (rawT) topicScores = JSON.parse(decodeURIComponent(rawT));
    const rawTm = params.get("times");
    if (rawTm) questionTimes = JSON.parse(decodeURIComponent(rawTm));
  } catch {}

  const questionIds = Object.keys(answers).map(Number);
  const allReviewQuestions = questionIds.map((id) => allQuestions.find((q) => q.id === id)).filter(Boolean) as Question[];

  if (allReviewQuestions.length === 0) {
    return (
      <Layout>
        <div className="container max-w-2xl py-16 text-center">
          <h1 className="text-3xl font-bold mb-3">No Review Data</h1>
          <p className="text-muted-foreground mb-6">Take a test first to review your answers.</p>
          <Link to="/mock-test" className="px-5 py-2.5 hero-gradient text-primary-foreground rounded-lg font-medium text-sm">
            Take Mock Test
          </Link>
        </div>
      </Layout>
    );
  }

  const correctCount = allReviewQuestions.filter((q) => answers[q.id] === q.correct).length;
  const wrongIds = allReviewQuestions.filter((q) => answers[q.id] !== q.correct).map((q) => q.id);

  const questions = filter === "all"
    ? allReviewQuestions
    : filter === "correct"
    ? allReviewQuestions.filter((q) => answers[q.id] === q.correct)
    : allReviewQuestions.filter((q) => answers[q.id] !== q.correct);

  const handleRetakeWrong = () => {
    const encoded = encodeURIComponent(JSON.stringify(wrongIds));
    navigate(`/practice/retake?ids=${encoded}`);
  };

  const formatTime = (s: number) => s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <Layout>
      <div className="container max-w-3xl py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Test Review</h1>
          <div className="flex items-center gap-2">
            {wrongIds.length > 0 && (
              <button
                onClick={handleRetakeWrong}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-destructive/30 text-destructive rounded-lg hover:bg-destructive/5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retake Wrong ({wrongIds.length})
              </button>
            )}
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              <Home className="w-4 h-4" /> Home
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl border bg-card card-shadow text-center">
            <div className="text-2xl font-bold text-primary">{correctCount}/{allReviewQuestions.length}</div>
            <div className="text-xs text-muted-foreground">Correct</div>
          </div>
          <div className="p-4 rounded-xl border bg-card card-shadow text-center">
            <div className="text-2xl font-bold text-success">{correctCount}</div>
            <div className="text-xs text-muted-foreground">Right Answers</div>
          </div>
          <div className="p-4 rounded-xl border bg-card card-shadow text-center">
            <div className="text-2xl font-bold text-destructive">{wrongIds.length}</div>
            <div className="text-xs text-muted-foreground">Wrong Answers</div>
          </div>
        </div>

        {/* Time & Mistake Analysis */}
        {Object.keys(questionTimes).length > 0 && (
          <div className="mb-6">
            <TimeAnalysis questionTimes={questionTimes} answers={answers} />
          </div>
        )}
        {Object.keys(answers).length > 0 && (
          <div className="mb-6">
            <MistakePatterns answers={answers} questionTimes={Object.keys(questionTimes).length > 0 ? questionTimes : undefined} />
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-1 mb-4 p-1 rounded-lg bg-muted w-fit">
          {(["all", "correct", "wrong"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                filter === f ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f} {f === "all" ? `(${allReviewQuestions.length})` : f === "correct" ? `(${correctCount})` : `(${wrongIds.length})`}
            </button>
          ))}
        </div>

        <div className="space-y-3 mb-8">
          {questions.map((q, i) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correct;
            const expanded = expandedId === q.id;
            const timeSpent = questionTimes[q.id];

            return (
              <div key={q.id} className="rounded-xl border bg-card card-shadow overflow-hidden">
                <button
                  onClick={() => setExpandedId(expanded ? null : q.id)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <div className="flex items-center gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive shrink-0" />
                    )}
                    <span className="text-sm font-medium">
                      Q{i + 1}. {q.question.slice(0, 60)}
                      {q.question.length > 60 ? "…" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {timeSpent !== undefined && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatTime(timeSpent)}
                      </span>
                    )}
                    {expanded ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                  </div>
                </button>

                {expanded && (
                  <div className="px-4 pb-4 animate-fade-in">
                    {q.passage && (
                      <div className="mb-3 p-3 bg-muted rounded-lg text-sm leading-relaxed">{q.passage}</div>
                    )}
                    <p className="text-sm font-medium mb-3">{q.question}</p>
                    <div className="space-y-2 mb-3">
                      {q.options.map((opt, oi) => {
                        let cls = "px-3 py-2 rounded-lg border text-sm ";
                        if (oi === q.correct) cls += "border-success bg-success/10 text-success";
                        else if (oi === userAnswer) cls += "border-destructive bg-destructive/10 text-destructive";
                        else cls += "border-border opacity-50";
                        return (
                          <div key={oi} className={cls}>
                            <span className="font-medium mr-2">{String.fromCharCode(65 + oi)}.</span>
                            {opt}
                          </div>
                        );
                      })}
                    </div>
                    <div className="p-3 rounded-lg bg-accent border border-primary/20">
                      <p className="text-xs font-medium text-accent-foreground mb-1">Explanation</p>
                      <p className="text-sm text-muted-foreground">{q.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {Object.keys(topicScores).length > 0 && (
          <StudyRecommendations topicScores={topicScores} />
        )}
      </div>
    </Layout>
  );
};

export default ReviewTest;

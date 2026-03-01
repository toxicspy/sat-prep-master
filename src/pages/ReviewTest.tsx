import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import StudyRecommendations from "@/components/StudyRecommendations";
import { allQuestions, Question, topicLabels, Topic } from "@/data/questions";
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, Home } from "lucide-react";

const ReviewTest = () => {
  const [params] = useSearchParams();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  let answers: Record<number, number> = {};
  let topicScores: Record<string, { correct: number; total: number }> = {};
  try {
    const rawA = params.get("answers");
    if (rawA) answers = JSON.parse(decodeURIComponent(rawA));
    const rawT = params.get("topics");
    if (rawT) topicScores = JSON.parse(decodeURIComponent(rawT));
  } catch {}

  const questionIds = Object.keys(answers).map(Number);
  const questions = questionIds.map((id) => allQuestions.find((q) => q.id === id)).filter(Boolean) as Question[];

  if (questions.length === 0) {
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

  const correctCount = questions.filter((q) => answers[q.id] === q.correct).length;

  return (
    <Layout>
      <div className="container max-w-3xl py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Test Review</h1>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <Home className="w-4 h-4" /> Home
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl border bg-card card-shadow text-center">
            <div className="text-2xl font-bold text-primary">{correctCount}/{questions.length}</div>
            <div className="text-xs text-muted-foreground">Correct</div>
          </div>
          <div className="p-4 rounded-xl border bg-card card-shadow text-center">
            <div className="text-2xl font-bold text-success">
              {questions.filter((q) => answers[q.id] === q.correct).length}
            </div>
            <div className="text-xs text-muted-foreground">Right Answers</div>
          </div>
          <div className="p-4 rounded-xl border bg-card card-shadow text-center">
            <div className="text-2xl font-bold text-destructive">
              {questions.filter((q) => answers[q.id] !== q.correct).length}
            </div>
            <div className="text-xs text-muted-foreground">Wrong Answers</div>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {questions.map((q, i) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correct;
            const expanded = expandedId === q.id;

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
                  {expanded ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
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

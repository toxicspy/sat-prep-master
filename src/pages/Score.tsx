import { useSearchParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import TopicBreakdown from "@/components/TopicBreakdown";
import StudyRecommendations from "@/components/StudyRecommendations";
import MistakePatterns from "@/components/MistakePatterns";
import TimeAnalysis from "@/components/TimeAnalysis";
import { Trophy, RotateCcw, Home, BarChart3, Eye, Star, RefreshCw } from "lucide-react";
import { allQuestions } from "@/data/questions";

const Score = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const correct = Number(params.get("correct") || 0);
  const total = Number(params.get("total") || 1);
  const section = params.get("section") || "Practice";
  const xpEarned = Number(params.get("xp") || 0);
  const pct = Math.round((correct / total) * 100);

  let topicScores: Record<string, { correct: number; total: number }> = {};
  let answers: Record<number, number> = {};
  let questionTimes: Record<number, number> = {};
  try {
    const raw = params.get("topics");
    if (raw) topicScores = JSON.parse(decodeURIComponent(raw));
    const rawA = params.get("answers");
    if (rawA) answers = JSON.parse(decodeURIComponent(rawA));
    const rawT = params.get("times");
    if (rawT) questionTimes = JSON.parse(decodeURIComponent(rawT));
  } catch {}

  const hasAnswers = !!params.get("answers");

  // Get wrong question IDs for retake mode
  const wrongIds = Object.entries(answers)
    .filter(([id, sel]) => {
      const q = allQuestions.find((q) => q.id === Number(id));
      return q && sel !== q.correct;
    })
    .map(([id]) => Number(id));

  const handleRetakeWrong = () => {
    const encoded = encodeURIComponent(JSON.stringify(wrongIds));
    navigate(`/practice/retake?ids=${encoded}`);
  };

  const getMessage = () => {
    if (pct >= 90) return "Outstanding! You're well-prepared.";
    if (pct >= 70) return "Great job! Keep practicing to push higher.";
    if (pct >= 50) return "Good effort. Review the areas you missed.";
    return "Keep studying! Consistent practice makes the difference.";
  };

  const retryPath = section.includes("Reading") ? "/practice/reading" : section.includes("Mock") ? "/mock-test" : "/practice/math";

  const reviewUrl = hasAnswers
    ? `/review?answers=${params.get("answers")}&topics=${params.get("topics") || ""}&times=${params.get("times") || ""}`
    : null;

  return (
    <Layout>
      <div className="container max-w-2xl py-12">
        <div className="p-8 rounded-xl border bg-card card-shadow-md mb-6">
          <div className="text-center">
            <Trophy className="w-14 h-14 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">{section} Score</h1>
            <p className="text-muted-foreground mb-6">{getMessage()}</p>
            <div className="text-6xl font-bold text-primary mb-1">{pct}%</div>
            <p className="text-muted-foreground mb-2">{correct} of {total} correct</p>
            {xpEarned > 0 && (
              <p className="text-sm font-medium text-primary flex items-center justify-center gap-1 mb-4">
                <Star className="w-4 h-4" /> +{xpEarned} XP earned
              </p>
            )}
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-6">
              <div className="h-full hero-gradient rounded-full" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
            {reviewUrl && (
              <Link
                to={reviewUrl}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 hero-gradient text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
              >
                <Eye className="w-4 h-4" /> Review Answers
              </Link>
            )}
            {wrongIds.length > 0 && (
              <button
                onClick={handleRetakeWrong}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-destructive/30 text-destructive rounded-lg font-medium text-sm hover:bg-destructive/5 transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Retake Wrong ({wrongIds.length})
              </button>
            )}
            <Link
              to={retryPath}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border rounded-lg font-medium text-sm hover:bg-muted transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border rounded-lg font-medium text-sm hover:bg-muted transition-colors"
            >
              <BarChart3 className="w-4 h-4" /> Dashboard
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border rounded-lg font-medium text-sm hover:bg-muted transition-colors"
            >
              <Home className="w-4 h-4" /> Home
            </Link>
          </div>
        </div>

        {/* Time Analysis */}
        {Object.keys(questionTimes).length > 0 && (
          <div className="mb-6">
            <TimeAnalysis questionTimes={questionTimes} answers={answers} />
          </div>
        )}

        {/* Mistake Patterns */}
        {Object.keys(answers).length > 0 && (
          <div className="mb-6">
            <MistakePatterns answers={answers} questionTimes={Object.keys(questionTimes).length > 0 ? questionTimes : undefined} />
          </div>
        )}

        {Object.keys(topicScores).length > 0 && (
          <>
            <div className="p-6 rounded-xl border bg-card card-shadow mb-6">
              <h2 className="text-lg font-semibold mb-4 font-sans">Score by Topic</h2>
              <TopicBreakdown scores={topicScores} />
            </div>
            <StudyRecommendations topicScores={topicScores} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Score;

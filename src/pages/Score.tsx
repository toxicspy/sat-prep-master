import { useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Trophy, RotateCcw, Home } from "lucide-react";

const Score = () => {
  const [params] = useSearchParams();
  const correct = Number(params.get("correct") || 0);
  const total = Number(params.get("total") || 1);
  const section = params.get("section") || "Practice";
  const pct = Math.round((correct / total) * 100);

  const getMessage = () => {
    if (pct >= 90) return "Outstanding! You're well-prepared.";
    if (pct >= 70) return "Great job! Keep practicing to push higher.";
    if (pct >= 50) return "Good effort. Review the areas you missed.";
    return "Keep studying! Consistent practice makes the difference.";
  };

  return (
    <Layout>
      <div className="container max-w-lg py-16 text-center">
        <div className="p-8 rounded-xl border bg-card card-shadow-md">
          <Trophy className="w-14 h-14 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">{section} Score</h1>
          <p className="text-muted-foreground mb-6">{getMessage()}</p>

          <div className="text-6xl font-bold text-primary mb-1">{pct}%</div>
          <p className="text-muted-foreground mb-8">
            {correct} of {total} correct
          </p>

          <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-8">
            <div className="h-full hero-gradient rounded-full" style={{ width: `${pct}%` }} />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={section.includes("Reading") ? "/practice/reading" : "/practice/math"}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 hero-gradient text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border rounded-lg font-medium text-sm hover:bg-muted transition-colors"
            >
              <Home className="w-4 h-4" /> Home
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Score;

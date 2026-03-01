import { topicLabels, Topic } from "@/data/questions";
import { Lightbulb, AlertTriangle, CheckCircle2 } from "lucide-react";

interface Props {
  topicScores: Record<string, { correct: number; total: number }>;
}

const StudyRecommendations = ({ topicScores }: Props) => {
  const entries = Object.entries(topicScores)
    .map(([topic, s]) => ({
      topic,
      label: topicLabels[topic as Topic] || topic,
      pct: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
      ...s,
    }))
    .sort((a, b) => a.pct - b.pct);

  if (entries.length === 0) return null;

  const weak = entries.filter((e) => e.pct < 60);
  const strong = entries.filter((e) => e.pct >= 80);

  return (
    <div className="p-6 rounded-xl border bg-card card-shadow">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold font-sans">Study Recommendations</h3>
      </div>

      {weak.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-1.5 text-sm font-medium text-destructive mb-2">
            <AlertTriangle className="w-4 h-4" /> Focus Areas
          </div>
          <ul className="space-y-1.5">
            {weak.map((e) => (
              <li key={e.topic} className="text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-destructive shrink-0" />
                <span>
                  <strong>{e.label}</strong> — {e.pct}% accuracy ({e.correct}/{e.total})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {strong.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 text-sm font-medium text-success mb-2">
            <CheckCircle2 className="w-4 h-4" /> Strong Topics
          </div>
          <ul className="space-y-1.5">
            {strong.map((e) => (
              <li key={e.topic} className="text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success shrink-0" />
                <span>
                  <strong>{e.label}</strong> — {e.pct}% accuracy
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {weak.length === 0 && (
        <p className="text-sm text-muted-foreground">Great job! No weak areas detected. Keep practicing to maintain your performance.</p>
      )}
    </div>
  );
};

export default StudyRecommendations;

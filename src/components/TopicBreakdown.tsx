import { topicLabels, Topic } from "@/data/questions";

interface TopicScore {
  correct: number;
  total: number;
}

interface Props {
  scores: Record<string, TopicScore>;
}

const TopicBreakdown = ({ scores }: Props) => {
  const entries = Object.entries(scores).map(([topic, s]) => ({
    topic,
    label: topicLabels[topic as Topic] || topic,
    pct: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
    ...s,
  }));

  if (entries.length === 0) return null;

  const sorted = [...entries].sort((a, b) => b.pct - a.pct);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-success/10 border border-success/20">
          <div className="text-xs text-success font-medium mb-1">Strongest Topic</div>
          <div className="text-sm font-semibold">{strongest.label}</div>
          <div className="text-xs text-muted-foreground">{strongest.pct}% accuracy</div>
        </div>
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <div className="text-xs text-destructive font-medium mb-1">Weakest Topic</div>
          <div className="text-sm font-semibold">{weakest.label}</div>
          <div className="text-xs text-muted-foreground">{weakest.pct}% accuracy</div>
        </div>
      </div>

      <div className="space-y-3">
        {entries.map((e) => (
          <div key={e.topic}>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium">{e.label}</span>
              <span className="text-muted-foreground">{e.correct}/{e.total} ({e.pct}%)</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${e.pct >= 70 ? "bg-success" : e.pct >= 50 ? "bg-primary" : "bg-destructive"}`}
                style={{ width: `${e.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicBreakdown;

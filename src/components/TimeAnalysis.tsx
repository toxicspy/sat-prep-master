import { Clock, Zap, Snail } from "lucide-react";
import { allQuestions, topicLabels, Topic } from "@/data/questions";

interface Props {
  questionTimes: Record<number, number>; // questionId → seconds
  answers: Record<number, number>;
}

const TimeAnalysis = ({ questionTimes, answers }: Props) => {
  const entries = Object.entries(questionTimes).map(([id, time]) => ({
    id: Number(id),
    time,
    question: allQuestions.find((q) => q.id === Number(id)),
    correct: allQuestions.find((q) => q.id === Number(id))
      ? answers[Number(id)] === allQuestions.find((q) => q.id === Number(id))!.correct
      : false,
  })).filter((e) => e.question);

  if (entries.length === 0) return null;

  const totalTime = entries.reduce((s, e) => s + e.time, 0);
  const avgTime = Math.round(totalTime / entries.length);
  const sorted = [...entries].sort((a, b) => a.time - b.time);
  const fastest = sorted[0];
  const slowest = sorted[sorted.length - 1];

  const formatTime = (s: number) => {
    if (s < 60) return `${s}s`;
    return `${Math.floor(s / 60)}m ${s % 60}s`;
  };

  return (
    <div className="p-6 rounded-xl border bg-card card-shadow">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold font-sans">Time Analysis</h3>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-muted text-center">
          <div className="text-lg font-bold">{formatTime(avgTime)}</div>
          <div className="text-xs text-muted-foreground">Avg / Question</div>
        </div>
        <div className="p-3 rounded-lg bg-success/10 text-center">
          <div className="flex items-center justify-center gap-1">
            <Zap className="w-3.5 h-3.5 text-success" />
            <span className="text-lg font-bold text-success">{formatTime(fastest.time)}</span>
          </div>
          <div className="text-xs text-muted-foreground">Fastest</div>
        </div>
        <div className="p-3 rounded-lg bg-destructive/10 text-center">
          <div className="flex items-center justify-center gap-1">
            <Snail className="w-3.5 h-3.5 text-destructive" />
            <span className="text-lg font-bold text-destructive">{formatTime(slowest.time)}</span>
          </div>
          <div className="text-xs text-muted-foreground">Slowest</div>
        </div>
      </div>

      {/* Per-question time bars */}
      <div className="space-y-1.5">
        {entries.map((e, i) => {
          const maxTime = slowest.time || 1;
          const pct = Math.min(100, Math.round((e.time / maxTime) * 100));
          return (
            <div key={e.id} className="flex items-center gap-2 text-xs">
              <span className="w-6 text-muted-foreground text-right">Q{i + 1}</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${e.correct ? "bg-primary" : "bg-destructive"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-10 text-muted-foreground text-right">{formatTime(e.time)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimeAnalysis;

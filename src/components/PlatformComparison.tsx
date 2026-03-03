import { getStats } from "@/lib/storage";
import { Users, TrendingUp } from "lucide-react";

/** Simulated platform averages since there's no backend yet */
const PLATFORM_AVG = {
  avgScore: 62,
  accuracyRate: 58,
  avgTimePerQuestion: 45, // seconds
};

const PlatformComparison = () => {
  const { avgScore, accuracyRate, totalTests } = getStats();

  if (totalTests === 0) return null;

  const comparisons = [
    {
      label: "Average Score",
      user: avgScore,
      platform: PLATFORM_AVG.avgScore,
      suffix: "%",
    },
    {
      label: "Accuracy Rate",
      user: accuracyRate,
      platform: PLATFORM_AVG.accuracyRate,
      suffix: "%",
    },
  ];

  return (
    <div className="p-6 rounded-xl border bg-card card-shadow">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold font-sans">You vs Platform Average</h3>
      </div>
      <div className="space-y-4">
        {comparisons.map((c) => {
          const diff = c.user - c.platform;
          const positive = diff >= 0;
          return (
            <div key={c.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium">{c.label}</span>
                <span className={`font-semibold ${positive ? "text-success" : "text-destructive"}`}>
                  {positive ? "+" : ""}{diff}{c.suffix}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
                    <span>You: {c.user}{c.suffix}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${c.user}%` }} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
                    <span>Avg: {c.platform}{c.suffix}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-muted-foreground/30 rounded-full" style={{ width: `${c.platform}%` }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        * Platform averages are simulated based on typical SAT preparation data.
      </p>
    </div>
  );
};

export default PlatformComparison;

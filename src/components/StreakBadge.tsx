import { getStreakData, getStreakBadges } from "@/lib/gamification";
import { Flame } from "lucide-react";

const StreakBadge = () => {
  const { currentStreak, longestStreak } = getStreakData();
  const badges = getStreakBadges(currentStreak);

  return (
    <div className="p-5 rounded-xl border bg-card card-shadow">
      <div className="flex items-center gap-2 mb-3">
        <Flame className="w-5 h-5 text-destructive" />
        <span className="font-semibold font-sans">Practice Streak</span>
      </div>
      <div className="flex gap-6 mb-4">
        <div>
          <div className="text-2xl font-bold text-primary">{currentStreak}</div>
          <div className="text-xs text-muted-foreground">Current</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-foreground">{longestStreak}</div>
          <div className="text-xs text-muted-foreground">Longest</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {badges.map((b) => (
          <span
            key={b.label}
            className={`text-xs px-2.5 py-1 rounded-full border ${
              b.earned ? "bg-accent text-accent-foreground border-primary/20" : "bg-muted text-muted-foreground opacity-50"
            }`}
          >
            {b.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default StreakBadge;

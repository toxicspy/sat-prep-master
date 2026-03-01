import { getXPData, getNextLevel } from "@/lib/gamification";
import { Star } from "lucide-react";

const XPDisplay = () => {
  const { totalXP, level } = getXPData();
  const next = getNextLevel(totalXP);

  return (
    <div className="p-5 rounded-xl border bg-card card-shadow">
      <div className="flex items-center gap-2 mb-3">
        <Star className="w-5 h-5 text-primary" />
        <span className="font-semibold font-sans">Level & XP</span>
      </div>
      <div className="text-2xl font-bold text-primary mb-1">{level}</div>
      <div className="text-sm text-muted-foreground mb-3">{totalXP.toLocaleString()} XP earned</div>
      {next && (
        <>
          <div className="text-xs text-muted-foreground mb-1">
            {next.xpNeeded} XP to {next.label}
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full hero-gradient rounded-full transition-all"
              style={{
                width: `${Math.min(100, ((totalXP) / (totalXP + next.xpNeeded)) * 100)}%`,
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default XPDisplay;

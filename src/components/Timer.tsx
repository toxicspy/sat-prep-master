import { useState, useEffect, useCallback } from "react";
import { Clock, Pause, Play } from "lucide-react";

interface Props {
  totalSeconds: number;
  onTimeUp: () => void;
  isPaused?: boolean;
  onElapsed?: (seconds: number) => void;
}

const Timer = ({ totalSeconds, onTimeUp, isPaused = false, onElapsed }: Props) => {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [paused, setPaused] = useState(isPaused);

  useEffect(() => {
    if (paused || remaining <= 0) return;
    const interval = setInterval(() => {
      setRemaining((r) => {
        const next = r - 1;
        onElapsed?.(totalSeconds - next);
        if (next <= 0) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [paused, remaining, totalSeconds, onTimeUp, onElapsed]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const urgent = remaining < 300; // less than 5 min
  const critical = remaining < 60;

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-mono text-sm font-semibold ${
      critical ? "bg-destructive/10 text-destructive border-destructive/30" :
      urgent ? "bg-yellow-50 text-yellow-700 border-yellow-300" :
      "bg-accent text-accent-foreground border-primary/20"
    }`}>
      <Clock className="w-4 h-4" />
      <span>{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}</span>
      <button
        onClick={() => setPaused(!paused)}
        className="ml-1 p-1 rounded hover:bg-primary/10 transition-colors"
        aria-label={paused ? "Resume" : "Pause"}
      >
        {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};

export default Timer;

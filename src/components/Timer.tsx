import { useState, useEffect, useCallback, useRef } from "react";
import { Clock, Pause, Play, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface Props {
  totalSeconds: number;
  onTimeUp: () => void;
  isPaused?: boolean;
  onElapsed?: (seconds: number) => void;
  storageKey?: string; // localStorage key for persistence
}

const FIVE_MIN_WARNING_KEY = "timer-5min-warned";

const Timer = ({ totalSeconds, onTimeUp, isPaused = false, onElapsed, storageKey }: Props) => {
  const [remaining, setRemaining] = useState(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const { remaining: r, savedAt } = JSON.parse(saved);
        const elapsed = Math.floor((Date.now() - savedAt) / 1000);
        return Math.max(0, r - elapsed);
      }
    }
    return totalSeconds;
  });
  const [paused, setPaused] = useState(isPaused);
  const [tabWarningShown, setTabWarningShown] = useState(false);
  const fiveMinWarned = useRef(false);
  const timeUpFired = useRef(false);

  // Persist remaining time to localStorage
  useEffect(() => {
    if (storageKey && remaining > 0) {
      localStorage.setItem(storageKey, JSON.stringify({ remaining, savedAt: Date.now() }));
    }
  }, [remaining, storageKey]);

  // Cleanup storage when time is up
  useEffect(() => {
    if (storageKey && remaining <= 0) {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(FIVE_MIN_WARNING_KEY);
    }
  }, [remaining, storageKey]);

  // Tab visibility warning
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && !paused && remaining > 0) {
        if (!tabWarningShown) {
          setTabWarningShown(true);
          toast.warning("⚠️ Tab switch detected!", {
            description: "Switching tabs during an exam is not recommended. Stay focused!",
            duration: 5000,
          });
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [paused, remaining, tabWarningShown]);

  // Main countdown
  useEffect(() => {
    if (paused || remaining <= 0) return;
    const interval = setInterval(() => {
      setRemaining((r) => {
        const next = r - 1;
        onElapsed?.(totalSeconds - next);

        // 5-minute warning
        if (next === 300 && !fiveMinWarned.current) {
          fiveMinWarned.current = true;
          toast.warning("⚠ Only 5 minutes remaining!", {
            description: "Finish your test soon.",
            duration: 6000,
          });
        }

        if (next <= 0) {
          clearInterval(interval);
          if (!timeUpFired.current) {
            timeUpFired.current = true;
            toast.error("⏰ Time is up!", {
              description: "Your test has been submitted.",
              duration: 8000,
            });
            onTimeUp();
          }
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [paused, remaining, totalSeconds, onTimeUp, onElapsed]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  // Color states: green (normal), orange (<10 min), red (<2 min)
  const getTimerStyles = () => {
    if (remaining < 120) {
      return "bg-destructive/10 text-destructive border-destructive/30 animate-pulse";
    }
    if (remaining < 600) {
      return "bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-700";
    }
    return "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700";
  };

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-mono text-sm font-semibold transition-colors duration-500 ${getTimerStyles()}`}>
      {remaining < 120 ? (
        <AlertTriangle className="w-4 h-4" />
      ) : (
        <Clock className="w-4 h-4" />
      )}
      <span>{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}</span>
      <button
        onClick={() => setPaused(!paused)}
        className="ml-1 p-1 rounded hover:bg-foreground/10 transition-colors"
        aria-label={paused ? "Resume" : "Pause"}
      >
        {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};

export default Timer;

/** Helper to clear a timer's persisted state */
export function clearTimerStorage(key: string) {
  localStorage.removeItem(key);
}

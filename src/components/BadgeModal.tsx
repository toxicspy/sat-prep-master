import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getBadgeForScore, type ScoreBadge } from "@/lib/gamification";

interface BadgeModalProps {
  open: boolean;
  onClose: () => void;
  correct: number;
  total: number;
  section: string;
}

const BadgeModal = ({ open, onClose, correct, total, section }: BadgeModalProps) => {
  const pct = Math.round((correct / total) * 100);
  const badge = getBadgeForScore(pct);
  const [animate, setAnimate] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (open) {
      setAnimate(false);
      setShowConfetti(false);
      const t1 = setTimeout(() => setAnimate(true), 100);
      const t2 = setTimeout(() => setShowConfetti(true), 300);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm text-center">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{section} Complete!</DialogTitle>
          <DialogDescription>Here's how you did</DialogDescription>
        </DialogHeader>

        {/* Confetti dots */}
        {showConfetti && pct >= 60 && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={i}
                className="absolute w-2 h-2 rounded-full opacity-80"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-5%`,
                  backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`,
                  animation: `confetti-fall ${1.5 + Math.random()}s ease-in forwards`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              />
            ))}
          </div>
        )}

        <div className="flex flex-col items-center gap-4 py-4">
          {/* Badge icon */}
          <div
            className={`text-7xl transition-all duration-700 ${
              animate ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          >
            {badge.emoji}
          </div>

          {/* Badge label */}
          <div
            className={`text-2xl font-bold ${badge.color} transition-all duration-500 delay-200 ${
              animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            {badge.label} Badge
          </div>

          {/* Score */}
          <div className="space-y-1">
            <div className="text-4xl font-bold text-primary">{pct}%</div>
            <div className="text-sm text-muted-foreground">
              {correct} of {total} correct
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full hero-gradient rounded-full transition-all duration-1000 ease-out"
              style={{ width: animate ? `${pct}%` : "0%" }}
            />
          </div>
        </div>

        <Button onClick={onClose} className="w-full">
          View Details
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default BadgeModal;

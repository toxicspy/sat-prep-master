import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Flame, Star, Rocket, Trophy, Sparkles } from "lucide-react";

const MESSAGES = [
  { icon: Flame, text: "You're on fire! Keep this momentum going!", color: "text-orange-500" },
  { icon: Star, text: "Great progress! You're doing amazing!", color: "text-yellow-500" },
  { icon: Rocket, text: "Halfway there! Stay focused and finish strong!", color: "text-blue-500" },
  { icon: Trophy, text: "Almost done! The finish line is in sight!", color: "text-green-500" },
  { icon: Sparkles, text: "Incredible effort! You've got this!", color: "text-purple-500" },
];

interface MotivationalPopupProps {
  currentIndex: number; // 0-based question index just completed
  total: number;
  open: boolean;
  onClose: () => void;
}

const MotivationalPopup = ({ currentIndex, total, open, onClose }: MotivationalPopupProps) => {
  const completed = currentIndex + 1;
  const milestone = Math.max(0, Math.floor(completed / 10) - 1);
  const msg = MESSAGES[milestone % MESSAGES.length];
  if (!msg) return null;
  const Icon = msg.icon;
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (open) {
      setAnimate(false);
      const t = setTimeout(() => setAnimate(true), 50);
      const autoClose = setTimeout(onClose, 5000);
      return () => { clearTimeout(t); clearTimeout(autoClose); };
    }
  }, [open, onClose]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xs text-center">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Milestone Reached! 🎯</DialogTitle>
          <DialogDescription className="sr-only">Progress update</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3 py-4">
          <div className={`transition-all duration-500 ${animate ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}>
            <Icon className={`w-14 h-14 ${msg.color}`} />
          </div>
          <p className={`font-semibold text-foreground transition-all duration-500 delay-100 ${animate ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
            {msg.text}
          </p>
          <div className="text-sm text-muted-foreground">
            <span className="font-bold text-primary">{completed}</span> / {total} questions completed
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full hero-gradient rounded-full transition-all duration-700"
              style={{ width: animate ? `${(completed / total) * 100}%` : "0%" }}
            />
          </div>
        </div>

        <Button onClick={onClose} className="w-full">Continue</Button>
      </DialogContent>
    </Dialog>
  );
};

export default MotivationalPopup;

/** Helper: returns true if a motivational popup should show after answering question at `index` (0-based) */
export function shouldShowMotivational(index: number, total: number): boolean {
  const completed = index + 1;
  return completed > 0 && completed < total && completed % 10 === 0;
}

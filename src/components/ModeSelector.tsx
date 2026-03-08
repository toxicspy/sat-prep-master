import { BookOpen, Timer, Sparkles } from "lucide-react";

export type TestMode = "practice" | "exam";

interface Props {
  selected: TestMode;
  onChange: (mode: TestMode) => void;
}

const ModeSelector = ({ selected, onChange }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-md">
      <button
        onClick={() => onChange("practice")}
        className={`p-4 rounded-xl border-2 text-left transition-all ${
          selected === "practice"
            ? "border-primary bg-primary/5 shadow-sm"
            : "border-border hover:border-primary/40 hover:bg-accent/50"
        }`}
      >
        <BookOpen className={`w-5 h-5 mb-2 ${selected === "practice" ? "text-primary" : "text-muted-foreground"}`} />
        <div className="font-semibold text-sm">Practice Mode</div>
        <p className="text-xs text-muted-foreground mt-1">No timer. Learn at your own pace with instant feedback.</p>
      </button>
      <button
        onClick={() => onChange("exam")}
        className={`p-4 rounded-xl border-2 text-left transition-all ${
          selected === "exam"
            ? "border-primary bg-primary/5 shadow-sm"
            : "border-border hover:border-primary/40 hover:bg-accent/50"
        }`}
      >
        <Timer className={`w-5 h-5 mb-2 ${selected === "exam" ? "text-primary" : "text-muted-foreground"}`} />
        <div className="font-semibold text-sm">Exam Mode</div>
        <p className="text-xs text-muted-foreground mt-1">Timed countdown. Simulates real test conditions.</p>
      </button>
    </div>
  );
};

export default ModeSelector;

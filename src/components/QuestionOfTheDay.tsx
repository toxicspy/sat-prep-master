import { useState } from "react";
import { allQuestions } from "@/data/questions";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";

const getDaily = () => {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return allQuestions[seed % allQuestions.length];
};

const QuestionOfTheDay = () => {
  const question = getDaily();
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  return (
    <div className="p-6 rounded-xl border bg-card card-shadow">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-sm font-sans">Question of the Day</h3>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground capitalize">{question.difficulty}</span>
      </div>
      <p className="text-sm font-medium mb-4 text-foreground">{question.question}</p>
      <div className="space-y-2">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => !answered && setSelected(i)}
            disabled={answered}
            className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-all ${
              !answered ? "hover:border-primary hover:bg-accent cursor-pointer" :
              i === question.correct ? "border-success bg-success/10 text-success" :
              i === selected ? "border-destructive bg-destructive/10 text-destructive" :
              "opacity-50"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <span className="w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
              {answered && i === question.correct && <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-success" />}
              {answered && i === selected && i !== question.correct && <XCircle className="w-3.5 h-3.5 ml-auto text-destructive" />}
            </span>
          </button>
        ))}
      </div>
      {answered && (
        <div className="mt-3 p-3 rounded-lg bg-accent border border-primary/20 text-sm text-muted-foreground">
          {question.explanation}
        </div>
      )}
    </div>
  );
};

export default QuestionOfTheDay;

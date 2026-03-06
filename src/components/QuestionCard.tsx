import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Question } from "@/data/questions";
import { CheckCircle2, XCircle, ChevronRight, Bookmark, Lightbulb, Target, BookOpen } from "lucide-react";
import { isBookmarked, toggleBookmark } from "@/lib/gamification";
import { getStrategyTip } from "@/lib/strategyTips";
import { getNotesForQuestionTopic } from "@/data/notes";

interface Props {
  question: Question;
  index: number;
  total: number;
  onAnswer: (correct: boolean, selectedIndex: number) => void;
  onNext: () => void;
  isLast: boolean;
  hideCorrectBeforeSubmit?: boolean;
  onTimeSpent?: (questionId: number, seconds: number) => void;
}

const SimpleExplanation = ({ explanation }: { explanation: string }) => {
  const [show, setShow] = useState(false);
  const steps = explanation.split(/[.;]/).filter(s => s.trim().length > 3).map(s => s.trim() + ".");
  return (
    <div className="mt-3">
      <button onClick={() => setShow(!show)} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
        <Lightbulb className="w-3.5 h-3.5" />
        {show ? "Hide Simple Explanation" : "Explain in Simple Terms"}
      </button>
      {show && (
        <div className="mt-2 p-3 rounded-md bg-background border text-xs space-y-1.5">
          <p className="font-medium text-foreground mb-1">Step-by-step:</p>
          {steps.map((step, i) => (
            <div key={i} className="flex gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
              <span className="text-muted-foreground">{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const QuestionCard = ({ question, index, total, onAnswer, onNext, isLast, hideCorrectBeforeSubmit = false, onTimeSpent }: Props) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(question.id));
  const [startTime] = useState(() => Date.now());

  const tip = useMemo(() => getStrategyTip(question.topic), [question.id]);
  const relatedNotes = useMemo(() => getNotesForQuestionTopic(question.topic), [question.topic]);

  const handleSelect = (optIndex: number) => {
    if (answered) return;
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    setSelected(optIndex);
    setAnswered(true);
    onAnswer(optIndex === question.correct, optIndex);
    onTimeSpent?.(question.id, timeSpent);
  };

  const handleBookmark = () => {
    const result = toggleBookmark(question.id);
    setBookmarked(result);
  };

  const optionClasses = (i: number) => {
    const base = "w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all ";
    if (!answered) return base + "border-border hover:border-primary hover:bg-accent cursor-pointer";
    if (hideCorrectBeforeSubmit) {
      if (i === selected) return base + "border-primary bg-primary/10 text-primary";
      return base + "border-border opacity-50";
    }
    if (i === question.correct) return base + "border-success bg-success/10 text-success";
    if (i === selected) return base + "border-destructive bg-destructive/10 text-destructive";
    return base + "border-border opacity-50";
  };

  return (
    <div className="animate-fade-in">
      {question.passage && (
        <div className="mb-6 p-4 bg-muted rounded-lg border">
          <p className="text-sm leading-relaxed text-foreground">{question.passage}</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-muted-foreground">
          Question {index + 1} of {total}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleBookmark}
            className={`p-1.5 rounded-md transition-colors ${
              bookmarked ? "text-primary bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            aria-label="Bookmark question"
          >
            <Bookmark className="w-4 h-4" fill={bookmarked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-4">
        <div
          className="h-full hero-gradient rounded-full transition-all duration-500"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      {/* Strategy Tip */}
      {!answered && (
        <div className="mb-4 p-2.5 rounded-lg bg-accent/50 border border-primary/10 flex items-start gap-2">
          <Target className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">{tip}</p>
        </div>
      )}

      <h3 className="text-lg font-semibold mb-5 text-foreground font-sans">{question.question}</h3>

      <div className="space-y-3 mb-5">
        {question.options.map((opt, i) => (
          <button key={i} onClick={() => handleSelect(i)} className={optionClasses(i)}>
            <span className="inline-flex items-center gap-3">
              <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
              {answered && !hideCorrectBeforeSubmit && i === question.correct && <CheckCircle2 className="w-4 h-4 ml-auto text-success" />}
              {answered && !hideCorrectBeforeSubmit && i === selected && i !== question.correct && <XCircle className="w-4 h-4 ml-auto text-destructive" />}
            </span>
          </button>
        ))}
      </div>

      {answered && !hideCorrectBeforeSubmit && (
        <div className="animate-fade-in">
          <div className="p-4 rounded-lg bg-accent border border-primary/20 mb-4">
            <p className="text-sm font-medium text-accent-foreground mb-1">Explanation</p>
            <p className="text-sm text-muted-foreground">{question.explanation}</p>
            <SimpleExplanation explanation={question.explanation} />
            {relatedNotes.length > 0 && (
              <Link
                to="/notes"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
              >
                <BookOpen className="w-3.5 h-3.5" />
                View Related Notes ({relatedNotes[0].title})
              </Link>
            )}
          </div>
          <button
            onClick={() => {
              setSelected(null);
              setAnswered(false);
              onNext();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg hero-gradient text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
          >
            {isLast ? "View Score" : "Next Question"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {answered && hideCorrectBeforeSubmit && (
        <div className="animate-fade-in">
          <button
            onClick={() => {
              setSelected(null);
              setAnswered(false);
              onNext();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg hero-gradient text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
          >
            {isLast ? "Submit Test" : "Next Question"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;

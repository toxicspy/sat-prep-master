import { allQuestions, topicLabels, Topic } from "@/data/questions";
import { AlertTriangle, Zap, Target, TrendingDown } from "lucide-react";

interface Props {
  answers: Record<number, number>;
  questionTimes?: Record<number, number>; // seconds per question
}

const MistakePatterns = ({ answers, questionTimes }: Props) => {
  const questionIds = Object.keys(answers).map(Number);
  const questions = questionIds
    .map((id) => allQuestions.find((q) => q.id === id))
    .filter(Boolean) as typeof allQuestions;

  const incorrect = questions.filter((q) => answers[q.id] !== q.correct);
  if (incorrect.length === 0) return null;

  // Topic frequency of mistakes
  const topicMistakes: Record<string, number> = {};
  incorrect.forEach((q) => {
    const label = topicLabels[q.topic as Topic] || q.topic;
    topicMistakes[label] = (topicMistakes[label] || 0) + 1;
  });
  const sortedTopics = Object.entries(topicMistakes).sort((a, b) => b[1] - a[1]);
  const repeatedTopics = sortedTopics.filter(([, count]) => count >= 2);

  // Detect possible guessing (answered in < 5 seconds and incorrect)
  const possibleGuesses = questionTimes
    ? incorrect.filter((q) => (questionTimes[q.id] || 999) < 5)
    : [];

  // Difficulty breakdown of mistakes
  const diffMistakes = { easy: 0, medium: 0, hard: 0 };
  incorrect.forEach((q) => { diffMistakes[q.difficulty] += 1; });

  return (
    <div className="p-6 rounded-xl border bg-card card-shadow">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-destructive" />
        <h3 className="text-lg font-semibold font-sans">Mistake Patterns</h3>
      </div>

      <div className="space-y-4">
        {/* Repeated topic mistakes */}
        {repeatedTopics.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-destructive mb-2">
              <TrendingDown className="w-4 h-4" /> Repeated Mistakes
            </div>
            <ul className="space-y-1">
              {repeatedTopics.map(([topic, count]) => (
                <li key={topic} className="text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-destructive shrink-0" />
                  <strong>{topic}</strong> — {count} incorrect answers
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Possible guessing */}
        {possibleGuesses.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-yellow-600 mb-2">
              <Zap className="w-4 h-4" /> Possible Guessing Detected
            </div>
            <p className="text-sm text-muted-foreground">
              {possibleGuesses.length} question{possibleGuesses.length > 1 ? "s" : ""} answered incorrectly in under 5 seconds. 
              Take more time to read each question carefully.
            </p>
          </div>
        )}

        {/* Difficulty breakdown */}
        <div>
          <div className="flex items-center gap-1.5 text-sm font-medium mb-2">
            <Target className="w-4 h-4 text-primary" /> Mistakes by Difficulty
          </div>
          <div className="flex gap-3">
            {(["easy", "medium", "hard"] as const).map((d) => (
              <div key={d} className="flex-1 p-2 rounded-lg bg-muted text-center">
                <div className="text-lg font-bold">{diffMistakes[d]}</div>
                <div className="text-xs text-muted-foreground capitalize">{d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Improvement suggestions */}
        <div className="p-3 rounded-lg bg-accent border border-primary/20">
          <p className="text-xs font-medium text-accent-foreground mb-1">💡 Suggestions</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            {diffMistakes.easy >= 2 && (
              <li>• Review fundamentals — you're missing easy questions that could boost your score significantly.</li>
            )}
            {repeatedTopics.length > 0 && (
              <li>• Focus on <strong>{repeatedTopics[0][0]}</strong> — it's your most common mistake area.</li>
            )}
            {possibleGuesses.length > 0 && (
              <li>• Slow down on questions you're unsure about. Elimination strategy is better than guessing.</li>
            )}
            {incorrect.length > questions.length / 2 && (
              <li>• Consider starting with easier difficulty to build confidence before attempting mixed/hard tests.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MistakePatterns;

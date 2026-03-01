import { useState } from "react";
import Layout from "@/components/Layout";
import QuestionCard from "@/components/QuestionCard";
import { getBookmarks } from "@/lib/gamification";
import { allQuestions } from "@/data/questions";
import { Bookmark } from "lucide-react";

const SavedQuestions = () => {
  const [bookmarkIds, setBookmarkIds] = useState(getBookmarks);
  const questions = allQuestions.filter((q) => bookmarkIds.includes(q.id));
  const [current, setCurrent] = useState(0);

  const refresh = () => setBookmarkIds(getBookmarks());

  if (questions.length === 0) {
    return (
      <Layout>
        <div className="container max-w-2xl py-16 text-center">
          <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-3">Saved Questions</h1>
          <p className="text-muted-foreground">
            You haven't bookmarked any questions yet. Click the bookmark icon while practicing to save questions for later review.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-3xl py-6">
        <div className="flex items-center gap-3 mb-6">
          <Bookmark className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold font-sans">Saved Questions ({questions.length})</h1>
        </div>
        <div className="p-6 md:p-8 rounded-xl border bg-card card-shadow">
          <QuestionCard
            key={current}
            question={questions[current]}
            index={current}
            total={questions.length}
            onAnswer={() => {}}
            onNext={() => {
              if (current < questions.length - 1) setCurrent((c) => c + 1);
              refresh();
            }}
            isLast={current >= questions.length - 1}
          />
        </div>
      </div>
    </Layout>
  );
};

export default SavedQuestions;

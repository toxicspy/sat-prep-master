import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import QuestionCard from "@/components/QuestionCard";
import { readingQuestions } from "@/data/questions";
import { FileText } from "lucide-react";

const ReadingPractice = () => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  const handleAnswer = (correct: boolean) => {
    if (correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current >= readingQuestions.length - 1) {
      navigate(`/score?correct=${score}&total=${readingQuestions.length}&section=Reading%20%26%20Writing`);
    } else {
      setCurrent((c) => c + 1);
    }
  };

  return (
    <Layout>
      <div className="container max-w-3xl py-10">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">SAT Reading & Writing Practice</h1>
        </div>
        <div className="p-6 md:p-8 rounded-xl border bg-card card-shadow">
          <QuestionCard
            key={current}
            question={readingQuestions[current]}
            index={current}
            total={readingQuestions.length}
            onAnswer={handleAnswer}
            onNext={handleNext}
            isLast={current >= readingQuestions.length - 1}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ReadingPractice;

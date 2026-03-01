import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import QuestionCard from "@/components/QuestionCard";
import { mathQuestions } from "@/data/questions";
import { Calculator } from "lucide-react";

const MathPractice = () => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  const handleAnswer = (correct: boolean) => {
    if (correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current >= mathQuestions.length - 1) {
      navigate(`/score?correct=${score}&total=${mathQuestions.length}&section=Math`);
    } else {
      setCurrent((c) => c + 1);
    }
  };

  return (
    <Layout>
      <div className="container max-w-3xl py-10">
        <div className="flex items-center gap-3 mb-8">
          <Calculator className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">SAT Math Practice</h1>
        </div>
        <div className="p-6 md:p-8 rounded-xl border bg-card card-shadow">
          <QuestionCard
            key={current}
            question={mathQuestions[current]}
            index={current}
            total={mathQuestions.length}
            onAnswer={handleAnswer}
            onNext={handleNext}
            isLast={current >= mathQuestions.length - 1}
          />
        </div>
      </div>
    </Layout>
  );
};

export default MathPractice;

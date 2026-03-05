import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FAQItem {
  question: string;
  answer: string;
  bullets?: string[];
}

const satFAQs: FAQItem[] = [
  {
    question: "Is the SAT hard?",
    answer: "The SAT is challenging but manageable with proper preparation. The test is designed to assess college readiness, not to trick students. Most questions test fundamental math, reading comprehension, and writing skills that you've been building throughout high school.",
    bullets: [
      "The Digital SAT is shorter than the old paper test (2 hours 14 minutes vs 3+ hours)",
      "It uses adaptive testing, adjusting difficulty based on your performance",
      "Consistent practice over 2–3 months significantly improves scores for most students",
    ],
  },
  {
    question: "What is a good SAT score?",
    answer: "A \"good\" SAT score depends on your target colleges. The SAT is scored on a scale of 400–1600, with the national average around 1050. A score of 1200+ is considered above average, while 1400+ is competitive for highly selective universities.",
    bullets: [
      "1000–1100: Average, suitable for many state universities",
      "1200–1350: Above average, competitive for most colleges",
      "1400–1500: Excellent, competitive for top-tier schools",
      "1500+: Outstanding, competitive for Ivy League and elite institutions",
    ],
  },
  {
    question: "How long should I study for the SAT?",
    answer: "Most students benefit from 2–3 months of focused preparation, studying 1–2 hours per day. However, the ideal timeline depends on your starting score and target score. Students aiming for a 100+ point improvement should plan for at least 10–12 weeks of structured study.",
    bullets: [
      "Take a diagnostic test first to identify your baseline score",
      "Focus on your weakest areas for the biggest score gains",
      "Practice with full-length timed tests every 1–2 weeks",
      "The last week before the test should be light review, not cramming",
    ],
  },
  {
    question: "Can I use a calculator on the SAT?",
    answer: "Yes. On the Digital SAT, you have access to a built-in Desmos graphing calculator for the entire math section. You can also bring your own approved calculator. This is a significant change from the old paper SAT, which had a no-calculator math section.",
    bullets: [
      "The built-in Desmos calculator is available for all math questions",
      "You may bring your own TI or Casio graphing calculator as a backup",
      "Smartwatches, phones, and laptops are not permitted",
      "Practice using Desmos before test day so you're comfortable with it",
    ],
  },
  {
    question: "How many times can I take the SAT?",
    answer: "There is no official limit on how many times you can take the SAT. College Board offers the test 7 times per year in the US. Most students take it 2–3 times. Many colleges practice \"superscoring,\" which means they consider your highest section scores across all attempts.",
    bullets: [
      "Most students see their biggest improvement between the first and second attempts",
      "Taking it more than 3 times rarely produces significant gains",
      "You can choose which scores to send to colleges using Score Choice",
      "Check each college's policy on superscoring before deciding how many times to test",
    ],
  },
  {
    question: "Is the SAT digital now?",
    answer: "Yes. As of 2024, the SAT is fully digital for all US and international test-takers. The test is administered on a laptop or tablet using the College Board's Bluebook application. The digital format includes several improvements over the paper version.",
    bullets: [
      "The test is shorter: 2 hours 14 minutes instead of 3+ hours",
      "It uses multistage adaptive testing for a more personalized experience",
      "Reading passages are shorter, with one question per passage",
      "Scores are released faster, typically within days instead of weeks",
    ],
  },
  {
    question: "How is the SAT scored?",
    answer: "The SAT is scored on a scale of 400–1600, combining two section scores. The Reading and Writing section is scored 200–800, and the Math section is scored 200–800. There is no penalty for wrong answers, so you should answer every question.",
    bullets: [
      "Raw score = number of correct answers (no penalty for guessing)",
      "Raw scores are converted to scaled scores using equating tables",
      "The adaptive format means Module 2 difficulty affects your score ceiling",
      "Strong performance on Module 1 unlocks harder (higher-scoring) Module 2 questions",
    ],
  },
];

/** Generates FAQ JSON-LD structured data for Google rich results */
export function getFAQJsonLd(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer + (faq.bullets ? " " + faq.bullets.join(". ") + "." : ""),
      },
    })),
  };
}

interface FAQSectionProps {
  faqs?: FAQItem[];
  title?: string;
  showRelated?: boolean;
}

const FAQSection = ({
  faqs = satFAQs,
  title = "People Also Ask",
  showRelated = true,
}: FAQSectionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const relatedQuestions = useMemo(() => {
    const shuffled = [...faqs].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [faqs]);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="w-full">
      <h2 className="text-2xl font-bold mb-6 font-serif">
        {title}
      </h2>
      <div className="rounded-xl border bg-card overflow-hidden divide-y divide-border">
        {faqs.map((faq, i) => (
          <div key={i}>
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left gap-3 hover:bg-accent/40 transition-colors"
              aria-expanded={openIndex === i}
            >
              <h3 className="text-sm sm:text-base font-semibold text-primary font-sans">
                {faq.question}
              </h3>
              <ChevronDown
                className={cn(
                  "w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  openIndex === i && "rotate-180"
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-200 ease-out",
                openIndex === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-4 pt-0">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                    {faq.answer}
                  </p>
                  {faq.bullets && (
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                      {faq.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showRelated && (
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-3 font-serif">Related Questions</h2>
          <div className="space-y-2">
            {relatedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => {
                  const idx = faqs.indexOf(q);
                  if (idx !== -1) {
                    setOpenIndex(idx);
                    document.querySelector(`[data-faq="${idx}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                }}
                className="block w-full text-left px-4 py-3 rounded-lg border bg-card text-sm font-medium text-primary hover:bg-accent/40 transition-colors"
              >
                {q.question}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export { satFAQs };
export default FAQSection;

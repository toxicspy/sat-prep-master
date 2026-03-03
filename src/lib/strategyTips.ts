// Strategy tips mapped by topic for contextual exam advice
import { Topic } from "@/data/questions";

const tips: Record<string, string[]> = {
  algebra: [
    "Isolate the variable step by step — don't skip steps to avoid sign errors.",
    "Plug your answer back in to verify it satisfies the original equation.",
    "When you see absolute values, remember to set up two separate equations.",
  ],
  geometry: [
    "Draw or label the figure — even a quick sketch prevents careless mistakes.",
    "Memorize key formulas: area of circle (πr²), triangle (½bh), Pythagorean theorem.",
    "Convert between radians and degrees: multiply by 180/π or π/180.",
  ],
  statistics: [
    "For probability, count favorable outcomes over total outcomes carefully.",
    "Mean = Sum / Count. If given the mean, multiply to find the sum.",
    "For median, always sort the data first before finding the middle value.",
  ],
  arithmetic: [
    "Convert percentages to decimals before calculating (e.g., 15% = 0.15).",
    "For ratio problems, find the total parts first, then compute each share.",
    "Simplify fractions by dividing numerator and denominator by their GCF.",
  ],
  "advanced-math": [
    "For quadratics, try factoring first — it's faster than the quadratic formula.",
    "Remember: (a+b)² = a² + 2ab + b². Don't forget the middle term.",
    "For composite functions, work from the inside out: f(g(x)) → compute g(x) first.",
  ],
  "main-idea": [
    "Read the first and last sentences of each paragraph to identify the main idea quickly.",
    "Eliminate answers that are too narrow (only one detail) or too broad.",
    "The main idea should cover the entire passage, not just one paragraph.",
  ],
  vocabulary: [
    "Use context clues — look at the sentence before and after the word.",
    "Substitute each answer choice into the sentence to see which fits best.",
    "Watch for words that look positive/negative — tone can eliminate options.",
  ],
  structure: [
    "Map the passage: intro → evidence → counterargument → conclusion.",
    "Look for transition words (however, therefore, in contrast) to identify structure.",
    "Ask: what is each paragraph doing? Claim, evidence, rebuttal, or summary?",
  ],
  evidence: [
    "The best evidence directly supports the claim — not just relates to the topic.",
    "Eliminate choices that are true but don't answer the specific question asked.",
    "Look for data, statistics, or expert quotes as strong evidence markers.",
  ],
  inference: [
    "Inferences must be supported by the text — avoid adding your own knowledge.",
    "The correct inference is usually the most conservative, well-supported option.",
    "Re-read the relevant section before choosing — memory can mislead you.",
  ],
  tone: [
    "Identify the author's word choices — are they positive, negative, or neutral?",
    "Tone answers are usually moderate (e.g., 'cautiously optimistic' not 'ecstatic').",
    "Look for qualifying words like 'however,' 'despite,' or 'although' for nuanced tone.",
  ],
};

export function getStrategyTip(topic: Topic): string {
  const topicTips = tips[topic] || [];
  if (topicTips.length === 0) return "Read each answer choice carefully before selecting.";
  return topicTips[Math.floor(Math.random() * topicTips.length)];
}

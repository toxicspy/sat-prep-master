/**
 * Study notes data organized by subject and topic.
 * Designed for easy migration to a database backend later.
 */

export interface StudyNote {
  id: string;
  subject: "Math" | "Reading" | "Writing";
  topic: string;
  /** Maps to question topic slugs for linking */
  questionTopic: string;
  title: string;
  content: string;
  formulas?: string[];
  examples?: string[];
  keyPoints: string[];
  relatedQuestionIds: number[];
}

export const studyNotes: StudyNote[] = [
  // ── MATH: Algebra ──
  {
    id: "math-algebra-linear",
    subject: "Math",
    topic: "Algebra",
    questionTopic: "algebra",
    title: "Linear Equations & Inequalities",
    content: "Linear equations have variables raised to the first power. The standard form is ax + b = c. To solve, isolate the variable by performing inverse operations on both sides. Inequalities follow the same rules, except the sign flips when multiplying or dividing by a negative number.",
    formulas: ["ax + b = c → x = (c − b) / a", "Slope-intercept: y = mx + b", "Point-slope: y − y₁ = m(x − x₁)"],
    examples: ["3x + 7 = 22 → 3x = 15 → x = 5", "5x − 3 > 12 → 5x > 15 → x > 3"],
    keyPoints: [
      "Always perform the same operation on both sides",
      "Flip the inequality sign when multiplying/dividing by a negative",
      "Check your answer by substituting back into the original equation",
      "The y-intercept is the value of b in y = mx + b"
    ],
    relatedQuestionIds: [1, 5, 6, 7, 10, 12, 16, 25],
  },
  {
    id: "math-algebra-systems",
    subject: "Math",
    topic: "Algebra",
    questionTopic: "algebra",
    title: "Systems of Equations",
    content: "A system of equations is a set of two or more equations with the same variables. You can solve using substitution (solve one equation for a variable and plug into the other) or elimination (add/subtract equations to eliminate a variable).",
    formulas: ["Substitution: solve for one variable, plug into the other", "Elimination: add or subtract equations to cancel a variable"],
    examples: ["x + y = 10 and x − y = 4 → Add: 2x = 14 → x = 7, y = 3"],
    keyPoints: [
      "Substitution works best when one variable is already isolated",
      "Elimination works best when coefficients align or can be made to align",
      "If the system has no solution, the lines are parallel",
      "If the system has infinitely many solutions, the equations are the same line"
    ],
    relatedQuestionIds: [33],
  },
  {
    id: "math-algebra-polynomials",
    subject: "Math",
    topic: "Algebra",
    questionTopic: "algebra",
    title: "Polynomials & Factoring",
    content: "Polynomials are expressions with variables raised to whole-number powers. Factoring is the process of breaking a polynomial into simpler expressions that multiply together. Key patterns include difference of squares, perfect square trinomials, and the distributive property (FOIL for binomials).",
    formulas: ["a² − b² = (a − b)(a + b)", "(a + b)² = a² + 2ab + b²", "FOIL: (a+b)(c+d) = ac + ad + bc + bd"],
    examples: ["x² − 9 = (x−3)(x+3)", "(x+4)² = x² + 8x + 16", "(2x+3)(x−1) = 2x² + x − 3"],
    keyPoints: [
      "Always check for a GCF before factoring",
      "Difference of squares: a² − b² = (a−b)(a+b)",
      "For trinomials ax² + bx + c, find two numbers that multiply to ac and add to b",
      "Use the power rule: (xᵃ)ᵇ = x^(ab)"
    ],
    relatedQuestionIds: [10, 21, 41, 49],
  },
  // ── MATH: Geometry ──
  {
    id: "math-geometry-circles",
    subject: "Math",
    topic: "Geometry",
    questionTopic: "geometry",
    title: "Circles & Area",
    content: "A circle is defined by its center and radius. The area measures the space inside, and the circumference measures the distance around. These formulas appear frequently on the SAT, often in word problems involving real-world scenarios.",
    formulas: ["Area = πr²", "Circumference = 2πr", "Arc length = (θ/360)·2πr"],
    examples: ["Radius 5 → Area = 25π", "Diameter 10 → Circumference = 10π"],
    keyPoints: [
      "Diameter = 2 × radius",
      "π ≈ 3.14159; leave answers in terms of π when possible",
      "Sector area = (θ/360)·πr²",
      "Central angle = arc measure in degrees"
    ],
    relatedQuestionIds: [4],
  },
  {
    id: "math-geometry-triangles",
    subject: "Math",
    topic: "Geometry",
    questionTopic: "geometry",
    title: "Triangles & Angles",
    content: "The sum of interior angles in any triangle is 180°. Special triangles include right triangles (one 90° angle), isosceles (two equal sides), and equilateral (all sides equal, all angles 60°). The Pythagorean theorem applies only to right triangles.",
    formulas: ["a² + b² = c² (right triangles)", "Sum of angles = 180°", "Area = ½ × base × height"],
    examples: ["3-4-5 right triangle: 9 + 16 = 25 ✓", "Angles 50° + 60° → third = 70°"],
    keyPoints: [
      "Common Pythagorean triples: 3-4-5, 5-12-13, 8-15-17",
      "45-45-90 triangle sides: x, x, x√2",
      "30-60-90 triangle sides: x, x√3, 2x",
      "The longest side is always opposite the largest angle"
    ],
    relatedQuestionIds: [11, 40],
  },
  {
    id: "math-geometry-coordinate",
    subject: "Math",
    topic: "Geometry",
    questionTopic: "geometry",
    title: "Coordinate Geometry",
    content: "Coordinate geometry combines algebra and geometry on the xy-plane. Key concepts include slope (rate of change), distance between points, and midpoint. These are essential for SAT questions involving lines, segments, and graphing.",
    formulas: ["Slope = (y₂ − y₁) / (x₂ − x₁)", "Distance = √((x₂−x₁)² + (y₂−y₁)²)", "Midpoint = ((x₁+x₂)/2, (y₁+y₂)/2)"],
    examples: ["Slope through (2,5) and (6,13) = 8/4 = 2", "Distance (1,2) to (4,6) = √(9+16) = 5", "Midpoint of (2,8) and (10,4) = (6,6)"],
    keyPoints: [
      "Parallel lines have equal slopes",
      "Perpendicular lines have slopes that are negative reciprocals",
      "Horizontal lines have slope 0; vertical lines have undefined slope",
      "The midpoint is the average of the coordinates"
    ],
    relatedQuestionIds: [2, 24, 44],
  },
  // ── MATH: Statistics ──
  {
    id: "math-statistics-central",
    subject: "Math",
    topic: "Statistics",
    questionTopic: "statistics",
    title: "Mean, Median & Probability",
    content: "Central tendency measures describe the center of a data set. The mean is the arithmetic average, the median is the middle value when data is ordered, and the mode is the most frequent value. Probability measures the likelihood of an event occurring.",
    formulas: ["Mean = Sum / Count", "P(event) = favorable outcomes / total outcomes", "Median: middle value in sorted data"],
    examples: ["Mean of 5 numbers summing to 100 = 20", "P(rolling 6) = 1/6", "Median of {3,7,9,15,21} = 9"],
    keyPoints: [
      "Mean is affected by outliers; median is not",
      "For even-count data sets, median = average of two middle values",
      "Probability is always between 0 and 1",
      "Complementary probability: P(not A) = 1 − P(A)"
    ],
    relatedQuestionIds: [8, 13, 34, 43, 50],
  },
  // ── MATH: Arithmetic ──
  {
    id: "math-arithmetic-fundamentals",
    subject: "Math",
    topic: "Arithmetic",
    questionTopic: "arithmetic",
    title: "Percentages, Ratios & Exponents",
    content: "Arithmetic fundamentals include percentages (parts per hundred), ratios (comparisons), and exponents (repeated multiplication). These concepts are the building blocks for more complex SAT math topics and appear in many word problems.",
    formulas: ["Percent = (part/whole) × 100", "a^m × a^n = a^(m+n)", "(a^m)^n = a^(mn)", "√(ab) = √a × √b"],
    examples: ["15% of 240 = 36", "√50 = √(25·2) = 5√2", "(−2)⁴ = 16", "3! = 6"],
    keyPoints: [
      "To find X% of Y: multiply Y × (X/100)",
      "Negative base with even exponent = positive result",
      "GCF: largest factor shared; LCM: smallest common multiple",
      "Speed = Distance / Time"
    ],
    relatedQuestionIds: [9, 14, 17, 18, 22, 26, 27, 29, 30, 31, 36, 37, 39, 46],
  },
  // ── MATH: Advanced Math ──
  {
    id: "math-advanced-functions",
    subject: "Math",
    topic: "Advanced Math",
    questionTopic: "advanced-math",
    title: "Functions, Quadratics & Logarithms",
    content: "Advanced math on the SAT covers function evaluation, quadratic equations, and basic logarithms. Function notation f(x) represents the output for input x. Quadratics can be solved by factoring, completing the square, or the quadratic formula. Logarithms are the inverse of exponents.",
    formulas: ["Quadratic formula: x = (−b ± √(b²−4ac)) / 2a", "Vertex form: y = a(x−h)² + k", "log_b(x) = y means b^y = x"],
    examples: ["f(x) = 2x²−3x+1, f(3) = 10", "x²−5x+6 = 0 → (x−2)(x−3) = 0", "log₁₀(1000) = 3"],
    keyPoints: [
      "The vertex (h,k) is the minimum or maximum point of a parabola",
      "Discriminant b²−4ac: positive = 2 real roots, zero = 1, negative = none",
      "Composition: g(f(x)) means apply f first, then g",
      "Logarithm and exponent are inverse operations"
    ],
    relatedQuestionIds: [3, 23, 28, 38, 42, 45],
  },
  // ── READING ──
  {
    id: "reading-main-idea",
    subject: "Reading",
    topic: "Main Idea & Purpose",
    questionTopic: "main-idea",
    title: "Identifying Main Ideas & Author's Purpose",
    content: "Main idea questions ask what the passage is primarily about. The author's purpose is why the passage was written—to inform, persuade, entertain, or analyze. Look for the thesis statement (often in the first or last paragraph) and recurring themes throughout the passage.",
    keyPoints: [
      "The main idea is the central message, not a supporting detail",
      "Wrong answers are often too narrow (one detail) or too broad (beyond the passage)",
      "Author's purpose: inform (facts), persuade (argument), analyze (examination)",
      "Read the first and last sentences of each paragraph for structure clues"
    ],
    relatedQuestionIds: [51, 57, 63],
  },
  {
    id: "reading-vocabulary",
    subject: "Reading",
    topic: "Vocabulary in Context",
    questionTopic: "vocabulary",
    title: "Vocabulary in Context",
    content: "These questions ask about the meaning of a word or phrase as it is used in the passage. The correct answer depends on context, not the most common dictionary definition. Substitute each answer choice into the sentence and see which one preserves the original meaning.",
    keyPoints: [
      "Don't pick the most common definition—pick the one that fits the context",
      "Substitute each answer choice into the sentence to test the meaning",
      "Look at surrounding sentences for clues about tone and subject",
      "Words like 'refined,' 'crude,' 'elevated' often have context-dependent meanings"
    ],
    relatedQuestionIds: [52, 56, 58, 66],
  },
  {
    id: "reading-structure",
    subject: "Reading",
    topic: "Passage Structure",
    questionTopic: "structure",
    title: "Understanding Passage Structure",
    content: "Structure questions ask how the passage is organized. Common structures include: claim → evidence → counterargument, problem → solution, chronological narrative, and compare/contrast. Understanding structure helps you predict where to find information.",
    keyPoints: [
      "Common patterns: cause-effect, problem-solution, compare-contrast, chronological",
      "Transition words signal structure: 'however' (contrast), 'therefore' (cause-effect), 'first/then' (sequence)",
      "Identify the role of each paragraph in the overall argument",
      "Structure questions often use phrases like 'best describes the organization'"
    ],
    relatedQuestionIds: [53, 67],
  },
  {
    id: "reading-evidence",
    subject: "Reading",
    topic: "Evidence & Analysis",
    questionTopic: "evidence",
    title: "Using Evidence to Support Claims",
    content: "Evidence questions ask which part of the passage supports a given conclusion, or which additional evidence would strengthen or weaken the argument. These require careful reading and the ability to distinguish between relevant and irrelevant information.",
    keyPoints: [
      "The best evidence directly supports the claim—not just relates to the same topic",
      "Eliminate choices that are off-topic or only tangentially related",
      "For 'strengthen' questions, look for data or examples that confirm the argument",
      "For 'weaken' questions, look for contradictions or counterexamples"
    ],
    relatedQuestionIds: [54, 64, 68],
  },
  {
    id: "reading-inference",
    subject: "Reading",
    topic: "Inference & Reasoning",
    questionTopic: "inference",
    title: "Making Inferences",
    content: "Inference questions ask you to draw a conclusion that is not explicitly stated but is supported by the passage. The correct answer is always grounded in the text—it requires a small logical step, not a big leap or personal opinion.",
    keyPoints: [
      "Inferences must be directly supported by passage evidence",
      "Avoid extreme answers—SAT inferences are usually moderate",
      "The word 'suggests' or 'implies' signals an inference question",
      "Eliminate answers that require information not in the passage"
    ],
    relatedQuestionIds: [55, 65, 69],
  },
  {
    id: "reading-tone",
    subject: "Reading",
    topic: "Tone & Attitude",
    questionTopic: "tone",
    title: "Analyzing Tone & Author's Attitude",
    content: "Tone questions ask about the author's attitude toward the subject. Tone is conveyed through word choice (diction), sentence structure, and the types of details included. Common SAT tones include objective, critical, optimistic, cautious, and skeptical.",
    keyPoints: [
      "Tone = author's attitude, revealed through word choice",
      "Common tones on SAT: analytical, critical, appreciative, cautionary, neutral",
      "Extreme tones (furious, ecstatic) are rarely correct on the SAT",
      "Pay attention to adjectives and adverbs—they reveal attitude"
    ],
    relatedQuestionIds: [60, 70],
  },
  // ── WRITING ──
  {
    id: "writing-grammar",
    subject: "Writing",
    topic: "Grammar & Punctuation",
    questionTopic: "structure",
    title: "Grammar Rules for the SAT",
    content: "The SAT Writing section tests standard English conventions including subject-verb agreement, pronoun clarity, verb tense consistency, comma usage, and semicolons. Mastering these rules can significantly boost your score.",
    keyPoints: [
      "Subject-verb agreement: the verb must match the subject in number (singular/plural)",
      "Pronoun agreement: pronouns must clearly refer to a specific noun",
      "Comma splice: two independent clauses cannot be joined by a comma alone",
      "Semicolons join two related independent clauses",
      "Use commas after introductory phrases and around nonessential clauses"
    ],
    relatedQuestionIds: [],
  },
  {
    id: "writing-rhetoric",
    subject: "Writing",
    topic: "Rhetoric & Effectiveness",
    questionTopic: "structure",
    title: "Effective Language & Rhetoric",
    content: "Rhetoric questions test whether you can choose the most effective, concise, and clear way to express an idea. The SAT values conciseness—eliminate wordiness and redundancy. Rhetorical questions also test transitions between sentences and paragraphs.",
    keyPoints: [
      "Shorter is usually better—eliminate redundant words",
      "Transitions must logically connect ideas (cause, contrast, addition, example)",
      "Choose the answer that is most specific and precise",
      "Avoid informal language or slang in formal passages",
      "Sentence placement questions: consider logical flow and topic sentences"
    ],
    relatedQuestionIds: [],
  },
];

/**
 * Get notes by subject
 */
export const getNotesBySubject = (subject: string): StudyNote[] =>
  studyNotes.filter((n) => n.subject === subject);

/**
 * Search notes by query string (searches title, content, topic, key points)
 */
export const searchNotes = (query: string): StudyNote[] => {
  const q = query.toLowerCase().trim();
  if (!q) return studyNotes;
  return studyNotes.filter(
    (n) =>
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.topic.toLowerCase().includes(q) ||
      n.keyPoints.some((kp) => kp.toLowerCase().includes(q))
  );
};

/**
 * Find notes related to a specific question topic
 */
export const getNotesForQuestionTopic = (questionTopic: string): StudyNote[] =>
  studyNotes.filter((n) => n.questionTopic === questionTopic);

/**
 * Get a single note by ID
 */
export const getNoteById = (id: string): StudyNote | undefined =>
  studyNotes.find((n) => n.id === id);

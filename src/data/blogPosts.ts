export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "top-10-sat-math-strategies",
    title: "Top 10 SAT Math Strategies That Actually Work",
    excerpt: "Master these proven strategies to boost your SAT Math score by 100+ points.",
    date: "2026-02-20",
    readTime: "6 min read",
    content: `Improving your SAT Math score doesn't require genius-level talent—it requires the right strategies applied consistently.\n\n**1. Master the Fundamentals First**\nBefore tackling advanced problems, ensure you're solid on algebra, geometry basics, and arithmetic. Most SAT Math questions test foundational concepts.\n\n**2. Plug In Numbers**\nWhen variables appear in both the question and answer choices, substitute simple numbers to find the right answer.\n\n**3. Back-Solve from Answer Choices**\nStart with choice C (the middle value) and work backward. This eliminates trial-and-error guessing.\n\n**4. Use Your Calculator Wisely**\nDon't rely on it for every problem. Mental math is faster for simple calculations.\n\n**5. Draw Diagrams**\nFor geometry and word problems, a quick sketch clarifies relationships between variables.\n\n**6. Watch for Unit Conversions**\nMany errors come from mixing units. Always check what the question asks for.\n\n**7. Eliminate Wrong Answers**\nEven if you can't solve the problem, eliminating 1-2 wrong answers dramatically improves your odds.\n\n**8. Time Management**\nSpend no more than 90 seconds on any single question. Flag difficult ones and return later.\n\n**9. Review Your Mistakes**\nAfter each practice session, categorize your errors: careless, conceptual, or time-related.\n\n**10. Practice Under Real Conditions**\nTake full-length timed practice tests to build stamina and familiarity with the format.`
  },
  {
    slug: "digital-sat-what-to-expect",
    title: "The Digital SAT: What You Need to Know in 2026",
    excerpt: "Everything has changed with the Digital SAT. Here's your complete guide to the new format.",
    date: "2026-02-15",
    readTime: "5 min read",
    content: `The SAT has gone fully digital, and the format is significantly different from the paper-based test.\n\n**Adaptive Testing**\nThe Digital SAT uses a multi-stage adaptive design. Your performance on the first module determines the difficulty of the second module.\n\n**Shorter Test**\nThe test is now about 2 hours and 14 minutes, down from over 3 hours.\n\n**Built-in Tools**\nYou get an on-screen calculator (Desmos) for the entire math section, plus annotation tools for reading passages.\n\n**Shorter Passages**\nReading passages are shorter and each paired with a single question, making it easier to focus.\n\n**Score Range**\nThe scoring still ranges from 400 to 1600, with two sections: Reading and Writing (200-800) and Math (200-800).\n\n**What This Means for You**\nPractice with digital tools. Get comfortable with the Bluebook app. And take advantage of the adaptive format—strong performance early makes later questions more manageable in scoring.`
  },
  {
    slug: "reading-comprehension-tips",
    title: "5 Reading Comprehension Tips for the SAT",
    excerpt: "Struggling with SAT Reading passages? These five techniques will help you find answers faster.",
    date: "2026-02-10",
    readTime: "4 min read",
    content: `SAT Reading can feel overwhelming, but these strategies make it manageable.\n\n**1. Read the Question First**\nKnowing what you're looking for before reading the passage helps you focus and saves time.\n\n**2. Identify the Main Idea Quickly**\nThe first and last sentences of each passage usually contain the core argument.\n\n**3. Look for Evidence in the Text**\nEvery correct answer is supported by specific text. If you can't point to it, reconsider your choice.\n\n**4. Eliminate Extreme Answers**\nAnswers with words like "always," "never," or "completely" are usually wrong. The SAT favors nuanced answers.\n\n**5. Practice Active Reading**\nAs you read, mentally summarize each paragraph. This keeps you engaged and improves retention.`
  },
  {
    slug: "sat-score-goals",
    title: "What SAT Score Do You Actually Need?",
    excerpt: "Not every college requires a 1500+. Learn how to set a realistic and strategic SAT score goal.",
    date: "2026-02-05",
    readTime: "5 min read",
    content: `Setting the right SAT score goal depends on your target schools.\n\n**Research Your Schools**\nLook up the middle 50% SAT score range for admitted students. Aim for the 75th percentile to be competitive.\n\n**Test-Optional ≠ Test-Blind**\nMany "test-optional" schools still consider scores when submitted. A strong score can only help.\n\n**Scholarship Opportunities**\nMany state universities offer automatic scholarships based on SAT scores. This can save thousands.\n\n**Superscoring**\nMany colleges take your highest section scores across multiple test dates. Plan to take the SAT 2-3 times.\n\n**Be Realistic**\nImprovement is real, but going from 900 to 1500 takes significant time and effort. Plan accordingly and start early.`
  },
  {
    slug: "sat-study-schedule",
    title: "The Perfect 3-Month SAT Study Schedule",
    excerpt: "A week-by-week plan to maximize your SAT preparation in just 12 weeks.",
    date: "2026-01-28",
    readTime: "7 min read",
    content: `Three months is the sweet spot for SAT prep—enough time to improve without burning out.\n\n**Weeks 1-2: Diagnostic Phase**\nTake a full-length practice test. Identify your weakest areas and create a baseline score.\n\n**Weeks 3-6: Foundation Building**\nFocus on your weakest subject areas. Study 45-60 minutes daily. Review fundamental concepts.\n\n**Weeks 7-9: Practice and Review**\nTake a practice test every weekend. Review every mistake. Start timing yourself on individual sections.\n\n**Weeks 10-11: Full Simulations**\nTake 2 full-length tests under real conditions. Focus on time management and stamina.\n\n**Week 12: Light Review**\nReview your notes and error log. Don't cram. Get good sleep. Trust your preparation.\n\n**Daily Schedule Suggestion**\n- Monday/Wednesday: Math practice (45 min)\n- Tuesday/Thursday: Reading & Writing practice (45 min)\n- Friday: Mixed review and strategy (30 min)\n- Saturday: Full practice test (every other week)\n- Sunday: Rest`
  },
];

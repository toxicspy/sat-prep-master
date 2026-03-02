import Layout from "@/components/Layout";
import { GraduationCap, TrendingUp, DollarSign, Target, BookOpen, Award } from "lucide-react";

const scoreRanges = [
  { range: "1400–1600", label: "Excellent", desc: "Competitive for Ivy League and top-20 universities.", color: "text-success" },
  { range: "1200–1390", label: "Strong", desc: "Solid for most state universities and many private colleges.", color: "text-primary" },
  { range: "1000–1190", label: "Average", desc: "Meets requirements for many colleges; consider retaking.", color: "text-foreground" },
  { range: "Below 1000", label: "Below Average", desc: "Focus on targeted practice to improve fundamentals.", color: "text-destructive" },
];

const applicationTips = [
  { title: "Start Early", desc: "Begin SAT prep at least 3-4 months before your test date. Consistent daily practice beats cramming." },
  { title: "Take Practice Tests", desc: "Simulate real test conditions with full-length timed tests at least once a week." },
  { title: "Focus on Weaknesses", desc: "Use your topic breakdown to identify and drill your weakest areas first." },
  { title: "Build a Balanced Application", desc: "Strong SAT scores complement GPA, extracurriculars, and essays — not replace them." },
  { title: "Consider Test-Optional", desc: "Many colleges are now test-optional. Research each school's specific policy." },
  { title: "Register Early", desc: "SAT test dates fill up fast. Register at least 6 weeks in advance to get your preferred location." },
];

const scholarshipTips = [
  { title: "Merit-Based Scholarships", desc: "Many universities offer automatic merit scholarships for SAT scores above certain thresholds (e.g., 1400+)." },
  { title: "National Merit", desc: "PSAT/NMSQT scores determine National Merit Scholar eligibility, which can lead to full-ride scholarships." },
  { title: "External Scholarships", desc: "Apply to as many external scholarships as possible — search platforms like Fastweb and Scholarships.com." },
  { title: "FAFSA", desc: "Always complete the FAFSA regardless of income. Many schools use it to determine institutional aid." },
];

const CollegeInsights = () => (
  <Layout>
    <div className="container max-w-4xl py-12">
      <div className="text-center mb-12">
        <GraduationCap className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">College Insights</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Understanding SAT score ranges, application strategies, and scholarship preparation.
        </p>
      </div>

      {/* Score Ranges */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Target className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">SAT Score Ranges</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {scoreRanges.map((s) => (
            <div key={s.range} className="p-5 rounded-xl border bg-card">
              <div className={`text-lg font-bold ${s.color} mb-1`}>{s.range}</div>
              <div className="text-sm font-medium mb-1">{s.label}</div>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Application Tips */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Application Tips</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {applicationTips.map((tip) => (
            <div key={tip.title} className="p-5 rounded-xl border bg-card">
              <h3 className="font-semibold mb-1">{tip.title}</h3>
              <p className="text-sm text-muted-foreground">{tip.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Scholarship Prep */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <DollarSign className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Scholarship Preparation</h2>
        </div>
        <div className="space-y-4">
          {scholarshipTips.map((tip) => (
            <div key={tip.title} className="p-5 rounded-xl border bg-card">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground">{tip.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center p-8 rounded-xl border bg-card">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h3 className="text-lg font-semibold mb-2">Ready to Improve Your Score?</h3>
        <p className="text-sm text-muted-foreground mb-4">Practice with our adaptive tests and track your progress.</p>
        <a href="/sat-simulation" className="inline-flex items-center gap-2 px-6 py-2.5 hero-gradient text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity">
          Take Full SAT Simulation
        </a>
      </div>
    </div>
  </Layout>
);

export default CollegeInsights;

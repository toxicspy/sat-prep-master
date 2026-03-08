import Layout from "@/components/Layout";
import QuestionOfTheDay from "@/components/QuestionOfTheDay";
import SEOHead from "@/components/SEOHead";
import AdSlot from "@/components/AdSlot";
import { Link } from "react-router-dom";
import { BookOpen, Calculator, FileText, BarChart3, ArrowRight, Shuffle, Clock, Target } from "lucide-react";

const features = [
  { icon: Calculator, title: "SAT Math", desc: "50 original questions with difficulty filters and step-by-step explanations.", link: "/practice/math" },
  { icon: FileText, title: "Reading & Writing", desc: "20 passage-based questions to sharpen your comprehension skills.", link: "/practice/reading" },
  { icon: Shuffle, title: "Mock Test", desc: "Timed, randomized tests that simulate real SAT conditions.", link: "/mock-test" },
  { icon: BarChart3, title: "Dashboard", desc: "Track your scores, view topic breakdowns, and monitor progress.", link: "/dashboard" },
];

const Index = () => (
  <Layout>
    <SEOHead
      title="Coursingle — Free SAT Practice & Mock Tests | 70+ Questions"
      description="Free SAT exam simulation with timed mock tests, difficulty filters, topic breakdowns, and progress tracking. 70+ original SAT-style questions."
      canonical="/"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        name: "SAT Ace Pro",
        url: "https://satacepro.com",
        description: "Free SAT practice with timed mock tests, topic breakdowns, and progress tracking.",
        sameAs: [],
      }}
    />
    {/* Hero */}
    <section className="hero-gradient py-20 md:py-28">
      <div className="container text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-5 text-balance leading-tight">
          Ace Your SAT with Free Practice
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/85 max-w-2xl mx-auto mb-8 text-balance">
          70 original SAT-style questions with timed mock tests, difficulty filters, topic breakdowns, and progress tracking — all free.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/mock-test"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-background text-primary rounded-lg font-semibold hover:bg-background/90 transition-colors"
          >
            Start Mock Test <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/practice/math"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-primary-foreground/30 text-primary-foreground rounded-lg font-semibold hover:bg-primary-foreground/10 transition-colors"
          >
            Practice by Section
          </Link>
        </div>
      </div>
    </section>

    {/* Leaderboard Ad — top of page, desktop only */}
    <AdSlot format="leaderboard" className="my-4" />
    {/* Mobile banner ad */}
    <AdSlot format="banner" className="my-4" />

    {/* Features */}
    <section className="py-16 md:py-20">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Prepare</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <Link key={f.title} to={f.link} className="group p-6 rounded-xl border bg-card card-shadow hover:card-shadow-md transition-shadow">
              <f.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2 font-sans">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                Get started <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* In-article ad between sections */}
    <AdSlot format="in-article" className="my-6 container" />

    {/* Question of the Day + Stats */}
    <section className="py-16 bg-muted">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Question of the Day</h2>
            <QuestionOfTheDay />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6">Platform Highlights</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Target, n: "70+", l: "Practice Questions" },
                { icon: Clock, n: "35 min", l: "Timed Tests" },
                { icon: Shuffle, n: "Random", l: "Mock Tests" },
                { icon: BarChart3, n: "Topic", l: "Score Breakdown" },
              ].map((s) => (
                <div key={s.l} className="p-4 rounded-xl border bg-card card-shadow text-center">
                  <s.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-xl font-bold text-primary">{s.n}</div>
                  <div className="text-xs text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Rectangle ad before CTA */}
    <AdSlot format="rectangle" className="my-6" />

    {/* CTA */}
    <section className="py-16 md:py-20">
      <div className="container text-center">
        <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">Ready to Start Practicing?</h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          Jump into a timed mock test or practice by section. Track your improvement over time.
        </p>
        <Link
          to="/mock-test"
          className="inline-flex items-center gap-2 px-6 py-3 hero-gradient text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Begin Mock Test <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  </Layout>
);

export default Index;

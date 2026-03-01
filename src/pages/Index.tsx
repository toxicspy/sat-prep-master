import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { BookOpen, Calculator, FileText, BarChart3, ArrowRight } from "lucide-react";

const features = [
  { icon: Calculator, title: "SAT Math", desc: "50 original practice questions covering algebra, geometry, and data analysis.", link: "/practice/math" },
  { icon: FileText, title: "Reading & Writing", desc: "20 passage-based questions to sharpen your comprehension skills.", link: "/practice/reading" },
  { icon: BarChart3, title: "Score Tracking", desc: "Instant feedback and score calculation after each practice session.", link: "/dashboard" },
];

const Index = () => (
  <Layout>
    {/* Hero */}
    <section className="hero-gradient py-20 md:py-28">
      <div className="container text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-5 text-balance leading-tight">
          Ace Your SAT with Free Practice
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/85 max-w-2xl mx-auto mb-8 text-balance">
          70 original SAT-style questions with instant feedback and detailed explanations. Start practicing today — no sign-up required.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/practice/math"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-background text-primary rounded-lg font-semibold hover:bg-background/90 transition-colors"
          >
            Start Math Practice <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/practice/reading"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-primary-foreground/30 text-primary-foreground rounded-lg font-semibold hover:bg-primary-foreground/10 transition-colors"
          >
            Reading & Writing
          </Link>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="py-16 md:py-20">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Prepare</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <Link
              key={f.title}
              to={f.link}
              className="group p-6 rounded-xl border bg-card card-shadow hover:card-shadow-md transition-shadow"
            >
              <f.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2 font-sans">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                Practice now <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="py-16 bg-muted">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: "70+", l: "Practice Questions" },
            { n: "100%", l: "Free to Use" },
            { n: "SAT", l: "Aligned Format" },
            { n: "Instant", l: "Feedback" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{s.n}</div>
              <div className="text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 md:py-20">
      <div className="container text-center">
        <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">Ready to Start Practicing?</h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          Jump into our SAT practice questions and see where you stand. No account needed.
        </p>
        <Link
          to="/practice/math"
          className="inline-flex items-center gap-2 px-6 py-3 hero-gradient text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Begin Practice <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  </Layout>
);

export default Index;

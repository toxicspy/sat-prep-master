import Layout from "@/components/Layout";
import PerformanceChart from "@/components/PerformanceChart";
import { getStats, getTopicStats, getAttempts } from "@/lib/storage";
import { topicLabels, Topic } from "@/data/questions";
import { Link } from "react-router-dom";
import { Calculator, FileText, BarChart3, Target, TrendingUp, Award, Percent, Hash } from "lucide-react";

const Dashboard = () => {
  const { totalTests, avgScore, highestScore, accuracyRate, recentAttempts } = getStats();
  const topicStats = getTopicStats();

  const topicEntries = Object.entries(topicStats)
    .map(([t, s]) => ({ topic: t, label: topicLabels[t as Topic] || t, ...s }))
    .sort((a, b) => b.pct - a.pct);

  return (
    <Layout>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground mb-8">Track your progress and performance over time.</p>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Hash, label: "Tests Taken", value: String(totalTests), color: "text-primary" },
            { icon: TrendingUp, label: "Average Score", value: `${avgScore}%`, color: "text-primary" },
            { icon: Award, label: "Highest Score", value: `${highestScore}%`, color: "text-success" },
            { icon: Percent, label: "Accuracy Rate", value: `${accuracyRate}%`, color: "text-primary" },
          ].map((s) => (
            <div key={s.label} className="p-5 rounded-xl border bg-card card-shadow">
              <s.icon className={`w-8 h-8 ${s.color} mb-3`} />
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Performance Chart */}
        <div className="p-6 rounded-xl border bg-card card-shadow mb-10">
          <h2 className="text-lg font-semibold mb-4 font-sans">Performance Trend</h2>
          <PerformanceChart attempts={recentAttempts} />
        </div>

        {/* Topic Performance */}
        {topicEntries.length > 0 && (
          <div className="p-6 rounded-xl border bg-card card-shadow mb-10">
            <h2 className="text-lg font-semibold mb-4 font-sans">Topic Performance</h2>
            <div className="space-y-3">
              {topicEntries.map((e) => (
                <div key={e.topic}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">{e.label}</span>
                    <span className="text-muted-foreground">{e.correct}/{e.total} ({e.pct}%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${e.pct >= 70 ? "bg-success" : e.pct >= 50 ? "bg-primary" : "bg-destructive"}`}
                      style={{ width: `${e.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Attempts */}
        {recentAttempts.length > 0 && (
          <div className="p-6 rounded-xl border bg-card card-shadow mb-10">
            <h2 className="text-lg font-semibold mb-4 font-sans">Recent Attempts</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium text-muted-foreground">Date</th>
                    <th className="pb-2 font-medium text-muted-foreground">Section</th>
                    <th className="pb-2 font-medium text-muted-foreground">Score</th>
                    <th className="pb-2 font-medium text-muted-foreground">Difficulty</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAttempts.map((a) => (
                    <tr key={a.id} className="border-b last:border-0">
                      <td className="py-2">{new Date(a.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                      <td className="py-2">{a.section}</td>
                      <td className="py-2">
                        <span className={`font-medium ${a.percentage >= 70 ? "text-success" : a.percentage >= 50 ? "text-primary" : "text-destructive"}`}>
                          {a.percentage}%
                        </span>
                        <span className="text-muted-foreground ml-1">({a.correct}/{a.total})</span>
                      </td>
                      <td className="py-2 capitalize">{a.difficulty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Practice Links */}
        <h2 className="text-xl font-semibold mb-4">Practice Sections</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link to="/practice/math" className="p-6 rounded-xl border bg-card card-shadow hover:card-shadow-md transition-shadow">
            <Calculator className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-lg mb-1 font-sans">SAT Math</h3>
            <p className="text-sm text-muted-foreground">50 questions with difficulty filters and optional timer.</p>
          </Link>
          <Link to="/practice/reading" className="p-6 rounded-xl border bg-card card-shadow hover:card-shadow-md transition-shadow">
            <FileText className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-lg mb-1 font-sans">Reading & Writing</h3>
            <p className="text-sm text-muted-foreground">20 passage-based questions testing comprehension and analysis.</p>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

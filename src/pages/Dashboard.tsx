import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Calculator, FileText, BarChart3, Target } from "lucide-react";

const Dashboard = () => (
  <Layout>
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">Track your progress and continue practicing.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { icon: Calculator, label: "Math Questions", value: "50", color: "text-primary" },
          { icon: FileText, label: "Reading Questions", value: "20", color: "text-primary" },
          { icon: Target, label: "Total Questions", value: "70", color: "text-primary" },
          { icon: BarChart3, label: "Sections", value: "2", color: "text-primary" },
        ].map((s) => (
          <div key={s.label} className="p-5 rounded-xl border bg-card card-shadow">
            <s.icon className={`w-8 h-8 ${s.color} mb-3`} />
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">Practice Sections</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/practice/math" className="p-6 rounded-xl border bg-card card-shadow hover:card-shadow-md transition-shadow group">
          <Calculator className="w-8 h-8 text-primary mb-3" />
          <h3 className="font-semibold text-lg mb-1">SAT Math</h3>
          <p className="text-sm text-muted-foreground">50 questions covering algebra, geometry, and problem-solving.</p>
        </Link>
        <Link to="/practice/reading" className="p-6 rounded-xl border bg-card card-shadow hover:card-shadow-md transition-shadow group">
          <FileText className="w-8 h-8 text-primary mb-3" />
          <h3 className="font-semibold text-lg mb-1">Reading & Writing</h3>
          <p className="text-sm text-muted-foreground">20 passage-based questions testing comprehension and analysis.</p>
        </Link>
      </div>
    </div>
  </Layout>
);

export default Dashboard;

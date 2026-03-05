/**
 * Improvement Zone — Smart Mistake Review & Practice page.
 * Shows all tracked mistakes with filtering, analytics, and retake mode.
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import {
  getMistakes,
  getActiveMistakes,
  getMistakeAnalytics,
  removeMistake,
  clearAllMistakes,
  MistakeRecord,
} from "@/lib/mistakes";
import { Difficulty, Topic } from "@/data/questions";
import {
  AlertTriangle,
  Trash2,
  Play,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Target,
  TrendingUp,
  Clock,
  Brain,
  Shield,
  Zap,
  Filter,
  Award,
} from "lucide-react";

const ImprovementZone = () => {
  const navigate = useNavigate();
  const [mistakes, setMistakes] = useState(() => getMistakes());
  const [filterTopic, setFilterTopic] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showDeleteId, setShowDeleteId] = useState<number | null>(null);

  const analytics = useMemo(() => getMistakeAnalytics(), [mistakes]);

  // Unique topics and difficulties for filters
  const topics = useMemo(() => [...new Set(mistakes.map((m) => m.topic))], [mistakes]);
  const difficulties: Difficulty[] = ["easy", "medium", "hard"];

  // Filtered mistakes
  const filtered = useMemo(() => {
    let result = mistakes;
    if (filterTopic !== "all") result = result.filter((m) => m.topic === filterTopic);
    if (filterDifficulty !== "all") result = result.filter((m) => m.difficulty === filterDifficulty);
    if (filterDate !== "all") {
      const now = new Date();
      const cutoff = new Date();
      if (filterDate === "week") cutoff.setDate(now.getDate() - 7);
      else if (filterDate === "month") cutoff.setMonth(now.getMonth() - 1);
      result = result.filter((m) => new Date(m.date_attempted) >= cutoff);
    }
    return result;
  }, [mistakes, filterTopic, filterDifficulty, filterDate]);

  const activeMistakes = filtered.filter((m) => !m.is_cleared);
  const clearedMistakes = filtered.filter((m) => m.is_cleared);

  const handleRemove = (id: number) => {
    removeMistake(id);
    setMistakes(getMistakes());
    setShowDeleteId(null);
  };

  const handleClearAll = () => {
    clearAllMistakes();
    setMistakes([]);
    setShowClearModal(false);
  };

  const handlePracticeMistakes = () => {
    const active = getActiveMistakes();
    if (active.length === 0) return;
    const ids = active.map((m) => m.question_id);
    const encoded = encodeURIComponent(JSON.stringify(ids));
    navigate(`/practice/retake?ids=${encoded}&from=improvement`);
  };

  return (
    <Layout>
      <SEOHead
        title="Improvement Zone — Mistake Review | SAT Ace Pro"
        description="Review and practice your SAT mistakes. Track improvement and master weak areas."
        canonical="/improvement-zone"
      />
      <div className="container max-w-4xl py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Improvement Zone</h1>
            <p className="text-muted-foreground text-sm">Track, review, and conquer your mistakes</p>
          </div>
          <div className="flex items-center gap-2">
            {analytics.activeMistakes > 0 && (
              <button
                onClick={handlePracticeMistakes}
                className="inline-flex items-center gap-2 px-4 py-2 hero-gradient text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
              >
                <Play className="w-4 h-4" /> Practice Mistakes ({analytics.activeMistakes})
              </button>
            )}
            {mistakes.length > 0 && (
              <button
                onClick={() => setShowClearModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-destructive/30 text-destructive rounded-lg text-sm font-medium hover:bg-destructive/5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            )}
          </div>
        </div>

        {/* ── Analytics Cards ───────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="p-4 rounded-xl border bg-card card-shadow">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-destructive" />
              <span className="text-xs font-medium text-muted-foreground">Active Mistakes</span>
            </div>
            <p className="text-2xl font-bold">{analytics.activeMistakes}</p>
          </div>
          <div className="p-4 rounded-xl border bg-card card-shadow">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-success" />
              <span className="text-xs font-medium text-muted-foreground">Cleared</span>
            </div>
            <p className="text-2xl font-bold text-success">{analytics.clearedMistakes}</p>
          </div>
          <div className="p-4 rounded-xl border bg-card card-shadow">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Improvement</span>
            </div>
            <p className="text-2xl font-bold text-primary">{analytics.improvementRate}%</p>
          </div>
          <div className="p-4 rounded-xl border bg-card card-shadow">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Avg Time</span>
            </div>
            <p className="text-2xl font-bold">{analytics.avgTimeOnMistakes}s</p>
          </div>
        </div>

        {/* ── Careless Warning ──────────────────────────── */}
        {analytics.guessWarning && (
          <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 mb-6 flex items-start gap-3">
            <Zap className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-destructive">Possible Guessing Detected</p>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.carelessCount} questions were answered incorrectly in under 5 seconds.
                Slow down and read each question carefully before answering.
              </p>
            </div>
          </div>
        )}

        {/* ── Weak Topic Insight ────────────────────────── */}
        {analytics.weakestTopic && (
          <div className="p-4 rounded-xl border bg-accent/30 mb-6 flex items-start gap-3">
            <Brain className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Focus Area: <span className="text-primary capitalize">{analytics.weakestTopic.replace("-", " ")}</span></p>
              <p className="text-xs text-muted-foreground mt-1">
                This is your most common mistake topic with {analytics.topicCounts[analytics.weakestTopic]} errors. Consider extra practice in this area.
              </p>
            </div>
          </div>
        )}

        {/* ── Filters ───────────────────────────────────── */}
        {mistakes.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
              className="px-3 py-1.5 text-sm border rounded-lg bg-card"
            >
              <option value="all">All Topics</option>
              {topics.map((t) => (
                <option key={t} value={t}>{t.replace("-", " ")}</option>
              ))}
            </select>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-3 py-1.5 text-sm border rounded-lg bg-card"
            >
              <option value="all">All Difficulties</option>
              {difficulties.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-3 py-1.5 text-sm border rounded-lg bg-card"
            >
              <option value="all">All Time</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
            </select>
          </div>
        )}

        {/* ── Mistake List ──────────────────────────────── */}
        {mistakes.length === 0 ? (
          <div className="text-center py-16">
            <Shield className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2 font-sans">No Mistakes Yet</h2>
            <p className="text-muted-foreground text-sm mb-6">Complete a practice test to start tracking your mistakes.</p>
            <button
              onClick={() => navigate("/mock-test")}
              className="inline-flex items-center gap-2 px-6 py-2.5 hero-gradient text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
            >
              <Play className="w-4 h-4" /> Take a Mock Test
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No mistakes match current filters.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Active mistakes */}
            {activeMistakes.map((m) => (
              <MistakeCard
                key={m.question_id}
                mistake={m}
                expanded={expandedId === m.question_id}
                onToggle={() => setExpandedId(expandedId === m.question_id ? null : m.question_id)}
                onRemove={() => setShowDeleteId(m.question_id)}
              />
            ))}

            {/* Cleared section */}
            {clearedMistakes.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold text-success mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Cleared Mistakes ({clearedMistakes.length})
                </h2>
                {clearedMistakes.map((m) => (
                  <MistakeCard
                    key={m.question_id}
                    mistake={m}
                    expanded={expandedId === m.question_id}
                    onToggle={() => setExpandedId(expandedId === m.question_id ? null : m.question_id)}
                    onRemove={() => setShowDeleteId(m.question_id)}
                    cleared
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Clear All Confirmation Modal ────────────── */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm" onClick={() => setShowClearModal(false)}>
          <div className="bg-card border rounded-xl p-6 max-w-sm mx-4 card-shadow-lg" onClick={(e) => e.stopPropagation()}>
            <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-3" />
            <h3 className="text-lg font-bold text-center mb-2 font-sans">Clear All Mistakes?</h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              This will permanently remove all {mistakes.length} tracked mistakes. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowClearModal(false)} className="flex-1 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                Cancel
              </button>
              <button onClick={handleClearAll} className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Single Delete Confirmation Modal ────────── */}
      {showDeleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm" onClick={() => setShowDeleteId(null)}>
          <div className="bg-card border rounded-xl p-6 max-w-sm mx-4 card-shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-center mb-2 font-sans">Remove This Question?</h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              This will remove the question from your mistake tracker.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteId(null)} className="flex-1 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                Cancel
              </button>
              <button onClick={() => handleRemove(showDeleteId)} className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

// ─── Mistake Card Component ───────────────────────────────

interface MistakeCardProps {
  mistake: MistakeRecord;
  expanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  cleared?: boolean;
}

const MistakeCard = ({ mistake, expanded, onToggle, onRemove, cleared }: MistakeCardProps) => {
  const isCareless = mistake.time_spent > 0 && mistake.time_spent < 5;

  return (
    <div className={`rounded-xl border transition-all ${cleared ? "bg-success/5 border-success/20 opacity-75" : "bg-card card-shadow"}`}>
      <button onClick={onToggle} className="w-full flex items-start gap-3 px-4 py-3 text-left">
        <div className="shrink-0 mt-0.5">
          {cleared ? (
            <CheckCircle2 className="w-5 h-5 text-success" />
          ) : (
            <XCircle className="w-5 h-5 text-destructive" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground line-clamp-2">{mistake.question_text}</p>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-muted text-muted-foreground capitalize">
              {mistake.topic.replace("-", " ")}
            </span>
            <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full capitalize ${
              mistake.difficulty === "hard" ? "bg-destructive/10 text-destructive" :
              mistake.difficulty === "medium" ? "bg-primary/10 text-primary" :
              "bg-success/10 text-success"
            }`}>
              {mistake.difficulty}
            </span>
            {isCareless && (
              <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-destructive/10 text-destructive">
                ⚡ Possible Guess
              </span>
            )}
            {!cleared && mistake.correct_streak > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-success/10 text-success">
                ✓ {mistake.correct_streak}/3 correct
              </span>
            )}
            {cleared && (
              <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-success/10 text-success">
                🏆 Mastered
              </span>
            )}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200 mt-1 ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t animate-fade-in">
          {mistake.passage && (
            <div className="mt-3 p-3 bg-muted rounded-lg border">
              <p className="text-xs leading-relaxed text-foreground">{mistake.passage}</p>
            </div>
          )}
          <div className="mt-3 space-y-2">
            {mistake.options.map((opt, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-lg border text-sm ${
                  i === mistake.correct_answer ? "border-success bg-success/10 text-success font-medium" :
                  i === mistake.selected_answer ? "border-destructive bg-destructive/10 text-destructive" :
                  "border-border opacity-50"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                  {i === mistake.correct_answer && <CheckCircle2 className="w-3.5 h-3.5 ml-auto" />}
                  {i === mistake.selected_answer && i !== mistake.correct_answer && <XCircle className="w-3.5 h-3.5 ml-auto" />}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 rounded-lg bg-accent border border-primary/20">
            <p className="text-xs font-medium text-accent-foreground mb-1">Explanation</p>
            <p className="text-xs text-muted-foreground">{mistake.explanation}</p>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span>⏱ {mistake.time_spent}s</span>
              <span>{new Date(mistake.date_attempted).toLocaleDateString()}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="inline-flex items-center gap-1 text-xs text-destructive hover:underline"
            >
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImprovementZone;

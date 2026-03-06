import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { studyNotes, searchNotes, StudyNote } from "@/data/notes";
import { BookOpen, Search, ChevronDown, ChevronUp, FlaskConical, PenLine, BookText, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

const subjectIcons: Record<string, React.ReactNode> = {
  Math: <FlaskConical className="w-5 h-5" />,
  Reading: <BookText className="w-5 h-5" />,
  Writing: <PenLine className="w-5 h-5" />,
};

const subjectLinks: Record<string, string> = {
  Math: "/practice/math",
  Reading: "/practice/reading",
  Writing: "/practice/reading",
};

/** Single expandable note card */
const NoteCard = ({ note }: { note: StudyNote }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-lg bg-card card-shadow overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <div>
          <span className="text-xs font-medium text-primary uppercase tracking-wide">{note.topic}</span>
          <h3 className="text-base font-semibold text-foreground font-sans mt-0.5">{note.title}</h3>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 animate-fade-in border-t">
          {/* Content */}
          <p className="text-sm text-muted-foreground leading-relaxed mt-3">{note.content}</p>

          {/* Formulas */}
          {note.formulas && note.formulas.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Key Formulas</h4>
              <div className="space-y-1.5">
                {note.formulas.map((f, i) => (
                  <div key={i} className="px-3 py-2 rounded-md bg-accent/50 border border-primary/10 text-sm font-mono text-accent-foreground">{f}</div>
                ))}
              </div>
            </div>
          )}

          {/* Examples */}
          {note.examples && note.examples.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Examples</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {note.examples.map((e, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Points */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Key Points</h4>
            <ul className="space-y-1.5">
              {note.keyPoints.map((kp, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-primary shrink-0 mt-0.5">•</span>
                  <span>{kp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Related Practice Link */}
          {note.relatedQuestionIds.length > 0 && (
            <Link
              to={subjectLinks[note.subject]}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Practice {note.relatedQuestionIds.length} related question{note.relatedQuestionIds.length > 1 ? "s" : ""}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

const Notes = () => {
  const [query, setQuery] = useState("");
  const [activeSubject, setActiveSubject] = useState<string>("All");

  const subjects = ["All", "Math", "Reading", "Writing"];

  const filtered = useMemo(() => {
    let results = query ? searchNotes(query) : studyNotes;
    if (activeSubject !== "All") {
      results = results.filter((n) => n.subject === activeSubject);
    }
    return results;
  }, [query, activeSubject]);

  /** Group notes by subject for display */
  const grouped = useMemo(() => {
    const map: Record<string, StudyNote[]> = {};
    filtered.forEach((n) => {
      if (!map[n.subject]) map[n.subject] = [];
      map[n.subject].push(n);
    });
    return map;
  }, [filtered]);

  return (
    <Layout>
      <SEOHead
        title="SAT Study Notes | SAT Ace Pro"
        description="Free SAT study notes organized by subject and topic. Clear explanations, formulas, examples, and links to practice questions."
      />

      <div className="container max-w-4xl py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Study Notes</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Clear explanations, formulas, and examples organized by subject. Use these notes alongside practice questions to strengthen weak areas.
        </p>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search notes by topic, formula, or keyword…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Subject Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSubject(s)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSubject === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              {s !== "All" && subjectIcons[s]}
              {s}
            </button>
          ))}
        </div>

        {/* Notes */}
        {Object.keys(grouped).length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No notes found. Try a different search term.</p>
          </div>
        )}

        {Object.entries(grouped).map(([subject, notes]) => (
          <div key={subject} className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-primary">{subjectIcons[subject]}</span>
              <h2 className="text-xl font-bold">{subject}</h2>
              <span className="text-xs text-muted-foreground ml-1">({notes.length} topic{notes.length > 1 ? "s" : ""})</span>
            </div>
            <div className="space-y-3">
              {notes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Notes;

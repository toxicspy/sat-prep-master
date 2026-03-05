import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, BookOpen, Bookmark } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/practice/math", label: "Math" },
  { to: "/practice/reading", label: "Reading" },
  { to: "/mock-test", label: "Mock Test" },
  { to: "/sat-simulation", label: "Full SAT" },
  { to: "/improvement-zone", label: "Improvement" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/college-insights", label: "College Insights" },
  { to: "/blog", label: "Blog" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-serif text-xl font-bold text-primary">
          <BookOpen className="w-6 h-6" />
          SAT Ace Pro
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link to="/saved" className="p-2 rounded-md hover:bg-muted transition-colors" aria-label="Saved Questions">
            <Bookmark className="w-4 h-4" />
          </Link>
          <ThemeToggle />
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t bg-background p-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/saved"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            Saved Questions
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;

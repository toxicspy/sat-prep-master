import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const Footer = () => (
  <footer className="border-t bg-card mt-auto">
    <div className="container py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="flex items-center gap-2 font-serif text-lg font-bold text-primary mb-3">
            <BookOpen className="w-5 h-5" />
            Coursingle
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Free SAT practice with timed mock tests, topic breakdowns, and progress tracking.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Practice</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/practice/math" className="hover:text-foreground transition-colors">SAT Math</Link></li>
            <li><Link to="/practice/reading" className="hover:text-foreground transition-colors">Reading & Writing</Link></li>
            <li><Link to="/mock-test" className="hover:text-foreground transition-colors">Mock Test</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Resources</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
            <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
            <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms & Conditions</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SAT Ace Pro. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;

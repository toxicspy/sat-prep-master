import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MathPractice from "./pages/MathPractice";
import ReadingPractice from "./pages/ReadingPractice";
import MockTest from "./pages/MockTest";
import Score from "./pages/Score";
import Dashboard from "./pages/Dashboard";
import ReviewTest from "./pages/ReviewTest";
import SavedQuestions from "./pages/SavedQuestions";
import RetakeWrong from "./pages/RetakeWrong";
import { BlogList, BlogPost } from "./pages/Blog";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import FullSATSimulation from "./pages/FullSATSimulation";
import CollegeInsights from "./pages/CollegeInsights";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/practice/math" element={<MathPractice />} />
          <Route path="/practice/reading" element={<ReadingPractice />} />
          <Route path="/practice/retake" element={<RetakeWrong />} />
          <Route path="/mock-test" element={<MockTest />} />
          <Route path="/score" element={<Score />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/review" element={<ReviewTest />} />
          <Route path="/saved" element={<SavedQuestions />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/sat-simulation" element={<FullSATSimulation />} />
          <Route path="/college-insights" element={<CollegeInsights />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

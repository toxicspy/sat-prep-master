import Layout from "@/components/Layout";

const Terms = () => (
  <Layout>
    <div className="container max-w-3xl py-10">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
      <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
        <p><strong className="text-foreground">Last updated:</strong> March 1, 2026</p>
        <p>By accessing and using Coursingle, you agree to be bound by these Terms and Conditions.</p>
        
        <h2 className="text-lg font-semibold text-foreground pt-2">Use of Service</h2>
        <p>Coursingle provides free SAT practice questions and educational content. You may use our platform for personal, non-commercial educational purposes only.</p>
        
        <h2 className="text-lg font-semibold text-foreground pt-2">Intellectual Property</h2>
        <p>All content on this website, including questions, explanations, and articles, is the intellectual property of Coursingle. You may not reproduce, distribute, or modify our content without written permission.</p>
        
        <h2 className="text-lg font-semibold text-foreground pt-2">Disclaimer</h2>
        <p>Coursingle is not affiliated with, endorsed by, or associated with the College Board or the official SAT exam. "SAT" is a registered trademark of the College Board. Our practice questions are original and designed to be similar in style and difficulty to the SAT.</p>
        
        <h2 className="text-lg font-semibold text-foreground pt-2">Accuracy</h2>
        <p>While we strive for accuracy in all our content, we make no guarantees about the accuracy or completeness of the information provided. Use our materials as a supplement to your overall study plan.</p>
        
        <h2 className="text-lg font-semibold text-foreground pt-2">Limitation of Liability</h2>
        <p>SAT Ace Prep shall not be liable for any damages arising from the use of our website or reliance on our content.</p>
        
        <h2 className="text-lg font-semibold text-foreground pt-2">Changes</h2>
        <p>We reserve the right to modify these Terms at any time. Continued use of the website constitutes acceptance of updated Terms.</p>
        
        <h2 className="text-lg font-semibold text-foreground pt-2">Contact</h2>
        <p>For questions about these Terms, contact us at legal@sataceprep.com.</p>
      </div>
    </div>
  </Layout>
);

export default Terms;

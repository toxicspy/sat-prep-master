import Layout from "@/components/Layout";

const Privacy = () => (
  <Layout>
    <div className="container max-w-3xl py-10">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
        <p><strong className="text-foreground">Last updated:</strong> March 1, 2026</p>
        <p>Coursingle ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.</p>
        
        <h2 className="text-lg font-semibold text-foreground pt-2">Information We Collect</h2>
        <p>We do not require account creation or personal information to use our practice tools. We may collect anonymous usage data such as page views, time spent on pages, and browser type through standard analytics tools.</p>
        
        <h2 className="text-lg font-semibold text-foreground pt-2">How We Use Information</h2>
        <p>Any information we collect is used solely to improve the user experience, fix bugs, and understand how our content is used. We do not sell, rent, or share personal information with third parties.</p>
        
        <h2 className="text-lg font-semibold text-foreground pt-2">Cookies</h2>
        <p>Our website may use cookies to enhance your experience. You can control cookie preferences through your browser settings.</p>
        
        <h2 className="text-lg font-semibold text-foreground pt-2">Third-Party Services</h2>
        <p>We may use third-party services for analytics. These services have their own privacy policies, and we encourage you to review them.</p>
        
        <h2 className="text-lg font-semibold text-foreground pt-2">Children's Privacy</h2>
        <p>Our platform is designed for high school students. We do not knowingly collect personal information from children under 13.</p>
        
        <h2 className="text-lg font-semibold text-foreground pt-2">Contact</h2>
        <p>If you have questions about this Privacy Policy, please contact us at privacy@coursingle.com.</p>
      </div>
    </div>
  </Layout>
);

export default Privacy;

import Layout from "@/components/Layout";

const About = () => (
  <Layout>
    <div className="container max-w-3xl py-10">
      <h1 className="text-3xl font-bold mb-6">About SAT Ace Pro</h1>
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        <p>
          SAT Ace Pro is a free, student-focused exam simulation platform designed to help high school students prepare for the SAT with confidence. We provide original, SAT-aligned practice questions with timed mock tests, difficulty filters, topic-based score breakdowns, and progress tracking.
        </p>
        <p>
          Our mission is to make high-quality SAT preparation accessible to every student, regardless of their financial situation. We believe that standardized test preparation shouldn't be a privilege.
        </p>
        <p>
          Every question on our platform is original and written to match the difficulty and style of the Digital SAT. We focus on the two core sections—Math and Reading & Writing—providing the practice you need to achieve your best score.
        </p>
        <h2 className="text-xl font-semibold text-foreground pt-4">Our Approach</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Original, SAT-aligned questions written by experienced educators</li>
          <li>Instant feedback with clear, detailed explanations</li>
          <li>No sign-up required — start practicing immediately</li>
          <li>Mobile-friendly design for studying anywhere</li>
          <li>Completely free — no hidden fees or premium tiers</li>
        </ul>
      </div>
    </div>
  </Layout>
);

export default About;

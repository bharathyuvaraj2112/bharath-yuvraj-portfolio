import { Navbar } from "@/components/navbar/Navbar";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { Skills } from "@/components/skills/Skills";
import { Education } from "@/components/education/Education";
import { Projects } from "@/components/projects/Projects";
import { Certifications } from "@/components/certifications/Certifications";
import { Achievements } from "@/components/achievements/Achievements";
import { ResumeCTA } from "@/components/resume/ResumeCTA";
import { Contact } from "@/components/contact/Contact";
import { Footer } from "@/components/footer/Footer";
import { AIChatWidget } from "@/components/ai/AIChatWidget";

export default function Home() {
  return (
    <div className="relative min-h-screen selection:bg-white selection:text-black">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Education />
        <Projects />
        <Certifications />
        <Achievements />
        <ResumeCTA />
        <Contact />
      </main>
      <Footer />
      <AIChatWidget />
    </div>
  );
}

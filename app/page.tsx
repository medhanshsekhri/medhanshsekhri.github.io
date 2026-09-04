import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import TechMarquee from "@/components/TechMarquee";
import Projects from "@/components/Projects";
import Hackathons from "@/components/Hackathons";
import WhyMe from "@/components/WhyMe";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

// Full-bleed dashed hairline between sections: spatial separation with no
// visual weight, in place of solid bars or background shifts.
function Rule() {
  return <div aria-hidden className="border-t border-dashed border-border" />;
}

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <Hero />
        <TechMarquee />
        <Rule />
        <Projects />
        <Rule />
        <Hackathons />
        <Rule />
        <WhyMe />
        <Rule />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

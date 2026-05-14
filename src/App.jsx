import Background from "./components/Background.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import SectionDivider from "./components/SectionDivider.jsx";
import About from "./components/About.jsx";
import Experience from "./components/Experience.jsx";
import Projects from "./components/Projects.jsx";
import TechStack from "./components/TechStack.jsx";
import Footer from "./components/Footer.jsx";
import { usePortfolioAnimations } from "./lib/usePortfolioAnimations.js";

export default function App() {
  usePortfolioAnimations();

  return (
    <>
      <Background />
      <Header />
      <main className="page-shell">
        <Hero />
        <SectionDivider />
        <About />
        <SectionDivider />
        <Experience />
        <SectionDivider />
        <Projects />
        <SectionDivider />
        <TechStack />
        <Footer />
      </main>
    </>
  );
}

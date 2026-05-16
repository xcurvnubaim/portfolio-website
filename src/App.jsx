import Background from "./components/Background.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Experience from "./components/Experience.jsx";
import Organization from "./components/Organization.jsx";
import Projects from "./components/Projects.jsx";
import ProjectDetailPage from "./components/ProjectDetailPage.jsx";
import TechStack from "./components/TechStack.jsx";
import Footer from "./components/Footer.jsx";
import { usePortfolioAnimations } from "./lib/usePortfolioAnimations.js";

export default function App() {
  usePortfolioAnimations();
  const projectMatch = window.location.pathname.match(/^\/projects\/([^/]+)\/?$/);

  return (
    <>
      <Background />
      <Header />
      {projectMatch ? (
        <ProjectDetailPage slug={projectMatch[1]} />
      ) : (
        <>
          <main className="page-shell">
            <Hero />
            <About />
            <Experience />
            <Organization />
            <Projects />
            <TechStack />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}

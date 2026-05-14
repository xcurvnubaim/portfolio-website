import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function scrambleText(element, text, duration = 1500) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  const totalFrames = duration / 30;
  let frame = 0;

  const interval = window.setInterval(() => {
    element.textContent = text
      .split("")
      .map((char, index) => {
        if (char === " ") {
          return " ";
        }

        if (index < (frame / totalFrames) * text.length) {
          return text[index];
        }

        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join("");

    frame += 1;
    if (frame >= totalFrames) {
      element.textContent = text;
      window.clearInterval(interval);
    }
  }, 30);

  return () => window.clearInterval(interval);
}

function initCustomCursor(cleanups) {
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (!dot || !ring || !hasFinePointer) {
    return;
  }

  const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3" });
  const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3" });
  const ringX = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3" });
  const ringY = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3" });
  const trackCursor = (event) => {
    dotX(event.clientX);
    dotY(event.clientY);
    ringX(event.clientX);
    ringY(event.clientY);
  };

  window.addEventListener("mousemove", trackCursor);
  cleanups.push(() => window.removeEventListener("mousemove", trackCursor));
}

function initMagneticLinks(cleanups) {
  document.querySelectorAll("[data-magnetic]").forEach((icon) => {
    const moveIcon = (event) => {
      const rect = icon.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(event.clientX - centerX, 2) + Math.pow(event.clientY - centerY, 2)
      );

      if (distance < 100) {
        gsap.to(icon, {
          x: (event.clientX - centerX) * 0.4,
          y: (event.clientY - centerY) * 0.4,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };

    const resetIcon = () => {
      gsap.to(icon, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.3)"
      });
    };

    icon.addEventListener("mousemove", moveIcon);
    icon.addEventListener("mouseleave", resetIcon);
    cleanups.push(() => {
      icon.removeEventListener("mousemove", moveIcon);
      icon.removeEventListener("mouseleave", resetIcon);
    });
  });
}

function initHeroText(cleanups) {
  const heroName = document.querySelector("[data-scramble-text]");
  const roleItems = Array.from(document.querySelectorAll(".hero-role-item"));
  let activeRole = 0;

  if (heroName) {
    const timer = window.setTimeout(() => {
      cleanups.push(scrambleText(heroName, heroName.dataset.scrambleText));
    }, 200);
    cleanups.push(() => window.clearTimeout(timer));
  }

  if (roleItems.length > 1) {
    const interval = window.setInterval(() => {
      roleItems[activeRole].classList.remove("is-active");
      activeRole = (activeRole + 1) % roleItems.length;
      roleItems[activeRole].classList.add("is-active");
    }, 2800);
    cleanups.push(() => window.clearInterval(interval));
  }
}

function animateCollection(selector, fromVars, toVars) {
  document.querySelectorAll(selector).forEach((element, index) => {
    gsap.fromTo(element, fromVars, {
      ...toVars,
      delay: index * 0.1,
      scrollTrigger: {
        trigger: element,
        start: "top 90%"
      }
    });
  });
}

function initScrollAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll(".fade-in-section").forEach((section) => {
    gsap.fromTo(
      section,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%"
        }
      }
    );
  });

  document.querySelectorAll(".divider-fill").forEach((divider) => {
    gsap.fromTo(
      divider,
      { width: "0%" },
      {
        width: "100%",
        duration: 1.5,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: divider.parentElement,
          start: "top 85%"
        }
      }
    );
  });

  animateCollection(".experience-item", { y: 20, opacity: 0 }, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power3.out"
  });

  animateCollection(".project-card", { y: 30, opacity: 0 }, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power3.out"
  });
}

export function usePortfolioAnimations() {
  useEffect(() => {
    const cleanups = [];
    const ctx = gsap.context(() => {
      initCustomCursor(cleanups);
      initMagneticLinks(cleanups);
      initHeroText(cleanups);
      initScrollAnimations();
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);
}

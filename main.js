import './style.css';
import './chatbot.js'; // AI Chatbot powered by Gemini
import { tsParticles } from "@tsparticles/engine";
import { loadBasic } from "@tsparticles/basic";

// Set active navigation item based on current URL
function setActiveNav() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (currentPath.endsWith(linkPath) || (currentPath.endsWith('/') && linkPath === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Initialize particles for the Antigravity effect
async function initParticles() {
  await loadBasic(tsParticles);
  
  await tsParticles.load({
    id: "tsparticles",
    options: {
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          repulse: {
            distance: 100,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: ["#1B838C", "#0E294B", "#38bdf8", "#2abac4"], // Resin colors matching logo
        },
        links: {
          enable: false, // No links, just floating beads
        },
        move: {
          direction: "top", // Floating upwards
          enable: true,
          outModes: {
            default: "out",
          },
          random: true,
          speed: 1.5,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 80,
        },
        opacity: {
          value: { min: 0.3, max: 0.8 },
        },
        shape: {
          type: "circle", // Resins are circular/spherical
        },
        size: {
          value: { min: 3, max: 8 },
        },
      },
      detectRetina: true,
    },
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initParticles();
});

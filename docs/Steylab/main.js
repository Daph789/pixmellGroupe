document.documentElement.classList.add("js-enabled");

const hasLenis = typeof window.Lenis === "function";
if (hasLenis) {
  const lenis = new window.Lenis({
    duration: 1.2,
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

const hasGsap = typeof window.gsap !== "undefined";
if (hasGsap && window.ScrollTrigger) {
  window.gsap.registerPlugin(window.ScrollTrigger);

  window.gsap.from(".hero-copy", {
    opacity: 0,
    y: 40,
    duration: 1,
    ease: "power3.out",
  });

  window.gsap.from(".media-frame", {
    opacity: 0,
    y: 40,
    duration: 1.1,
    ease: "power3.out",
    delay: 0.2,
  });

  window.gsap.utils.toArray(".section").forEach((section) => {
    window.gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
      },
      opacity: 0,
      y: 30,
      duration: 0.9,
      ease: "power2.out",
    });
  });

  window.gsap.utils.toArray(".reveal-text").forEach((el) => {
    window.gsap.fromTo(
      el,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          end: "bottom 60%",
          toggleActions: "play reverse play reverse",
        },
      }
    );

    window.gsap.to(el, {
      "--reveal-x": "120%",
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        end: "bottom 60%",
        toggleActions: "play reverse play reverse",
      },
    });
  });

  window.gsap.to(".progress-bar", {
    width: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: "#progression",
      start: "top 80%",
      end: "bottom 40%",
      scrub: true,
    },
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      } else {
        entry.target.classList.remove("is-visible");
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".reveal-text").forEach((el) => observer.observe(el));
document.querySelectorAll(".reveal-media").forEach((el) => observer.observe(el));
const progressTrack = document.querySelector(".progress-track");
if (progressTrack) observer.observe(progressTrack);

const translations = {
  fr: {
    "nav.concept": "Concept",
    "nav.progress": "Progression",
    "nav.nutrition": "Nutrition",
    "nav.bonus": "Bonus",
    "header.cta": "Rejoindre la beta",
    "hero.eyebrow": "Application sportive pour femmes & hommes",
    "hero.titleLine1": "Atteins ton objectif",
    "hero.titleLine2": "muscu + nutrition",
    "hero.titleLine3": "en un seul plan.",
    "hero.lead":
      "Choisis tes zones de travail (pecs, dos, bras…), renseigne ta taille et ton poids, et SteyLab te propose chaque jour une séance + une nutrition 100% adaptée à ton objectif.",
    "hero.primaryCta": "Démarrer maintenant",
    "hero.secondaryCta": "Voir le concept",
    "hero.badge1": "+500 exos guidés",
    "hero.badge2": "Nutrition quotidienne",
    "hero.badge3": "IA d'assistance",
    "hero.mediaFocus": "Focus dos + épaules",
    "hero.mediaLevel": "Niveau 1 • Jour 1",
    "hero.statLabel": "Progression par niveaux",
    "hero.statValue": "30 jours = photo comparatif",
    "concept.title": "Tout comprendre en 30 secondes",
    "concept.lead":
      "SteyLab est le site officiel de l'app. Ici, tu vois tout de suite comment ça marche : un objectif clair, des séances ciblées, et une nutrition qui suit tes progrès.",
    "concept.card1Title": "Choisis ton objectif",
    "concept.card1Text":
      "Prise de masse, sèche, force, ou remise en forme : l'app construit un plan complet autour de ton but.",
    "concept.card2Title": "Séances par zones",
    "concept.card2Text":
      "Pecs, dos, bras, jambes… tu sélectionnes ce que tu veux travailler et l'app ajuste les exercices.",
    "concept.card3Title": "Nutrition au jour le jour",
    "concept.card3Text":
      "Tes données (taille, poids, objectif) servent à créer une nutrition adaptée chaque jour.",
    "visual.tag": "Sélection visuelle des muscles",
    "visual.title": "Un plan visuel et ultra clair",
    "visual.lead":
      "Chaque séance est une liste d'exercices guidés. Tu coches chaque série terminée pour passer au niveau suivant. Le niveau 1 = jour 1, avec sa séance + son alimentation.",
    "visual.bullet1": "Système de progression par niveaux",
    "visual.bullet2": "Cases à cocher pour chaque série",
    "visual.bullet3": "Objectif visible en un coup d'œil",
    "progress.title": "Progression & photos privées",
    "progress.lead":
      "Tu prends une photo de toi directement dans l'app. Elle reste en local, jamais dans le cloud, pour éviter toute fuite de données.",
    "progress.level30": "Niveau 30",
    "progress.level30Text": "Photo comparatif + différence visible",
    "progress.level60": "Niveau 60",
    "progress.level60Text": "Récompense boutique (ensemble sport ou créatine)",
    "progress.day1": "Jour 1",
    "progress.day1Text": "Photo de départ + première séance.",
    "progress.day30": "Jour 30",
    "progress.day30Text": "Nouvelle photo pour voir la transformation.",
    "progress.day60": "Jour 60",
    "progress.day60Text": "Si zéro jour sauté, cadeau offert depuis notre boutique.",
    "nutrition.title": "Nutrition quotidienne",
    "nutrition.lead":
      "Chaque jour, SteyLab adapte la nutrition à ton objectif : calories, macros, idées de repas et timing pour progresser vite.",
    "nutrition.card1Title": "Objectif ciblé",
    "nutrition.card1Text": "Le plan s'ajuste si tu passes en sèche ou en prise de masse.",
    "nutrition.card2Title": "Simple à suivre",
    "nutrition.card2Text": "Pas de prise de tête : l'app te guide au jour le jour.",
    "nutrition.card3Title": "Hommes & femmes",
    "nutrition.card3Text": "Les calculs sont personnalisés pour tous les profils.",
    "bonus.title": "Bonus IA + récompenses",
    "bonus.lead":
      "Une IA intégrée analyse ton objectif et te propose exactement les exercices à travailler parmi des centaines d'exercices disponibles.",
    "bonus.card1Title": "Coach IA visuel",
    "bonus.card1Text":
      "L'IA voit ta posture et ton corps pour recommander précisément ce qu'il faut bosser.",
    "bonus.card2Title": "Coach privé",
    "bonus.card2Text": "Tu as aussi un contact direct avec un coach sportif privé pour te guider.",
    "bonus.card3Title": "Récompense Jour 60",
    "bonus.card3Text":
      "Si tu ne sautes aucun jour jusqu'au niveau 60, SteyLab offre un ensemble de sport ou de la créatine de notre boutique.",
    "cta.title": "Prêt à lancer ta transformation ?",
    "cta.lead":
      "SteyLab t'accompagne chaque jour. Entraînement, nutrition, progression : tout est dans la même app.",
    "cta.button": "Télécharger l'app",
    footer: "SteyLab © 2025 — Application sportive pour femmes & hommes.",
    "lang.title": "Choisis ta langue",
    "lang.subtitle": "Tu pourras changer à tout moment.",
  },
  en: {
    "nav.concept": "Concept",
    "nav.progress": "Progress",
    "nav.nutrition": "Nutrition",
    "nav.bonus": "Bonus",
    "header.cta": "Join the beta",
    "hero.eyebrow": "Sports app for women & men",
    "hero.titleLine1": "Reach your goal",
    "hero.titleLine2": "training + nutrition",
    "hero.titleLine3": "in one plan.",
    "hero.lead":
      "Pick your focus areas (chest, back, arms…), enter your height and weight, and SteyLab builds a daily workout + nutrition plan tailored to your goal.",
    "hero.primaryCta": "Start now",
    "hero.secondaryCta": "See the concept",
    "hero.badge1": "+500 guided exercises",
    "hero.badge2": "Daily nutrition",
    "hero.badge3": "AI assistant",
    "hero.mediaFocus": "Back + shoulders focus",
    "hero.mediaLevel": "Level 1 • Day 1",
    "hero.statLabel": "Level-based progression",
    "hero.statValue": "30 days = comparison photo",
    "concept.title": "Understand everything in 30 seconds",
    "concept.lead":
      "SteyLab is the official site of the app. Here you instantly see how it works: a clear goal, targeted sessions, and nutrition that follows your progress.",
    "concept.card1Title": "Pick your goal",
    "concept.card1Text":
      "Bulking, cutting, strength, or getting back in shape: the app builds a full plan around your goal.",
    "concept.card2Title": "Train by muscle group",
    "concept.card2Text":
      "Chest, back, arms, legs… you choose what to train and the app adapts the exercises.",
    "concept.card3Title": "Day-by-day nutrition",
    "concept.card3Text":
      "Your data (height, weight, goal) is used to create nutrition tailored each day.",
    "visual.tag": "Visual muscle selection",
    "visual.title": "A clear, visual plan",
    "visual.lead":
      "Each session is a guided exercise list. You tick every finished set to move up a level. Level 1 = Day 1, with its workout + nutrition.",
    "visual.bullet1": "Level-based progression system",
    "visual.bullet2": "Checkboxes for each set",
    "visual.bullet3": "Goal visible at a glance",
    "progress.title": "Progress & private photos",
    "progress.lead":
      "Take a photo directly in the app. It stays local, never in the cloud, to avoid any data leakage.",
    "progress.level30": "Level 30",
    "progress.level30Text": "Comparison photo + visible difference",
    "progress.level60": "Level 60",
    "progress.level60Text": "Shop reward (sports set or creatine)",
    "progress.day1": "Day 1",
    "progress.day1Text": "Starting photo + first session.",
    "progress.day30": "Day 30",
    "progress.day30Text": "New photo to see the transformation.",
    "progress.day60": "Day 60",
    "progress.day60Text": "If zero days skipped, a gift from our shop.",
    "nutrition.title": "Daily nutrition",
    "nutrition.lead":
      "Each day, SteyLab adapts nutrition to your goal: calories, macros, meal ideas, and timing to progress fast.",
    "nutrition.card1Title": "Targeted goal",
    "nutrition.card1Text": "The plan adapts if you switch to cutting or bulking.",
    "nutrition.card2Title": "Easy to follow",
    "nutrition.card2Text": "No stress: the app guides you day by day.",
    "nutrition.card3Title": "Women & men",
    "nutrition.card3Text": "Calculations are personalized for every profile.",
    "bonus.title": "AI bonus + rewards",
    "bonus.lead":
      "Built‑in AI analyzes your goal and suggests exactly what to work on among hundreds of exercises.",
    "bonus.card1Title": "Visual AI coach",
    "bonus.card1Text":
      "The AI reads your posture and body to recommend precisely what to train.",
    "bonus.card2Title": "Private coach",
    "bonus.card2Text": "You also get direct access to a private sports coach.",
    "bonus.card3Title": "Day 60 reward",
    "bonus.card3Text":
      "If you don’t skip any day until level 60, SteyLab offers a sports set or creatine from our shop.",
    "cta.title": "Ready to start your transformation?",
    "cta.lead":
      "SteyLab supports you every day. Training, nutrition, progression: everything in one app.",
    "cta.button": "Download the app",
    footer: "SteyLab © 2025 — Sports app for women & men.",
    "lang.title": "Choose your language",
    "lang.subtitle": "You can change it anytime.",
  },
};

const langButtons = document.querySelectorAll(".lang-btn, .lang-modal [data-lang]");
const modal = document.querySelector(".lang-modal");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

const applyLanguage = (lang) => {
  const dict = translations[lang] || translations.fr;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.getAttribute("data-lang") === lang);
  });

  localStorage.setItem("steylab_lang", lang);
};

const storedLang = localStorage.getItem("steylab_lang");
if (!storedLang && modal) {
  modal.classList.add("is-visible");
}

if (storedLang) applyLanguage(storedLang);

langButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const lang = btn.getAttribute("data-lang");
    applyLanguage(lang);
    if (modal) modal.classList.remove("is-visible");
  });
});

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

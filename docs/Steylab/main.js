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
    "nav.app": "Interface",
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
    "app.title": "Passe à l'interface application",
    "app.lead":
      "Découvre l'interface complète : un onboarding en étapes, un profil sportif pro, et une sauvegarde locale sécurisée.",
    "app.previewTitle": "Interface 100% orientée performance",
    "app.previewText":
      "Tu complètes ton profil en quelques étapes. Chaque donnée est stockée en local et sert à personnaliser tes séances et ta nutrition.",
    "app.previewTag": "Onboarding guidé",
    "app.previewField1": "Type de profil",
    "app.previewField2": "Objectif",
    "app.open": "Ouvrir l'interface",
    "app.home.age": "Âge",
    "app.home.weight": "Poids",
    "app.home.rank": "Voir le classement",
    "app.home.meal": "Repas du jour",
    "app.home.mealText": "Plan nutritionnel personnalisé.",
    "app.home.workout": "Séance du jour",
    "app.home.workoutText": "Guidée + check des séries.",
    "app.home.progressTile": "Voir mes progrès",
    "app.home.progressTileText": "Photos + niveaux + stats.",
    "app.nav.home": "Accueil",
    "app.nav.exos": "Exos",
    "app.nav.nutrition": "Nutrition",
    "app.nav.profile": "Profil",
    "app.nav.settings": "Paramètres",
    "app.tab.profile": "Profil",
    "app.tab.goal": "Objectif",
    "app.tab.plan": "Plan du jour",
    "app.progress": "Progression",
    "app.progressHint": "Niveau 12 / 60",
    "app.headerTag": "Données locales",
    "app.headerTitle": "Ton profil sportif",
    "app.headerStatus": "Sauvegarde locale active",
    "app.form.type": "Type de profil",
    "app.form.typePlaceholder": "Choisir",
    "app.form.typeMan": "Homme",
    "app.form.typeWoman": "Femme",
    "app.form.typeOther": "Autre",
    "app.form.name": "Nom",
    "app.form.birthdate": "Date de naissance",
    "app.form.height": "Taille (cm)",
    "app.form.weight": "Poids (kg)",
    "app.form.goal": "Objectif",
    "app.form.goalPlaceholder": "Sélectionner",
    "app.form.goalMass": "Prise de masse",
    "app.form.goalCut": "Sèche",
    "app.form.goalStrength": "Force",
    "app.form.goalTone": "Tonus",
    "app.form.focus": "Zones à travailler",
    "app.form.focusPlaceholder": "Pecs, dos, bras...",
    "app.form.save": "Sauvegarder en local",
    "app.form.clear": "Effacer",
    "app.form.hint": "Les données restent dans ton navigateur, pas dans le cloud.",
    "app.form.saved": "Profil enregistré en local.",
    "app.form.cleared": "Profil effacé.",
    "cta.title": "Prêt à lancer ta transformation ?",
    "cta.lead":
      "SteyLab t'accompagne chaque jour. Entraînement, nutrition, progression : tout est dans la même app.",
    "cta.button": "Télécharger l'app",
    footer: "SteyLab © 2026 — Application sportive pour femmes & hommes.",
    "lang.title": "Choisis ta langue",
    "lang.subtitle": "Tu pourras changer à tout moment.",
  },
  en: {
    "nav.concept": "Concept",
    "nav.progress": "Progress",
    "nav.nutrition": "Nutrition",
    "nav.bonus": "Bonus",
    "nav.app": "Interface",
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
    "app.title": "Go to the in‑app interface",
    "app.lead":
      "Discover the full interface: step‑by‑step onboarding, a pro profile, and secure local storage.",
    "app.previewTitle": "Performance-first interface",
    "app.previewText":
      "Complete your profile in a few steps. Every data point is stored locally to personalize workouts and nutrition.",
    "app.previewTag": "Guided onboarding",
    "app.previewField1": "Profile type",
    "app.previewField2": "Goal",
    "app.open": "Open the interface",
    "app.home.age": "Age",
    "app.home.weight": "Weight",
    "app.home.rank": "See rankings",
    "app.home.meal": "Meal of the day",
    "app.home.mealText": "Personalized nutrition plan.",
    "app.home.workout": "Workout of the day",
    "app.home.workoutText": "Guided + set tracking.",
    "app.home.progressTile": "See my progress",
    "app.home.progressTileText": "Photos + levels + stats.",
    "app.nav.home": "Home",
    "app.nav.exos": "Exercises",
    "app.nav.nutrition": "Nutrition",
    "app.nav.profile": "Profile",
    "app.nav.settings": "Settings",
    "app.tab.profile": "Profile",
    "app.tab.goal": "Goal",
    "app.tab.plan": "Today's plan",
    "app.progress": "Progress",
    "app.progressHint": "Level 12 / 60",
    "app.headerTag": "Local data",
    "app.headerTitle": "Your sports profile",
    "app.headerStatus": "Local save active",
    "app.form.type": "Profile type",
    "app.form.typePlaceholder": "Choose",
    "app.form.typeMan": "Man",
    "app.form.typeWoman": "Woman",
    "app.form.typeOther": "Other",
    "app.form.name": "Name",
    "app.form.birthdate": "Birth date",
    "app.form.height": "Height (cm)",
    "app.form.weight": "Weight (kg)",
    "app.form.goal": "Goal",
    "app.form.goalPlaceholder": "Select",
    "app.form.goalMass": "Bulking",
    "app.form.goalCut": "Cutting",
    "app.form.goalStrength": "Strength",
    "app.form.goalTone": "Tone",
    "app.form.focus": "Focus areas",
    "app.form.focusPlaceholder": "Chest, back, arms...",
    "app.form.save": "Save locally",
    "app.form.clear": "Clear",
    "app.form.hint": "Your data stays in your browser, not in the cloud.",
    "app.form.saved": "Profile saved locally.",
    "app.form.cleared": "Profile cleared.",
    "cta.title": "Ready to start your transformation?",
    "cta.lead":
      "SteyLab supports you every day. Training, nutrition, progression: everything in one app.",
    "cta.button": "Download the app",
    footer: "SteyLab © 2026 — Sports app for women & men.",
    "lang.title": "Choose your language",
    "lang.subtitle": "You can change it anytime.",
  },
};

const langButtons = document.querySelectorAll(".lang-btn, .lang-modal [data-lang]");
const modal = document.querySelector(".lang-modal");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const profileForm = document.querySelector("#profile-form");
const profileStatus = document.querySelector("#profile-status");
const clearProfileBtn = document.querySelector("#clear-profile");

const applyLanguage = (lang) => {
  const dict = translations[lang] || translations.fr;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key]) el.setAttribute("placeholder", dict[key]);
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

const loadProfile = () => {
  if (!profileForm) return;
  const raw = localStorage.getItem("steylab_profile");
  if (!raw) return;
  const data = JSON.parse(raw);
  Array.from(profileForm.elements).forEach((field) => {
    if (field.name && data[field.name] !== undefined) {
      field.value = data[field.name];
    }
  });
};

const saveProfile = (values) => {
  localStorage.setItem("steylab_profile", JSON.stringify(values));
};

if (profileForm) {
  loadProfile();
  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(profileForm);
    const payload = Object.fromEntries(formData.entries());
    saveProfile(payload);
    const lang = localStorage.getItem("steylab_lang") || "fr";
    if (profileStatus) profileStatus.textContent = translations[lang]["app.form.saved"];
  });
}

if (clearProfileBtn && profileForm) {
  clearProfileBtn.addEventListener("click", () => {
    localStorage.removeItem("steylab_profile");
    profileForm.reset();
    const lang = localStorage.getItem("steylab_lang") || "fr";
    if (profileStatus) profileStatus.textContent = translations[lang]["app.form.cleared"];
  });
}

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

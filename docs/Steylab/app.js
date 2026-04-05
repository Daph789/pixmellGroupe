const SUPABASE_URL = "https://jdudwikpzziitvinotwu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkdWR3aWtwenppaXR2aW5vdHd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjc4MzAsImV4cCI6MjA5MDkwMzgzMH0.KjBki03APLglWYYeFiZVOXJZBr-gxR7CWCKnE-JdhRY";

const supabase = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const steps = Array.from(document.querySelectorAll(".form-step"));
const nextBtn = document.querySelector("#next-step");
const prevBtn = document.querySelector("#prev-step");
const finishBtn = document.querySelector("#finish-step");
const progressFill = document.querySelector(".step-progress-fill");
const stepLabel = document.querySelector("#step-label");
// auth handled on login/signup pages
const onboardingSection = document.querySelector("#app-settings");
const appHome = document.querySelector("#app-home");
const homeName = document.querySelector("#home-name");
const homeGoal = document.querySelector("#home-goal");
const homeAge = document.querySelector("#home-age");
const homeWeight = document.querySelector("#home-weight");
const homePoints = document.querySelector("#home-points");
const form = document.querySelector("#profile-form");

let currentStep = 0;

const calcAge = (birthdate) => {
  const date = new Date(birthdate);
  if (Number.isNaN(date.getTime())) return "";
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const m = today.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
    age -= 1;
  }
  return age;
};

const updateWizard = () => {
  steps.forEach((step, index) => {
    step.classList.toggle("is-active", index === currentStep);
  });

  const total = steps.length;
  const progress = ((currentStep + 1) / total) * 100;
  if (progressFill) progressFill.style.width = `${progress}%`;
  if (stepLabel) stepLabel.textContent = `${currentStep + 1} / ${total}`;

  if (prevBtn) prevBtn.disabled = currentStep === 0;
  if (nextBtn) nextBtn.style.display = currentStep === total - 1 ? "none" : "inline-flex";
  if (finishBtn) finishBtn.style.display = currentStep === total - 1 ? "inline-flex" : "none";
};

const validateStep = () => {
  const activeStep = steps[currentStep];
  if (!activeStep) return true;
  const fields = Array.from(activeStep.querySelectorAll("input, select, textarea"));
  for (const field of fields) {
    if (!field.checkValidity()) {
      field.reportValidity();
      return false;
    }
  }
  return true;
};

const showHome = (data = {}) => {
  if (onboardingSection) {
    onboardingSection.hidden = true;
    onboardingSection.style.display = "none";
  }
  if (appHome) {
    appHome.hidden = false;
    appHome.style.display = "block";
  }
  if (homeName) homeName.textContent = data.name || "SteyLab User";
  if (homeGoal) {
    const map = {
      masse: "Prise de masse",
      seche: "Sèche",
      force: "Force",
      tonus: "Tonus",
    };
    homeGoal.textContent = map[data.goal] || "Objectif";
  }
  if (homeAge) homeAge.textContent = data.birthdate ? `${calcAge(data.birthdate)}` : "25";
  if (homeWeight) homeWeight.textContent = data.weight ? `${data.weight} kg` : "70 kg";
};


const showSettings = () => {
  if (appHome) {
    appHome.hidden = true;
    appHome.style.display = "none";
  }
  if (onboardingSection) {
    onboardingSection.hidden = false;
    onboardingSection.style.display = "block";
  }
};


if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    if (!validateStep()) return;
    if (currentStep < steps.length - 1) {
      currentStep += 1;
      updateWizard();
    }
  });
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep -= 1;
      updateWizard();
    }
  });
}

const upsertProfile = async (payload) => {
  if (!supabase) return;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const record = {
    user_id: user.id,
    profile_type: payload.profileType,
    name: payload.name,
    birthdate: payload.birthdate,
    height_cm: Number(payload.height),
    weight_kg: Number(payload.weight),
    goal: payload.goal,
    focus: payload.focus,
    updated_at: new Date().toISOString(),
  };
  await supabase.from("profiles").upsert(record, { onConflict: "user_id" });
};

const fetchProfile = async () => {
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
  return data || null;
};

const fetchPoints = async () => {
  if (!supabase) return 0;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;
  const { data } = await supabase.from("points").select("points").eq("user_id", user.id).maybeSingle();
  return data?.points ?? 0;
};

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    await upsertProfile(payload);
    showHome(payload);
  });
}

const handleAuthReady = async () => {
  if (!supabase) return;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = "./login.html";
    return;
  }
  const points = await fetchPoints();
  if (homePoints) homePoints.textContent = `${points}`;
  const profile = await fetchProfile();
  if (profile) {
    showHome({
      name: profile.name,
      goal: profile.goal,
      birthdate: profile.birthdate,
      weight: profile.weight_kg,
    });
  } else {
    showSettings();
  }
};

updateWizard();
handleAuthReady();

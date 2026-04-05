const SUPABASE_URL = "https://jdudwikpzziitvinotwu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkdWR3aWtwenppaXR2aW5vdHd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjc4MzAsImV4cCI6MjA5MDkwMzgzMH0.KjBki03APLglWYYeFiZVOXJZBr-gxR7CWCKnE-JdhRY";

const supabase = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.querySelector("#settings-form");
const status = document.querySelector("#settings-status");
const clearBtn = document.querySelector("#clear-profile");

const ensureSession = async () => {
  if (!supabase) return;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = "./login.html";
  }
};

const loadProfile = async () => {
  if (!form || !supabase) return;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
  if (!data) return;
  const mapped = {
    profileType: data.profile_type,
    name: data.name,
    birthdate: data.birthdate,
    height: data.height_cm,
    weight: data.weight_kg,
    goal: data.goal,
    focus: data.focus,
  };
  Array.from(form.elements).forEach((field) => {
    if (field.name && mapped[field.name] !== undefined) {
      field.value = mapped[field.name];
    }
  });
};

if (form) {
  ensureSession();
  loadProfile();
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      if (status) status.textContent = "Connecte-toi d'abord.";
      return;
    }
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
    if (status) status.textContent = "Profil mis à jour.";
  });
}

if (clearBtn) {
  clearBtn.addEventListener("click", async () => {
    if (form) form.reset();
    if (status) status.textContent = "Profil effacé.";
  });
}

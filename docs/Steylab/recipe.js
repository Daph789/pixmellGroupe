const titleEl = document.querySelector("#recipe-title");
const metaEl = document.querySelector("#recipe-meta");
const imageEl = document.querySelector("#recipe-image");
const descEl = document.querySelector("#recipe-desc");
const caloriesEl = document.querySelector("#recipe-calories");
const proteinEl = document.querySelector("#recipe-protein");
const carbsEl = document.querySelector("#recipe-carbs");
const fatEl = document.querySelector("#recipe-fat");
const stepsEl = document.querySelector("#recipe-steps");
const wheyCard = document.querySelector("#whey-card");
const doneBtn = document.querySelector("#meal-done-btn");
const doneState = document.querySelector("#meal-done-state");
const confirmOverlay = document.querySelector("#confirm-overlay");
const confirmYes = document.querySelector("#confirm-yes");
const confirmNo = document.querySelector("#confirm-no");
const pointsOverlay = document.querySelector("#points-overlay");

const sb = window.sb;
const toLocalDate = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDate = (date) =>
  new Intl.DateTimeFormat("fr-FR", { dateStyle: "full" }).format(date);

const ensureSession = async () => {
  if (!sb) return null;
  const {
    data: { session },
  } = await sb.auth.getSession();
  if (!session) {
    window.location.href = "./login.html";
    return null;
  }
  return session;
};

const getBreakfast = async (id, userId) => {
  if (id) {
    const { data } = await sb.from("breakfasts").select("*").eq("id", id).single();
    return data;
  }
  const today = new Date().toISOString().slice(0, 10);
  const { data: history } = await sb
    .from("meal_history")
    .select("breakfast_id")
    .eq("user_id", userId)
    .eq("day", today)
    .maybeSingle();
  if (history?.breakfast_id) {
    const { data } = await sb
      .from("breakfasts")
      .select("*")
      .eq("id", history.breakfast_id)
      .single();
    return data;
  }
  return null;
};

const getOrCreatePoints = async (userId) => {
  const { data } = await sb.from("points").select("*").eq("user_id", userId).maybeSingle();
  if (data) return data;
  const { data: inserted } = await sb
    .from("points")
    .insert({ user_id: userId, points: 0 })
    .select("*")
    .single();
  return inserted;
};

const markMealDone = async (userId, day, breakfastId) => {
  const existing = await checkMealDone(userId, day);
  if (existing) return { alreadyDone: true };

  await sb.from("meal_completions").insert({
    user_id: userId,
    day,
    breakfast_id: breakfastId,
    completed_at: new Date().toISOString(),
  });

  const current = await getOrCreatePoints(userId);
  await sb.from("points").update({ points: (current?.points || 0) + 5 }).eq("user_id", userId);
  return { alreadyDone: false };
};

const checkMealDone = async (userId, day) => {
  const { data } = await sb
    .from("meal_completions")
    .select("*")
    .eq("user_id", userId)
    .eq("day", day)
    .maybeSingle();
  return data || null;
};

const render = (meal) => {
  if (!meal) return;
  if (titleEl) titleEl.textContent = meal.name;
  if (metaEl) metaEl.textContent = formatDate(new Date());
  if (imageEl) imageEl.src = meal.image_path || "./assets/meal-placeholder.jpg";
  if (descEl) descEl.textContent = meal.description || "";
  if (caloriesEl) caloriesEl.textContent = `${meal.calories} kcal`;
  if (proteinEl) proteinEl.textContent = `${meal.protein_g} g`;
  if (carbsEl) carbsEl.textContent = `${meal.carbs_g} g`;
  if (fatEl) fatEl.textContent = `${meal.fat_g} g`;
  if (stepsEl) {
    stepsEl.innerHTML = "";
    const steps = meal.recipe_steps || [];
    steps.forEach((step, index) => {
      const div = document.createElement("div");
      div.className = "recipe-step";
      div.innerHTML = `<strong>Étape ${index + 1}</strong>${step}`;
      stepsEl.appendChild(div);
    });
  }

  const hasWhey =
    (meal.name && meal.name.toLowerCase().includes("whey")) ||
    (meal.description && meal.description.toLowerCase().includes("whey")) ||
    (meal.recipe_steps || []).some((s) => s.toLowerCase().includes("whey"));
  if (wheyCard) wheyCard.hidden = !hasWhey;
};

const init = async () => {
  const session = await ensureSession();
  if (!session) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const meal = await getBreakfast(id, session.user.id);
  render(meal);

  const day = toLocalDate();
  const done = await checkMealDone(session.user.id, day);
  if (done && doneState && doneBtn) {
    doneState.hidden = false;
    doneBtn.style.display = "none";
  }

  if (doneBtn && meal) {
    doneBtn.addEventListener("click", () => {
      if (confirmOverlay) confirmOverlay.classList.add("is-open");
    });
  }

  if (confirmNo) {
    confirmNo.addEventListener("click", () => {
      if (confirmOverlay) confirmOverlay.classList.remove("is-open");
    });
  }

  if (confirmYes && meal) {
    confirmYes.addEventListener("click", async () => {
      if (confirmOverlay) confirmOverlay.classList.remove("is-open");
      const result = await markMealDone(session.user.id, day, meal.id);
      doneState.hidden = false;
      doneBtn.style.display = "none";
      if (!result.alreadyDone && pointsOverlay) {
        pointsOverlay.classList.add("is-open");
        setTimeout(() => {
          pointsOverlay.classList.remove("is-open");
        }, 1800);
      }
    });
  }
};

init();

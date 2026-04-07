const meta = document.querySelector("#day-meta");
const message = document.querySelector("#day-message");
const startBtn = document.querySelector("#start-btn");
const startActions = document.querySelector("#start-actions");
const startedInfo = document.querySelector("#started-info");
const mealImage = document.querySelector("#meal-image");
const mealTitle = document.querySelector("#meal-title");
const mealDesc = document.querySelector("#meal-desc");
const mealCalories = document.querySelector("#meal-calories");
const mealProtein = document.querySelector("#meal-protein");
const mealCarbs = document.querySelector("#meal-carbs");
const mealFat = document.querySelector("#meal-fat");
const recipeLink = document.querySelector("#recipe-link");
const mealList = document.querySelector("#meal-list");
const mealMessage = document.querySelector("#meal-message");
const goalCard = document.querySelector("#goal-card");
const goalStartedText = document.querySelector("#goal-started-text");
const goalDay = document.querySelector("#goal-day");
const overlay = document.querySelector("#overlay");
const overlayClose = document.querySelector("#overlay-close");
const overlayText = document.querySelector("#overlay-text");

const sb = window.sb;
let hasStarted = false;
let startedAtValue = null;
const mealKeyMap = {
  "Bowl grec protéiné": "meal.bowl",
  "Omelette muscu": "meal.omelette",
  "Overnight oats": "meal.oats",
  "Pancakes protéinés": "meal.pancakes",
};

const translateMeal = (meal) => {
  if (!meal) return meal;
  const key = mealKeyMap[meal.name];
  if (!key || !window.i18n) return meal;
  return {
    ...meal,
    name: window.i18n.t(`${key}.title`),
    description: window.i18n.t(`${key}.desc`),
  };
};

const toLocalDate = (d = new Date()) => d.toISOString().slice(0, 10);

const formatDateTime = (date) =>
  new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);

const setMeta = () => {
  const now = new Date();
  if (meta) {
    meta.textContent = `${formatDateTime(now)}`;
  }
};

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

const getDailyProgress = async (userId, day) => {
  const { data } = await sb
    .from("daily_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("day", day)
    .maybeSingle();
  return data || null;
};

const getProfile = async (userId) => {
  const { data } = await sb.from("profiles").select("*").eq("user_id", userId).single();
  return data || null;
};

const setObjectiveStart = async (userId, startedAt) => {
  await sb.from("profiles").update({ started_at: startedAt }).eq("user_id", userId);
};

const showGoalCard = (startedAt) => {
  if (!goalCard) return;
  const startedDate = new Date(startedAt);
  const days =
    Math.floor((new Date().setHours(0, 0, 0, 0) - startedDate.setHours(0, 0, 0, 0)) / 86400000) || 0;
  goalCard.hidden = false;
  if (goalStartedText) {
    const text = window.i18n?.t("app.goal.startedText", { date: formatDateTime(new Date(startedAt)) });
    goalStartedText.textContent =
      text ||
      `Vous avez commencé votre objectif le ${formatDateTime(
        new Date(startedAt)
      )}. Les jours sont comptés pour atteindre votre objectif.`;
  }
  if (goalDay) {
    const txt = window.i18n?.t("app.goal.day", { day: days });
    goalDay.textContent = txt || `Jour ${days}`;
  }
};

const showStarted = (startedAt) => {
  if (startActions) startActions.style.display = "none";
  if (message) message.textContent = window.i18n?.t("app.start.confirmed") || "Départ confirmé.";
  if (startedInfo)
    startedInfo.textContent =
      window.i18n?.t("app.start.startedAt", { date: formatDateTime(new Date(startedAt)) }) ||
      `Commencé le ${formatDateTime(new Date(startedAt))}`;
  hasStarted = true;
  startedAtValue = startedAt;
  showGoalCard(startedAt);
};

const handleStart = async (userId, day) => {
  const now = new Date().toISOString();
  hasStarted = true;
  startedAtValue = now;
  await sb.from("daily_progress").upsert(
    {
      user_id: userId,
      day,
      started_at: now,
    },
    { onConflict: "user_id,day" }
  );
  const profile = await getProfile(userId);
  if (profile && !profile.started_at) {
    await setObjectiveStart(userId, now);
  }
  showStarted(now);
};

const isMorning = () => {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  return h < 11 || (h === 11 && m <= 30);
};

const renderMeal = (meal) => {
  if (!meal) return;
  const display = translateMeal(meal);
  if (mealImage) mealImage.src = display.image_path || "./assets/meal-placeholder.jpg";
  if (mealTitle) mealTitle.textContent = display.name;
  if (mealDesc) mealDesc.textContent = display.description || "";
  if (mealCalories) mealCalories.textContent = `${meal.calories} kcal`;
  if (mealProtein) mealProtein.textContent = `${meal.protein_g} g`;
  if (mealCarbs) mealCarbs.textContent = `${meal.carbs_g} g`;
  if (mealFat) mealFat.textContent = `${meal.fat_g} g`;
  if (recipeLink) recipeLink.href = `./recipe.html?id=${meal.id}`;
};

const renderMealList = (meals, todayMealId, unlockedOrder, startedAt, doneMealId) => {
  if (!mealList) return;
  mealList.innerHTML = "";
  const total = meals.length || 1;
  meals.forEach((meal) => {
    const display = translateMeal(meal);
    const card = document.createElement("div");
    card.className = "meal-thumb";
    const isToday = meal.id === todayMealId;
    const isLocked = !isToday || !startedAt;
    if (!isToday || isLocked) {
      card.classList.add("locked");
      card.setAttribute("data-lock", window.i18n?.t("app.meal.lockedLabel") || "Verrouillé");
    }
    if (doneMealId && meal.id === doneMealId) card.classList.add("done");
    card.innerHTML = `
      <img src="${display.image_path || "./assets/meal-placeholder.jpg"}" alt="${display.name}" />
      <div class="thumb-body">
        <strong>${display.name}</strong>
        ${
          doneMealId && meal.id === doneMealId
            ? `<span class="done-badge">${window.i18n?.t("app.workout.done") || "✓ Fait"}</span>`
            : ""
        }
      </div>
    `;
    card.addEventListener("click", () => {
      if (isToday && !isLocked) {
        window.location.href = `./recipe.html?id=${meal.id}`;
        return;
      }
      const currentOrder = unlockedOrder;
      const targetOrder = meal.sort_order || 1;
      const remaining = ((targetOrder - currentOrder) % total + total) % total;
      if (remaining > 0) {
        const txt =
          window.i18n?.t("app.meal.lockedDays", { days: remaining }) ||
          `Veuillez attendre ${remaining} jour${remaining > 1 ? "s" : ""}.`;
        if (overlayText) overlayText.textContent = txt;
        if (overlay) overlay.classList.add("is-open");
        return;
      }
      if (!startedAt) {
        const txt =
          window.i18n?.t("app.meal.needStart") ||
          "Clique d'abord sur “Commencer” pour lancer l'objectif.";
        if (overlayText) overlayText.textContent = txt;
        if (overlay) overlay.classList.add("is-open");
        return;
      }
      if (!isMorning()) {
        const txt =
          window.i18n?.t("app.meal.lockedMorning") || "Vous devez attendre le matin.";
        if (overlayText) overlayText.textContent = txt;
        if (overlay) overlay.classList.add("is-open");
        return;
      }
      // no-op: already handled by cases above
    });
    mealList.appendChild(card);
  });
};

const init = async () => {
  setMeta();
  const session = await ensureSession();
  if (!session) return;
  const userId = session.user.id;
  const day = toLocalDate();

  const progress = await getDailyProgress(userId, day);
  if (progress?.started_at) showStarted(progress.started_at);

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      hasStarted = true;
      startedAtValue = new Date().toISOString();
      if (overlay) overlay.classList.remove("is-open");
      handleStart(userId, day);
    });
  }

  if (!isMorning() && message) {
    message.textContent =
      window.i18n?.t("app.start.message") ||
      "Le petit déjeuner est prévu le matin. En cliquant sur “Commencer”, tu lances ton objectif et les jours sont comptés.";
  }

  const profile = await getProfile(userId);
  const startedAt = profile?.started_at ? new Date(profile.started_at) : null;
  if (profile?.started_at) {
    hasStarted = true;
    startedAtValue = profile.started_at;
  }
  if (startedAt) {
    showGoalCard(profile.started_at);
  }
  const { data: allMealsRaw } = await sb
    .from("breakfasts")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  const allMeals = [];
  const seen = new Set();
  (allMealsRaw || []).forEach((m) => {
    const key = `${m.name}`.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      allMeals.push(m);
    }
  });

  const { data: completions } = await sb
    .from("meal_completions")
    .select("breakfast_id, day")
    .eq("user_id", userId);
  const completedBeforeToday = (completions || []).filter((row) => row.day < day).length;
  const currentIndex = allMeals.length
    ? ((completedBeforeToday % allMeals.length) + allMeals.length) % allMeals.length
    : 0;
  const unlockedOrder = currentIndex + 1;
  const meal = allMeals[currentIndex] || null;
  renderMeal(meal);

  const { data: done } = await sb
    .from("meal_completions")
    .select("breakfast_id")
    .eq("user_id", userId)
    .eq("day", day)
    .maybeSingle();

  if (allMeals && meal) {
    renderMealList(allMeals, meal.id, unlockedOrder, profile?.started_at, done?.breakfast_id);
  }

  if (recipeLink) {
    recipeLink.addEventListener("click", (event) => {
      if (!hasStarted) {
        event.preventDefault();
        if (overlayText)
          overlayText.textContent =
            window.i18n?.t("app.overlay.needStart") || "Tu dois d’abord cliquer sur “Commencer”.";
        if (overlay) overlay.classList.add("is-open");
        return;
      }

      if (!isMorning()) {
        event.preventDefault();
        const now = new Date();
        const nextMorning = new Date();
        nextMorning.setDate(nextMorning.getDate() + 1);
        nextMorning.setHours(7, 0, 0, 0);
        if (overlayText) {
          const txt =
            window.i18n?.t("app.overlay.waitMorning", { date: formatDateTime(nextMorning) }) ||
            `Le petit déjeuner est disponible jusqu'à 11h30. Reviens demain matin (${formatDateTime(
              nextMorning
            )}).`;
          overlayText.textContent = txt;
        }
        if (overlay) overlay.classList.add("is-open");
      }
    });
  }

  const langToggle = document.querySelector("#lang-toggle");
  if (langToggle && !langToggle.dataset.rerender) {
    langToggle.addEventListener("click", () => {
      setTimeout(init, 0);
    });
    langToggle.dataset.rerender = "1";
  }
};

init();
if (overlayClose) {
  overlayClose.addEventListener("click", () => {
    if (overlay) overlay.classList.remove("is-open");
  });
}

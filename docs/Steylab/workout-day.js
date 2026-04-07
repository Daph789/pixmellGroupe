const sb = window.sb;

const titleEl = document.querySelector("#workout-day-title");
const metaEl = document.querySelector("#workout-day-meta");
const grid = document.querySelector("#exercise-grid");
const exKeyMap = {
  "Développé couché": "ex.bench",
  "Développé épaules": "ex.shoulder",
  Dips: "ex.dips",
  "Tirage vertical": "ex.latpulldown",
  "Rowing barre": "ex.row",
  "Curl biceps": "ex.curl",
  Squat: "ex.squat",
  Fentes: "ex.lunge",
  "Hip thrust": "ex.hipthrust",
  Gainage: "ex.plank",
  Crunch: "ex.crunch",
  Burpees: "ex.burpee",
  "Soulevé de terre": "ex.deadlift",
  "Rowing haltères": "ex.rowdb",
  Pompes: "ex.pushup",
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

const getLocale = () => (window.i18n?.getLang() === "en" ? "en-US" : "fr-FR");
const formatDate = (date) =>
  new Intl.DateTimeFormat(getLocale(), { dateStyle: "full" }).format(date);

const getDoneExercises = async (userId, day) => {
  const { data } = await sb
    .from("exercise_completions")
    .select("exercise_id")
    .eq("user_id", userId)
    .eq("day", day);
  return new Set((data || []).map((row) => row.exercise_id));
};

const init = async () => {
  const session = await ensureSession();
  if (!session) return;

  const params = new URLSearchParams(window.location.search);
  const day = Number(params.get("day") || "1");

  const updateTexts = () => {
    if (titleEl) {
      const txt =
        window.i18n?.t("app.exercise.sessionDay", { day }) || `Séance — Jour ${day}`;
      titleEl.textContent = txt;
    }
    if (metaEl) metaEl.textContent = formatDate(new Date());
  };
  updateTexts();
  const langToggle = document.querySelector("#lang-toggle");
  if (langToggle && !langToggle.dataset.bound) {
    langToggle.addEventListener("click", () => {
      setTimeout(init, 0);
    });
    langToggle.dataset.bound = "1";
  }

  const { data: exercises } = await sb
    .from("workout_day_exercises")
    .select("exercise:exercises(*)")
    .eq("day", day);

  if (!grid || !exercises) return;
  const doneSet = await getDoneExercises(session.user.id, day);
  grid.innerHTML = "";
  exercises.forEach((row) => {
    const ex = row.exercise;
    const key = exKeyMap[ex.name];
    const displayName = key && window.i18n ? window.i18n.t(`${key}.title`) : ex.name;
    const displayDesc = key && window.i18n ? window.i18n.t(`${key}.desc`) : ex.description || "";
    const card = document.createElement("a");
    card.className = "workout-card";
    card.href = `./exercise.html?id=${ex.id}&day=${day}`;
    card.innerHTML = `
      <img src="${ex.image_path}" alt="${ex.name}" />
      <div class="workout-body">
        <strong>${displayName}</strong>
        <p>${displayDesc}</p>
      </div>
    `;
    if (doneSet.has(ex.id)) {
      const doneLabel = window.i18n?.t("app.workout.done") || "✓ Fait";
      card.classList.add("done");
      card.setAttribute("data-done", doneLabel);
      const body = card.querySelector(".workout-body");
      if (body) {
        const badge = document.createElement("span");
        badge.className = "done-badge";
        badge.textContent = doneLabel;
        body.appendChild(badge);
      }
    }
    grid.appendChild(card);
  });
};

init();
window.addEventListener("pageshow", () => {
  init();
});

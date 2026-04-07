const sb = window.sb;

const titleEl = document.querySelector("#exercise-title");
const metaEl = document.querySelector("#exercise-meta");
const imageEl = document.querySelector("#exercise-image");
const descEl = document.querySelector("#exercise-desc");
const setsEl = document.querySelector("#exercise-sets");
const repsEl = document.querySelector("#exercise-reps");
const restEl = document.querySelector("#exercise-rest");
const tempoEl = document.querySelector("#exercise-tempo");
const doneBtn = document.querySelector("#exercise-done-btn");
const doneState = document.querySelector("#exercise-done-state");
const overlay = document.querySelector("#exercise-overlay");
const overlayText = document.querySelector("#exercise-overlay-text");
const overlayClose = document.querySelector("#exercise-overlay-close");

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

const toLocalDate = (d = new Date()) => d.toISOString().slice(0, 10);
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

const showOverlay = (text) => {
  if (overlayText) overlayText.textContent = text;
  if (overlay) overlay.classList.add("is-open");
};

if (overlayClose) {
  overlayClose.addEventListener("click", () => {
    if (overlay) overlay.classList.remove("is-open");
  });
}

const getDailyProgress = async (userId, day) => {
  const { data } = await sb
    .from("daily_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("day", day)
    .maybeSingle();
  return data || null;
};

const checkCompletion = async (userId, day, exerciseId) => {
  const { data } = await sb
    .from("exercise_completions")
    .select("*")
    .eq("user_id", userId)
    .eq("day", day)
    .eq("exercise_id", exerciseId)
    .maybeSingle();
  return data || null;
};

const markCompletion = async (userId, day, exerciseId) => {
  await sb.from("exercise_completions").insert({
    user_id: userId,
    day,
    exercise_id: exerciseId,
    completed_at: new Date().toISOString(),
  });
};

const allExercisesDone = async (userId, day) => {
  const { data: all } = await sb.from("workout_day_exercises").select("exercise_id").eq("day", day);
  const { data: done } = await sb.from("exercise_completions").select("exercise_id").eq("user_id", userId).eq("day", day);
  const allIds = new Set((all || []).map((r) => r.exercise_id));
  const doneIds = new Set((done || []).map((r) => r.exercise_id));
  return allIds.size > 0 && allIds.size === doneIds.size;
};

const awardWorkoutPoints = async (userId, day) => {
  const dayDate = toLocalDate();
  const { data: already } = await sb
    .from("workout_completions")
    .select("*")
    .eq("user_id", userId)
    .eq("day", dayDate)
    .maybeSingle();
  if (already) return;

  await sb.from("workout_completions").insert({
    user_id: userId,
    day: dayDate,
    completed_at: new Date().toISOString(),
  });

  const { data: points } = await sb.from("points").select("*").eq("user_id", userId).maybeSingle();
  const current = points?.points || 0;
  await sb.from("points").upsert({ user_id: userId, points: current + 5 });
};

const init = async () => {
  const session = await ensureSession();
  if (!session) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const day = Number(params.get("day") || "1");

  const updateTexts = () => {
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

  const { data: exercise } = await sb.from("exercises").select("*").eq("id", id).single();
  if (!exercise) return;

  const key = exKeyMap[exercise.name];
  const displayName = key && window.i18n ? window.i18n.t(`${key}.title`) : exercise.name;
  const displayDesc =
    key && window.i18n ? window.i18n.t(`${key}.desc`) : exercise.description || "";
  if (titleEl) titleEl.textContent = displayName;
  if (imageEl) imageEl.src = exercise.image_path;
  if (descEl) descEl.textContent = displayDesc;
  if (setsEl) setsEl.textContent = `${exercise.sets} séries`;
  if (repsEl) repsEl.textContent = `${exercise.reps} reps`;
  if (restEl) restEl.textContent = `${exercise.rest_seconds}s`;
  if (tempoEl) tempoEl.textContent = exercise.tempo || "-";

  const done = await checkCompletion(session.user.id, day, id);
  if (done && doneState && doneBtn) {
    doneState.hidden = false;
    doneBtn.style.display = "none";
  }

  if (doneBtn) {
    doneBtn.addEventListener("click", async () => {
      const today = toLocalDate();
      const progress = await getDailyProgress(session.user.id, today);
      if (!progress?.started_at) {
        showOverlay(window.i18n?.t("app.exercise.needStart") || "Tu dois d’abord cliquer sur “Commencer” pour lancer le compteur.");
        return;
      }
      await markCompletion(session.user.id, day, id);
      doneState.hidden = false;
      doneBtn.style.display = "none";
      if (await allExercisesDone(session.user.id, day)) {
        await awardWorkoutPoints(session.user.id, day);
      }
    });
  }
};

init();

const meta = document.querySelector("#day-meta");
const message = document.querySelector("#day-message");
const startBtn = document.querySelector("#start-btn");
const startActions = document.querySelector("#start-actions");
const startedInfo = document.querySelector("#started-info");
const goalCard = document.querySelector("#goal-card");
const goalStartedText = document.querySelector("#goal-started-text");
const goalDay = document.querySelector("#goal-day");
const workoutCards = document.querySelectorAll(".workout-card");
const workoutOverlay = document.querySelector("#workout-overlay");
const workoutOverlayText = document.querySelector("#workout-overlay-text");
const workoutOverlayClose = document.querySelector("#workout-overlay-close");

const sb = window.sb;
let workoutDoneDays = new Set();

const toLocalDate = (d = new Date()) => d.toISOString().slice(0, 10);

const formatDateTime = (date) =>
  new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);

const setMeta = () => {
  const now = new Date();
  if (meta) meta.textContent = `${formatDateTime(now)}`;
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

const applyWorkoutLocks = (today, doneDays = new Set()) => {
  workoutCards.forEach((card) => {
    const day = Number(card.dataset.day);
    const isToday = day === today;
    const isLocked = day !== today;
    card.classList.toggle("is-today", isToday);
    card.classList.toggle("is-locked", isLocked);
    if (isLocked) {
      card.setAttribute("aria-disabled", "true");
      card.style.cursor = "not-allowed";
      card.setAttribute("data-lock", window.i18n?.t("app.workout.lockedLabel") || "Verrouillé");
      if (!card.dataset.lockBound) {
        card.addEventListener("click", (e) => {
          e.preventDefault();
          const remaining = ((day - today) % 7 + 7) % 7 || 7;
          const txt =
            window.i18n?.t("app.workout.waitDays", { days: remaining }) ||
            `Veuillez attendre ${remaining} jour${remaining > 1 ? "s" : ""}.`;
          if (workoutOverlayText) workoutOverlayText.textContent = txt;
          if (workoutOverlay) workoutOverlay.classList.add("is-open");
        });
        card.dataset.lockBound = "1";
      }
    } else {
      card.style.cursor = "pointer";
    }
    if (doneDays.has(day)) {
      const doneLabel = window.i18n?.t("app.workout.done") || "✓ Fait";
      card.classList.add("done");
      card.setAttribute("data-done", doneLabel);
    }
    const existingTag = card.querySelector(".workout-tag");
    if (isToday && !existingTag) {
      const tag = document.createElement("div");
      tag.className = "workout-tag";
      tag.textContent = window.i18n?.t("app.workout.today") || "Aujourd’hui";
      card.appendChild(tag);
    }
    const existingBtn = card.querySelector(".start-workout");
    if (isToday && !existingBtn) {
      const btn = document.createElement("button");
      btn.className = "cta start-workout";
      btn.type = "button";
      btn.textContent = window.i18n?.t("app.workout.start") || "Commencer la séance du jour";
      card.querySelector(".workout-body").appendChild(btn);
    }
  });
};

const showGoalCard = (startedAt) => {
  if (!goalCard) return;
  const startedDate = new Date(startedAt);
  const days =
    Math.floor((new Date().setHours(0, 0, 0, 0) - startedDate.setHours(0, 0, 0, 0)) / 86400000) || 0;
  goalCard.hidden = false;
  if (goalStartedText) {
    const txt = window.i18n?.t("app.goal.startedText", { date: formatDateTime(new Date(startedAt)) });
    goalStartedText.textContent =
      txt || `Vous avez commencé votre objectif le ${formatDateTime(new Date(startedAt))}.`;
  }
  if (goalDay) {
    const txt = window.i18n?.t("app.goal.day", { day: days });
    goalDay.textContent = txt || `Jour ${days}`;
  }
  // locking handled in init based on completions
};

if (workoutOverlayClose) {
  workoutOverlayClose.addEventListener("click", () => {
    if (workoutOverlay) workoutOverlay.classList.remove("is-open");
  });
}

const showStarted = (startedAt) => {
  if (startActions) startActions.style.display = "none";
  if (message) message.textContent = "Départ confirmé.";
  if (startedInfo) startedInfo.textContent = `Commencé le ${formatDateTime(new Date(startedAt))}`;
  showGoalCard(startedAt);
};

const handleStart = async (userId, day) => {
  const now = new Date().toISOString();
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

const init = async () => {
  setMeta();
  const session = await ensureSession();
  if (!session) return;
  const userId = session.user.id;
  const day = toLocalDate();
  const { data: workoutDone } = await sb
    .from("workout_completions")
    .select("day")
    .eq("user_id", userId);
  const completedBeforeToday = (workoutDone || []).filter((row) => row.day < day).length;
  const currentDay = Math.min(completedBeforeToday + 1, 7);
  const doneToday = (workoutDone || []).some((row) => row.day === day);
  workoutDoneDays = new Set(doneToday ? [currentDay] : []);

  const progress = await getDailyProgress(userId, day);
  if (progress?.started_at) showStarted(progress.started_at);

  if (startBtn) {
    startBtn.onclick = () => handleStart(userId, day);
  }

  const profile = await getProfile(userId);
  if (profile?.started_at) {
    showGoalCard(profile.started_at);
  } else {
    // default: day 1 unlocked when objective not started yet
    applyWorkoutLocks(1, workoutDoneDays);
  }
  if (profile?.started_at) {
    applyWorkoutLocks(currentDay, workoutDoneDays);
  }
};

init();
window.addEventListener("pageshow", () => {
  init();
});

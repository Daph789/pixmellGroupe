const sb = window.sb;
const pointsEl = document.querySelector("#progress-points");
const streakEl = document.querySelector("#progress-streak");
const skippedEl = document.querySelector("#progress-skipped");
const hintEl = document.querySelector("#progress-hint");
const startedEl = document.querySelector("#progress-started");
const overlay = document.querySelector("#progress-overlay");
const overlayTitle = document.querySelector("#progress-overlay-title");
const overlayList = document.querySelector("#progress-overlay-list");
const overlayClose = document.querySelector("#progress-overlay-close");

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

const toLocalDateString = (d = new Date()) => d.toLocaleDateString("en-CA");

const formatDate = (dateStr) =>
  new Intl.DateTimeFormat(window.i18n?.getLang() === "en" ? "en-US" : "fr-FR", {
    dateStyle: "full",
  }).format(new Date(`${dateStr}T00:00:00`));

const openOverlay = (title, dates = []) => {
  if (overlayTitle) overlayTitle.textContent = title;
  if (overlayList) {
    overlayList.innerHTML = "";
    if (!dates.length) {
      const empty = document.createElement("p");
      empty.textContent =
        window.i18n?.t("app.progress.none") || "Aucune date pour le moment.";
      overlayList.appendChild(empty);
    } else {
      dates.forEach((d) => {
        const item = document.createElement("div");
        item.className = "progress-list-item";
        item.textContent = formatDate(d);
        overlayList.appendChild(item);
      });
    }
  }
  if (overlay) overlay.classList.add("is-open");
};

const init = async () => {
  const session = await ensureSession();
  if (!session) return;
  const userId = session.user.id;

  const { data: profile } = await sb.from("profiles").select("*").eq("user_id", userId).single();
  const { data: points } = await sb.from("points").select("*").eq("user_id", userId).maybeSingle();
  const { data: progress } = await sb.from("daily_progress").select("day").eq("user_id", userId);

  const todayStr = toLocalDateString();
  const startStr = profile?.started_at ? toLocalDateString(new Date(profile.started_at)) : null;

  if (startedEl) {
    startedEl.textContent = startStr
      ? (window.i18n?.t("app.progress.startedAt", { date: formatDate(startStr) }) ||
          `Objectif commencé le ${formatDate(startStr)}.`)
      : (window.i18n?.t("app.progress.notStarted") || "Objectif non démarré.");
  }

  const progressSet = new Set((progress || []).map((row) => row.day));

  let skippedDates = [];
  let streakDates = [];

  if (startStr) {
    const startDate = new Date(`${startStr}T00:00:00`);
    const todayDate = new Date(`${todayStr}T00:00:00`);
    const yesterday = new Date(todayDate);
    yesterday.setDate(yesterday.getDate() - 1);

    for (let d = new Date(startDate); d <= yesterday; d.setDate(d.getDate() + 1)) {
      const ds = toLocalDateString(d);
      if (!progressSet.has(ds)) skippedDates.push(ds);
    }

    const hasToday = progressSet.has(todayStr);
    let cursor = hasToday ? new Date(todayDate) : new Date(yesterday);
    while (cursor >= startDate) {
      const ds = toLocalDateString(cursor);
      if (progressSet.has(ds)) {
        streakDates.push(ds);
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
  }

  if (pointsEl) pointsEl.textContent = `${points?.points || 0}`;
  if (streakEl) streakEl.textContent = `${streakDates.length}`;
  if (skippedEl) skippedEl.textContent = `${skippedDates.length}`;
  if (hintEl) {
    hintEl.textContent =
      window.i18n?.t("app.progress.hint") ||
      "Les jours sautés restent enregistrés même si tu rattrapes plus tard.";
  }

  document.querySelectorAll(".detail-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.detail;
      if (type === "streak") {
        openOverlay(
          window.i18n?.t("app.progress.streakDetails") || "Jours consécutifs",
          streakDates
        );
      } else {
        openOverlay(
          window.i18n?.t("app.progress.skippedDetails") || "Jours sautés",
          skippedDates
        );
      }
    });
  });

  if (overlayClose) {
    overlayClose.addEventListener("click", () => {
      if (overlay) overlay.classList.remove("is-open");
    });
  }
};

init();

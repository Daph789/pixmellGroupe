(() => {
  const dict = {
    fr: {
      "lang.choose": "Choisis ta langue",
      "lang.fr": "Français",
      "lang.en": "Anglais",
      "lang.change": "Changer la langue",
      "app.home.title": "Repas du jour",
      "app.home.rank": "Voir le classement",
      "app.home.age": "Âge",
      "app.home.weight": "Poids",
      "app.home.points": "Points",
      "app.home.cardMeal": "Repas du jour",
      "app.home.cardMealText": "Plan nutritionnel personnalisé.",
      "app.home.cardWorkout": "Séance du jour",
      "app.home.cardWorkoutText": "Guidée + check des séries.",
      "app.home.cardProgress": "Voir mes progrès",
      "app.home.cardProgressText": "Photos + niveaux + stats.",
      "app.home.toWorkout": "Aller à la séance",
      "app.goal.started": "Objectif démarré",
      "app.goal.startedText": "Vous avez commencé votre objectif le {date}. Les jours sont comptés pour atteindre votre objectif.",
      "app.goal.day": "Jour {day}",
      "app.start.message":
        "Le petit déjeuner est prévu le matin. En cliquant sur “Commencer”, tu lances ton objectif et les jours sont comptés.",
      "app.start.confirmed": "Départ confirmé.",
      "app.start.startedAt": "Commencé le {date}",
      "app.start.cta": "Commencer",
      "app.meal.today": "Repas du jour",
      "app.meal.prep": "Faire la préparation",
      "app.meal.available": "Petits déjeuners disponibles",
      "app.meal.availableHint":
        "Le petit déjeuner du jour est débloqué. Les autres se débloquent les jours suivants.",
      "app.meal.lockedMorning": "Vous devez attendre le matin.",
      "app.meal.lockedDays": "Veuillez attendre {days} jour(s).",
      "app.meal.needStart": "Clique d'abord sur “Commencer” pour lancer l'objectif.",
      "app.overlay.needStart": "Tu dois d’abord cliquer sur “Commencer”.",
      "app.overlay.waitMorning":
        "Le petit déjeuner est disponible jusqu'à 11h30. Reviens demain matin ({date}).",
      "app.overlay.ok": "OK",
      "app.workout.title": "Séance du jour",
      "app.workout.toMeal": "Aller aux repas",
      "app.workout.plan": "Plan hebdomadaire",
      "app.workout.start": "Commencer la séance du jour",
      "app.workout.today": "Aujourd’hui",
      "app.login.title": "Connexion",
      "app.login.subtitle": "Connecte-toi pour retrouver ton profil sur tous tes appareils.",
      "app.login.email": "Email",
      "app.login.password": "Mot de passe",
      "app.login.cta": "Se connecter",
      "app.login.signup": "Créer un compte",
      "app.signup.title": "Inscription",
      "app.signup.subtitle": "Crée ton compte pour synchroniser tes données sur tous tes appareils.",
      "app.signup.passwordConfirm": "Confirmer le mot de passe",
      "app.signup.cta": "Créer un compte",
      "app.signup.login": "Se connecter",
      "app.signup.confirmTitle": "Vérifie ta boîte mail",
      "app.signup.confirmText":
        "Un email de confirmation a été envoyé. Clique sur le lien pour activer ton compte.",
      "app.signup.confirmCta": "Aller à la connexion",
      "app.recipe.title": "Recette",
      "app.recipe.prepDone": "Préparation terminée",
      "app.recipe.done": "Fait",
      "app.recipe.prepTitle": "Préparation",
      "app.recipe.done": "Fait",
      "app.recipe.confirmTitle": "Avez-vous terminé de faire votre petit déj ?",
      "app.recipe.confirmYes": "Oui",
      "app.recipe.confirmNo": "Non",
      "app.recipe.points": "+5 points",
      "app.recipe.pointsSub": "Bien joué, continue comme ça !",
      "macro.calories": "Calories",
      "macro.protein": "Protéines",
      "macro.carbs": "Glucides",
      "macro.fat": "Lipides",
    },
    en: {
      "lang.choose": "Choose your language",
      "lang.fr": "French",
      "lang.en": "English",
      "lang.change": "Change language",
      "app.home.title": "Meal of the day",
      "app.home.rank": "See rankings",
      "app.home.age": "Age",
      "app.home.weight": "Weight",
      "app.home.points": "Points",
      "app.home.cardMeal": "Meal of the day",
      "app.home.cardMealText": "Personalized nutrition plan.",
      "app.home.cardWorkout": "Workout of the day",
      "app.home.cardWorkoutText": "Guided + set tracking.",
      "app.home.cardProgress": "See my progress",
      "app.home.cardProgressText": "Photos + levels + stats.",
      "app.home.toWorkout": "Go to workout",
      "app.goal.started": "Goal started",
      "app.goal.startedText": "You started your goal on {date}. Days are counted to reach your goal.",
      "app.goal.day": "Day {day}",
      "app.start.message":
        "Breakfast is for the morning. By clicking “Start”, you begin your goal and days are counted.",
      "app.start.confirmed": "Start confirmed.",
      "app.start.startedAt": "Started on {date}",
      "app.start.cta": "Start",
      "app.meal.today": "Meal of the day",
      "app.meal.prep": "Start preparation",
      "app.meal.available": "Available breakfasts",
      "app.meal.availableHint": "Today’s breakfast is unlocked. Others unlock on the next days.",
      "app.meal.lockedMorning": "You must wait for the morning.",
      "app.meal.lockedDays": "Please wait {days} day(s).",
      "app.meal.needStart": "Click “Start” first to begin your goal.",
      "app.overlay.needStart": "You must click “Start” first.",
      "app.overlay.waitMorning":
        "Breakfast is available until 11:30. Come back tomorrow morning ({date}).",
      "app.overlay.ok": "OK",
      "app.workout.title": "Workout of the day",
      "app.workout.toMeal": "Go to meals",
      "app.workout.plan": "Weekly plan",
      "app.workout.start": "Start today’s workout",
      "app.workout.today": "Today",
      "app.login.title": "Login",
      "app.login.subtitle": "Log in to access your profile on all devices.",
      "app.login.email": "Email",
      "app.login.password": "Password",
      "app.login.cta": "Log in",
      "app.login.signup": "Create account",
      "app.signup.title": "Sign up",
      "app.signup.subtitle": "Create an account to sync your data across devices.",
      "app.signup.passwordConfirm": "Confirm password",
      "app.signup.cta": "Create account",
      "app.signup.login": "Log in",
      "app.signup.confirmTitle": "Check your inbox",
      "app.signup.confirmText":
        "A confirmation email has been sent. Click the link to activate your account.",
      "app.signup.confirmCta": "Go to login",
      "app.recipe.title": "Recipe",
      "app.recipe.prepDone": "Preparation done",
      "app.recipe.done": "Done",
      "app.recipe.prepTitle": "Preparation",
      "app.recipe.done": "Done",
      "app.recipe.confirmTitle": "Have you finished your breakfast?",
      "app.recipe.confirmYes": "Yes",
      "app.recipe.confirmNo": "No",
      "app.recipe.points": "+5 points",
      "app.recipe.pointsSub": "Great job, keep it up!",
      "macro.calories": "Calories",
      "macro.protein": "Protein",
      "macro.carbs": "Carbs",
      "macro.fat": "Fat",
    },
  };

  const getLang = () => localStorage.getItem("steylab_lang") || "fr";
  const setLang = (lang) => localStorage.setItem("steylab_lang", lang);

  const t = (key, vars = {}) => {
    const lang = getLang();
    const str = dict[lang]?.[key] ?? dict.fr[key] ?? key;
    return Object.keys(vars).reduce(
      (acc, k) => acc.replace(new RegExp(`\\{${k}\\}`, "g"), vars[k]),
      str
    );
  };

  const applyI18n = () => {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      el.textContent = t(key);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      el.setAttribute("placeholder", t(key));
    });
  };

  const initLanguageUI = (options = {}) => {
    const { showPrompt = false } = options;
    const toggleBtn = document.querySelector("#lang-toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const next = getLang() === "fr" ? "en" : "fr";
        setLang(next);
        applyI18n();
      });
    }

    const modal = document.querySelector("#lang-modal");
    const frBtn = document.querySelector("#lang-fr");
    const enBtn = document.querySelector("#lang-en");

    if (showPrompt && !localStorage.getItem("steylab_lang") && modal) {
      modal.classList.add("is-visible");
    }
    if (frBtn) {
      frBtn.addEventListener("click", () => {
        setLang("fr");
        applyI18n();
        if (modal) modal.classList.remove("is-visible");
      });
    }
    if (enBtn) {
      enBtn.addEventListener("click", () => {
        setLang("en");
        applyI18n();
        if (modal) modal.classList.remove("is-visible");
      });
    }

    applyI18n();
  };

  window.i18n = { t, applyI18n, initLanguageUI, getLang };
})();

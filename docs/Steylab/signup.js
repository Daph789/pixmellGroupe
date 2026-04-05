const SUPABASE_URL = "https://jdudwikpzziitvinotwu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkdWR3aWtwenppaXR2aW5vdHd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjc4MzAsImV4cCI6MjA5MDkwMzgzMH0.KjBki03APLglWYYeFiZVOXJZBr-gxR7CWCKnE-JdhRY";

const supabase = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const signupSection = document.querySelector("#signup-section");
const confirmSection = document.querySelector("#confirm-section");
const form = document.querySelector("#signup-form");
const status = document.querySelector("#signup-status");

const getRedirectUrl = () => {
  const url = new URL(window.location.href);
  url.pathname = url.pathname.replace(/signup\.html.*$/, "login.html");
  return url.toString();
};

const checkSession = async () => {
  if (!supabase) return;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) {
    window.location.href = "./app.html";
  }
};

const showConfirm = () => {
  if (signupSection) signupSection.hidden = true;
  if (confirmSection) confirmSection.hidden = false;
};

if (form && supabase) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "";
    const formData = new FormData(form);
    const email = formData.get("email");
    const password = formData.get("password");
    const passwordConfirm = formData.get("passwordConfirm");
    if (password !== passwordConfirm) {
      status.textContent = "Les mots de passe ne correspondent pas.";
      return;
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getRedirectUrl(),
      },
    });
    if (error) {
      status.textContent = error.message;
      return;
    }
    showConfirm();
  });
}

checkSession();

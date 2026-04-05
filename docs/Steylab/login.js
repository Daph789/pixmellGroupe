const SUPABASE_URL = "https://jdudwikpzziitvinotwu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkdWR3aWtwenppaXR2aW5vdHd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjc4MzAsImV4cCI6MjA5MDkwMzgzMH0.KjBki03APLglWYYeFiZVOXJZBr-gxR7CWCKnE-JdhRY";

const supabase = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.querySelector("#login-form");
const status = document.querySelector("#login-status");

const checkSession = async () => {
  if (!supabase) return;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) {
    window.location.href = "./app.html";
  }
};

if (form && supabase) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "";
    const formData = new FormData(form);
    const email = formData.get("email");
    const password = formData.get("password");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      status.textContent = error.message;
      return;
    }
    window.location.href = "./app.html";
  });
}

checkSession();

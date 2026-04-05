const SUPABASE_URL = "https://jdudwikpzziitvinotwu.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkdWR3aWtwenppaXR2aW5vdHd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjc4MzAsImV4cCI6MjA5MDkwMzgzMH0.KjBki03APLglWYYeFiZVOXJZBr-gxR7CWCKnE-JdhRY";

window.sb = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Promote a signed-in user to staff/admin after first OAuth login.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... pnpm exec tsx scripts/promote-staff.ts you@email.com admin
 */
import { createClient } from "@supabase/supabase-js";

const email = process.argv[2];
const role = process.argv[3] === "staff" ? "staff" : "admin";
const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!email || !url || !key) {
  console.error("Need email arg + SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data, error } = await supabase
  .from("profiles")
  .update({ role, updated_at: new Date().toISOString() })
  .eq("email", email)
  .select("id,email,role")
  .maybeSingle();

if (error) {
  console.error(error.message);
  process.exit(1);
}

if (!data) {
  console.error("No profile with that email. Sign in once first.");
  process.exit(1);
}

console.log("Updated", data);

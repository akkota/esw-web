import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { isStaff } from "@/lib/types";

export async function requireStaff(): Promise<Profile> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  const { data } = await supabase
    .from("profiles")
    .select("id,display_name,email,discord_user_id,school,role")
    .eq("id", user.id)
    .maybeSingle();
  if (!data || !isStaff(data.role)) {
    redirect("/");
  }
  return data as Profile;
}

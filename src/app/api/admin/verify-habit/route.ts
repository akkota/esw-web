import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isStaff } from "@/lib/types";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!isStaff(profile?.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as {
    logId?: string;
    status?: "verified" | "rejected";
  };

  if (!body.logId || (body.status !== "verified" && body.status !== "rejected")) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { error } = await supabase
    .from("habit_logs")
    .update({
      status: body.status,
      verified_by: "web_staff",
      verified_at: new Date().toISOString(),
      verified_by_user_id: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.logId)
    .eq("status", "pending");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

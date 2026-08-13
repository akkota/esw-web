import Link from "next/link";
import { redirect } from "next/navigation";
import { HabitLogForm } from "@/components/HabitLogForm";
import { createClient } from "@/lib/supabase/server";

export default async function ChallengesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/challenges");
  }

  const now = new Date().toISOString();
  const [{ data: window }, { data: actions }, { data: myLogs }] = await Promise.all([
    supabase
      .from("habit_windows")
      .select("id,title,starts_at,ends_at")
      .eq("active", true)
      .lte("starts_at", now)
      .gte("ends_at", now)
      .order("starts_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("habit_actions")
      .select("id,name,description")
      .eq("active", true)
      .order("sort_order"),
    supabase
      .from("habit_logs")
      .select("id,status,created_at,habit_actions(name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="font-display text-4xl text-esw-forest">Sustainability challenges</h1>
        <p className="max-w-2xl text-esw-ink/70">
          Log a real action with a photo. Staff approve on this site or in Discord — either path
          counts.
        </p>
        <Link href="/challenges/leaderboard" className="text-sm text-esw-leaf hover:text-esw-forest">
          View leaderboard →
        </Link>
      </div>

      {!window ? (
        <p className="rounded-2xl border border-dashed border-esw-forest/20 p-6 text-esw-ink/60">
          No active challenge window right now. Check back soon.
        </p>
      ) : (
        <>
          <div className="rounded-2xl border border-esw-forest/10 bg-white/50 p-5">
            <p className="text-xs uppercase tracking-wide text-esw-leaf">Active window</p>
            <h2 className="font-display text-2xl text-esw-forest">{window.title}</h2>
          </div>
          <HabitLogForm
            windowId={window.id}
            actions={(actions ?? []).map((a) => ({
              id: a.id,
              name: a.name,
              description: a.description,
            }))}
          />
        </>
      )}

      <section className="space-y-3">
        <h2 className="font-display text-2xl text-esw-forest">Your recent logs</h2>
        {!myLogs?.length ? (
          <p className="text-esw-ink/60">No logs yet.</p>
        ) : (
          <ul className="space-y-2">
            {myLogs.map((log) => {
              const action = Array.isArray(log.habit_actions)
                ? log.habit_actions[0]
                : log.habit_actions;
              return (
                <li
                  key={log.id}
                  className="flex items-center justify-between rounded-xl border border-esw-forest/10 bg-white/40 px-4 py-3 text-sm"
                >
                  <span>{(action as { name?: string } | null)?.name ?? "Action"}</span>
                  <span className="capitalize text-esw-leaf">{log.status}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

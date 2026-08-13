import { createClient } from "@/lib/supabase/server";

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: logs } = await supabase
    .from("habit_logs")
    .select("user_id,profiles(display_name,school)")
    .eq("status", "verified");

  const byUser = new Map<string, { name: string; school: string; count: number }>();
  const bySchool = new Map<string, number>();

  for (const log of logs ?? []) {
    const profile = Array.isArray(log.profiles) ? log.profiles[0] : log.profiles;
    const name = (profile as { display_name?: string | null } | null)?.display_name ?? "Member";
    const school = (profile as { school?: string | null } | null)?.school ?? "Unspecified";
    const current = byUser.get(log.user_id) ?? { name, school, count: 0 };
    current.count += 1;
    byUser.set(log.user_id, current);
    bySchool.set(school, (bySchool.get(school) ?? 0) + 1);
  }

  const users = [...byUser.values()].sort((a, b) => b.count - a.count).slice(0, 20);
  const schools = [...bySchool.entries()]
    .map(([school, count]) => ({ school, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="font-display text-4xl text-esw-forest">Leaderboard</h1>
        <p className="text-esw-ink/70">Verified actions only.</p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <section>
          <h2 className="font-display mb-3 text-2xl text-esw-forest">People</h2>
          <ol className="space-y-2">
            {users.length === 0 ? (
              <li className="text-esw-ink/60">No verified logs yet.</li>
            ) : (
              users.map((row, index) => (
                <li
                  key={`${row.name}-${index}`}
                  className="flex justify-between rounded-xl border border-esw-forest/10 bg-white/40 px-4 py-2"
                >
                  <span>
                    {index + 1}. {row.name}
                  </span>
                  <span className="text-esw-leaf">{row.count}</span>
                </li>
              ))
            )}
          </ol>
        </section>
        <section>
          <h2 className="font-display mb-3 text-2xl text-esw-forest">Schools</h2>
          <ol className="space-y-2">
            {schools.length === 0 ? (
              <li className="text-esw-ink/60">No school data yet.</li>
            ) : (
              schools.map((row, index) => (
                <li
                  key={row.school}
                  className="flex justify-between rounded-xl border border-esw-forest/10 bg-white/40 px-4 py-2"
                >
                  <span>
                    {index + 1}. {row.school}
                  </span>
                  <span className="text-esw-leaf">{row.count}</span>
                </li>
              ))
            )}
          </ol>
        </section>
      </div>
    </div>
  );
}

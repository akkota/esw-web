import Link from "next/link";
import { requireStaff } from "@/lib/staff";
import { createServiceClient } from "@/lib/supabase/admin";

export default async function AdminBotPage() {
  await requireStaff();

  let embeds: { message_id: string; channel_id: string; title: string | null }[] = [];
  let panels: { message_id: string; channel_id: string; title: string | null }[] = [];
  let ranks: { name: string; required_level: number }[] = [];
  let error: string | null = null;

  try {
    const admin = createServiceClient();
    const [embedRes, panelRes, rankRes] = await Promise.all([
      admin
        .from("bot_embeds")
        .select("message_id,channel_id,title")
        .order("created_at", { ascending: false })
        .limit(20),
      admin
        .from("reaction_role_messages")
        .select("message_id,channel_id,title")
        .eq("active", true)
        .limit(20),
      admin
        .from("level_roles")
        .select("name,required_level")
        .order("required_level")
        .limit(50),
    ]);
    embeds = embedRes.data ?? [];
    panels = panelRes.data ?? [];
    ranks = rankRes.data ?? [];
    if (embedRes.error || panelRes.error || rankRes.error) {
      error =
        embedRes.error?.message ||
        panelRes.error?.message ||
        rankRes.error?.message ||
        "Lookup failed";
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Service role not configured";
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-4xl text-esw-forest">Bot overview</h1>
        <Link href="/admin" className="text-sm text-esw-leaf">
          ← Admin
        </Link>
      </div>
      <p className="text-sm text-esw-ink/70">
        Read-only. Edit embeds in Discord with <code>/embed edit</code>, reaction roles with{" "}
        <code>/reaction-role</code>, ranks with <code>/level-role</code>.
      </p>
      {error ? (
        <p className="rounded-xl border border-esw-clay/40 bg-white/50 p-4 text-sm text-esw-ink/70">
          {error}
        </p>
      ) : null}

      <section className="space-y-3">
        <h2 className="font-display text-2xl text-esw-forest">Recent embeds</h2>
        <ul className="space-y-2 text-sm">
          {embeds.length === 0 ? (
            <li className="text-esw-ink/60">None</li>
          ) : (
            embeds.map((row) => (
              <li key={row.message_id} className="rounded-xl border border-esw-forest/10 px-4 py-2">
                {row.title || "(untitled)"} · channel {row.channel_id} · msg{" "}
                <code>{row.message_id}</code>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl text-esw-forest">Reaction role panels</h2>
        <ul className="space-y-2 text-sm">
          {panels.length === 0 ? (
            <li className="text-esw-ink/60">None</li>
          ) : (
            panels.map((row) => (
              <li key={row.message_id} className="rounded-xl border border-esw-forest/10 px-4 py-2">
                {row.title || "Panel"} · <code>{row.message_id}</code>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl text-esw-forest">Level ranks</h2>
        <ul className="space-y-2 text-sm">
          {ranks.length === 0 ? (
            <li className="text-esw-ink/60">None configured</li>
          ) : (
            ranks.map((row) => (
              <li
                key={`${row.name}-${row.required_level}`}
                className="rounded-xl border border-esw-forest/10 px-4 py-2"
              >
                {row.name} — level {row.required_level}
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

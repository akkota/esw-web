import Link from "next/link";
import { requireStaff } from "@/lib/staff";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { VerifyButtons } from "@/components/VerifyButtons";

export default async function AdminChallengesPage() {
  await requireStaff();
  const supabase = await createClient();
  const { data: pending } = await supabase
    .from("habit_logs")
    .select(
      "id,note,image_path,created_at,profiles(display_name,email),habit_actions(name)",
    )
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  let service: ReturnType<typeof createServiceClient> | null = null;
  try {
    service = createServiceClient();
  } catch {
    service = null;
  }

  const rows = await Promise.all(
    (pending ?? []).map(async (log) => {
      let imageUrl: string | null = null;
      if (service) {
        const { data } = await service.storage
          .from("habit-proofs")
          .createSignedUrl(log.image_path, 3600);
        imageUrl = data?.signedUrl ?? null;
      }
      const profile = Array.isArray(log.profiles) ? log.profiles[0] : log.profiles;
      const action = Array.isArray(log.habit_actions) ? log.habit_actions[0] : log.habit_actions;
      return {
        id: log.id,
        note: log.note,
        created_at: log.created_at,
        imageUrl,
        name: (profile as { display_name?: string | null } | null)?.display_name ?? "Member",
        action: (action as { name?: string } | null)?.name ?? "Action",
      };
    }),
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-4xl text-esw-forest">Verification queue</h1>
        <Link href="/admin" className="text-sm text-esw-leaf">
          ← Admin
        </Link>
      </div>

      {!rows.length ? (
        <p className="text-esw-ink/60">Queue is empty.</p>
      ) : (
        <ul className="space-y-6">
          {rows.map((row) => (
            <li
              key={row.id}
              className="rounded-2xl border border-esw-forest/10 bg-white/60 p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                {row.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={row.imageUrl}
                    alt="Habit proof"
                    className="h-40 w-full rounded-xl object-cover sm:w-56"
                  />
                ) : (
                  <div className="flex h-40 w-full items-center justify-center rounded-xl bg-esw-mist text-sm text-esw-ink/50 sm:w-56">
                    Image unavailable
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <p className="font-display text-xl text-esw-forest">{row.action}</p>
                  <p className="text-sm text-esw-ink/70">{row.name}</p>
                  {row.note ? <p className="text-sm">{row.note}</p> : null}
                  <p className="text-xs text-esw-ink/50">
                    {new Date(row.created_at).toLocaleString()}
                  </p>
                  <VerifyButtons logId={row.id} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

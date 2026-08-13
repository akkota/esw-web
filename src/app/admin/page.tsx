import Link from "next/link";
import { requireStaff } from "@/lib/staff";

export default async function AdminHomePage() {
  await requireStaff();

  return (
    <div className="space-y-8">
      <h1 className="font-display text-4xl text-esw-forest">Staff hub</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            href: "/admin/challenges",
            title: "Challenge queue",
            body: "Approve or reject photo submissions.",
          },
          {
            href: "/admin/resources",
            title: "Resources",
            body: "Edit student resource pages.",
          },
          {
            href: "/admin/bot",
            title: "Bot overview",
            body: "Read-only look at embeds, reaction roles, and ranks.",
          },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-esw-forest/10 bg-white/50 p-5 hover:border-esw-moss"
          >
            <h2 className="font-display text-xl text-esw-forest">{card.title}</h2>
            <p className="mt-2 text-sm text-esw-ink/70">{card.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

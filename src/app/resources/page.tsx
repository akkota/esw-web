import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const labels: Record<string, string> = {
  budget: "Budget",
  sponsorship: "Sponsorship",
  career: "Career",
  discord: "Discord",
  other: "Other",
};

export default async function ResourcesPage() {
  const supabase = await createClient();
  const { data: pages } = await supabase
    .from("resource_pages")
    .select("slug,title,category,body")
    .eq("published", true)
    .order("title");

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-4xl text-esw-forest">Student resources</h1>
        <p className="max-w-2xl text-esw-ink/70">
          Practical guides for chapters — budgets, sponsors, and career prep. Kept short on purpose.
        </p>
      </div>

      {!pages?.length ? (
        <p className="rounded-2xl border border-dashed border-esw-forest/20 p-8 text-esw-ink/60">
          Resources will appear here after the database migration is applied.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {pages.map((page) => (
            <li key={page.slug}>
              <Link
                href={`/resources/${page.slug}`}
                className="block rounded-2xl border border-esw-forest/10 bg-white/50 p-5 hover:border-esw-moss"
              >
                <p className="text-xs uppercase tracking-wide text-esw-leaf">
                  {labels[page.category] ?? page.category}
                </p>
                <h2 className="font-display mt-1 text-xl text-esw-forest">{page.title}</h2>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

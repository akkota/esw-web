"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ResourceEditor({
  page,
}: {
  page: {
    id: string;
    slug: string;
    title: string;
    body: string;
    category: string;
    published: boolean;
  };
}) {
  const router = useRouter();
  const [title, setTitle] = useState(page.title);
  const [body, setBody] = useState(page.body);
  const [published, setPublished] = useState(page.published);
  const [status, setStatus] = useState<string | null>(null);

  async function save() {
    const supabase = createClient();
    const { error } = await supabase
      .from("resource_pages")
      .update({
        title,
        body,
        published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", page.id);
    setStatus(error ? error.message : "Saved.");
    router.refresh();
  }

  return (
    <div className="space-y-3 rounded-2xl border border-esw-forest/10 bg-white/60 p-5">
      <p className="text-xs uppercase tracking-wide text-esw-leaf">
        {page.category} · /resources/{page.slug}
      </p>
      <input
        className="w-full rounded-xl border border-esw-forest/20 px-3 py-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="min-h-48 w-full rounded-xl border border-esw-forest/20 px-3 py-2 font-mono text-sm"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        Published
      </label>
      <button
        type="button"
        onClick={() => void save()}
        className="rounded-full bg-esw-forest px-4 py-2 text-sm text-esw-sand"
      >
        Save
      </button>
      {status ? <p className="text-sm text-esw-leaf">{status}</p> : null}
    </div>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { renderMarkdownLite } from "@/lib/types";

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: page } = await supabase
    .from("resource_pages")
    .select("slug,title,body,published")
    .eq("slug", slug)
    .maybeSingle();

  if (!page || (!page.published && !(await isStaffUser(supabase)))) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <Link href="/resources" className="text-sm text-esw-leaf hover:text-esw-forest">
        ← Resources
      </Link>
      <h1 className="font-display text-4xl text-esw-forest">{page.title}</h1>
      <div
        className="prose-esw"
        dangerouslySetInnerHTML={{ __html: renderMarkdownLite(page.body) }}
      />
    </article>
  );
}

async function isStaffUser(
  supabase: Awaited<ReturnType<typeof createClient>>,
): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  return data?.role === "staff" || data?.role === "admin";
}

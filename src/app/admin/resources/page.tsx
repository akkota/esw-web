import Link from "next/link";
import { requireStaff } from "@/lib/staff";
import { createClient } from "@/lib/supabase/server";
import { ResourceEditor } from "@/components/ResourceEditor";

export default async function AdminResourcesPage() {
  await requireStaff();
  const supabase = await createClient();
  const { data: pages } = await supabase
    .from("resource_pages")
    .select("id,slug,title,body,category,published")
    .order("title");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-4xl text-esw-forest">Edit resources</h1>
        <Link href="/admin" className="text-sm text-esw-leaf">
          ← Admin
        </Link>
      </div>
      {!pages?.length ? (
        <p className="text-esw-ink/60">No resource pages yet. Apply the SQL migration first.</p>
      ) : (
        <div className="space-y-8">
          {pages.map((page) => (
            <ResourceEditor key={page.id} page={page} />
          ))}
        </div>
      )}
    </div>
  );
}

import Link from "next/link";

/** Public Discord join guide — hidden from nav until the chapter server is live. */
export default function DiscordGuidePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 py-8">
      <div className="space-y-3">
        <h1 className="font-display text-4xl text-esw-forest sm:text-5xl">Discord — coming soon</h1>
        <p className="text-lg text-esw-ink/70">
          The ESW Discord server isn&apos;t public yet. When it launches, this page will have a short
          join guide and invite.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/challenges"
          className="rounded-full bg-esw-forest px-6 py-3 text-esw-sand hover:bg-esw-leaf"
        >
          Habit challenges
        </Link>
        <Link href="/resources" className="rounded-full border border-esw-forest/30 px-6 py-3">
          Resources
        </Link>
        <Link href="/" className="px-6 py-3 text-esw-leaf hover:text-esw-forest">
          Home →
        </Link>
      </div>
    </div>
  );
}

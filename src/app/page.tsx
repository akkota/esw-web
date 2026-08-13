import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="flex min-h-[70vh] flex-col justify-center gap-6 py-8">
        <p className="text-sm uppercase tracking-[0.2em] text-esw-leaf">Engineers for a Sustainable World</p>
        <h1 className="font-display max-w-3xl text-5xl leading-tight text-esw-forest sm:text-6xl">
          Build with your chapter. Grow with the planet.
        </h1>
        <p className="max-w-xl text-lg text-esw-ink/75">
          Student resources, verified sustainability challenges, and a fast path into the ESW Discord —
          all in one place.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/discord"
            className="rounded-full bg-esw-forest px-5 py-3 text-esw-sand hover:bg-esw-leaf"
          >
            Join Discord (2 min)
          </Link>
          <Link
            href="/challenges"
            className="rounded-full border border-esw-forest/30 px-5 py-3 text-esw-forest hover:border-esw-forest"
          >
            Log a habit
          </Link>
          <Link
            href="/docs"
            className="rounded-full border border-esw-forest/30 px-5 py-3 text-esw-forest hover:border-esw-forest"
          >
            Bot docs
          </Link>
          <Link href="/resources" className="px-5 py-3 text-esw-leaf hover:text-esw-forest">
            Browse resources →
          </Link>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        {[
          {
            title: "Discord, simplified",
            body: "A five-step guide so new members are not lost in channels.",
            href: "/discord",
          },
          {
            title: "Bot docs",
            body: "Setup order, permissions, and how website habits sync with Discord.",
            href: "/docs",
          },
          {
            title: "Chapter resources",
            body: "Budget tracking, sponsorship outreach, and career prep that stays up to date.",
            href: "/resources",
          },
          {
            title: "Habit challenges",
            body: "Log sustainable actions with a photo. Staff verify on the web or in Discord.",
            href: "/challenges",
          },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-esw-forest/10 bg-white/50 p-6 transition hover:border-esw-moss"
          >
            <h2 className="font-display text-xl text-esw-forest">{card.title}</h2>
            <p className="mt-2 text-sm text-esw-ink/70">{card.body}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}

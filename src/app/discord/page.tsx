import Link from "next/link";

const steps = [
  {
    n: "1",
    title: "Join the server",
    body: "Tap Join Discord below. Accept the invite and open the ESW server.",
  },
  {
    n: "2",
    title: "Say hi / get roles",
    body: "Check #welcome (or the channel your chapter uses). Grab roles if a panel is posted.",
  },
  {
    n: "3",
    title: "Try two commands",
    body: "In any text channel type /rank and /xp. That shows your level and progress.",
  },
  {
    n: "4",
    title: "Ask when stuck",
    body: "Ping a chapter lead or HQ channel. Tickets will show up later for private help.",
  },
  {
    n: "5",
    title: "Log sustainability habits",
    body: "Come back here to log actions with a photo — staff verify on the site or in Discord.",
  },
];

export default function DiscordGuidePage() {
  const invite = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL ?? "https://discord.com";

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <div className="space-y-3">
        <h1 className="font-display text-4xl text-esw-forest sm:text-5xl">Discord in 2 minutes</h1>
        <p className="text-lg text-esw-ink/70">Five steps. No fluff.</p>
      </div>

      <ol className="space-y-6">
        {steps.map((step) => (
          <li key={step.n} className="flex gap-4">
            <span className="font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-esw-forest text-esw-sand">
              {step.n}
            </span>
            <div>
              <h2 className="text-xl text-esw-forest">{step.title}</h2>
              <p className="mt-1 text-esw-ink/70">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap gap-3 pt-2">
        <a
          href={invite}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-esw-forest px-6 py-3 text-esw-sand hover:bg-esw-leaf"
        >
          Join Discord
        </a>
        <Link href="/docs" className="rounded-full border border-esw-forest/30 px-6 py-3">
          Full bot docs
        </Link>
        <Link href="/challenges" className="px-6 py-3 text-esw-leaf hover:text-esw-forest">
          Challenges →
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";

function Cmd({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-esw-mist px-1.5 py-0.5 text-[0.9em] text-esw-forest">
      {children}
    </code>
  );
}

function Card({
  id,
  title,
  kicker,
  children,
}: {
  id: string;
  title: string;
  kicker?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 space-y-4 rounded-2xl border border-esw-forest/10 bg-white/55 p-5 sm:p-7"
    >
      {kicker ? (
        <p className="text-xs uppercase tracking-[0.16em] text-esw-leaf">{kicker}</p>
      ) : null}
      <h2 className="font-display text-2xl text-esw-forest sm:text-3xl">{title}</h2>
      <div className="space-y-4 text-esw-ink/80">{children}</div>
    </section>
  );
}

const toc = [
  { href: "#members", label: "Members" },
  { href: "#garden", label: "Garden" },
  { href: "#setup", label: "Staff setup" },
  { href: "#permissions", label: "Who can run what" },
  { href: "#staff", label: "Staff tools" },
  { href: "#habits", label: "Habits" },
  { href: "#commands", label: "Commands" },
];

export default function BotDocsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <header className="space-y-4 pb-8">
        <p className="text-sm uppercase tracking-[0.18em] text-esw-leaf">Gears bot</p>
        <h1 className="font-display text-4xl text-esw-forest sm:text-5xl">How to use the bot</h1>
        <p className="max-w-2xl text-lg text-esw-ink/70">
          Chat for XP, tend a garden, and (if you&apos;re staff) set the server up once.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href="#members"
            className="rounded-2xl border border-esw-forest/15 bg-white/60 p-5 hover:border-esw-moss"
          >
            <p className="text-xs uppercase tracking-[0.16em] text-esw-leaf">Members</p>
            <p className="mt-1 font-display text-xl text-esw-forest">Garden, XP, everyday commands</p>
          </a>
          <a
            href="#setup"
            className="rounded-2xl border border-esw-forest/15 bg-white/60 p-5 hover:border-esw-moss"
          >
            <p className="text-xs uppercase tracking-[0.16em] text-esw-leaf">Staff</p>
            <p className="mt-1 font-display text-xl text-esw-forest">Setup order, intents, habits</p>
          </a>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[11rem_minmax(0,1fr)]">
        <nav className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-2 hidden text-xs uppercase tracking-[0.16em] text-esw-leaf lg:block">
            On this page
          </p>
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {toc.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block rounded-full border border-esw-forest/15 px-3 py-1.5 text-sm text-esw-leaf hover:border-esw-forest hover:text-esw-forest lg:rounded-lg lg:border-0 lg:px-2"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-6">
          <Card id="members" kicker="Members" title="Start here">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["/rank", "Your garden card + level"],
                ["/xp", "Just the XP numbers"],
                ["/garden", "Plant, water, harvest, bag"],
              ].map(([cmd, blurb]) => (
                <div key={cmd} className="rounded-xl bg-esw-mist/70 px-4 py-3">
                  <Cmd>{cmd}</Cmd>
                  <p className="mt-1 text-sm">{blurb}</p>
                </div>
              ))}
            </div>
            <p>
              Chat in the server to earn XP (short cooldown). Level unlocks rank roles{" "}
              <em>and</em> garden plots. Other useful commands: <Cmd>/remind</Cmd>,{" "}
              <Cmd>/timezone</Cmd>, <Cmd>/project search</Cmd>, reaction-role buttons on staff
              panels.
            </p>
          </Card>

          <Card id="garden" kicker="Members" title="Garden &amp; levels">
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                Open <Cmd>/rank</Cmd> or <Cmd>/garden view</Cmd>.
              </li>
              <li>Plant a seed. Wait. Harvest into your bag. Use it for a timed chat-XP boost.</li>
              <li>
                Longer wait = stronger boost, up to a peak. Wait too long and it wilts (still
                usable, but weak). One boost at a time.
              </li>
            </ol>
            <p className="text-sm text-esw-ink/65">
              Water once per plant to speed growth. Fertilizer bumps quality.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="overflow-hidden rounded-xl border border-esw-forest/10">
                <p className="bg-esw-mist px-4 py-2 text-sm font-medium text-esw-forest">
                  Plots
                </p>
                <ul className="divide-y divide-esw-forest/10 px-4 py-1 text-sm">
                  {[
                    ["Level 1", "1 plot"],
                    ["5", "2 plots + watering can"],
                    ["10", "3 plots"],
                    ["20", "4 plots + fertilizer"],
                    ["35", "5 plots"],
                    ["50", "6 plots"],
                  ].map(([level, what]) => (
                    <li key={level} className="flex justify-between gap-3 py-2">
                      <span className="text-esw-ink/55">{level}</span>
                      <span>{what}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="overflow-hidden rounded-xl border border-esw-forest/10">
                <p className="bg-esw-mist px-4 py-2 text-sm font-medium text-esw-forest">
                  Seeds
                </p>
                <ul className="divide-y divide-esw-forest/10 px-4 py-1 text-sm">
                  {[
                    ["1", "Radish"],
                    ["3", "Lettuce"],
                    ["8", "Marigold"],
                    ["15", "Tomato"],
                    ["25", "Sunflower"],
                    ["40", "Pumpkin"],
                  ].map(([level, name]) => (
                    <li key={name} className="flex justify-between gap-3 py-2">
                      <span className="text-esw-ink/55">Lv {level}</span>
                      <span>{name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          <Card id="setup" kicker="Staff" title="Setup (once, in order)">
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                <Cmd>/set-admin-role</Cmd> — owner only.
              </li>
              <li>
                <Cmd>/set-srmod-role</Cmd> then <Cmd>/set-mod-role</Cmd>.
              </li>
              <li>
                <Cmd>/set-log-channel</Cmd>.
              </li>
              <li>
                Bot role <strong>above</strong> ranks and reaction roles. Needs Manage Roles.
              </li>
              <li>
                Optional: <Cmd>/level-role setup-defaults</Cmd>, <Cmd>/welcome set</Cmd>,{" "}
                <Cmd>/set-habit-channel</Cmd>.
              </li>
            </ol>
            <div className="rounded-xl border border-esw-forest/10 bg-esw-mist/50 px-4 py-3 text-sm">
              <p className="font-medium text-esw-forest">Discord Developer Portal</p>
              <p className="mt-1">
                Enable <strong>Server Members Intent</strong> (welcome) and{" "}
                <strong>Message Content Intent</strong> (autorespond + chat XP).
              </p>
            </div>
          </Card>

          <Card id="permissions" kicker="Staff" title="Who can run what">
            <ul className="space-y-2 text-sm">
              <li>
                <strong className="text-esw-forest">Everyone</strong> — garden, info, remind,
                timezone, projects
              </li>
              <li>
                <strong className="text-esw-forest">Mod+</strong> — purge, habit Approve/Reject
              </li>
              <li>
                <strong className="text-esw-forest">SrMod+</strong> — mute, kick, ban, give/set XP
              </li>
              <li>
                <strong className="text-esw-forest">Admin / owner</strong> — setup, welcome, repeat,
                embeds, level-role, habit channel
              </li>
            </ul>
            <p className="text-sm text-esw-ink/65">
              Discord permissions still apply. The bot cannot moderate anyone above it in the role
              list.
            </p>
          </Card>

          <Card id="staff" kicker="Staff" title="Staff tools">
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="font-medium text-esw-forest">Rank roles</dt>
                <dd>
                  <Cmd>/level-role setup-defaults</Cmd> or <Cmd>add</Cmd>. Chat XP /{" "}
                  <Cmd>/givexp</Cmd> / <Cmd>/setxp</Cmd> assign the highest qualifying role.
                </dd>
              </div>
              <div>
                <dt className="font-medium text-esw-forest">Welcome</dt>
                <dd>
                  <Cmd>/welcome set</Cmd> · templates <Cmd>{"{user}"}</Cmd>{" "}
                  <Cmd>{"{server}"}</Cmd> <Cmd>{"{memberCount}"}</Cmd> <Cmd>{"{boosts}"}</Cmd>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-esw-forest">Repeat / autorespond / embeds</dt>
                <dd>
                  <Cmd>/repeat</Cmd> (min 1m) · <Cmd>/autorespond</Cmd> · <Cmd>/embed create</Cmd>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-esw-forest">Reaction roles</dt>
                <dd>
                  <Cmd>/reaction-role create</Cmd> then <Cmd>add-option</Cmd> with the panel
                  message id.
                </dd>
              </div>
              <div>
                <dt className="font-medium text-esw-forest">Optional integrations</dt>
                <dd>
                  <Cmd>/set-email-channel</Cmd> · <Cmd>/set-calendar</Cmd> ·{" "}
                  <Cmd>/set-social-channel</Cmd> — no credentials, they stay quiet.
                </dd>
              </div>
            </dl>
          </Card>

          <Card id="habits" kicker="Staff + members" title="Website habits">
            <p>
              Log a photo on{" "}
              <Link href="/challenges" className="text-esw-leaf hover:underline">
                Challenges
              </Link>
              . Staff verify <strong>once</strong> — on this site or in Discord. Same log, first
              win.
            </p>
            <ol className="list-decimal space-y-1 pl-5 text-sm">
              <li>
                Staff: <Cmd>/set-habit-channel</Cmd>
              </li>
              <li>Member: sign in → log with photo → pending</li>
              <li>Mod+ Approve/Reject in Discord, or the site staff queue</li>
              <li>Leaderboards count verified logs only</li>
            </ol>
            <p className="text-sm text-esw-ink/65">
              Sign in with Discord so the bot can mention you on proof posts.
            </p>
          </Card>

          <Card id="commands" kicker="Reference" title="Command map">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Everyone", "/rank, /xp, /garden, /remind, /timezone, /define, /userinfo, /serverinfo, /roleinfo, /project search"],
                ["Mod+", "/purge + habit Approve/Reject"],
                ["SrMod+", "/mute, /kick, /ban, /givexp, /setxp"],
                ["Admin", "/set-*-role, /level-role, /welcome, /repeat, /autorespond, /embed, /reaction-role, /set-habit-channel"],
              ].map(([who, cmds]) => (
                <div key={who} className="rounded-xl border border-esw-forest/10 px-4 py-3">
                  <p className="text-sm font-medium text-esw-forest">{who}</p>
                  <p className="mt-1 text-sm text-esw-ink/70">{cmds}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-esw-ink/55">
              Not built: <Cmd>/warn</Cmd>, <Cmd>/suggest</Cmd>, <Cmd>/calculate</Cmd>.
            </p>
          </Card>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/challenges"
              className="rounded-full bg-esw-forest px-5 py-2.5 text-esw-sand hover:bg-esw-leaf"
            >
              Challenges
            </Link>
            <Link
              href="/resources"
              className="rounded-full border border-esw-forest/30 px-5 py-2.5 hover:border-esw-forest"
            >
              Resources
            </Link>
            <Link href="/" className="px-5 py-2.5 text-esw-leaf hover:text-esw-forest">
              Home →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

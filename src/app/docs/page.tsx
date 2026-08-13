import Link from "next/link";

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-3 border-t border-esw-forest/10 pt-10">
      <h2 className="font-display text-2xl text-esw-forest sm:text-3xl">{title}</h2>
      <div className="space-y-3 text-esw-ink/80">{children}</div>
    </section>
  );
}

function Cmd({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-esw-mist px-1.5 py-0.5 text-[0.9em] text-esw-forest">
      {children}
    </code>
  );
}

export default function BotDocsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.18em] text-esw-leaf">Gears bot</p>
        <h1 className="font-display text-4xl text-esw-forest sm:text-5xl">How to use the bot</h1>
        <p className="text-lg text-esw-ink/70">
          Short guide for members and staff. Setup order matters; website habits share one
          verification queue with Discord.
        </p>
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-esw-leaf">
          <a href="#start" className="hover:text-esw-forest">
            Start here
          </a>
          <a href="#permissions" className="hover:text-esw-forest">
            Permissions
          </a>
          <a href="#members" className="hover:text-esw-forest">
            Members
          </a>
          <a href="#staff-setup" className="hover:text-esw-forest">
            Staff setup
          </a>
          <a href="#habits" className="hover:text-esw-forest">
            Website habits
          </a>
          <a href="#commands" className="hover:text-esw-forest">
            Command map
          </a>
        </nav>
      </header>

      <Section id="start" title="1. Start here (do this once)">
        <p>
          Owner/Admin should run these <strong>in order</strong> in Discord. Later features assume
          staff roles and a log channel exist.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <Cmd>/set-admin-role</Cmd> — owner only. Pick or create the Admin role.
          </li>
          <li>
            <Cmd>/set-srmod-role</Cmd> then <Cmd>/set-mod-role</Cmd> — who can moderate.
          </li>
          <li>
            <Cmd>/set-log-channel</Cmd> — where mod/setup logs go.
          </li>
          <li>
            Put the <strong>bot role above</strong> any roles it must assign (ranks, reaction roles).
            Needs <strong>Manage Roles</strong> (Administrator is fine).
          </li>
          <li>
            Optional but recommended: <Cmd>/level-role setup-defaults</Cmd>,{" "}
            <Cmd>/welcome set</Cmd>, <Cmd>/set-habit-channel</Cmd>.
          </li>
        </ol>
        <p className="rounded-xl border border-esw-forest/10 bg-white/50 px-4 py-3 text-sm">
          New to Discord? Use the{" "}
          <Link href="/discord" className="text-esw-leaf underline-offset-2 hover:underline">
            2-minute join guide
          </Link>{" "}
          first, then come back here for staff setup.
        </p>
      </Section>

      <Section id="permissions" title="2. Who can run what">
        <p>Bot ranks (configured with the set-*-role commands):</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Everyone</strong> — info, XP view, remind, timezone, projects, …
          </li>
          <li>
            <strong>Mod+</strong> — purge, habit Approve/Reject buttons
          </li>
          <li>
            <strong>SrMod+</strong> — mute, kick, ban, give/set XP
          </li>
          <li>
            <strong>Admin / owner</strong> — setup, reaction roles, welcome, repeat, autorespond,
            embed, level-role, habit channel
          </li>
        </ul>
        <p className="text-sm text-esw-ink/65">
          Discord also enforces its own permissions (Ban Members, Manage Messages, etc.). The bot
          cannot moderate people above it in the role list.
        </p>
      </Section>

      <Section id="members" title="3. Everyday member stuff">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <Cmd>/xp</Cmd> — your XP and level. <Cmd>/rank</Cmd> — full ladder (Unlocked / Current /
            Locked).
          </li>
          <li>
            Chat awards XP automatically (with a short cooldown). Rank roles sync when you cross a
            threshold — only if staff ran <Cmd>/level-role</Cmd> first.
          </li>
          <li>
            <Cmd>/remind</Cmd>, <Cmd>/timestamp</Cmd>, <Cmd>/timezone</Cmd>, <Cmd>/define</Cmd>,{" "}
            <Cmd>/userinfo</Cmd>, <Cmd>/serverinfo</Cmd>, <Cmd>/roleinfo</Cmd>
          </li>
          <li>
            <Cmd>/project search</Cmd> — ESW Plan.io projects
          </li>
          <li>
            Reaction-role panels: click the buttons on the panel message (staff create those).
          </li>
        </ul>
      </Section>

      <Section id="staff-setup" title="4. Staff features (and what they need)">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-esw-forest">XP & ranks</h3>
            <p>
              <Cmd>/level-role setup-defaults</Cmd> or <Cmd>/level-role add</Cmd> → creates/links
              Discord roles at the bottom of the list. Then chat XP / <Cmd>/givexp</Cmd> /{" "}
              <Cmd>/setxp</Cmd> can assign them and post unlock notices.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-esw-forest">Welcome & boosts</h3>
            <p>
              <Cmd>/welcome set</Cmd> and <Cmd>/welcome boost</Cmd>. Templates:{" "}
              <Cmd>{"{user}"}</Cmd>, <Cmd>{"{server}"}</Cmd>, <Cmd>{"{memberCount}"}</Cmd>,{" "}
              <Cmd>{"{boosts}"}</Cmd>. Needs Server Members Intent enabled for the bot app.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-esw-forest">Repeat / autorespond / embeds</h3>
            <p>
              <Cmd>/repeat</Cmd> — posts on a timer (min 1m). <Cmd>/autorespond</Cmd> — replies to a
              phrase (needs Message Content Intent). <Cmd>/embed create</Cmd> / <Cmd>edit</Cmd> —
              bot-authored embeds only.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-esw-forest">Reaction roles</h3>
            <p>
              <Cmd>/reaction-role create</Cmd> then <Cmd>/reaction-role add-option</Cmd> with the
              panel message id. Bot must sit above those roles.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-esw-forest">Integrations (optional)</h3>
            <p>
              <Cmd>/set-email-channel</Cmd>, <Cmd>/set-calendar</Cmd>, <Cmd>/set-social-channel</Cmd> —
              only fire when credentials are in the bot&apos;s <Cmd>.env</Cmd>. No credentials = silent
              skip.
            </p>
          </div>
        </div>
      </Section>

      <Section id="habits" title="5. Website habits ↔ Discord (read this)">
        <p>
          Sustainability challenges live on this site. Discord is one place to{" "}
          <strong>verify</strong> them — not a second ledger.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Staff: <Cmd>/set-habit-channel</Cmd> to a verification channel.
          </li>
          <li>
            Member: sign in on the site → <Link href="/challenges" className="text-esw-leaf hover:underline">Challenges</Link> → log
            an action <strong>with a photo</strong> → status <em>pending</em>.
          </li>
          <li>
            Bot posts that proof in the habit channel with <strong>Approve / Reject</strong> (Mod+).
          </li>
          <li>
            <strong>Either</strong> Discord Approve/Reject <strong>or</strong> the site{" "}
            <Link href="/admin/challenges" className="text-esw-leaf hover:underline">
              staff queue
            </Link>{" "}
            updates the <em>same</em> log. First one wins; the other path then says “already
            resolved.”
          </li>
          <li>
            Leaderboards only count <strong>verified</strong> logs.
          </li>
        </ol>
        <p className="rounded-xl border border-esw-clay/40 bg-white/50 px-4 py-3 text-sm">
          Sign in with Discord on the site if you can — that links your Discord id so the bot can
          mention you on proof posts.
        </p>
      </Section>

      <Section id="commands" title="6. Command map">
        <div className="overflow-x-auto rounded-2xl border border-esw-forest/10 bg-white/40">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead className="border-b border-esw-forest/10 text-esw-forest">
              <tr>
                <th className="px-4 py-3 font-medium">Area</th>
                <th className="px-4 py-3 font-medium">Commands</th>
                <th className="px-4 py-3 font-medium">Who</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-esw-forest/5">
              {[
                ["Setup", "/set-admin-role, /set-srmod-role, /set-mod-role, /set-log-channel (+ unset-*)", "Owner / Admin"],
                ["Moderation", "/mute, /kick, /ban, /massban, /purge", "SrMod+ / Admin / Mod"],
                ["XP", "/xp, /rank, /givexp, /setxp, /level-role", "Everyone / SrMod+ / Admin"],
                ["Server ops", "/welcome, /repeat, /autorespond, /embed, /reaction-role", "Admin"],
                ["Habits bridge", "/set-habit-channel (+ Approve/Reject buttons)", "Admin / Mod+"],
                ["Utilities", "/remind, /timestamp, /timezone, /define, /userinfo, /serverinfo, /roleinfo", "Everyone"],
                ["ESW data", "/project search", "Everyone"],
                ["Channels", "/set-email-channel, /set-calendar, /set-social-channel", "Admin"],
              ].map(([area, cmds, who]) => (
                <tr key={area}>
                  <td className="px-4 py-3 align-top font-medium text-esw-forest">{area}</td>
                  <td className="px-4 py-3 align-top text-esw-ink/75">{cmds}</td>
                  <td className="px-4 py-3 align-top text-esw-ink/65">{who}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-esw-ink/60">
          Not built yet (ignore if you see them in old docs): <Cmd>/warn</Cmd>, <Cmd>/suggest</Cmd>,{" "}
          <Cmd>/calculate</Cmd>.
        </p>
      </Section>

      <div className="flex flex-wrap gap-3 border-t border-esw-forest/10 pt-8">
        <Link
          href="/discord"
          className="rounded-full bg-esw-forest px-5 py-2.5 text-esw-sand hover:bg-esw-leaf"
        >
          Join guide
        </Link>
        <Link
          href="/challenges"
          className="rounded-full border border-esw-forest/30 px-5 py-2.5 hover:border-esw-forest"
        >
          Challenges
        </Link>
        <Link href="/resources" className="px-5 py-2.5 text-esw-leaf hover:text-esw-forest">
          Resources →
        </Link>
      </div>
    </div>
  );
}

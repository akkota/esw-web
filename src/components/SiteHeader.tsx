import Link from "next/link";
import type { Profile } from "@/lib/types";
import { isStaff } from "@/lib/types";

export function SiteHeader({ profile }: { profile: Profile | null }) {
  const invite = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL ?? "#discord";

  return (
    <header className="border-b border-esw-forest/10 bg-esw-sand/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="font-display text-xl tracking-tight text-esw-forest sm:text-2xl">
          ESW
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-sm text-esw-ink/80">
          <Link href="/discord" className="hover:text-esw-forest">
            Discord
          </Link>
          <Link href="/docs" className="hover:text-esw-forest">
            Bot docs
          </Link>
          <Link href="/resources" className="hover:text-esw-forest">
            Resources
          </Link>
          <Link href="/challenges" className="hover:text-esw-forest">
            Challenges
          </Link>
          <Link href="/challenges/leaderboard" className="hover:text-esw-forest">
            Leaderboard
          </Link>
          {isStaff(profile?.role) ? (
            <Link href="/admin" className="hover:text-esw-forest">
              Admin
            </Link>
          ) : null}
          {profile ? (
            <form action="/auth/signout" method="post">
              <button type="submit" className="hover:text-esw-forest">
                Sign out
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-esw-forest px-3 py-1.5 text-esw-sand hover:bg-esw-leaf"
            >
              Sign in
            </Link>
          )}
          <a
            href={invite}
            className="hidden rounded-full border border-esw-forest/30 px-3 py-1.5 hover:border-esw-forest sm:inline"
            target="_blank"
            rel="noreferrer"
          >
            Join Discord
          </a>
        </nav>
      </div>
    </header>
  );
}

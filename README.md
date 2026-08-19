# ESW Hub

Student-facing website for **Engineers for a Sustainable World** — chapter resources and dual-verified sustainability habit challenges. Discord join UI is parked until the chapter server is live.

Lives next to the [Gears](../Gears) Discord bot and shares the same Supabase project.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Supabase Auth (Discord) + Postgres + Storage

## Quick start

```bash
pnpm install
cp .env.example .env.local
# fill Supabase URL/anon key + service role. Discord invite is optional (omit for invite-only).
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase setup

1. Apply SQL in order:
   - `supabase/schema.sql`
   - `supabase/rls.sql`
2. Create Storage bucket `habit-proofs` (private).
3. Auth → enable **Discord** provider (Google can wait).
4. Auth → URL Configuration (exact shapes — path mistakes cause localhost or 404):
   - **Site URL**: `https://esw-web.vercel.app` only (no `/auth/callback`, no trailing path)
   - **Redirect URLs** (one per line):
     - `http://localhost:3000/auth/callback`
     - `https://esw-web.vercel.app/auth/callback`
5. Discord Developer Portal → OAuth2 → Redirects must be the **Supabase** callback, not Vercel:
   `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
6. On Vercel env (optional): `NEXT_PUBLIC_SITE_URL=https://esw-web.vercel.app` (origin only). Redeploy after changing any `NEXT_PUBLIC_*` var.
7. Promote staff: `update profiles set role = 'admin' where email = 'you@example.com';`

## Discord bot bridge (Gears)

In the Gears bot repo:

1. Apply `habit_challenge_channel_id` on `guild_settings` (included in Gears schema / migration).
2. Run `/set-habit-channel` in Discord.
3. Pending website logs are posted with Approve/Reject buttons (Mod+).

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Home |
| `/discord` | 2-minute Discord guide |
| `/docs` | How to use the Gears bot (setup order + website habits) |
| `/resources` | Student guides |
| `/challenges` | Log habits (photo required) |
| `/challenges/leaderboard` | Verified tallies |
| `/admin/*` | Staff queue, resources, bot overview |

## Env

See `.env.example`.

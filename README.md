# ESW Hub

Student-facing website for **Engineers for a Sustainable World** — Discord onboarding, chapter resources, and dual-verified sustainability habit challenges.

Lives next to the [Gears](../Gears) Discord bot and shares the same Supabase project.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Supabase Auth (Discord + Google) + Postgres + Storage

## Quick start

```bash
pnpm install
cp .env.example .env.local
# fill Supabase URL/anon key, service role (server), Discord invite
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase setup

1. Apply SQL in order:
   - `supabase/schema.sql`
   - `supabase/rls.sql`
2. Create Storage bucket `habit-proofs` (private).
3. Auth → enable **Discord** and **Google** providers.
4. Add redirect URL: `http://localhost:3000/auth/callback` (and production URL later).
5. Promote staff: `update profiles set role = 'admin' where email = 'you@example.com';`

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

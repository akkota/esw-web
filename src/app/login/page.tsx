"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  async function signInWithDiscord() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="mx-auto max-w-md space-y-8 py-10">
      <div className="space-y-2 text-center">
        <h1 className="font-display text-4xl text-esw-forest">Sign in</h1>
        <p className="text-esw-ink/70">Continue with Discord. Google sign-in will be added later.</p>
      </div>
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => void signInWithDiscord()}
          className="rounded-full bg-[#5865F2] px-5 py-3 text-white hover:opacity-90"
        >
          Continue with Discord
        </button>
      </div>
    </div>
  );
}

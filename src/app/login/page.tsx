"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { authCallbackUrlFromOrigin, normalizeSiteOrigin } from "@/lib/siteUrl";

function resolveCallbackUrl() {
  // Always prefer the host the user is actually on (prod / preview / local).
  // NEXT_PUBLIC_SITE_URL is only a fallback if origin is somehow unavailable.
  const configured = normalizeSiteOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  const origin = window.location.origin || configured;
  if (!origin) {
    throw new Error("Could not determine site origin for OAuth redirect.");
  }
  return authCallbackUrlFromOrigin(origin);
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function signInWithDiscord() {
    setError(null);
    setPending(true);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
      if (!supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("localhost")) {
        setError(
          "NEXT_PUBLIC_SUPABASE_URL is missing or wrong in this deployment. It must be your Supabase project URL (https://….supabase.co), not the Vercel site URL.",
        );
        setPending(false);
        return;
      }

      const supabase = createClient();
      const redirectTo = resolveCallbackUrl();

      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (oauthError) {
        setError(oauthError.message);
        setPending(false);
        return;
      }

      if (!data.url) {
        setError("Discord sign-in did not return an authorize URL.");
        setPending(false);
        return;
      }

      // If this points at our own site under /auth/v1/..., Supabase URL env is wrong.
      const authorize = new URL(data.url);
      if (authorize.origin === window.location.origin) {
        setError(
          `OAuth URL incorrectly points at this site (${authorize.pathname}). Check NEXT_PUBLIC_SUPABASE_URL on Vercel — it must be https://YOUR_PROJECT.supabase.co.`,
        );
        setPending(false);
        return;
      }

      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
      setPending(false);
    }
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
          disabled={pending}
          onClick={() => void signInWithDiscord()}
          className="rounded-full bg-[#5865F2] px-5 py-3 text-white hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Redirecting…" : "Continue with Discord"}
        </button>
        {error ? (
          <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}
      </div>
      <p className="text-center text-xs text-esw-ink/50">
        After Discord, you should return to <code className="text-esw-ink/70">/auth/callback</code> on
        this site. In Supabase → Auth → URL Configuration, Site URL must be the site origin only
        (no <code className="text-esw-ink/70">/auth/callback</code>), and that callback URL must be
        listed under Redirect URLs.
      </p>
    </div>
  );
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { normalizeSiteOrigin } from "@/lib/siteUrl";

function siteOrigin(request: Request) {
  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";

  // Prefer the host that actually received the callback (correct for preview + prod).
  if (forwardedHost) {
    return `${forwardedProto.split(",")[0]?.trim() ?? "https"}://${forwardedHost.split(",")[0]?.trim()}`;
  }

  if (url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
    return url.origin;
  }

  return normalizeSiteOrigin(process.env.NEXT_PUBLIC_SITE_URL) ?? url.origin;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const nextRaw = searchParams.get("next") ?? "/";
  const next = nextRaw.startsWith("/") ? nextRaw : "/";
  const origin = siteOrigin(request);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}

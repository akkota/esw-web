/**
 * Public site origin for OAuth redirects.
 * Must be origin only — never include `/auth/callback` or other paths.
 */
export function normalizeSiteOrigin(raw: string | undefined | null): string | null {
  if (!raw?.trim()) {
    return null;
  }

  let value = raw.trim().replace(/\/$/, "");

  // Common misconfig: paste the callback URL into Site URL / NEXT_PUBLIC_SITE_URL
  if (value.endsWith("/auth/callback")) {
    value = value.slice(0, -"/auth/callback".length);
  }

  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    return url.origin;
  } catch {
    return null;
  }
}

export function authCallbackUrlFromOrigin(origin: string): string {
  return `${origin.replace(/\/$/, "")}/auth/callback`;
}

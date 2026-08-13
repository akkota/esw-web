import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ESW Hub",
  description: "Engineers for a Sustainable World — resources and sustainability challenges.",
};

async function loadProfile(): Promise<Profile | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return null;
    }
    const { data } = await supabase
      .from("profiles")
      .select("id,display_name,email,discord_user_id,school,role")
      .eq("id", user.id)
      .maybeSingle();
    return (data as Profile | null) ?? null;
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await loadProfile();

  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} font-sans antialiased`}>
        <SiteHeader profile={profile} />
        <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">{children}</main>
      </body>
    </html>
  );
}

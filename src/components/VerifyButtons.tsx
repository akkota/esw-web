"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function VerifyButtons({ logId }: { logId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function decide(status: "verified" | "rejected") {
    setBusy(true);
    await fetch("/api/admin/verify-habit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logId, status }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2 pt-2">
      <button
        type="button"
        disabled={busy}
        onClick={() => void decide("verified")}
        className="rounded-full bg-esw-forest px-4 py-2 text-sm text-esw-sand disabled:opacity-50"
      >
        Approve
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => void decide("rejected")}
        className="rounded-full border border-esw-forest/30 px-4 py-2 text-sm disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}

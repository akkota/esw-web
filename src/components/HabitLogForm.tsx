"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function HabitLogForm({
  windowId,
  actions,
}: {
  windowId: string;
  actions: { id: string; name: string; description: string | null }[];
}) {
  const [actionId, setActionId] = useState(actions[0]?.id ?? "");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!file || !actionId) {
      setStatus("Pick an action and attach a photo.");
      return;
    }

    setBusy(true);
    setStatus(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setStatus("Sign in required.");
      setBusy(false);
      return;
    }

    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("habit-proofs")
      .upload(path, file, { contentType: file.type, upsert: false });

    if (uploadError) {
      setStatus(`Upload failed: ${uploadError.message}`);
      setBusy(false);
      return;
    }

    const { error: insertError } = await supabase.from("habit_logs").insert({
      user_id: user.id,
      action_id: actionId,
      window_id: windowId,
      note: note.trim() || null,
      image_path: path,
      status: "pending",
    });

    if (insertError) {
      setStatus(`Could not save log: ${insertError.message}`);
      setBusy(false);
      return;
    }

    setNote("");
    setFile(null);
    setStatus("Submitted! Staff will verify on the site or in Discord.");
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-esw-forest/10 bg-white/60 p-6">
      <h2 className="font-display text-2xl text-esw-forest">Log an action</h2>
      <label className="block space-y-1 text-sm">
        <span>Action</span>
        <select
          className="w-full rounded-xl border border-esw-forest/20 bg-white px-3 py-2"
          value={actionId}
          onChange={(e) => setActionId(e.target.value)}
        >
          {actions.map((action) => (
            <option key={action.id} value={action.id}>
              {action.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block space-y-1 text-sm">
        <span>Note (optional)</span>
        <textarea
          className="w-full rounded-xl border border-esw-forest/20 bg-white px-3 py-2"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={500}
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span>Photo proof (required)</span>
        <input
          type="file"
          accept="image/*"
          className="w-full text-sm"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>
      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-esw-forest px-5 py-2.5 text-esw-sand hover:bg-esw-leaf disabled:opacity-60"
      >
        {busy ? "Submitting…" : "Submit for verification"}
      </button>
      {status ? <p className="text-sm text-esw-leaf">{status}</p> : null}
    </form>
  );
}

"use client";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = "admin@embrione.pes.edu";
const ADMIN_PASSWORD = "EmbrioneAdmin@2026";

type Member = {
  id: string; name: string; domain: string; position: string; srn: string;
  email: string; branch: string; semester: number; bio: string | null;
  photo_url: string; status: string;
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    try { setAuthed(sessionStorage.getItem("embrione_admin") === "1"); } catch {}
    setReady(true);
  }, []);

  const load = useCallback(async () => {
    const { data } = await supabase.from("members").select("*").order("created_at", { ascending: false });
    setMembers((data as Member[]) ?? []);
  }, []);

  useEffect(() => { if (authed) load(); }, [authed, load]);

  const login = () => {
    if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem("embrione_admin", "1");
      setAuthed(true); setError("");
    } else setError("Invalid email or password.");
  };
  const logout = () => { sessionStorage.removeItem("embrione_admin"); setAuthed(false); };

  const setStatus = async (id: string, status: "approved" | "rejected") => {
    await supabase.from("members").update({ status }).eq("id", id);
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this profile?")) return;
    await supabase.from("members").delete().eq("id", id);
    load();
  };

  if (!ready) return null;

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
        <div className="w-full max-w-sm space-y-3 rounded-2xl border border-white/10 bg-zinc-900 p-6">
          <h1 className="text-xl font-bold">Admin Login</h1>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
            className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()} placeholder="Password"
            className="w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm" />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button onClick={login} className="w-full rounded-lg bg-indigo-600 py-2 font-medium hover:bg-indigo-500">Log in</button>
        </div>
      </main>
    );
  }

  const pending = members.filter((m) => m.status === "pending");
  const approved = members.filter((m) => m.status === "approved").length;
  const stats = [["Total Submissions", members.length], ["Pending", pending.length], ["Approved", approved]];

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Moderation Dashboard</h1>
          <button onClick={logout} className="text-sm text-zinc-400 hover:text-white">Log out</button>
        </div>
        <div className="mb-8 grid grid-cols-3 gap-3">
          {stats.map(([label, n]) => (
            <div key={label as string} className="rounded-xl border border-white/10 bg-zinc-900 p-4 text-center">
              <p className="text-2xl font-bold">{n}</p>
              <p className="text-xs text-zinc-400">{label}</p>
            </div>
          ))}
        </div>
        <h2 className="mb-3 text-lg font-semibold">Pending</h2>
        {pending.length === 0 && <p className="text-sm text-zinc-500">Nothing waiting for review.</p>}
        <div className="space-y-3">
          {pending.map((m) => (
            <div key={m.id} className="flex flex-col gap-3 rounded-xl border border-white/10 bg-zinc-900 p-4 sm:flex-row sm:items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.photo_url} alt={m.name} className="h-16 w-16 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{m.name}</p>
                <p className="text-xs text-indigo-400">{m.position} · {m.domain}</p>
                <p className="text-xs text-zinc-400">{m.srn} · {m.branch} · Sem {m.semester}</p>
                <p className="line-clamp-2 text-xs text-zinc-300">{m.bio}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStatus(m.id, "approved")} className="rounded-lg bg-green-600 px-3 py-1.5 text-sm hover:bg-green-500">Approve</button>
                <button onClick={() => setStatus(m.id, "rejected")} className="rounded-lg bg-red-600 px-3 py-1.5 text-sm hover:bg-red-500">Reject</button>
                <button onClick={() => remove(m.id)} className="rounded-lg bg-zinc-700 px-3 py-1.5 text-sm hover:bg-zinc-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
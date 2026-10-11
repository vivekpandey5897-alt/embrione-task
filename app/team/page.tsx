"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import MemberCard from "@/components/MemberCard";

const DOMAINS = ["Web Development", "Design", "Logistics", "Operations", "Sponsorship", "Hospitality", "Social Media", "Event Management"];
const POSITIONS = ["Head", "Vice-Head", "Core Member", "Member"];

type Member = {
  id: string; name: string; domain: string; position: string;
  branch: string; semester: number; bio: string | null; photo_url: string;
};

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [domain, setDomain] = useState("");
  const [position, setPosition] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("members").select("*").eq("status", "approved")
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setMembers((data as Member[]) ?? []);
        setLoading(false);
      });
  }, []);

  const shown = members.filter(
    (m) => (!domain || m.domain === domain) && (!position || m.position === position)
  );

  const sel = "rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-indigo-500";

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">Meet The Team</h1>
        <p className="mt-1 text-sm text-zinc-400">The people behind The Embrione.</p>

        <div className="my-6 flex flex-wrap gap-3">
          <select value={domain} onChange={(e) => setDomain(e.target.value)} className={sel}>
            <option value="">All domains</option>
            {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={position} onChange={(e) => setPosition(e.target.value)} className={sel}>
            <option value="">All positions</option>
            {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {loading && <p className="text-zinc-500">Loading...</p>}
        {!loading && shown.length === 0 && <p className="text-zinc-500">No members found.</p>}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((m) => (
            <MemberCard
              key={m.id}
              data={{
                name: m.name, domain: m.domain, position: m.position,
                branch: m.branch, semester: String(m.semester),
                bio: m.bio ?? "", photo: m.photo_url,
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
"use client";
import { useState } from "react";
import MemberCard from "@/components/MemberCard";

const DOMAINS = ["Web Development", "Design", "Logistics", "Operations", "Sponsorship", "Hospitality", "Social Media", "Event Management"];
const POSITIONS = ["Head", "Vice-Head", "Core Member", "Member"];
const BRANCHES = ["CSE", "AIML", "ECE", "EEE", "ME", "Biotech", "Civil", "Other"];
const SEMS = ["1", "2", "3", "4", "5", "6", "7", "8"];
const field = "w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-indigo-500";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "", domain: "", position: "", srn: "", email: "",
    linkedin: "", github: "", branch: "", semester: "", bio: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const select = (name: string, label: string, options: string[]) => (
    <select name={name} value={form[name as keyof typeof form]} onChange={update} className={field}>
      <option value="">{label}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10 text-white">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold">Join The Embrione</h1>
          <input name="name" value={form.name} onChange={update} placeholder="Full name" className={field} />
          {select("domain", "Domain", DOMAINS)}
          {select("position", "Position", POSITIONS)}
          <input name="srn" value={form.srn} onChange={update} placeholder="SRN (PES1UG23CS001)" className={field} />
          <input name="email" value={form.email} onChange={update} placeholder="Email" className={field} />
          <input name="linkedin" value={form.linkedin} onChange={update} placeholder="LinkedIn URL" className={field} />
          <input name="github" value={form.github} onChange={update} placeholder="GitHub URL" className={field} />
          {select("branch", "Branch", BRANCHES)}
          {select("semester", "Semester", SEMS)}
          <textarea name="bio" value={form.bio} onChange={update} maxLength={200} rows={3}
            placeholder="Short bio (150-200 characters)" className={field} />
          <p className="text-right text-xs text-zinc-500">{form.bio.length}/200</p>
          <input type="file" accept=".png,.jpg,.jpeg" onChange={onFile} className="text-sm text-zinc-400" />
        </div>

        <div className="flex items-start justify-center md:sticky md:top-10">
          <MemberCard data={{ ...form, photo: preview }} />
        </div>
      </div>
    </main>
  );
}

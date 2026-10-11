"use client";
import { useState } from "react";
import MemberCard from "@/components/MemberCard";
import { supabase } from "@/lib/supabase";
import { convertToWebP } from "@/lib/webp";

const DOMAINS = ["Web Development", "Design", "Logistics", "Operations", "Sponsorship", "Hospitality", "Social Media", "Event Management"];
const POSITIONS = ["Head", "Vice-Head", "Core Member", "Member"];
const BRANCHES = ["CSE", "AIML", "ECE", "EEE", "ME", "Biotech", "Civil", "Other"];
const SEMS = ["1", "2", "3", "4", "5", "6", "7", "8"];
const field = "w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-indigo-500";
const empty = { name: "", domain: "", position: "", srn: "", email: "", linkedin: "", github: "", branch: "", semester: "", bio: "" };

export default function RegisterPage() {
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ ok: boolean; text: string } | null>(null);

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const say = (ok: boolean, text: string) => {
    setToast({ ok, text });
    setTimeout(() => setToast(null), 4000);
  };

  const submit = async () => {
    const required = ["name", "domain", "position", "srn", "email", "branch", "semester"] as const;
    if (required.some((k) => !form[k].trim()) || !file) return say(false, "Please fill all fields and choose a photo.");
    if (form.bio.length < 150 || form.bio.length > 200) return say(false, "Bio must be 150-200 characters.");

    setBusy(true);
    try {
      const { data: dup } = await supabase.from("members").select("id").eq("srn", form.srn.trim()).limit(1);
      if (dup && dup.length > 0) throw new Error("This SRN is already submitted.");

      const blob = await convertToWebP(file);
      const path = `${Date.now()}-${form.srn.trim()}.webp`;
      const { error: upErr } = await supabase.storage
        .from("member-photos")
        .upload(path, blob, { contentType: "image/webp" });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("member-photos").getPublicUrl(path);

      const { error } = await supabase.from("members").insert({
        name: form.name.trim(), domain: form.domain, position: form.position,
        srn: form.srn.trim(), email: form.email.trim(),
        linkedin_url: form.linkedin || null, github_url: form.github || null,
        branch: form.branch, semester: Number(form.semester),
        bio: form.bio, photo_url: pub.publicUrl, status: "pending",
      });
      if (error) throw error;

      say(true, "Submitted! Your profile is pending approval.");
      setForm(empty); setFile(null); setPreview(null);
    } catch (err: any) {
      say(false, err.message ?? "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const select = (name: string, label: string, options: string[]) => (
    <select name={name} value={form[name as keyof typeof form]} onChange={update} className={field}>
      <option value="">{label}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10 text-white">
      {toast && (
        <div className={`fixed right-4 top-4 z-50 rounded-lg px-4 py-3 text-sm shadow-lg ${toast.ok ? "bg-green-600" : "bg-red-600"}`}>
          {toast.text}
        </div>
      )}
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
          <button onClick={submit} disabled={busy}
            className="w-full rounded-lg bg-indigo-600 py-2 font-medium hover:bg-indigo-500 disabled:opacity-50">
            {busy ? "Submitting..." : "Submit"}
          </button>
        </div>
        <div className="flex items-start justify-center md:sticky md:top-10">
          <MemberCard data={{ ...form, photo: preview }} />
        </div>
      </div>
    </main>
  );
}
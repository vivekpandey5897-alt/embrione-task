import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-950 px-4 text-white">
      <h1 className="text-4xl font-bold">The Embrione</h1>
      <p className="text-zinc-400">Meet the team, or join it.</p>
      <div className="flex gap-3">
        <Link href="/team" className="rounded-lg bg-indigo-600 px-4 py-2 hover:bg-indigo-500">Meet the Team</Link>
        <Link href="/register" className="rounded-lg border border-white/20 px-4 py-2 hover:bg-white/10">Register</Link>
      </div>
    </main>
  );
}
export type CardData = {
  name: string;
  domain: string;
  position: string;
  branch: string;
  semester: string;
  bio: string;
  photo: string | null;
};

export default function MemberCard({ data }: { data: CardData }) {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-xl transition hover:-translate-y-1 hover:border-indigo-500/50">
      <div className="flex flex-col items-center text-center">
        {data.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.photo} alt="Profile" className="h-28 w-28 rounded-full object-cover ring-2 ring-indigo-500" />
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-zinc-800 text-4xl text-zinc-500 ring-2 ring-zinc-700">
            {data.name ? data.name.charAt(0).toUpperCase() : "?"}
          </div>
        )}
        <h3 className="mt-4 w-full truncate text-xl font-semibold text-white">{data.name || "Your Name"}</h3>
        <p className="text-sm text-indigo-400">{data.position || "Position"} · {data.domain || "Domain"}</p>
        <p className="mt-1 text-xs text-zinc-400">{data.branch || "Branch"} · Sem {data.semester || "–"}</p>
        <p className="mt-3 line-clamp-3 text-sm text-zinc-300">{data.bio || "Your short bio will appear here."}</p>
      </div>
    </div>
  );
}
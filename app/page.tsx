"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("members").select("*").then(({ data }) => setRows(data ?? []));
  }, []);
  return <pre className="p-4">{JSON.stringify(rows, null, 2)}</pre>;
}
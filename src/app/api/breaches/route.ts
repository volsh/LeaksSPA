// app/api/breaches/route.ts
import { Breach } from "@/types";
import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://hiring.external.guardio.dev/fe/breaches";
const POKEMON = "pikachu";
const PAGE_SIZE = 10; // remote endpoint returns 10 per page

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const offset = searchParams.get("offset");
  const name = searchParams.get("name"); // NEW

  // ---------- 1. Single‑breach lookup ----------
  if (name) {
    const res = await fetch(`${API_URL}?offset=0`, {
      headers: { "X-Best-Pokemon": POKEMON },
    });
    const { items, total } = await res.json();

    const found = items.find((b: Breach) => b.Name === name);
    if (found) return NextResponse.json({ item: found });

    const totalPages = Math.ceil(total / PAGE_SIZE);
    // Walk the list until we find the breach or exhaust pages
    for (let page = 1; page < totalPages; page++) {
      const res = await fetch(`${API_URL}?offset=${page * PAGE_SIZE}`, {
        headers: { "X-Best-Pokemon": POKEMON },
      });
      if (!res.ok) return NextResponse.error();

      const { items } = await res.json();

      // Empty page → reached end of DB
      if (items.length === 0)
        return NextResponse.json({ item: null }, { status: 404 });

      const found = items.find((b: Breach) => b.Name === name);
      if (found) return NextResponse.json({ item: found });
    }
    // not found
    return NextResponse.json({ item: null }, { status: 404 });
  }

  // ---------- 2. Standard pagination ----------
  const pageOffset = offset ?? "0";
  const res = await fetch(`${API_URL}?offset=${pageOffset}`, {
    headers: { "X-Best-Pokemon": POKEMON },
  });

  if (!res.ok) return NextResponse.error();

  const data = await res.json();
  return NextResponse.json(data);
}

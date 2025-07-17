// app/api/breaches/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://hiring.external.guardio.dev/fe/breaches";
const POKEMON = "pikachu";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const offset = searchParams.get("offset") || "0";

  const response = await fetch(`${API_URL}?offset=${offset}`, {
    headers: {
      "X-Best-Pokemon": POKEMON,
    },
  });

  const data = await response.json();
  return NextResponse.json(data);
}

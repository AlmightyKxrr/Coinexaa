import { NextResponse } from "next/server";

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/coins/markets" +
  "?vs_currency=usd" +
  "&order=market_cap_desc" +
  "&per_page=100" +
  "&page=1" +
  "&sparkline=false" +
  "&price_change_percentage=24h";

export async function GET() {
  try {
    const res = await fetch(COINGECKO_URL, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 30 }, // cache on server for 30s
    });

    if (res.status === 429) {
      return NextResponse.json(
        { error: "CoinGecko rate limit hit. Try again shortly." },
        { status: 429 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: `CoinGecko responded with ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

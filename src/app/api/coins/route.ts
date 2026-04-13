import { NextResponse } from "next/server";

// ─── In-memory cache (lives for the lifetime of the server process) ─────────

let cachedData: unknown = null;
let cachedAt = 0;

/** Minimum gap between actual CoinGecko calls (30 seconds). */
const CACHE_TTL_MS = 30_000;

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/coins/markets" +
  "?vs_currency=usd" +
  "&order=market_cap_desc" +
  "&per_page=100" +
  "&page=1" +
  "&sparkline=false" +
  "&price_change_percentage=24h";

// ─── Handler ────────────────────────────────────────────────────────────────────

export async function GET() {
  const now = Date.now();

  // Return cached data if still fresh
  if (cachedData && now - cachedAt < CACHE_TTL_MS) {
    return NextResponse.json(cachedData, {
      headers: { "X-Cache": "HIT", "X-Cache-Age": String(now - cachedAt) },
    });
  }

  try {
    const res = await fetch(COINGECKO_URL, {
      headers: { Accept: "application/json" },
      // No Next.js cache — we manage our own in-memory cache above
      cache: "no-store",
    });

    if (res.status === 429) {
      // If rate limited but we have stale data, return it instead of failing
      if (cachedData) {
        return NextResponse.json(cachedData, {
          headers: { "X-Cache": "STALE", "X-Rate-Limited": "true" },
        });
      }
      return NextResponse.json(
        { error: "CoinGecko rate limit hit. Try again shortly." },
        { status: 429 }
      );
    }

    if (!res.ok) {
      if (cachedData) {
        return NextResponse.json(cachedData, {
          headers: { "X-Cache": "STALE", "X-Error": String(res.status) },
        });
      }
      return NextResponse.json(
        { error: `CoinGecko responded with ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    // Update cache
    cachedData = data;
    cachedAt = now;

    return NextResponse.json(data, {
      headers: { "X-Cache": "MISS" },
    });
  } catch (err: unknown) {
    // On network error, return stale cache if available
    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: { "X-Cache": "STALE", "X-Error": "network" },
      });
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

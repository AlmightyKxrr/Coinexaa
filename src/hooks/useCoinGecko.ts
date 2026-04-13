"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { CoinMarketData } from "@/types";
import { usePortfolioStore } from "@/store/usePortfolioStore";

// ─── Constants ─────────────────────────────────────────────────────────────────

/** Proxy through our own API route (server-side cached, rate-limit safe) */
const API_URL = "/api/coins";

/** Polling interval in milliseconds (60s — safe for CoinGecko free tier). */
const POLL_INTERVAL_MS = 60_000;

// ─── Hook ──────────────────────────────────────────────────────────────────────

interface UseCoinGeckoReturn {
  coins: CoinMarketData[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refetch: () => Promise<void>;
}

export function useCoinGecko(): UseCoinGeckoReturn {
  const [coins, setCoins] = useState<CoinMarketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Use a ref for the interval so it never triggers re-renders
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Use a ref for the Zustand action to avoid dependency churn
  const updateLivePricesRef = useRef(usePortfolioStore.getState().updateLivePrices);
  useEffect(() => {
    // Keep ref synced just in case (Zustand doesn't change this, but safety)
    updateLivePricesRef.current = usePortfolioStore.getState().updateLivePrices;
  }, []);

  // Guard against concurrent fetches
  const isFetchingRef = useRef(false);

  // ── Fetch function (stable — zero dependencies) ───────────────────────────

  const fetchCoins = useCallback(async () => {
    // Prevent overlapping fetches
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const res = await fetch(API_URL);

      // Handle rate limiting gracefully
      if (res.status === 429) {
        console.warn("[useCoinGecko] Rate limited (429). Will retry on next poll.");
        setError("Rate limited — retrying shortly…");
        return;
      }

      if (!res.ok) {
        throw new Error(`CoinGecko API responded with ${res.status}`);
      }

      const data: CoinMarketData[] = await res.json();
      setCoins(data);
      setError(null);
      setLastUpdated(new Date());

      // Sync prices into Zustand store
      const priceMap: Record<string, number> = {};
      for (const coin of data) {
        priceMap[coin.id] = coin.current_price;
      }
      updateLivePricesRef.current(priceMap);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch market data";
      setError(message);
      console.error("[useCoinGecko] fetch error:", err);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []); // ← STABLE: zero dependencies, never recreated

  // ── Lifecycle: initial fetch + polling ────────────────────────────────────

  useEffect(() => {
    // Initial fetch
    fetchCoins();

    // Start polling — single interval, cleaned up on unmount
    intervalRef.current = setInterval(fetchCoins, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchCoins]);

  return { coins, isLoading, error, lastUpdated, refetch: fetchCoins };
}

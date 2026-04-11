import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { PortfolioAsset } from "@/types";

// ─── State Shape ───────────────────────────────────────────────────────────────

interface PortfolioState {
  /** Virtual USD balance from `profiles.virtual_balance` */
  usdBalance: number;
  /** Array of held assets from the `portfolio` table */
  assets: PortfolioAsset[];
  /** Live price map  —  key: CoinGecko coin id (e.g. "bitcoin"), value: USD price */
  livePrices: Record<string, number>;
  /** Computed: usdBalance + Σ(asset.total_amount × livePrices[asset.asset_symbol]) */
  totalNetAssetValue: number;
  /** Loading flag for portfolio fetches */
  isLoading: boolean;
  /** Most recent error message, if any */
  error: string | null;
}

interface PortfolioActions {
  /** Pull the latest profile balance + portfolio holdings from Supabase */
  fetchUserPortfolio: (userId: string) => Promise<void>;
  /** Merge incoming price data into `livePrices` and recalculate NAV */
  updateLivePrices: (prices: Record<string, number>) => void;
  /** Recalculate `totalNetAssetValue` from current state */
  calculateNetAssetValue: () => void;
  /** Reset store to initial state (e.g. on logout) */
  reset: () => void;
}

// ─── Initial State ─────────────────────────────────────────────────────────────

const initialState: PortfolioState = {
  usdBalance: 0,
  assets: [],
  livePrices: {},
  totalNetAssetValue: 0,
  isLoading: false,
  error: null,
};

// ─── Store ─────────────────────────────────────────────────────────────────────

export const usePortfolioStore = create<PortfolioState & PortfolioActions>(
  (set, get) => ({
    ...initialState,

    // ── fetchUserPortfolio ──────────────────────────────────────────────────

    fetchUserPortfolio: async (userId: string) => {
      set({ isLoading: true, error: null });

      try {
        // 1. Fetch profile (virtual balance)
        let { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("virtual_balance")
          .eq("id", userId)
          .maybeSingle();

        // If profile doesn't exist yet (new user or RLS issue), create it
        if (!profile && (!profileError || profileError.code === "PGRST116")) {
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .upsert({ id: userId, virtual_balance: 10000 }, { onConflict: "id" })
            .select("virtual_balance")
            .single();

          if (createError) {
            console.error("[usePortfolioStore] Profile create error:", JSON.stringify(createError));
            // Fallback: just use default balance
            profile = { virtual_balance: 10000 };
          } else {
            profile = newProfile;
          }
        } else if (profileError) {
          console.error("[usePortfolioStore] Profile fetch error:", JSON.stringify(profileError));
          // Fallback: use default balance rather than crashing
          profile = { virtual_balance: 10000 };
        }

        // 2. Fetch portfolio holdings
        const { data: portfolio, error: portfolioError } = await supabase
          .from("portfolio")
          .select("*")
          .eq("user_id", userId);

        if (portfolioError) {
          console.error("[usePortfolioStore] Portfolio fetch error:", JSON.stringify(portfolioError));
        }

        const usdBalance = Number(profile?.virtual_balance ?? 10000);
        const assets = (portfolio ?? []).map((row) => ({
          ...row,
          total_amount: Number(row.total_amount),
        })) as PortfolioAsset[];

        set({ usdBalance, assets, isLoading: false });

        // Recalculate NAV with whatever live prices we already have
        get().calculateNetAssetValue();
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch portfolio";
        set({ error: message, isLoading: false, usdBalance: 10000 });
        console.error("[usePortfolioStore] fetchUserPortfolio error:", JSON.stringify(err));
      }
    },

    // ── updateLivePrices ────────────────────────────────────────────────────

    updateLivePrices: (prices: Record<string, number>) => {
      set((state) => ({
        livePrices: { ...state.livePrices, ...prices },
      }));
      // Immediately recalculate NAV after prices change
      get().calculateNetAssetValue();
    },

    // ── calculateNetAssetValue ──────────────────────────────────────────────

    calculateNetAssetValue: () => {
      const { usdBalance, assets, livePrices } = get();

      const holdingsValue = assets.reduce((sum, asset) => {
        const price = livePrices[asset.asset_symbol] ?? 0;
        return sum + asset.total_amount * price;
      }, 0);

      set({ totalNetAssetValue: usdBalance + holdingsValue });
    },

    // ── reset ───────────────────────────────────────────────────────────────

    reset: () => set(initialState),
  })
);

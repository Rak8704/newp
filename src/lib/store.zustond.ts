
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ExtendedCard } from "@/types/api/card";
import { Categories, GamesList, NetEnt } from "@/types/game";
import { create } from "zustand";

interface WithdrawCardType {
  card: ExtendedCard | null;
  setCard: (card: ExtendedCard) => void;
}

export const useCard = create<WithdrawCardType>((set) => ({
  card: null,
  setCard: (card) => set({ card }),
}));

interface GameType {
  games: GamesList | null;
  isLoading: boolean;
  error: string;
  providerGames: Record<string, NetEnt[]> | null;
  isProviderLoading: boolean;

  getGames: (
    category: string,
    name?: string,
    limit?: number,
    provider?: any
  ) => NetEnt[] | null;

  getCustomeCategoriesGames: (
    category: string,
    search?: string
  ) => NetEnt[] | null;

  getFavoriesGames: (gamesId: string[]) => NetEnt[] | null;

  setGames: (games: GamesList) => void;
  setGscGames: (games: NetEnt[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string) => void;
  setProviderGames: (provider: string, games: NetEnt[]) => void;
  setProviderLoading: (isLoading: boolean) => void;
}

const filterBySearch = (games: NetEnt[], search?: string) => {
  if (!search?.trim()) return games;

  const term = search.trim().toLowerCase();

  return games.filter((game) =>
    String(game.name ?? "").toLowerCase().includes(term)
  );
};

export const useGames = create<GameType>((set, get) => ({
  games: null,
  isLoading: true,
  error: "",
  providerGames: {},
  isProviderLoading: false,

  getGames: (category, name, limit, provider) => {
    const state = get();

    let result: NetEnt[] = [];

    if (
      provider &&
      provider !== "all" &&
      state.providerGames?.[String(provider)]
    ) {
      result = state.providerGames[String(provider)] ?? [];
    } else {
      const allGames = Object.values(state.games ?? {}).flat() as NetEnt[];

      result = allGames.filter((game) => {
        const gameCategory = String(game.categories ?? "").toLowerCase();
        const requestedCategory = String(category ?? "").toLowerCase();

        if (
          requestedCategory === String(Categories.Slots).toLowerCase()
        ) {
          return (
            gameCategory === requestedCategory ||
            gameCategory ===
              String(Categories.FastGames).toLowerCase()
          );
        }

        return gameCategory === requestedCategory;
      });

      if (provider && provider !== "all") {
        result = result.filter(
          (game) => String(game.title) === String(provider)
        );
      }
    }

    result = filterBySearch(result, name);

    return limit !== undefined && limit > 0
      ? result.slice(0, limit)
      : result;
  },

  getCustomeCategoriesGames: (category, search) => {
    const games = Object.values(get().games ?? {}).flat() as NetEnt[];

    let filtered: NetEnt[] = [];

    if (category === "hot") {
      const hotIds = [
        "8892", "8891", "8890", "15808", "15814",
        "15815", "15813", "15810", "15809", "15065",
        "15056", "15812", "7053", "10269", "9896",
      ];

      filtered = games.filter((game) => hotIds.includes(String(game.id)));
    }

    return filterBySearch(filtered, search);
  },

  getFavoriesGames: (gamesId) => {
    const games = Object.values(get().games ?? {}).flat() as NetEnt[];

    return games.filter((game) => gamesId.includes(String(game.id)));
  },

  setGames: (games) => set({ games }),

  // GSC+ API থেকে normalize করা গেম এখানে রাখা হবে।
  setGscGames: (games) =>
    set({
      games: { gsc: games } as unknown as GamesList,
      error: "",
      isLoading: false,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setProviderGames: (provider, games) =>
    set((state) => ({
      providerGames: {
        ...(state.providerGames ?? {}),
        [provider]: games,
      },
    })),

  setProviderLoading: (isLoading) =>
    set({ isProviderLoading: isLoading }),
}));

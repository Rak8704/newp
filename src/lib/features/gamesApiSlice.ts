
import { GamesList } from "@/types/game";
import { apiSlice } from "./apiSlice";

const gamesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchGamesList: builder.mutation<
      { success: boolean; gamesList: GamesList },
      { game_type: string; search?: string }
    >({
      query: ({ game_type, search }) => ({
        url: "api/games/list",
        method: "POST",
        body: { game_type, search },
      }),
    }),

    openGame: builder.mutation<
      any,
      { gameId: string; playerId?: string }
    >({
      query: (body) => ({
        url: "api/open-game",
        method: "POST",
        body,
      }),
    }),

    fetchGamesByProvider: builder.mutation<
      { success: boolean; games: any[] },
      { providerCode: string; page?: number; limit?: number }
    >({
      query: ({ providerCode, page = 1, limit = 200 }) => ({
        url: `api/games/provider/${encodeURIComponent(providerCode)}`,
        method: "GET",
        params: { page, limit },
      }),
    }),
  }),
});

export const {
  useFetchGamesListMutation,
  useOpenGameMutation,
  useFetchGamesByProviderMutation,
} = gamesApiSlice;

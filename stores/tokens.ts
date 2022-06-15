import { defineStore } from "pinia";
import { TokensListResponse } from "@/types/Token";

export const useTokensStore = defineStore("tokensList", {
  state: () => {
    return { data: undefined };
  },

  getters: {
    tokensList: async (state) => {
      if (state.data) {
        return state.data;
      }

      const { data, error } = await useFetch<TokensListResponse>(
        "https://tokens.uniswap.org",
        { pick: ["tokens"] }
      );
      if (error.value) {
        navigateTo({
          path: `/errorPage`,
        });
      }
      state.data = data.value;
      return data.value;
    },
  },
});

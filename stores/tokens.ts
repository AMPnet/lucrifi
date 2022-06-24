import { defineStore } from "pinia";
import { TokensListResponse } from "@/types/Token";

import { ipfsToHttp } from "@/shared/ipfs";

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
        {
          key: "uniswapTokens",
          pick: ["tokens"],
          transform: (data) => {
            const tokens = data.tokens;

            data.tokens = tokens.map((token) => {
              token.logoURI = ipfsToHttp(token.logoURI);
              return token;
            });

            return data;
          },
        }
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

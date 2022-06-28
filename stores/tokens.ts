import { defineStore } from "pinia";
import {Token, TokensListResponse} from "@/types/Token";
import tokensList from '../public/tokens/list.json';

export const useTokensStore = defineStore("tokensList", {
  state: () => {
    return { data: undefined };
  },

  getters: {
    tokensList: function(state) {
      if (state.data) {
        return tokensList;
      } else {
        state.data = tokensList;
        return state.data;
      }
    }
    // tokensList: async (state) => {
    //   if (state.data) {
    //     return state.data;
    //   }
    //
    //   const { data, error } = await useFetch<TokensListResponse>(
    //     "https://raw.githubusercontent.com/viaprotocol/tokenlists/main/tokenlists/all.json"
    //   );
    //
    //   const fetched = JSON.parse(data.value.toString());
    //   if (error.value) {
    //     navigateTo({
    //       path: `/errorPage`,
    //     });
    //   }
    //   state.data = fetched;
    //   return fetched;
    // },
  },
});

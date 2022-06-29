import { defineStore } from "pinia";
import { Token } from "@/types/Token";
import tokensList from '../public/tokens/list.json';

export const useTokensStore = defineStore("tokensList", {
  state: () => {
    return { data: tokensList };
  },
  actions: {
    tokensList: function(chainId: number): Token[] {
      return this.data[chainId.toString()];
    }
  }
});

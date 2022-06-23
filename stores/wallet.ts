import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { ethers } from "ethers";
import { event } from "vue-gtag";

import { BalanceCheckRequestResponse } from "@/types/ampnet/BalanceCheck";

export const useWallet = defineStore("walletData", {
  state: () => {
    return {
      walletAddress: useLocalStorage("wallet-address", ""),
      isConnecting: false,
    };
  },

  hydrate(storeState, initialState) {
    // https://pinia.vuejs.org/api/interfaces/pinia.DefineStoreOptions.html#hydrate
    // @ts-expect-error: https://github.com/microsoft/TypeScript/issues/43826
    storeState.walletAddress = useLocalStorage("wallet-address", "");
  },

  getters: {
    isWalletConnected: (state) => ethers.utils.isAddress(state.walletAddress),
  },

  actions: {
    async connectWallet() {
      const runtimeConfig = useRuntimeConfig();

      const payload = {
        chain_id: 1,
        token_address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
        redirect_url: runtimeConfig.public.connectWalletRedirect,
      };
      const { data: requestData, error } =
        await useFetch<BalanceCheckRequestResponse>(
          `${runtimeConfig.public.backendUrl}/balance/`,
          {
            method: "post",
            body: payload,
            pick: ["id", "redirect_url"],
            key: Date.now().toString(),
          }
        );
      if (error.value) {
        navigateTo({
          path: `/errorPage`,
        });
      }
      const requestId = requestData.value.id;
      this.isConnecting = true;
      const { data: statusData, refresh } =
        await useFetch<BalanceCheckRequestResponse>(
          `${runtimeConfig.public.backendUrl}/balance/${requestId}`,
          {
            pick: ["status", "balance"],
          }
        );

      window.open(requestData.value.redirect_url, "_blank");

      setTimeout(function () {
        this.isConnecting = false;
      }, 5 * 60 * 1000); // Timeout if user doesn't log in within reasonable time

      while (this.isConnecting) {
        await new Promise((r) => setTimeout(r, 2000));

        await refresh();

        if (error.value) {
          this.isConnecting = false;
        }

        if (statusData.value.status === "SUCCESS") {
          this.walletAddress = statusData.value.balance.wallet;
          this.isConnecting = false;
          event("login", { method: "Wallet" });
        } else if (statusData.value.status === "FAILED") {
          this.isConnecting = false;
        }
      }
    },

    disconnectWallet() {
      this.walletAddress = "";
      event("logout", {
        event_category: "engagement",
        event_label: "wallet_disconnect",
      });
    },
  },
});

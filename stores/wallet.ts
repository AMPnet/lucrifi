import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { ethers } from "ethers";
import { event } from "vue-gtag";

import { useNetworksStore } from "@/stores/networks";

import { BalanceCheckRequestResponse } from "@/types/ampnet/BalanceCheck";

export const useWallet = defineStore("walletData", {
  state: () => {
    return {
      walletAddress: useLocalStorage("wallet-address", ""),
      isConnecting: false,
      connectData: {
        redirectUrl: "",
        id: "",
      },
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
    async preFetchConnectData() {
      /*
      Fetches redirect URL and request ID that will be used to connect wallet
      */
      const runtimeConfig = useRuntimeConfig();

      const payload = {
        chain_id: 137,
        token_address: "0x0000000000000000000000000000000000001010",
        redirect_url: runtimeConfig.public.connectWalletRedirect,
        asset_type: "TOKEN",
      };

      const networksStore = useNetworksStore();
      const apiKey = networksStore.networksList[0].apiKey;
      const headers = {
        "X-API-KEY": `${apiKey}`,
      };
      const data = await useFetch<BalanceCheckRequestResponse>(
        `${runtimeConfig.public.backendUrl}/balance/`,
        {
          method: "post",
          headers: headers,
          body: payload,
          pick: ["id", "redirect_url"],
        }
      );

      return data;
    },
    async connectWallet() {
      const networksStore = useNetworksStore();
      const apiKey = networksStore.networksList[0].apiKey;
      const headers = {
        "X-API-KEY": `${apiKey}`,
      };

      const runtimeConfig = useRuntimeConfig();

      this.isConnecting = true;
      const {
        data: statusData,
        refresh,
        error,
      } = await useFetch<BalanceCheckRequestResponse>(
        `${runtimeConfig.public.backendUrl}/balance/${this.connectData.id}`,
        {
          pick: ["status", "balance"],
          headers: headers,
        }
      );

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

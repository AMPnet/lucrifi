import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { ethers } from "ethers";
import { event } from "vue-gtag";

import { useNetworksStore } from "@/stores/networks";

import {
  FetchWalletAuthRequest,
  CreateWalletAuthRequest,
  GetPayloadByMessage,
  GetJWTByMessage,
} from "@/types/ampnet/BalanceCheck";

export const useWallet = defineStore("walletData", {
  state: () => {
    return {
      walletAddress: useLocalStorage("wallet-address", ""),
      isConnecting: false,
      connectData: {
        redirectUrl: "",
        id: "",
      },
      jwt: {
        accessToken: useLocalStorage("accessToken", ""),
        refreshToken: useLocalStorage("refreshToken", ""),
        expires: useLocalStorage("expires", Date.now()),
        refreshTokenExpires: useLocalStorage("refreshTokenExpires", Date.now()),
      },
    };
  },

  hydrate(storeState, initialState) {
    // https://pinia.vuejs.org/api/interfaces/pinia.DefineStoreOptions.html#hydrate
    // @ts-expect-error: https://github.com/microsoft/TypeScript/issues/43826
    storeState.walletAddress = useLocalStorage("wallet-address", "");
    // @ts-expect-error: https://github.com/microsoft/TypeScript/issues/43826
    storeState.jwt.accessToken = useLocalStorage("accessToken", "");
    // @ts-expect-error: https://github.com/microsoft/TypeScript/issues/43826
    storeState.jwt.refreshToken = useLocalStorage("refreshToken", "");
    // @ts-expect-error: https://github.com/microsoft/TypeScript/issues/43826
    storeState.jwt.expires = useLocalStorage("expires", Date.now());
    // @ts-expect-error: https://github.com/microsoft/TypeScript/issues/43826
    storeState.jwt.refreshTokenExpires = useLocalStorage(
      "refreshTokenExpires",
      Date.now()
    );
  },

  getters: {
    isWalletConnected: (state) => ethers.utils.isAddress(state.walletAddress),
    accessToken: (state): string => state.jwt.accessToken,
    accessTokenValid: (state): boolean =>
      state.jwt.expires > Date.now() + 2 * 60 * 1000,
  },

  actions: {
    async preFetchConnectData() {
      /*
      Fetches redirect URL and request ID that will be used to connect wallet
      */

      const { data: payloadData } = await useFetch<GetPayloadByMessage>(
        "https://eth-staging.ampnet.io/api/identity/authorize/by-message",
        {
          method: "post",
          body: {},
          pick: ["payload"],
        }
      );

      const payload = {
        message_to_sign: payloadData.value.payload,
      };

      const networksStore = useNetworksStore();
      const apiKey = networksStore.networksList[0].apiKey;
      const headers = {
        "X-API-KEY": `${apiKey}`,
      };

      const runtimeConfig = useRuntimeConfig();
      const data = await useFetch<CreateWalletAuthRequest>(
        `${runtimeConfig.public.backendUrl}/wallet-authorization`,
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
      } = await useFetch<FetchWalletAuthRequest>(
        `${runtimeConfig.public.backendUrl}/wallet-authorization/${this.connectData.id}`,
        {
          pick: [
            "status",
            "wallet_address",
            "message_to_sign",
            "signed_message",
          ],
          headers: headers,
        }
      );

      setTimeout(function () {
        this.isConnecting = false;
      }, 5 * 60 * 1000); // Timeout if user doesn't log in within reasonable time

      while (this.isConnecting) {
        await refresh();

        if (error.value) {
          this.isConnecting = false;
        }

        if (statusData.value.status === "SUCCESS") {
          const payload = {
            address: statusData.value.wallet_address,
            message_to_sign: statusData.value.message_to_sign,
            signed_payload: statusData.value.signed_message,
          };
          const { data: jwtData } = await useFetch<GetJWTByMessage>(
            `https://eth-staging.ampnet.io/api/identity/authorize/jwt/by-message`,
            {
              method: "post",
              body: payload,
            }
          );
          this.jwt.accessToken = jwtData.value.access_token;
          this.jwt.refreshToken = jwtData.value.refresh_token;

          this.jwt.expires = jwtData.value.expires_in * 1000 + Date.now();
          this.jwt.refreshTokenExpires =
            jwtData.value.refresh_token_expires_in * 1000 + Date.now();

          this.walletAddress = statusData.value.wallet_address;
          this.isConnecting = false;
          event("login", { method: "Wallet" });
        } else if (statusData.value.status === "FAILED") {
          this.isConnecting = false;
        }

        await new Promise((r) => setTimeout(r, 1000));
      }
    },

    async refreshAccessToken() {
      const { data } = await useFetch<GetJWTByMessage>(
        "https://eth-staging.ampnet.io/api/identity/authorize/refresh",
        {
          method: "post",
          body: {
            refresh_token: this.jwt.refreshToken,
          },
        }
      );
      this.jwt.accessToken = data.value.access_token;
      this.jwt.expires = data.value.expires_in * 1000 + Date.now();
    },

    disconnectWallet() {
      this.walletAddress = "";
      this.jwt.accessToken = "";
      this.jwt.refreshToken = "";
      this.jwt.expires = Date.now();
      this.jwt.refresh_token_expires = Date.now();

      event("logout", {
        event_category: "engagement",
        event_label: "wallet_disconnect",
      });
    },
  },
});

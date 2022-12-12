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
      walletAddress: useLocalStorage("walletAddress", ""),
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
      const { public: publicKey } = useRuntimeConfig();

      const data = await $fetch<GetPayloadByMessage>(
        `${publicKey.identityUrl}/authorize/by-message`,
        {
          method: "POST",
        }
      );

      const payload = {
        message_to_sign: data.payload,
      };

      const networksStore = useNetworksStore();
      const apiKey = networksStore.networksList[0].apiKey;
      const headers = {
        "X-API-KEY": `${apiKey}`,
      };

      try {
        const walletData = await $fetch<CreateWalletAuthRequest>(
          `${publicKey.backendUrl}/wallet-authorization`,
          {
            method: "post",
            headers: headers,
            body: payload,
          }
        );
        this.connectData.id = walletData.id;
        this.connectData.redirectUrl = walletData.redirect_url;
      } catch (error) {}
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
          headers: headers,
          pick: [
            "status",
            "wallet_address",
            "message_to_sign",
            "signed_message",
          ],
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
            `${runtimeConfig.public.identityUrl}/authorize/jwt/by-message`,
            {
              method: "post",
              body: payload,
            }
          );
          this.jwt.accessToken = jwtData.value.access_token;
          this.jwt.refreshToken = jwtData.value.refresh_token;

          this.jwt.expires = jwtData.value.expires_in + Date.now();

          this.jwt.refreshTokenExpires =
            jwtData.value.refresh_token_expires_in + Date.now();

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
      const runtimeConfig = useRuntimeConfig();
      if (this.jwt.refreshToken) {
        try {
          const data = await $fetch<GetJWTByMessage>(
            `${runtimeConfig.public.identityUrl}/authorize/refresh`,
            {
              method: "post",
              body: {
                refresh_token: this.jwt.refreshToken,
              },
            }
          );
          this.jwt.accessToken = data.access_token;
          this.jwt.expires = data.expires_in + Date.now();
        } catch (error) {
          this.disconnectWallet();
        }
      }
    },

    disconnectWallet() {
      this.walletAddress = "";
      this.jwt.accessToken = "";
      this.jwt.refreshToken = "";
      this.jwt.expires = Date.now();
      this.jwt.refreshTokenExpires = Date.now();
      event("logout", {
        event_category: "engagement",
        event_label: "wallet_disconnect",
      });
    },
  },
});

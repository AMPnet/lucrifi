import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  head: {
    title: "Lucrifi",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "Easily get paid in crypto",
      },
      {
        hid: "keywords",
        name: "keywords",
        content: "web3, crypto, blockhain, defi, payments, transaction, dev3",
      },
    ],
  },
  css: ["~/assets/css/tailwind.css"],
  modules: ["@nuxtjs/tailwindcss"],

  buildModules: ["@pinia/nuxt"],

  build: {
    // https://github.com/nuxt/framework/discussions/3301#discussioncomment-2816743
    transpile: ["@ethersproject", "ethers"],
  },
  vite: {
    // https://github.com/nuxt/framework/discussions/3301#discussioncomment-2816743
    optimizeDeps: {
      include: ["bn.js", "js-sha3", "hash.js", "aes-js", "scrypt-js", "bech32"],
    },
  },

  runtimeConfig: {
    public: {
      gtagId: "",
      backendUrl: "https://eth-staging.ampnet.io/api/blockchain-api/v1",
      requestPaymentRedirect:
        "https://rsend.vercel.app/request-send/${id}/action",
      connectWalletRedirect: "https://staging.ampnet.io/connect/${id}",
    },
  },
});

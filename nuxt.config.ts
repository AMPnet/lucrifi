export default defineNuxtConfig({
  app: {
    head: {
      title: "LucriFi",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Get paid in crypto, easy and fast!",
        },
        {
          hid: "keywords",
          name: "keywords",
          content:
            "web3, crypto, blockhain, defi, payments, transaction, dev3, lucrifi, finance",
        },
      ],
    },
  },
  css: ["~/assets/css/tailwind.css"],
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],

  //buildModules: ["@pinia/nuxt"],

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
      polygonApiKey: "",
      ethereumApiKey: "",
      bscApiKey: "",
      avaxApiKey: "",
      moonriverApiKey: "",
      gnosisApiKey: "",
      fantomApiKey: "",
      auroraApiKey: "",

      gtagId: "",
      identityUrl: "https://invest-api.ampnet.io/api/identity",
      backendUrl: "https://invest-api.ampnet.io/api/blockchain-api/v1",
    },
  },

  typescript: {
    typeCheck: true,
    tsConfig: "./tsconfig.json",
    shim: false,
  },
});

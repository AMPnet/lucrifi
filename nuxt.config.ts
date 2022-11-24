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
          content: "Easy crypto payrolls",
        },
        {
          hid: "keywords",
          name: "keywords",
          content:
            "web3, crypto, blockhain, defi, payments, transaction, dev3, lucrifi, finance",
        },
        {
          property: "og:site_name",
          content: "LucriFi",
        },
        {
          property: "og:title",
          content: "LucriFi",
        },
        {
          property: "og:description",
          content: "Easy crypto payrolls",
        },
        {
          property: "og:image",
          content: "/share-thumb.webp",
        },
        {
          property: "og:url",
          content: "https://app.lucri.fi",
        },
        {
          name: "twitter:title",
          content: "LucrFi",
        },
        {
          name: "twitter:description",
          content: "Easy crypto payrolls",
        },
        {
          name: "twitter:image",
          content: "/share-thumb.webp",
        },
        {
          property: "twitter:url",
          content: "https://app.lucri.fi",
        },
        {
          name: "twitter:card",
          content: "summary",
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
    typeCheck: false,
    tsConfig: "./tsconfig.json",
    shim: false,
  },
});

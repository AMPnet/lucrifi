import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ["~/assets/css/tailwind.css"],
  modules: ["@nuxtjs/tailwindcss"],

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
});

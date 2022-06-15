<script setup lang="ts">
import { useWallet } from "@/stores/wallet";

const wallet = useWallet();

async function connectWallet() {
  await wallet.connectWallet();
}
</script>

<template>
  <div class="text-center">
    <div
      class="text-gray-700 bg-white py-8 sm:py-10 px-4 sm:px-14 inline-flex rounded-xl"
    >
      <div class="w-full sm:w-64">
        <div class="flex justify-center mb-5">
          <img class="h-12 w-auto" src="/logos/lucrifi-logo.png" />
        </div>

        <button
          v-if="!wallet.isConnecting"
          @click="connectWallet"
          class="mt-3 w-full font-bold text-xs rounded-full bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 py-3 px-6 text-white disabled:from-slate-400 disabled:to-slate-400"
        >
          Connect Wallet
        </button>

        <button
          v-else
          class="mt-3 w-full font-bold text-xs rounded-full bg-gradient-to-r from-sky-600 to-cyan-500 py-3 px-6 text-white"
        >
          Connecting...
        </button>
      </div>
    </div>
  </div>
</template>

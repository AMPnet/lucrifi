<script setup lang="ts">
import { useWallet } from "@/stores/wallet";

const wallet = useWallet();

function connectWallet() {
  window.open(wallet.connectData.redirectUrl, "_blank");
  wallet.connectWallet();
}

const { data, pending, refresh } = await wallet.preFetchConnectData();

watch(data, (newData) => {
  if (newData) {
    wallet.connectData.id = newData.id;
    wallet.connectData.redirectUrl = newData.redirect_url;
  }
});

if (!wallet.isWalletConnected) {
  // Fetch new wallet connect data only if the user hasn't connected wallet
  await refresh();
}
</script>

<template>
  <div class="text-center">
    <div
      class="text-gray-700 bg-white py-8 sm:py-10 px-4 sm:px-14 inline-flex rounded-xl"
    >
      <div class="w-64">
        <div class="flex justify-center mb-5">
          <img
            class="h-12 w-auto"
            src="/logos/lucrifi-logo.png"
            alt="lucrifi logo"
          />
        </div>

        <button
          v-if="!wallet.isConnecting"
          :disabled="pending"
          @click="connectWallet"
          class="mt-3 w-full font-bold text-xs rounded-full bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 py-3 px-6 text-white disabled:from-slate-400 disabled:to-slate-400"
        >
          Connect Wallet
        </button>

        <button
          v-else
          class="mt-3 w-full font-bold text-xs rounded-full bg-gradient-to-r from-sky-600 to-cyan-500 py-3 px-6 text-white"
        >
          <div class="flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 animate-spin mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>

            <span>Connecting wallet</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

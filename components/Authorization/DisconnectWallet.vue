<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import { useWallet } from "@/stores/wallet";

const { copy } = useClipboard();

const wallet = useWallet();

const { data, refresh } = await wallet.preFetchConnectData();

const showCopied = ref(false);

function copyAddr() {
  copy(wallet.walletAddress);
  showCopied.value = true;

  setTimeout(function () {
    showCopied.value = false;
  }, 1200);
}

async function disconnectWallet() {
  wallet.disconnectWallet();
  await refresh(); // Refresh the redirect link in case user wants to connect wallet again without page refresh

  wallet.connectData.id = data.value.id;
  wallet.connectData.redirectUrl = data.value.redirect_url;
}
</script>

<template>
  <div class="absolute z-10">
    <div class="min-h-full sm:-ml-10 py-3 sm:py-0 text-center">
      <div
        class="bg-white pb-4 rounded-xl text-base overflow-hidden shadow-xl sm:my-3 sm:w-full"
      >
        <div class="border-slate-200">
          <div
            class="flex justify-center items-center border-b mb-3 py-2 px-7 text-black font-bold"
          >
            <span>{{ shortAddr(wallet.walletAddress, 5, 4) }}</span>
            <button
              @click="copyAddr"
              class="ml-2 rounded-full bg-gray-100 p-1.5 hover:bg-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                />
              </svg>
            </button>
            <div
              v-show="showCopied"
              class="absolute rounded-xl px-2 py-1 bg-violet-700 text-white text-xs z-11 -right-8 bottom-24"
            >
              Copied
            </div>
          </div>
        </div>

        <div>
          <button
            @click="disconnectWallet"
            class="text-sm rounded-full py-1 px-2 border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

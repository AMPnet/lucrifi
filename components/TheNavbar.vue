<script setup lang="ts">
import { ref } from "vue";
import { useWallet } from "@/stores/wallet";

const wallet = useWallet();

const isOpen = ref(false);
</script>

<template>
  <div class="px-5 py-5 text-slate-500 text-sm">
    <div class="flex justify-between items-center">
      <NuxtLink to="/">
      <img
        class="h-10 w-auto"
        src="/logos/lucrifi-logo.png"
      />
     </NuxtLink>
      <button class="sm:hidden" @click="isOpen = !isOpen ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="{2}"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <nav class="hidden sm:flex">
        <div class="flex items-center">
          <NuxtLink to=/ class="flex mr-6 hover:text-violet-700 py-2" activeClass="text-violet-700 border-b-2 border-violet-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            <span>NEW REQUEST </span></NuxtLink
          >

          <NuxtLink
            to="/payments"
            class="flex items-center py-2 mx-6 hover:text-violet-700"
            activeClass="text-violet-700 border-b-2 border-violet-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <span>PAYMENTS </span></NuxtLink
          >
          <div v-if="wallet.isWalletConnected" class="ml-3">
            <WalletBtn :wallet-addr="wallet.walletAddress" />
          </div>
        </div>
      </nav>
    </div>
    <nav v-if="isOpen" class="pt-4 sm:hidden">
      <div>
        <div class="flex">
          <NuxtLink to=/ class="inline-flex mr-6 hover:text-violet-700 py-2" activeClass="text-violet-700 border-b-2 border-violet-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>NEW REQUEST </span></NuxtLink
          ></div>

        <div class="flex mt-2">
          <NuxtLink
            to="/payments"
            class="inline-flex items-center py-2 hover:text-violet-700"
            activeClass="text-violet-700 border-b-2 border-violet-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <span>PAYMENTS </span></NuxtLink
          >
</div>
      </div>
    </nav>
  </div>
</template>

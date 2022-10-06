<script setup lang="ts">
import { pageview } from "vue-gtag";
import { useWallet } from "@/stores/wallet";

pageview({ page_title: "/payments" });

const wallet = useWallet();

const menuId = ref(1);
</script>

<template>
  <div>
    <div v-if="wallet.isWalletConnected">
      <div class="flex justify-center gap-8 text-slate-500 text-sm font-bold">
        <button
          @click="menuId = 1"
          :class="menuId === 1 ? 'text-violet-700' : 'text-inherit'"
        >
          <div class="flex items-center uppercase">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"
              />
            </svg>
            <span>Funds Requested</span>
          </div>
        </button>
        <button
          @click="menuId = 2"
          :class="menuId === 2 ? 'text-violet-700' : 'text-inherit'"
        >
          <div class="flex items-center uppercase">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"
              />
            </svg>
            <span> Funds Sent </span>
          </div>
        </button>
      </div>
      <div class="mt-4">
        <PaymentsFundsRequested v-show="menuId === 1" />
        <PaymentsFundsSent v-show="menuId === 2" />
      </div>
    </div>

    <AuthorizationSignIn />
  </div>
</template>

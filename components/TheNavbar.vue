<script setup lang="ts">
import { ref } from "vue";
import { useWallet } from "@/stores/wallet";

const wallet = useWallet();
const route = useRoute();

const walletConnected = computed(() => wallet.isWalletConnected);

const isOpen = ref(false);
</script>

<template>
  <div class="px-5 py-5 text-slate-500 text-sm">
    <div class="flex justify-between items-center">
      <NuxtLink to="/">
        <img
          class="h-10 w-auto"
          src="/logos/logo-lucrifi-beta.webp"
          alt="Lucrifi logo"
        />
      </NuxtLink>

      <button class="sm:hidden" @click="isOpen = !isOpen">
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
        <div class="flex items-center gap-x-8">
          <NuxtLink
            to="/payrolls"
            class="flex items-center py-2 hover:text-violet-700"
            :class="{
              'text-violet-700 border-b-2 border-violet-700':
                route.path.includes('payrolls'),
            }"
          >
            <div class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 mr-1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <span>PAYROLLS </span>
            </div>
          </NuxtLink>
          <NuxtLink
            to="/"
            class="flex hover:text-violet-700 py-2"
            activeClass="text-violet-700 border-b-2 border-violet-700"
          >
            <div class="flex items-center">
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

              <span>NEW REQUEST </span>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/payments"
            class="flex items-center py-2 hover:text-violet-700"
            activeClass="text-violet-700 border-b-2 border-violet-700"
          >
            <div class="flex items-center">
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
              <span>PAYMENTS </span>
            </div>
          </NuxtLink>
          <ClientOnly>
            <div v-if="walletConnected">
              <WalletBtn :wallet-addr="wallet.walletAddress" />
            </div>
          </ClientOnly>
        </div>
      </nav>
    </div>
    <nav v-if="isOpen" class="pt-4 sm:hidden">
      <div>
        <div class="flex">
          <NuxtLink
            to="/"
            class="inline-flex mr-6 hover:text-violet-700 py-2"
            activeClass="text-violet-700 border-b-2 border-violet-700"
          >
            <div class="flex items-center">
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
              <span>NEW REQUEST </span>
            </div>
          </NuxtLink>
        </div>

        <div class="flex mt-2">
          <NuxtLink
            to="/payments"
            class="inline-flex py-2 hover:text-violet-700"
            activeClass="text-violet-700 border-b-2 border-violet-700"
          >
            <div class="flex items-center">
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
              <span>PAYMENTS </span>
            </div>
          </NuxtLink>
        </div>

        <div v-if="walletConnected" class="mt-5">
          <WalletBtn :wallet-addr="wallet.walletAddress" />
        </div>
      </div>
    </nav>
  </div>
</template>

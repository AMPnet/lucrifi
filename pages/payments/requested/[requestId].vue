<script setup lang="ts">
import { event, pageview } from "vue-gtag";
import QrcodeVue from "qrcode.vue";
import { useClipboard } from "@vueuse/core";

import { useTokensStore } from "@/stores/tokens";
import { useNetworksStore } from "@/stores/networks";

import { FetchSendRequestResponse } from "@/types/ampnet/RequestPayment";
import { Token } from "@/types/Token";
import { Network } from "@/types/Network";

pageview({ page_title: "/request_details" });

const networkStore = useNetworksStore();

const runtimeConfig = useRuntimeConfig();
const { copy } = useClipboard();

const tokensListStore = useTokensStore();

const route = useRoute();

let headers = {};
if (route.query.rpcURL) {
  headers = {
    "X-RPC-URL": route.query.rpcURL,
  };
}

const { data: requestData } = await useFetch<FetchSendRequestResponse>(
  `${runtimeConfig.public.backendUrl}/send/${route.params.requestId}`,
  {
    headers: headers,
    key: route.params.requestId.toString(),
  }
);

const network = computed((): Network => {
  return networkStore.networks.find(
    (network) => network.chainId === requestData.value.chain_id
  );
});

const transferUrl = computed(() => requestData.value.redirect_url);
const recepientAddress = computed(() => requestData.value.recipient_address);

let address = "";
if (requestData.value.token_address) {
  address = requestData.value.token_address.toLowerCase();
} else {
  // It's native token
  address = "0x0000000000000000000000000000000000000000";
}

const amount = computed(() => {
  const token: Token = tokensListStore
    .tokensList(network.value.chainId)
    .find((tok: Token) => tok.address.toLowerCase() === address);
  return solNumberToDecimal(requestData.value.amount, token.decimals);
});

const note = computed(() => requestData.value.arbitrary_data.note);

const tokenMeta = computed((): Token => {
  const token = tokensListStore
    .tokensList(requestData.value.chain_id)
    .find((tok: Token) => tok.address.toLowerCase() === address);

  if (token) return token;

  return {
    // Custom RPC was selected
    address: address,
    logoURI: "/icons/questionmark.svg",
    symbol: "Custom Token",
    chainId: undefined,
    decimals: 18,
    name: "Custom",
  };
});

const showCopyDialog = ref(false);

function openCopiedDialog() {
  showCopyDialog.value = true;
  setTimeout(() => (showCopyDialog.value = false), 800);
}
</script>

<template>
  <div class="text-center">
    <Transition>
      <NewRequestLinkCopiedDialog v-show="showCopyDialog" />
    </Transition>

    <div class="text-gray-700 bg-white py-6 px-5 inline-flex rounded-xl">
      <div class="w-full sm:w-96">
        <h2 class="text-lg font-bold">Transfer request</h2>
        <div class="flex items-center justify-center mt-5">
          <img
            :src="`/tokens/${tokenMeta.logoURI}`"
            class="w-5 h-5"
            alt="token logo"
            loading="lazy"
          />
          <span class="ml-1.5 text-2xl font-bold"
            >{{ amount }} {{ tokenMeta.symbol }}</span
          >
        </div>

        <div class="flex items-center justify-center mt-1.5">
          <img
            :src="network.logoURI"
            class="w-4 h-4"
            alt="token logo"
            loading="lazy"
          />
          <span class="ml-1.5 text-sm font-bold">{{ network.name }}</span>
        </div>

        <div class="text-xs mt-3.5">To: {{ recepientAddress }}</div>

        <div class="mt-7 mb-1 flex justify-center">
          <qrcode-vue :value="transferUrl" :size="150" level="H" />
        </div>

        <button
          @click="
            copy(transferUrl);
            openCopiedDialog();
            event('copy_payment_link');
          "
          class="rounded-full bg-slate-200 px-3 py-1 mt-1.5"
        >
          <div class="flex items-center text-sm">
            <span class="">
              {{ `${transferUrl.slice(0, 42)}...` }}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
        </button>

        <div v-if="note" class="flex items-center justify-center mt-7 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-1.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
          <span>{{ note }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import { useNetworksStore } from "@/stores/networks";
import { useTokensStore } from "@/stores/tokens";
import { solNumberToDecimal } from "@/shared/token";
import { Token } from "@/types/Token";

const { copy } = useClipboard();
const networkStore = useNetworksStore();
const tokensStore = useTokensStore();

const tokensList = await tokensStore.tokensList;

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  tokenAddress: {
    type: String,
    required: true,
  },
  chainId: {
    type: Number,
    required: true,
  },
  created: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
  redirectUrl: {
    type: String,
    required: true,
  },
  txHash: {
    type: [String, null],
    required: true,
  },
});

const network = computed(() => {
  return networkStore.networksList.find(
    (network) => network.chainId === props.chainId
  );
});
const token = computed(() => {
  return tokensList.tokens.find(
    (token) => token.address.toLowerCase() === props.tokenAddress.toLowerCase()
  );
});

const prettyDate = computed(() => {
  if (props.created.length > 0) {
    return props.created.slice(0, 10);
  }
  return "Unknown";
});

const prettyAmount = computed(() => {
  const token: Token = tokensList.tokens.find(
    (tok: Token) =>
      tok.address.toLowerCase() === props.tokenAddress.toLowerCase()
  );
  return solNumberToDecimal(props.amount, token.decimals);
});
const showMenu = ref(false);

const statusColorClass = computed(() => {
  if (props.status.toLowerCase() === "success") {
    return "text-green-400";
  } else if (props.status.toLowerCase() === "failed") {
    return "text-red-400";
  } else {
    return "text-gray-400";
  }
});

const showCopied = ref(false);

function copyPaymentLink() {
  copy(props.redirectUrl);
  showCopied.value = true;

  setTimeout(function () {
    showCopied.value = false;
  }, 1200);
}
</script>
<template>
  <div
    class="grid grid-cols-6 gap-y-7 sm:gap-0 sm:grid-cols-12 py-5 items-center border-b border-slate-2 text-sm font-bold px-6 text-slate-400"
  >
    <div class="col-span-3 text-gray-700 text-base break-all">
      <div class="flex items-center">
        <img class="w-5 h-5 mr-2" :src="token.logoURI" />
        <span>{{ prettyAmount }} {{ token.symbol }}</span>
      </div>
    </div>
    <div class="flex items-center">
      <img class="w-5 h-5" :src="network.logoURI" />
    </div>
    <div class="col-span-2 text-xs">{{ prettyDate }}</div>
    <div class="col-span-3 sm:col-span-2">
      <div class="flex items-center" :class="statusColorClass">
        <div class="mr-1">
          <svg
            v-if="status.toLowerCase() === 'success'"
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <svg
            v-else-if="status.toLowerCase() === 'failed'"
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <span>{{ status }}</span>

        <a
          v-if="status.toLowerCase() === 'success'"
          :href="`${network.blockExplorerUrl}/${txHash}`"
          target="_blank"
          class="ml-2 rounded-full bg-gray-100 p-1.5 hover:bg-gray-300 text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
    <div class="col-span-3 truncate text-xs">{{ note }}</div>
    <div class="relative flex justify-start sm:justify-end">
      <button @click="showMenu = !showMenu">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
          />
        </svg>
      </button>

      <div
        v-show="showMenu"
        class="absolute z-10 left-0 sm:left-auto sm:right-0 top-4"
      >
        <div class="min-h-full py-3 sm:py-0 text-center">
          <div
            class="bg-white rounded-lg py-2 text-sm text-left overflow-hidden shadow-xl sm:w-full"
          >
            <button
              @click="navigateTo(`/payments/requested/${id}`)"
              class="hover:bg-slate-100 whitespace-nowrap w-full px-4 py-1.5"
            >
              <div class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Preview</span>
              </div>
            </button>
            <button
              @click="copyPaymentLink"
              class="hover:bg-slate-100 whitespace-nowrap w-full px-4 py-1.5"
            >
              <div class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 mr-1"
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
                <span>Copy payment link</span>
              </div>
            </button>
            <div
              v-show="showCopied"
              class="absolute rounded-xl px-2 py-1 bg-violet-700 text-white text-xs z-11 left-20 bottom-10"
            >
              Copied
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

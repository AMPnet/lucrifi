<script setup lang="ts">
import { useTokensStore } from "@/stores/tokens";
import { useNetworksStore } from "@/stores/networks";
import { Recipient } from "@/types/payrolls/TemplateRecpient";

definePageMeta({
  layout: "payrolls",
});

const networkStore = useNetworksStore();
const networks = networkStore.networksList;
const selectedNetwork = useState("selectedNetwork", () => networks[0]);

const tokensListStore = useTokensStore();
const filteredTokenList = computed(() => {
  return tokensListStore.tokensList(selectedNetwork.value.chainId);
});
const selectedToken = useState("selectedToken", () => {
  return filteredTokenList.value.find((token) => token.symbol === "USDC");
});
const tokenLogoUri = computed(() => selectedToken.value.logoURI);
const tokenSymbol = computed(() => selectedToken.value.symbol);

const showTokenModal = ref(false);
const showNetworkModal = ref(false);

const templateRecipients = useState<Array<Recipient>>(
  "newTemplateRecipients",
  () => []
);

const templateName = useState<string>("templateName", () => "");
</script>

<template>
  <div>
    <NewRequestSelectTokenModal
      :chain-id="selectedNetwork.chainId"
      :tokens="filteredTokenList"
      v-if="showTokenModal"
      @close="showTokenModal = false"
    />
    <PayrollsSelectNetworkModal
      v-if="showNetworkModal"
      @close="showNetworkModal = false"
    />
    <div class="flex items-center mb-6">
      <input
        v-model="templateName"
        class="text-xl mr-2 p-1 focus:outline-none bg-inherit rounded-lg border border-transparent hover:border-gray-200 focus:border-violet-500"
        placeholder="Enter template name"
      />
      <div class="text-xs flex items-center gap-1.5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-4 h-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3"
          />
        </svg>

        <span>Get payment link</span>
      </div>
    </div>

    <h2 class="text-sm font-semibold mb-3">Select Network and Token</h2>

    <div class="flex items-center gap-4 mb-8">
      <button
        class="bg-white rounded-full px-2.5 py-2 text-sm font-semibold border border-slate-200"
        @click="showNetworkModal = true"
      >
        <div class="flex items-center">
          <img :src="selectedNetwork.logoURI" class="h-5 w-5" />

          <span class="mx-2.5"> {{ selectedNetwork.name }}</span>
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
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      <button
        class="bg-white rounded-full px-2.5 py-2 text-sm font-semibold border border-slate-200"
        @click="showTokenModal = true"
      >
        <div class="flex items-center">
          <img :src="`/tokens/${tokenLogoUri}`" class="h-5 w-5" />

          <span class="mx-2.5"> {{ tokenSymbol }}</span>
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
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>
    </div>

    <div class="mb-4" v-show="templateRecipients">
      <div
        v-for="recipient in templateRecipients"
        :key="recipient.id"
        class="gap-y-2 flex flex-col"
      >
        <PayrollsRecipientItem :recipient="recipient"></PayrollsRecipientItem>
      </div>
    </div>

    <div>
      <PayrollsRecipientItem></PayrollsRecipientItem>
    </div>
  </div>
</template>

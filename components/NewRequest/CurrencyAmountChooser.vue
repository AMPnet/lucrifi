<script setup lang="ts">
import { useField } from "vee-validate";
import { useTokensStore } from "@/stores/tokens";
import { isValidAddress, countDecimals } from "@/validators/blockchain";
import { Network } from "@/types/Network";

const tokensListStore = useTokensStore();
const selectedNetwork = useState("selectedNetwork", (): Network => {
  return {
    chainId: undefined,
    logoURI: "",
    rpcURL: undefined,
    name: "",
    blockExplorerUrl: "",
    apiKey: "",
    disperseContract: "",
  };
});

watch(selectedNetwork, (newNetwork) => {
  // Reset amount and token if the network changes
  validatedAmount.value = "";
  selectedToken.value = tokensListStore
    .tokensList(newNetwork.chainId)
    .find((token) => token.symbol === "USDC");
});

const filteredTokenList = computed(() => {
  return tokensListStore.tokensList(selectedNetwork.value.chainId);
});
const selectedToken = useState("selectedToken", () => {
  return filteredTokenList.value.find((token) => token.symbol === "USDC");
});
const tokenLogoUri = computed(() => selectedToken.value.logoURI);
const tokenSymbol = computed(() => selectedToken.value.symbol);

function isValidCurrencyAmount(value: string): string | boolean {
  if (!value) return "Please set amount";

  let regex = /^(0|[1-9]\d*)((\.|,)\d+)?$/;
  if (!regex.test(value)) {
    return "Please set valid amount";
  }

  const valueFloat = parseFloat(value.replace(",", "."));

  if (valueFloat <= 0) {
    return "Please set positive amount";
  }

  if (
    countDecimals(value) > selectedToken.value.decimals &&
    selectedNetwork.value.chainId !== undefined
  ) {
    return "Please set less decimals";
  }

  return true;
}

// Amount
const { value: validatedAmount, meta } = useField(
  "selectedAmount",
  isValidCurrencyAmount,
  { initialValue: "" }
);

watch(validatedAmount, async (newData, oldData) => {
  selectedAmount.value = newData;
});
watch(meta, async (newMeta, oldMeta) => {
  currencyAmountValid.value = newMeta.valid;
});

const selectedAmount = useState(
  "selectedCurrencyAmount",
  () => validatedAmount.value
);
const currencyAmountValid = useState("currencyAmountValid", () => false);

// Custom token address
const { value: validatedCustomTokenAddress, meta: metaToken } = useField(
  "customTokenAddress",
  isValidAddress,
  { initialValue: "" }
);
watch(validatedCustomTokenAddress, async (newAddr, oldAddr) => {
  selectedTokenAddress.value = newAddr;
});
watch(metaToken, async (newMeta, oldMeta) => {
  // Valid only when address is valid AND custom RPC is chain is selected
  amountTokenValid.value = newMeta.valid;
});
const selectedTokenAddress = useState("selectedCustomTokenAddres", () => {
  return validatedCustomTokenAddress;
});
const amountTokenValid = useState("customTokenAddressValid", () => false);

// Dynamic Classes
const dirtyClassAmount = computed(() => {
  if (!meta.valid) {
    return "bg-orange-50 border-orange-300";
  } else {
    return "bg-slate-100 border-slate-300";
  }
});
const dirtyClassTokenAddress = computed(() => {
  if (!metaToken.valid) {
    return "bg-orange-50 border-orange-300";
  } else {
    return "bg-slate-100 border-slate-300";
  }
});

const showTokenModal = ref(false);

const isCustomRpc = computed(() => selectedNetwork.value.chainId === undefined);
</script>

<template>
  <div>
    <NewRequestSelectTokenModal
      :chain-id="selectedNetwork.chainId"
      :tokens="filteredTokenList"
      v-if="showTokenModal"
      @close="showTokenModal = false"
    />

    <h3>Currency and amount</h3>
    <div
      v-if="isCustomRpc"
      class="px-4 py-3 mt-2 border rounded"
      :class="dirtyClassTokenAddress"
    >
      <div class="flex items-center justify between">
        <input
          v-model="validatedCustomTokenAddress"
          id="token-address"
          type="text"
          placeholder="Input token contract address"
          class="placeholder:text-xs placeholder:sm:text-sm text-left w-full bg-inherit focus:outline-none"
        />
      </div>
    </div>
    <div class="px-4 py-3 mt-2 border rounded" :class="dirtyClassAmount">
      <div class="flex items-center justify between">
        <button
          v-if="!isCustomRpc"
          class="bg-white rounded-full px-2.5 py-0.75 text-sm font-semibold shadow"
          @click="showTokenModal = true"
        >
          <div class="flex items-center">
            <img :src="`/tokens/${tokenLogoUri}`" class="h-5 w-5" />

            <span class="mx-2.5"> {{ tokenSymbol }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-9 w-9"
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
        <input
          v-model="validatedAmount"
          id="amount"
          type="text"
          inputmode="decimal"
          placeholder="Input amount to receive"
          :class="isCustomRpc ? 'text-left' : 'text-right ml-5'"
          class="placeholder:text-xs placeholder:sm:text-sm w-full text-xl bg-inherit focus:outline-none"
        />
      </div>
    </div>
  </div>
</template>

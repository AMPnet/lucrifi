<script setup lang="ts">
import { useField } from "vee-validate";

import { isValidAddress } from "@/validators/blockchain";
import { tokenToString } from "typescript";

const selectedNetwork = useState("selectedNetwork", () => {
  return {
    chainId: undefined,
  };
});

const { data: uniswapTokenListAll } = await useFetch(
  "https://tokens.uniswap.org"
);

const uniswapTokenList = computed(() => {
  // @ts-ignore
  return uniswapTokenListAll.value.tokens.filter(
    (token) => token.chainId === selectedNetwork.value.chainId
  );
});
const selectedToken = useState("selectedToken", () => {
  return uniswapTokenList.value.filter((token) => token.symbol === "USDC")[0];
});

const countDecimals = function (value: string) {
  if (!value.includes(".")) return 0;

  if (value.indexOf(".") !== -1 && value.indexOf("-") !== -1) {
    return value.split("-")[1] || 0;
  } else if (value.indexOf(".") !== -1) {
    return value.split(".")[1].length || 0;
  }
  return value.split("-")[1] || 0;
};

function isValidCurrencyAmount(value: string) {
  if (!value || !value.trim()) return "Please set amount";

  const trimmedValue = value.trim();

  // @ts-ignore
  if (isNaN(trimmedValue)) {
    return "Please set valid amount";
  }

  const valueFloat = parseFloat(trimmedValue);

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
  <NewRequestSelectTokenModal
    :chain-id="selectedNetwork.chainId"
    :tokens="uniswapTokenList"
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
        placeholder="Input token address"
        class="placeholder:text-sm text-left w-full bg-inherit focus:outline-none"
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
          <img :src="selectedToken.logoURI" class="h-5 w-5" />

          <span class="mx-2.5"> {{ selectedToken.symbol }}</span>
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
        class="placeholder:text-sm w-full text-xl bg-inherit focus:outline-none"
      />
    </div>
  </div>
</template>

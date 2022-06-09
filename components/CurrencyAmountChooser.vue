<script setup lang="ts">
import { useField } from "vee-validate";

const chainId = ref(1);

const { data: uniswapTokenList } = await useFetch(
  "https://tokens.uniswap.org/",
  {
    key: "uniswapItems",
    transform: (data) =>
      data["tokens"].filter((token) => token.chainId === chainId.value),
  }
);

const selectedToken = useState("selectedToken", () => {
  return uniswapTokenList.value.filter((token) => token.symbol === "USDC")[0];
});

const selectedAmount = useState("selectedCurrencyAmount", () => "");

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

  if (countDecimals(value) > selectedToken.value.decimals) {
    return "Please set less decimals";
  }

  return true;
}

const { value: validatedAmount, meta } = useField(
  selectedAmount,
  isValidCurrencyAmount,
  { initialValue: "" }
);

const currencyAmountValid = useState("currencyAmountValid", () => false);

watch(meta, async (newMeta, oldMeta) => {
  currencyAmountValid.value = newMeta.valid;
});

const dirtyClass = computed(() => {
  if (!meta.valid) {
    return "bg-red-50 border-red-300";
  } else {
    return "bg-slate-100 border-slate-300";
  }
});

const showTokenModal = ref(false);
</script>

<template>
  <SelectTokenModal
    :chain-id="chainId"
    :tokens="uniswapTokenList"
    v-if="showTokenModal"
    @close="showTokenModal = false"
  />

  <h3>Currency and amount</h3>
  <div class="px-4 py-3 mt-2 border rounded" :class="dirtyClass">
    <div class="flex items-center justify between">
      <button
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
        class="placeholder:text-sm w-full text-xl text-right ml-5 bg-inherit focus:outline-none"
      />
    </div>
  </div>
</template>

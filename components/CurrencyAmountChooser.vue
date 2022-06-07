<script setup>
const selectedToken = useState("selectedToken", () => {
  return {
    title: "USDC",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/480px-Ethereum-icon-purple.svg.png",
  };
});

const selectedAmount = useState("selectedCurrencyAmount", () => "");
const showTokenModal = ref(false);
</script>

<template>
  <SelectTokenModal v-if="showTokenModal" @close="showTokenModal = false" />

  <h3>Currency and amount</h3>
  <div class="px-4 py-3 mt-2 bg-slate-100 border border-slate-300 rounded">
    <div class="flex items-center justify between">
      <button
        class="bg-white rounded-full px-2.5 py-0.75 text-sm font-semibold shadow"
        @click="showTokenModal = true"
      >
        <div class="flex items-center">
          <img :src="selectedToken.img" class="h-5 w-5" />

          <span class="mx-2.5"> {{ selectedToken.title }}</span>
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
        v-model="selectedAmount"
        id="amount"
        type="text"
        inputmode="decimal"
        placeholder="Input amount to receive"
        pattern="[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)"
        class="placeholder:text-sm w-full text-xl text-right ml-5 bg-slate-100 focus:outline-none"
      />
    </div>
  </div>
</template>

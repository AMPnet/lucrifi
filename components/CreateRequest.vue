<script setup>
const tokens = [
  {
    title: "USDC",
    img: "",
  },
  {
    title: "DAI",
    img: "",
  },
  {
    title: "ETH",
    img: "",
  },
  {
    title: "WETH",
    img: "",
  },
  {
    title: "AAPX",
    img: "",
  },
  {
    title: "1INCH",
    img: "",
  },
];
const selectedToken = ref(tokens[0]);
</script>

<template>
  <div class="text-center">
    <div class="text-gray-700 bg-white py-4 px-5 inline-flex rounded-xl">
      <div class="w-full sm:w-96">
        <NetworkChooser />

        <div class="mt-5">
          <h3>Currency and amount</h3>
          <div class="px-4 py-3 border border-slate-300 rounded mt-2">
            <input min="0" type="number" id="amount" />
          </div>
        </div>

        <div class="mt-5">
          <h3>Transfer to</h3>
          <div class="px-4 py-3 border border-slate-300 rounded mt-2">
            <input type="text" id="transfer-to" />
          </div>
        </div>
        <div class="mt-5">
          <div class="px-4 py-3 border border-slate-300 rounded">
            <input type="text" />
          </div>
        </div>
        <button
          class="mt-3 w-full uppercase text-xs rounded-full bg-gradient-to-r from-violet-700 to-purple-500 py-3 px-6 text-white"
        >
          Create Request
        </button>
      </div>
    </div>
  </div>
</template>

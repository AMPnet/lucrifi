<script setup>
const selectedToken = useState("selectedToken");
const selectedNetwork = useState("selectedNetwork");
const selectedAmount = useState("selectedCurrencyAmount");

const isAmountValid = useState("currencyAmountValid");
const isAddressValid = useState("addressValid");
const isRpcValid = useState("rpcUrlValid");

const formValid = computed(() => {
  if (isAmountValid.value && isAddressValid.value && isRpcValid.value) {
    return true;
  }
  return false;
});
</script>

<template>
  <div class="text-center">
    <div class="text-gray-700 bg-white py-4 px-5 inline-flex rounded-xl">
      <div class="w-full sm:w-96">
        <NetworkChooser />

        <div class="mt-5">
          <CurrencyAmountChooser />
        </div>

        <div class="mt-5">
          <TransferToField />
        </div>

        <div class="mt-5">
          <div class="px-4 py-3 border border-slate-300 rounded">
            <div class="flex items-center">
              <svg
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
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              <input
                type="text"
                placeholder="Add note (optional)"
                class="w-full focus:outline-none mx-2"
              />
            </div>
          </div>
        </div>

        <button
          :disabled="!formValid"
          class="mt-3 w-full font-bold uppercase text-xs rounded-full bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 py-3 px-6 text-white disabled:from-slate-400 disabled:to-slate-400"
        >
          Create Request<br />
        </button>
      </div>
    </div>
  </div>
</template>

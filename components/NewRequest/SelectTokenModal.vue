<script setup lang="ts">
import { PropType } from "vue";
import Token from "@/types/Token";

const props = defineProps({
  chainId: {
    type: Number,
    required: true,
  },
  tokens: {
    type: Array as PropType<Token[]>,
    required: true,
  },
});

const selectedToken = useState("selectedToken");

const searchQuery = ref("");

const topTokens = computed(() => {
  const top = [];

  for (const token of props.tokens) {
    if (["USDC", "WETH", "DAI"].includes(token.symbol)) {
      top.push(token);
    }
  }
  return top;
});

const queriedTokens = computed(() => {
  if (searchQuery.value == "") {
    return props.tokens;
  } else {
    const queried = [];
    const queryLowerCase = searchQuery.value.toLowerCase();
    for (const token of props.tokens) {
      if (token.symbol.toLowerCase().includes(queryLowerCase)) {
        queried.push(token);
      }
    }
    return queried;
  }
});
</script>

<template>
  <div
    class="relative z-10"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
    ></div>

    <div class="fixed z-10 inset-0 overflow-y-auto">
      <div
        class="flex items-center justify-center min-h-full p-4 text-center sm:p-0"
      >
        <div
          class="relative bg-white pt-4 pb-4 rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full"
        >
          <div class="px-6">
            <div class="flex flex-row-reverse">
              <button @click="$emit('close')">
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <h3 class="text-center font-bold">Select token</h3>
            <input
              class="w-full px-4 py-3 mt-3 border border-slate-300 rounded focus:outline-none"
              v-model="searchQuery"
              type="text"
              placeholder="Search token symbol"
            />
            <div
              class="pt-5 pb-2 mb-4 gap-2 flex flex-wrap justify-left border-b border-slate-200"
            >
              <button
                v-for="token in topTokens"
                :key="token.address"
                @click="
                  selectedToken = token;
                  $emit('close');
                "
                class="rounded-full border border-slate-200 px-2 py-1.5 gap-3 hover:bg-violet-200 font-bold"
              >
                <div class="flex items-center">
                  <img :src="token.logoURI" class="w-5 h-5 mr-1" />
                  {{ token.symbol }}
                </div>
              </button>
            </div>
          </div>

          <div class="h-72 overflow-scroll">
            <h4 v-if="queriedTokens.length === 0" class="text-slate-400">
              No results found
            </h4>
            <button
              class="w-full text-left px-7 py-2 hover:bg-violet-100 hover:font-bold"
              v-for="token in queriedTokens"
              :key="token.address"
              @click="
                selectedToken = token;
                $emit('close');
              "
            >
              <div class="flex items-center">
                <img :src="token.logoURI" class="w-5 h-5 mr-2.5" />
                {{ token.symbol }}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

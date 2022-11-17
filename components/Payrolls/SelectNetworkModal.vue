<script setup lang="ts">
import { useNetworksStore } from "@/stores/networks";

const networkStore = useNetworksStore();
const networks = networkStore.networksList;
const selectedNetwork = useState("selectedNetwork", () => networks[0]);
</script>

<template>
  <div
    class="relative z-10"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75"></div>

    <div class="fixed z-10 inset-0 overflow-y-auto">
      <div
        class="flex items-center justify-center min-h-full p-4 text-center sm:p-0"
      >
        <div
          class="w-96 relative bg-white pt-4 pb-4 rounded-lg overflow-hidden shadow-xl sm:my-8 sm:max-w-lg sm:w-full"
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
            <h3 class="text-center font-bold mb-3">Select Network</h3>
          </div>

          <div class="h-72 overflow-y-scroll">
            <button
              class="w-full text-left px-7 py-2 hover:bg-violet-100 hover:font-bold"
              v-for="network in networks"
              :key="network.chainId"
              @click="
                selectedNetwork = network;
                $emit('close');
              "
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <img
                    :src="network.logoURI"
                    class="w-5 h-5 mr-2.5"
                    alt="token logo"
                    loading="lazy"
                  />
                  <span>
                    {{ network.name }}
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

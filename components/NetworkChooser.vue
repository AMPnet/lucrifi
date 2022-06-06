<script setup>
import { ref } from "vue";

const networks = ref([
  {
    title: "Polygon",
    img: "",
  },
  {
    title: "Ethereum",
    img: "",
  },
  {
    title: "BSC",
    img: "",
  },
  {
    title: "Avanalnche",
    img: "",
  },
  {
    title: "Tron",
    img: "",
  },
  {
    title: "Custom RPC",
    img: "",
  },
]);
const selectedNetwork = ref(networks.value[0]);

const dropDownActive = ref(false);
const customRpc = ref("");
</script>

<template>
  <div>
    <h3>Network</h3>
    <button
      class="w-full flex items-center justify-between px-4 py-3 border border-slate-300 rounded mt-2"
      @click="dropDownActive = !dropDownActive"
    >
      <div class="flex items-center">
        <img
          src="https://seeklogo.com/images/P/polygon-matic-logo-86F4D6D773-seeklogo.com.png"
          class="w-4 h-4 mr-2.5"
        />
        <span>{{ selectedNetwork.title }}</span>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
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
    </button>
    <div v-if="dropDownActive" class="mt-1 shadow-md rounded-md">
      <button
        class="w-full text-left px-4 py-2 hover:bg-violet-100 text-sm"
        v-for="network in networks"
        :key="network.title"
        @click="
          selectedNetwork = network;
          dropDownActive = false;
        "
      >
        {{ network.title }}
      </button>
    </div>
    <input
      v-if="selectedNetwork.title.toLowerCase().includes('custom')"
      class="w-full px-4 py-3 mt-2 border border-slate-300 rounded focus:outline-none"
      v-model="customRpc"
      type="text"
      placeholder="Enter RPC"
    />
  </div>
</template>

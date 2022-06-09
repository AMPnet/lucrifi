<script setup lang="ts">
import { ref } from "vue";
import { useField } from "vee-validate";

const networks = [
  {
    title: "Polygon",
    img: "https://seeklogo.com/images/P/polygon-matic-logo-86F4D6D773-seeklogo.com.png",
    chainId: 1,
  },
  {
    title: "Ethereum",
    img: "https://seeklogo.com/images/P/polygon-matic-logo-86F4D6D773-seeklogo.com.png",
    chainId: 2,
  },
  {
    title: "BSC",
    img: "https://seeklogo.com/images/P/polygon-matic-logo-86F4D6D773-seeklogo.com.png",
    chainId: 3,
  },
  {
    title: "Avanalnche",
    img: "https://seeklogo.com/images/P/polygon-matic-logo-86F4D6D773-seeklogo.com.png",
    chainId: 4,
  },
  {
    title: "Tron",
    img: "https://seeklogo.com/images/P/polygon-matic-logo-86F4D6D773-seeklogo.com.png",
    chainId: 5,
  },
];

const customRpc = ref({
  title: "Custom RPC",
  img: undefined,
  chainId: -1,
});

networks.push(customRpc.value);

const selectedNetwork = useState("selectedNetwork", () => networks[0]);
const rpcUrl = useState("rpcUrl", () => "");

const dropDownActive = ref(false);

const isCustomRpc = computed(
  () => selectedNetwork.value.title == customRpc.value.title
);

// Validation
function isValidRpcUrl(value: string) {
  if (!value || !value.trim()) return "Please set URL";

  const trimmedValue = value.trim();

  try {
    new URL(trimmedValue);
  } catch (_) {
    return "Please set valid URL";
  }

  return true;
}

const { value: validatedRpcUrl, meta } = useField(rpcUrl, isValidRpcUrl, {
  initialValue: "",
});
const rpcUrlValid = useState("rpcUrlValid", () => false);

watch(meta, async (newMeta, oldMeta) => {
  rpcUrlValid.value =
    newMeta.valid && selectedNetwork.value.title == customRpc.value.title;
});

const dirtyClass = computed(() => {
  if (!meta.valid) {
    return "bg-red-50 border-red-300";
  } else {
    return "bg-slate-100 border-slate-300";
  }
});
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
          v-if="!isCustomRpc"
          :src="selectedNetwork.img"
          class="w-4 h-4 mr-2.5"
        />
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-2.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
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
        class="w-full text-left px-4 py-2 text-sm hover:bg-violet-100 hover:font-bold"
        v-for="network in networks"
        :key="network.title"
        @click="
          selectedNetwork = network;
          dropDownActive = false;
        "
      >
        <div class="flex items-center">
          <img
            v-if="network !== customRpc"
            :src="network.img"
            class="w-4 h-4 mr-2.5"
          />
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 mr-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          {{ network.title }}
        </div>
      </button>
    </div>
    <div>
      <input
        v-if="isCustomRpc"
        :class="dirtyClass"
        class="w-full px-4 py-3 mt-2 border rounded focus:outline-none"
        v-model="validatedRpcUrl"
        type="text"
        placeholder="Input RPC URL"
      />
    </div>
  </div>
</template>

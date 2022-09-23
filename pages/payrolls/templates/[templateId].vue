<script setup lang="ts">
import { useTokensStore } from "@/stores/tokens";
import { useNetworksStore } from "@/stores/networks";
import { Recipient } from "@/types/payrolls/TemplateData";

definePageMeta({
  layout: "payrolls",
});

const networkStore = useNetworksStore();
const networks = networkStore.networksList;
const selectedNetwork = useState("selectedNetwork", () => networks[0]);

const tokensListStore = useTokensStore();
const filteredTokenList = computed(() => {
  return tokensListStore.tokensList(selectedNetwork.value.chainId);
});

const selectedToken = useState("selectedToken", () => {
  return filteredTokenList.value.find((token) => token.symbol === "USDC");
});

const templateRecipients = useState<Array<Recipient>>(
  "newTemplateRecipients",
  () => [
    {
      address: "oxjfiejfiejfijfie",
      amount: "13",
      id: 1,
      name: null,
    },
    {
      address: "oxjfiejfiejfijfie",
      amount: "12",
      id: 2,
      name: null,
    },
  ]
);

const templateChanged = useState<boolean>("templateChanged", () => false);
const templateName = useState<string>("templateName", () => "Ampnet Salary");

watch(templateRecipients.value, () => {
  templateChanged.value = true;
});
watch(templateName, () => {
  templateChanged.value = true;
});

const payrollSum = computed(() => {
  const sum = templateRecipients.value.reduce(
    (a, b) => a + Number(b.amount),
    0
  );
  return new Intl.NumberFormat("en-US").format(sum);
});

function saveTemplate() {
  // TODO sync with API
  templateChanged.value = false;
}
</script>

<template>
  <div>
    <div class="flex items-center mb-6">
      <input
        v-model="templateName"
        class="text-xl mr-2 p-1 focus:outline-none bg-inherit rounded-lg border border-transparent hover:border-gray-200 focus:border-violet-500"
        placeholder="Enter template name"
      />

      <div class="px-4 py-2 bg-indigo-100 rounded-xl font-bold text-sm">
        <span>Sum: {{ payrollSum }} {{ selectedToken.symbol }} </span>
      </div>
    </div>

    <div class="mb-4" v-show="templateRecipients">
      <div
        v-for="recipient in templateRecipients"
        :key="recipient.id"
        class="gap-y-2 flex flex-col"
      >
        <PayrollsRecipientItem :recipient="recipient"></PayrollsRecipientItem>
      </div>
    </div>

    <div class="mb-10">
      <PayrollsRecipientItem></PayrollsRecipientItem>
    </div>

    <div class="flex justify-start">
      <button
        v-if="templateChanged"
        class="rounded-full bg-gradient-to-r font-bold from-violet-700 to-purple-500 text-white py-2.5 px-8 text-lg"
        @click="saveTemplate"
      >
        <div class="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>

          <span>Save Template</span>
        </div>
      </button>

      <button
        v-else
        class="rounded-full bg-gradient-to-r font-bold from-violet-700 to-purple-500 text-white py-2.5 px-12 text-lg"
        @click="saveTemplate"
      >
        <span>Execute Payment</span>
      </button>
    </div>
  </div>
</template>

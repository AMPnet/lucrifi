<script setup lang="ts">
import { useTokensStore } from "@/stores/tokens";
import { useNetworksStore } from "@/stores/networks";
import { Recipient } from "@/types/payrolls/TemplateData";
import { useTemplates } from "@/stores/templates";
import { useAddressBook } from "@/stores/addressBook";

definePageMeta({
  layout: "payrolls",
});

const addressBookStore = useAddressBook();
addressBookStore.fetchAliases();

const route = useRoute();
const templatesStore = useTemplates();
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

let templateName = useState<string>("templateName", () => "");
let templateRecipients = useState<Array<Recipient>>(
  "templateRecipients",
  () => []
);

const templateUpdated = ref(false);

try {
  const data = await templatesStore.fetchTemplateDetails(
    route.params.templateId
  );
  templateName.value = data.template_name;
  templateRecipients.value = data.items;
  watch(templateName, (oldName, newName) => {
    templateUpdated.value = oldName !== newName;
  });
} catch (error) {}

const payrollSum = computed(() => {
  const sum = templateRecipients.value.reduce(
    (a, b) => a + Number(b.amount),
    0
  );
  return new Intl.NumberFormat("en-US").format(sum);
});

async function saveTemplateName() {
  try {
    await templatesStore.updateTemplate(
      route.params.templateId.toString(),
      templateName.value
    );
    templateUpdated.value = false;
  } catch (error) {
    console.log(error);
  }
}

function executePayment() {}
</script>

<template>
  <div>
    <div class="flex items-center mb-6">
      <input
        v-model="templateName"
        class="text-xl p-1 mr-1.5 focus:outline-none bg-inherit rounded-lg border border-transparent hover:border-gray-200 focus:border-violet-500"
        placeholder="Enter template name"
      />
      <button
        v-show="templateUpdated"
        class="bg-slate-800 text-xs py-1 px-4 rounded-full text-white whitespace-nowrap flex items-center gap-1.5 disabled:bg-slate-200 disabled:text-gray-400 mr-6"
        @click="saveTemplateName"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>

        <span>Save</span>
      </button>

      <div class="px-4 py-2 bg-indigo-100 rounded-xl font-bold text-sm">
        <span>Total: {{ payrollSum }} {{ selectedToken.symbol }} </span>
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
        class="rounded-full bg-gradient-to-r font-bold from-violet-700 to-purple-500 text-white py-2.5 px-12 text-lg"
        @click="executePayment"
      >
        <span>Execute Payment</span>
      </button>
    </div>
  </div>
</template>

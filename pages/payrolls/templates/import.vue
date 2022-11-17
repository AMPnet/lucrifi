<script setup lang="ts">
import { Ref } from "vue";
import { useTokensStore } from "@/stores/tokens";
import { useTemplates } from "@/stores/templates";
import {
  Recipient,
  TemplateItemWRecipients,
} from "@/types/payrolls/TemplateData";
import { useNetworksStore } from "@/stores/networks";

definePageMeta({
  layout: "payrolls",
});

const route = useRoute();
const router = useRouter();
const templatesStore = useTemplates();
const networkStore = useNetworksStore();
const tokensListStore = useTokensStore();

const message = ref("Importing template...");
const importLoading = ref(false);
const selectedNetwork = useState(
  "selectedNetwork",
  () => networkStore.networks[0]
);

const filteredTokenList = computed(() => {
  return tokensListStore.tokensList(selectedNetwork.value.chainId);
});
const selectedToken = useState("selectedToken", () => {
  return filteredTokenList.value.find((token) => token.symbol === "USDC");
});

let templateData: TemplateItemWRecipients;

try {
  const templateDetails = await templatesStore.fetchTemplateDetails(
    route.query.id
  );
  selectedNetwork.value = networkStore.networks.find(
    (x) => x.chainId === templateDetails.chain_id
  );

  let tokenAddr = NATIVE_TOKEN_ADDR;
  if (templateDetails.asset_type === "TOKEN") {
    tokenAddr = templateDetails.token_address;
  }
  selectedToken.value = filteredTokenList.value.find(
    (token) => token.address.toLowerCase() === tokenAddr
  );

  templateData = templateDetails;
} catch (err) {
  message.value = "Failed to import template.";
  console.error(err);
}

const itemsDecimalAmounts = computed(() => {
  return templateData.items.map((item) => {
    const decimalAmount = solNumberToDecimal(
      item.amount,
      selectedToken.value.decimals
    );
    const newItem = { ...item };
    newItem.amount = decimalAmount;
    return newItem;
  });
});

const payrollSum = computed(() => {
  const sum = itemsDecimalAmounts.value.reduce(
    (a, b) => a + Number(b.amount),
    0
  );
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 10 }).format(
    sum
  );
});

async function importTemplate() {
  importLoading.value = true;
  try {
    await templatesStore.addTemplate(templateData);
    const newTemplateId = templatesStore.templates[0].id;
    router.push(`/payrolls/templates/${newTemplateId}`);
  } catch (err) {
    console.error(err);
  } finally {
    importLoading.value = false;
  }
}
</script>
<template>
  <div>
    <div v-if="templateData">
      <div class="flex flex-row items-center justify-between">
        <div class="flex flex-col">
          <div class="text-sm font-semibold uppercase text-violet-600">
            Import template
          </div>
          <div class="mt-1">
            <div class="mb-4 text-lg text-slate-600">
              {{ templateData.template_name }}
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-row gap-2">
        <div
          class="pl-4 py-4 pr-8 mb-3 bg-indigo-50 rounded-lg font-semibold text-slate-600 text-sm w-fit"
        >
          <div class="text-xs uppercase font-semibold text-violet-700">
            Total template amount
          </div>
          <span class="text-lg"
            >{{ payrollSum }} {{ selectedToken.symbol }}
          </span>
        </div>
      </div>

      <div class="mb-4">
        <div
          v-for="recipient in itemsDecimalAmounts"
          :key="recipient.id"
          class="gap-y-2 flex flex-col"
        >
          <PayrollsRecipientItem
            :is-editable="false"
            :recipient="recipient"
          ></PayrollsRecipientItem>
        </div>
      </div>

      <div class="flex justify-start">
        <button
          class="rounded-full bg-gradient-to-r font-bold from-violet-700 to-purple-500 text-white py-2 px-12 text-xs uppercase disabled:from-slate-200 disabled:to-slate-200 disabled:text-gray-400"
          @click="importTemplate"
        >
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5 mr-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>

            <span>Add to my templates</span>
          </div>
        </button>
      </div>
    </div>
    <div v-else>
      {{ message }}
    </div>
  </div>
</template>

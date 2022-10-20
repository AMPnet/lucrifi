<script setup lang="ts">
import { useTokensStore } from "@/stores/tokens";
import { useNetworksStore } from "@/stores/networks";
import { Recipient, UpdateTemplate } from "@/types/payrolls/TemplateData";
import { useTemplates } from "@/stores/templates";
import { FunctionCallResponse } from "@/types/ampnet/FunctionCall";
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

  selectedNetwork.value = networks.find((x) => x.chainId === data.chain_id);

  let tokenAddr = NATIVE_TOKEN_ADDR;
  if (data.asset_type === "TOKEN") {
    tokenAddr = data.token_address;
  }
  selectedToken.value = filteredTokenList.value.find(
    (token) => token.address.toLowerCase() === tokenAddr
  );

  const itemsDecimalAmounts = data.items.map((item) => {
    const decimalAmount = solNumberToDecimal(
      item.amount,
      selectedToken.value.decimals
    );
    item.amount = decimalAmount;
    return item;
  });

  templateRecipients.value = itemsDecimalAmounts;

  watch(templateName, (oldName, newName) => {
    templateUpdated.value = oldName !== newName;
  });
} catch (error) {
  console.log(error);
}

const payrollSum = computed(() => {
  const sum = templateRecipients.value.reduce(
    (a, b) => a + Number(b.amount),
    0
  );
  return new Intl.NumberFormat("en-US").format(sum);
});

const templateExecutable = computed(() => {
  const validName = templateName.value.length > 0;
  const validRecipients = templateRecipients.value.length > 0;
  return validName && validRecipients;
});

async function saveTemplateName() {
  const template: UpdateTemplate = {
    template_name: templateName.value,
    id: route.params.templateId.toString(),
    asset_type:
      selectedToken.value.address === NATIVE_TOKEN_ADDR ? "NATIVE" : "TOKEN",
    chain_id: selectedNetwork.value.chainId,
    token_address: selectedToken.value.address,
  };
  try {
    await templatesStore.updateTemplate(template);
    templateUpdated.value = false;
  } catch (error) {
    console.log(error);
  }
}

const multiSendId = ref("");
const paymentLoading = ref(false);

async function authorizePayment() {
  const assetType =
    selectedToken.value.address === NATIVE_TOKEN_ADDR ? "NATIVE" : "TOKEN";

  const sumSol = decimalToSolNumber(
    String(payrollSum.value),
    selectedToken.value.decimals
  );
  const itemsSol = templateRecipients.value.map((item) => {
    const decimalAmount = decimalToSolNumber(
      item.amount,
      selectedToken.value.decimals
    );
    const newData = { ...item }; // must create a copy otherwise the ref is modified in place
    newData.amount = decimalAmount;
    return newData;
  });

  paymentLoading.value = true;
  try {
    const data = await templatesStore.createMultiPayment(
      itemsSol,
      assetType,
      "0xb853e8b0dc7542391f095070a75af57e3f0427be",
      selectedToken.value.address,
      sumSol
    );
    multiSendId.value = data;
  } catch (error) {
    multiSendId.value = "";
    console.log(error);
  } finally {
    paymentLoading.value = false;
  }
}

async function executePayment() {
  const addresses = templateRecipients.value.map((x) => x.wallet_address);
  const amounts = templateRecipients.value.map((x) =>
    decimalToSolNumber(x.amount, selectedToken.value.decimals)
  );

  paymentLoading.value = true;
  try {
    await templatesStore.disperseFunctionCall(
      "05dcc94a-1a96-4309-957c-36a31eb1e840",
      selectedToken.value.address,
      addresses,
      amounts,
      multiSendId.value
    );
  } catch (err) {
    console.error(err);
  } finally {
    multiSendId.value = "";
    paymentLoading.value = false;
  }
}
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
        v-if="multiSendId.length === 0"
        :disabled="!templateExecutable || paymentLoading"
        class="rounded-full bg-gradient-to-r font-bold from-violet-700 to-purple-500 text-white py-2.5 px-12 text-lg disabled:from-slate-200 disabled:to-slate-200 disabled:text-gray-400"
        @click="authorizePayment"
      >
        <div v-if="paymentLoading" class="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5 animate-spin mr-2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>

          <span>Authorizing</span>
        </div>
        <div v-else>
          <span>Step 1: Authorize</span>
        </div>
      </button>

      <button
        v-else
        :disabled="paymentLoading"
        class="rounded-full bg-gradient-to-r font-bold from-violet-700 to-purple-500 text-white py-2.5 px-12 text-lg disabled:from-slate-200 disabled:to-slate-200 disabled:text-gray-400"
        @click="executePayment"
      >
        <div v-if="paymentLoading" class="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5 animate-spin mr-2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          <span>Executing</span>
        </div>
        <div v-else>
          <span>Step 2: Execute payment</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTokensStore } from "@/stores/tokens";
import { useNetworksStore } from "@/stores/networks";
import { Recipient, UpdateTemplate } from "@/types/payrolls/TemplateData";
import { useTemplates } from "@/stores/templates";
import { useAddressBook } from "@/stores/addressBook";

definePageMeta({
  layout: "payrolls",
});

const addressBookStore = useAddressBook();
addressBookStore.fetchAliases();

const route = useRoute();
const router = useRouter();
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

const isEditModeEnabled = ref(false);
const templateUpdated = ref(false);
const multiSendId = ref("");
const paymentLoading = ref(false);

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

  if (data.asset_type === "NATIVE") {
    await createNativeMultiPaymentRequest();
  }

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

const isNativeToken = computed(() => {
  return selectedToken.value.address === NATIVE_TOKEN_ADDR;
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

async function toggleEdit() {
  if (isEditModeEnabled.value) {
    await saveTemplateName();
  }
  isEditModeEnabled.value = !isEditModeEnabled.value;
}

async function createNativeMultiPaymentRequest() {
  const itemsSol = templateRecipients.value.map((item) => {
    const solAmount = decimalToSolNumber(
      item.amount,
      selectedToken.value.decimals
    );
    const newData = { ...item }; // must create a copy otherwise the ref is modified in place
    newData.amount = solAmount;
    return newData;
  });
  try {
    const data = await templatesStore.createNativeMultiPayment(
      itemsSol,
      selectedNetwork.value.chainId,
      selectedNetwork.value.disperseContract
    );
    multiSendId.value = data;
  } catch (error) {
    multiSendId.value = "";
    console.error(error);
  } finally {
  }
}

async function authorizePayment() {
  const sumSol = decimalToSolNumber(
    String(payrollSum.value),
    selectedToken.value.decimals
  );
  const itemsSol = templateRecipients.value.map((item) => {
    const solAmount = decimalToSolNumber(
      item.amount,
      selectedToken.value.decimals
    );
    const newData = { ...item }; // must create a copy otherwise the ref is modified in place
    newData.amount = solAmount;
    return newData;
  });

  paymentLoading.value = true;
  try {
    const data = await templatesStore.createMultiPayment(
      itemsSol,
      selectedNetwork.value.chainId,
      selectedNetwork.value.disperseContract,
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
      selectedToken.value.address,
      selectedNetwork.value.chainId,
      selectedNetwork.value.disperseContract,
      addresses,
      amounts,
      multiSendId.value,
      isNativeToken.value
    );
  } catch (err) {
    console.error(err);
  } finally {
    paymentLoading.value = false;
    router.push(`/payrolls/previous-payments/${multiSendId.value}`);
  }
}
</script>

<template>
  <div>
    <div class="flex flex-row items-center justify-between">
      <div class="flex flex-col">
        <div
          v-if="!isEditModeEnabled"
          class="text-sm font-semibold uppercase text-violet-600"
        >
          Start payroll
        </div>
        <div v-else class="text-sm font-semibold uppercase text-violet-600">
          Edit payroll
        </div>
        <div class="mt-1">
          <div v-if="!isEditModeEnabled" class="mb-4 text-lg text-slate-600">
            {{ templateName }}
          </div>
          <div v-else class="mb-4 text-lg text-slate-600">
            <input
              class="border px-1 border-1 rounded-md focus:outline-none focus:border-violet-500"
              v-model="templateName"
            />
          </div>
        </div>
      </div>
      <button
        :disabled="
          isEditModeEnabled &&
          (templateName.length === 0 || templateRecipients.length === 0)
        "
        @click="toggleEdit"
        class="flex flex-row items-center gap-2 hover:bg-violet-50 cursor-pointer font-semibold text-xs uppercase text-slate-700 border rounded-full py-2 px-6 disabled:bg-slate-200 disabled:text-gray-400"
      >
        <div v-if="!isEditModeEnabled">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </div>
        <div v-else>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <div v-if="!isEditModeEnabled">Edit template</div>
        <div v-else>Done</div>
      </button>
    </div>

    <div class="flex flex-row gap-2">
      <div
        class="pl-4 py-4 pr-8 mb-3 bg-indigo-50 rounded-lg font-semibold text-slate-600 text-sm w-fit"
      >
        <div class="text-xs uppercase font-semibold text-violet-700">
          Total amount to be paid out
        </div>
        <span class="text-lg"
          >{{ payrollSum }} {{ selectedToken.symbol }}
        </span>
      </div>
    </div>

    <div class="mb-4" v-show="templateRecipients">
      <div
        v-for="recipient in templateRecipients"
        :key="recipient.id"
        class="gap-y-2 flex flex-col"
      >
        <PayrollsRecipientItem
          :is-editable="isEditModeEnabled"
          :recipient="recipient"
        ></PayrollsRecipientItem>
      </div>
    </div>

    <div
      v-if="isEditModeEnabled"
      class="w-full text-sm uppercase text-slate-500 font-semibold"
    >
      Add new recipients to payroll
    </div>
    <div v-if="isEditModeEnabled" class="mb-4">
      <PayrollsRecipientItem></PayrollsRecipientItem>
    </div>

    <div v-if="!isEditModeEnabled" class="flex justify-start">
      <button
        v-if="multiSendId.length === 0 && !isNativeToken"
        :disabled="!templateExecutable || paymentLoading"
        class="rounded-full bg-gradient-to-r font-bold from-violet-700 to-purple-500 text-white py-2.5 px-12 text-sm uppercase disabled:from-slate-200 disabled:to-slate-200 disabled:text-gray-400"
        @click="authorizePayment"
      >
        <div v-if="paymentLoading" class="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4 animate-spin mr-2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>

          <span class="text-xs">Authorizing</span>
        </div>

        <div v-else>
          <span class="flex flex-row gap-1 items-start">
            <div class="text-xs">Step 1</div>
            <div class="text-xs mx-1">•</div>
            <div class="text-xs">Approve</div>
          </span>
        </div>
      </button>

      <button
        v-else
        :disabled="paymentLoading"
        class="rounded-full bg-gradient-to-r font-bold from-violet-700 to-purple-500 text-white py-2.5 px-12 text-sm uppercase disabled:from-slate-200 disabled:to-slate-200 disabled:text-gray-400"
        @click="executePayment"
      >
        <div v-if="paymentLoading" class="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4 animate-spin mr-2"
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
          <span class="flex flex-row gap-1 uppercase items-start">
            <div v-if="!isNativeToken" class="flex items-center">
              <div class="text-xs">Step 2</div>
              <div class="text-xs mx-1">•</div>
            </div>
            <div class="text-xs">Execute Payment</div>
          </span>
        </div>
      </button>
    </div>
  </div>
</template>

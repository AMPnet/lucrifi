<script setup lang="ts">
import { useTokensStore } from "@/stores/tokens";
import { useNetworksStore } from "@/stores/networks";
import { useTemplates } from "@/stores/templates";
import { useAddressBook } from "@/stores/addressBook";
import { NewTemplate, Recipient } from "@/types/payrolls/TemplateData";

definePageMeta({
  layout: "payrolls",
});

const router = useRouter();

const addressBook = useAddressBook();
addressBook.fetchAliases();

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
const tokenLogoUri = computed(() => selectedToken.value.logoURI);
const tokenSymbol = computed(() => selectedToken.value.symbol);

const showTokenModal = ref(false);
const showNetworkModal = ref(false);

const templateRecipients = useState<Array<Recipient>>(
  "newTemplateRecipients",
  () => []
);

const templateName = useState<string>("newTemplateName", () => "");

const templateValid = computed(() => {
  const nameValid = templateName.value.length > 0;
  const recipientsValid = templateRecipients.value.length > 0;
  return nameValid && recipientsValid;
});

async function saveTemplate() {
  // Convert amounts to Solidity supported amounts
  const itemsSolAmounts = templateRecipients.value.map((item) => {
    const solAmount = decimalToSolNumber(
      item.amount,
      selectedToken.value.decimals
    );
    item.amount = solAmount;
    return item;
  });

  const assetType =
    selectedToken.value.address === NATIVE_TOKEN_ADDR ? "NATIVE" : "TOKEN";

  const newTemplate: NewTemplate = {
    template_name: templateName.value,
    items: itemsSolAmounts,
    chain_id: selectedNetwork.value.chainId,
    asset_type: assetType,
    token_address: selectedToken.value.address,
  };

  try {
    templatesStore.addTemplate(newTemplate);
    templateName.value = "";
    templateRecipients.value = [];

    router.push("/payrolls/templates");
  } catch (error) {}
}
</script>

<template>
  <div>
    <NewRequestSelectTokenModal
      :chain-id="selectedNetwork.chainId"
      :tokens="filteredTokenList"
      v-if="showTokenModal"
      @close="showTokenModal = false"
    />
    <PayrollsSelectNetworkModal
      v-if="showNetworkModal"
      @close="showNetworkModal = false"
    />
    <div class="flex items-center mb-6">
      <input
        v-model="templateName"
        class="text-xl mr-2 p-1 focus:outline-none bg-inherit rounded-lg border border-transparent hover:border-gray-200 focus:border-violet-500"
        placeholder="Enter template name"
      />
    </div>

    <h2 class="text-sm font-semibold mb-3">Select Network and Token</h2>

    <div class="flex items-center gap-4 mb-8">
      <button
        class="bg-white rounded-full px-2.5 py-2 text-sm font-semibold border border-slate-200"
        @click="showNetworkModal = true"
      >
        <div class="flex items-center">
          <img :src="selectedNetwork.logoURI" class="h-5 w-5" />

          <span class="mx-2.5"> {{ selectedNetwork.name }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
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
        </div>
      </button>

      <button
        class="bg-white rounded-full px-2.5 py-2 text-sm font-semibold border border-slate-200"
        @click="showTokenModal = true"
      >
        <div class="flex items-center">
          <img :src="`/tokens/${tokenLogoUri}`" class="h-5 w-5" />

          <span class="mx-2.5"> {{ tokenSymbol }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
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
        </div>
      </button>
    </div>

    <div class="mb-4" v-show="templateRecipients">
      <div
        v-for="(recipient, index) in templateRecipients"
        :key="index"
        class="gap-y-2 flex flex-col"
      >
        <PayrollsNewRecipientItem
          :recipient="recipient"
        ></PayrollsNewRecipientItem>
      </div>
    </div>

    <div class="mb-10">
      <PayrollsNewRecipientItem></PayrollsNewRecipientItem>
    </div>

    <div class="flex justify-start">
      <button
        :disabled="!templateValid"
        class="rounded-full bg-gradient-to-r font-bold from-violet-700 to-purple-500 text-white py-2.5 px-8 text-lg disabled:from-slate-200 disabled:to-slate-200 disabled:text-gray-400"
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
    </div>
  </div>
</template>

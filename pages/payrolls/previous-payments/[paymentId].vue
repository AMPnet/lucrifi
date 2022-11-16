<script setup lang="ts">
import { Ref } from "vue";
import { Token } from "@/types/Token";
import { Network } from "@/types/Network";
import { useTemplates } from "@/stores/templates";
import { Recipient } from "@/types/payrolls/TemplateData";
import { useTokensStore } from "@/stores/tokens";
import { useNetworksStore } from "@/stores/networks";
import { useWallet } from "@/stores/wallet";
import { MultiSendPayment } from "@/types/payrolls/MultiSend";

definePageMeta({
  layout: "payrolls",
});

const route = useRoute();
const networkStore = useNetworksStore();
const tokensListStore = useTokensStore();
const templatesStore = useTemplates();

const templateRecipients: Ref<Array<Recipient>> = ref([]);

const selectedToken = useState<Token>("selectedToken");
const selectedNetwork = useState<Network>("selectedNetwork");
const dataLoading = ref(true);
const paymentLoading = ref(false);
const paymentExecuted = ref(false);
const txHash = ref("");

try {
  const runtimeConfig = useRuntimeConfig();
  const wallet = useWallet();

  const data = await $fetch<MultiSendPayment>(
    `${runtimeConfig.public.backendUrl}/multi-send/${route.params.paymentId}`,
    {
      headers: { Authorization: `Bearer ${wallet.jwt.accessToken}` },
    }
  );

  paymentExecuted.value =
    data.approve_status === "SUCCESS" && data.disperse_status === "SUCCESS";

  const networks = networkStore.networksList;
  selectedNetwork.value = networks.find((x) => x.chainId === data.chain_id);

  if (paymentExecuted.value) {
    txHash.value = `${selectedNetwork.value.blockExplorerUrl}/${data.disperse_tx.tx_hash}`;
  }

  const filteredTokenList = computed(() => {
    return tokensListStore.tokensList(selectedNetwork.value.chainId);
  });
  let tokenAddr = NATIVE_TOKEN_ADDR;
  if (data.asset_type === "TOKEN") {
    tokenAddr = data.token_address;
  }
  selectedToken.value = filteredTokenList.value.find(
    (token) => token.address.toLowerCase() === tokenAddr.toLowerCase()
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

  dataLoading.value = false;
} catch (error) {
  console.error(error);
}

const payrollSum = computed(() => {
  const sum = templateRecipients.value.reduce(
    (a, b) => a + Number(b.amount),
    0
  );
  return new Intl.NumberFormat("en-US").format(sum);
});

async function executePayment() {
  const addresses = templateRecipients.value.map((x) => x.wallet_address);
  const amounts = templateRecipients.value.map((x) =>
    decimalToSolNumber(x.amount, selectedToken.value.decimals)
  );
  paymentLoading.value = true;
  try {
    const data = await templatesStore.disperseFunctionCall(
      selectedToken.value.address,
      selectedNetwork.value.chainId,
      selectedNetwork.value.disperseContract,
      addresses,
      amounts,
      String(route.params.paymentId),
      false // only real tokens will be visible hear as native tokens don't have 2 step process
    );
    paymentExecuted.value = true;
    txHash.value = `${selectedNetwork.value.blockExplorerUrl}/${data.disperse_tx.tx_hash}`;
  } catch (err) {
    console.error(err);
  } finally {
    paymentLoading.value = false;
  }
}
</script>

<template>
  <div>
    <div v-if="!dataLoading">
      <div class="flex flex-row gap-2">
        <div
          class="pl-4 py-4 pr-8 mb-3 bg-indigo-50 rounded-lg font-semibold text-slate-600 text-sm w-fit"
        >
          <div class="text-xs uppercase font-semibold text-violet-700">
            Total amount
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
            :is-editable="false"
            :recipient="recipient"
          ></PayrollsRecipientItem>
        </div>
      </div>

      <div class="flex justify-start">
        <div v-if="!paymentExecuted">
          <button
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
              <span class="flex text-xs flex-row gap-1 uppercase items-start">
                <div>Step 2</div>
                <div class="mx-1">•</div>
                <div>Execute Payment</div>
              </span>
            </div>
          </button>
        </div>
        <div v-else class="flex items-center">
          <div
            class="rounded-lg bg-gradient-to-r font-bold from-green-700 to-green-500 text-white py-2 px-6 text-sm uppercase disabled:from-slate-200 disabled:to-slate-200 disabled:text-gray-400"
          >
            <div class="flex items-center text-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 mr-1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <span>Payment successfully executed </span>
            </div>
          </div>
          <a
            :href="txHash"
            target="_blank norelopener"
            class="ml-1.5 rounded-lg bg-gray-200 p-2.5 hover:bg-gray-300 text-gray-700"
          >
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
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>

    <div class="text-center" v-else>Loading...</div>
  </div>
</template>

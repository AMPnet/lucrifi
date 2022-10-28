<script setup lang="ts">
import { Ref } from "vue";
import { useWallet } from "@/stores/wallet";
import { useTokensStore } from "@/stores/tokens";
import { useNetworksStore } from "@/stores/networks";
import {
  MultiSendPayment,
  MultiSendPaymentListItem,
} from "@/types/payrolls/MultiSend";
import { parseDatetime } from "@/composables/util";

definePageMeta({
  layout: "payrolls",
});

interface MultiSendResponse {
  requests: Array<MultiSendPayment>;
}

const wallet = useWallet();
const runtimeConfig = useRuntimeConfig();

onMounted(() => {
  if (!wallet.accessTokenValid) {
    wallet.refreshAccessToken();
  }
});

const networkStore = useNetworksStore();
const tokensListStore = useTokensStore();

const prevPayments: Ref<Array<MultiSendPaymentListItem>> = ref([]);

const { data, pending } = useFetch<MultiSendResponse>(
  `${runtimeConfig.public.backendUrl}/multi-send/by-sender/${wallet.walletAddress}`,
  {
    key: String(Date.now()),
  }
);

watch(data, (newData) => {
  const sortedRequests = newData.requests.sort((a, b) => {
    const date1 = Date.parse(a.created_at);
    const date2 = Date.parse(b.created_at);
    return date2 - date1;
  });

  for (const request of sortedRequests) {
    const network = networkStore.networksList.find(
      (network) => network.chainId == request.chain_id
    );
    const tokensList = tokensListStore.tokensList(network.chainId);
    const token = tokensList.find(
      (token) => token.address.toLowerCase() === request.token_address
    );

    const totalPayment = request.items.reduce(
      (a, b) => a + Number(solNumberToDecimal(b.amount, token.decimals)),
      0
    );

    let status = "PENDING_APPROVE";
    if (
      request.approve_status === "FAILED" ||
      request.disperse_status === "FAILED"
    ) {
      status = "FAILED";
    } else if (
      request.approve_status === "SUCCESS" &&
      request.disperse_status === "SUCCESS"
    ) {
      status = "SUCCESS";
    } else if (
      request.approve_status === "SUCCESS" &&
      request.disperse_status === "PENDING"
    ) {
      status = "PENDING_EXECUTION";
    }

    const payment = {
      totalPayment: totalPayment,
      currencySymbol: token.symbol,
      processedOn: parseDatetime(request.created_at),
      status: status,
      txHash: request.disperse_tx.tx_hash,
      chainId: request.chain_id,
    };
    prevPayments.value.push(payment);
  }
});
</script>

<template>
  <div>
    <div class="rounded-t-md border-t border-x border-slate-200">
      <div
        class="bg-slate-100 rounded-t-md text-black font-bold text-sm grid grid-cols-12 py-4 px-5"
      >
        <span class="col-span-4">Total payment</span>
        <span class="col-span-2">Processed on</span>
        <span class="col-span-4">Status</span>
        <span class="col-span-2 text-center">Actions</span>
      </div>
      <div v-if="pending">
        <h3 class="text-center text-base mt-8 text-slate-400">
          Loading data...
        </h3>
      </div>

      <div v-else>
        <div v-if="prevPayments.length > 0">
          <PayrollsPreviousPayment
            v-for="(payment, index) in prevPayments"
            :key="index"
            :payment="payment"
          ></PayrollsPreviousPayment>
        </div>
        <div v-else class="border-b border-slate-200">
          <h3 class="text-center text-base my-8 text-slate-400">
            No previous payments found
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

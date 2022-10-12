<script setup lang="ts">
import { Ref } from "vue";
import { useWallet } from "@/stores/wallet";
import {
  MultiSendPayment,
  MultiSendPaymentListItem,
} from "@/types/payrolls/MultiSend";
import { useTokensStore } from "@/stores/tokens";
import { parseDatetime } from "@/composables/util";

definePageMeta({
  layout: "payrolls",
});

interface MultiSendResponse {
  requests: Array<MultiSendPayment>;
}

const tokensStore = useTokensStore();
const wallet = useWallet();
const runtimeConfig = useRuntimeConfig();

onMounted(() => {
  if (!wallet.accessTokenValid) {
    wallet.refreshAccessToken();
  }
});

const { data, error, pending } = await useFetch<MultiSendResponse>(
  `${runtimeConfig.public.backendUrl}/multi-send/by-sender/${wallet.walletAddress}`
);

const prevPayments: Ref<Array<MultiSendPaymentListItem>> = ref([]);

watch(data, (newData) => {
  for (const request of newData.requests) {
    const totalPayment = request.items.reduce(
      (a, b) => a + Number(b.amount),
      0
    );
    const tokensList = tokensStore.tokensList(request.chain_id);
    const token = tokensList.find(
      (x) => x.address.toLowerCase() === request.token_address.toLowerCase()
    );
    const payment = {
      totalPayment: totalPayment,
      currencySymbol: token.symbol,
      processedOn: parseDatetime(request.created_at),
      status: request.approve_status,
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
        <h3 class="text-center text-lg mt-8 text-slate-400">Loading data...</h3>
      </div>

      <div v-else>
        <div v-if="prevPayments.length > 0">
          <PayrollsPreviousPayment
            v-for="(payment, index) in prevPayments"
            :key="index"
            :total-payment="payment.totalPayment"
            :currency-symbol="payment.currencySymbol"
            :processed-date="payment.processedOn"
            :status="payment.status"
          ></PayrollsPreviousPayment>
        </div>
        <div class="border-b border-slate-200">
          <h3 class="text-center text-lg my-8 text-slate-400">
            No previous payments found
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

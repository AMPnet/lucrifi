<script setup lang="ts">
import { FetchERC20SendRequestsByRecipientAddress } from "@/types/ampnet/RequestPayment";
import { useWallet } from "@/stores/wallet";

const wallet = useWallet();
const runtimeConfig = useRuntimeConfig();

const { data, error, pending } =
  useLazyFetch<FetchERC20SendRequestsByRecipientAddress>(
    `${runtimeConfig.public.backendUrl}/send/by-recipient/${wallet.walletAddress}`
  );

if (error.value) {
  navigateTo("/errorPage");
}

const requests = computed(() =>
  data.value.requests.sort((a, b) => {
    if (a.arbitrary_data && b.arbitrary_data) {
      const date1 = Date.parse(a.arbitrary_data.created);
      const date2 = Date.parse(b.arbitrary_data.created);
      return date2 - date1;
    }
    return 0;
  })
);

const noData = computed(() => !pending.value && requests.value.length === 0);
</script>

<template>
  <div
    class="bg-white border border-slate-200 rounded-xl py-4 mx-2 xl:mx-24 overflow-y-scroll"
    :class="'h-fit' ? noData : 'h-[550px] lg:h-[700px]'"
  >
    <div class="hidden sm:grid grid-cols-12 text-sm font-bold pb-5 px-6">
      <div class="col-span-3">Amount & token</div>
      <div>Chain</div>
      <div class="col-span-2">Created at</div>
      <div class="col-span-2">Status</div>
      <div class="col-span-3">Note</div>
    </div>

    <div v-if="!pending" v-for="request of requests" :key="request.id">
      <PaymentsRequestListItem
        :amount="request.amount"
        :token-address="request.token_address"
        :chain-id="request.chain_id"
        :created="
          request.arbitrary_data ? request.arbitrary_data.created || '' : ''
        "
        :note="request.arbitrary_data ? request.arbitrary_data.note : ''"
        :status="request.status"
        :id="request.id"
        :redirect-url="request.redirect_url"
        :tx-hash="request.send_tx.tx_hash"
      />
    </div>
    <div v-else class="text-center py-5 text-slate-400">
      <h3>Loading...</h3>
    </div>

    <h3 class="text-center py-5 text-slate-400" v-if="noData">
      No payment requests found
    </h3>
  </div>
</template>

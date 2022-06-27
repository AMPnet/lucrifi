<script setup lang="ts">
import { FetchERC20SendRequestsByRecipientAddress } from "@/types/ampnet/RequestPayment";
import { useWallet } from "@/stores/wallet";

const wallet = useWallet();
const runtimeConfig = useRuntimeConfig();

const { data, error, pending } =
  useLazyFetch<FetchERC20SendRequestsByRecipientAddress>(
    `${runtimeConfig.public.backendUrl}/send/by-sender/${wallet.walletAddress}`
  );

if (error.value) {
  navigateTo("/errorPage");
}

const requests = computed(() => data.value.requests);
</script>

<template>
  <div class="bg-white border border-slate-200 rounded-xl py-4 mx-2 lg:mx-24">
    <div class="hidden sm:grid grid-cols-9 text-sm font-bold pb-5 px-6">
      <div class="col-span-3">Amount & token</div>
      <div>Chain</div>
      <div class="col-span-2">To wallet</div>
      <div class="col-span-2">Status</div>
    </div>
    <div v-if="!pending" v-for="request of requests" :key="request.id">
      <PaymentsSentListItem
        :amount="request.amount"
        :token-address="request.token_address"
        :chain-id="request.chain_id"
        :to-wallet-addr="request.recipient_address"
        :status="request.status"
        :id="request.id"
        :redirect-url="request.redirect_url"
        :tx-hash="request.send_tx.tx_hash"
      />
    </div>
    <div v-else class="text-center py-5 text-slate-400">
      <h3>Loading...</h3>
    </div>
    <h3
      class="text-center py-5 text-slate-400"
      v-if="!pending && requests.length === 0"
    >
      No transactions found
    </h3>
  </div>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();

//const { data, error } = await useFetch(`${runtimeConfig.public.backendUrl}/`);

const data = [
  {
    ammount: 2.2,
    chain: 1,
    status: "Paid",
    id: "1",
    toWallet: "0x6aec30c04751f512db03720a969293bf6196ca61",
  },
  {
    ammount: 2342,
    chain: 1,
    status: "Pending",
    id: "2",
    toWallet: "0x6aec30c04751f512db03720a969293bf6196ca61",
  },
  {
    ammount: 2342,
    chain: 2,
    status: "Paid",
    id: "35",
    toWallet: "0x6aec30c04751f512db03720a969293bf6196ca61",
  },
  {
    ammount: 24982304802930,
    chain: 1,
    status: "Paid",
    id: "242",
    toWallet: "0x6aec30c04751f512db03720a969293bf6196ca61",
  },
  {
    ammount: 358390.35332,
    chain: 1,
    status: "Paid",
    id: "33",
    toWallet: "0x6aec30c04751f512db03720a969293bf6196ca61",
  },
];
</script>

<template>
  <div class="bg-white border border-slate-200 rounded-xl py-4 mx-2 lg:mx-24">
    <div class="hidden sm:grid grid-cols-9 text-sm font-bold pb-5 px-6">
      <div class="col-span-3">Amount & token</div>
      <div>Chain</div>
      <div class="col-span-2">To wallet</div>
      <div class="col-span-2">Status</div>
    </div>

    <div v-for="transaction of data" :key="transaction.ammount">
      <PaymentsSentListItem
        :amount="transaction.ammount"
        chain-logo-url="P"
        :status="transaction.status"
        :id="transaction.id"
        :to-wallet-addr="transaction.toWallet"
      />
    </div>
  </div>
</template>

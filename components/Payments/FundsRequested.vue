<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();

//const { data, error } = await useFetch(`${runtimeConfig.public.backendUrl}/`);

const data = [
  {
    ammount: 2.2,
    chain: 1,
    status: "Paid",
    Note: "",
    date: "25 Aug 2022",
    id: "1",
  },
  {
    ammount: 2342,
    chain: 1,
    status: "Pending",
    Note: " Dafuuuq fjeijf oiejfj ifej oifjeoi jfoi ejoifj eoijfoeijfoiej fioejio jeoi jeoi jfoie",
    date: "25 Aug 2022",
    id: "2",
  },
  {
    ammount: 2342,
    chain: 2,
    status: "Paid",
    Note: "",
    date: "25 Aug 2022",
    id: "35",
  },
  {
    ammount: 24982304802930,
    chain: 1,
    status: "Paid",
    Note: "",
    date: "25 Aug 2022",
    id: "242",
  },
  {
    ammount: 358390.35332,
    chain: 1,
    status: "Paid",
    Note: "Test nonte",
    date: "25 Aug 2022",
    id: "33",
  },
];
</script>

<template>
  <div class="bg-white border border-slate-200 rounded-xl py-4 mx-2 xl:mx-24">
    <div class="hidden sm:grid grid-cols-12 text-sm font-bold pb-5 px-6">
      <div class="col-span-3">Amount & token</div>
      <div>Chain</div>
      <div class="col-span-2">Created at</div>
      <div class="col-span-2">Status</div>
      <div class="col-span-3">Note</div>
    </div>

    <div v-for="transaction of data" :key="transaction.ammount">
      <PaymentsRequestListItem
        :amount="transaction.ammount"
        chain-logo-url="P"
        :created="transaction.date"
        :note="transaction.Note"
        :status="transaction.status"
        :id="transaction.id"
      />
    </div>
  </div>
</template>

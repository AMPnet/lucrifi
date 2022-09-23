<script setup lang="ts">
definePageMeta({
  layout: "payrolls",
});

const prevPayments = [
  {
    templateName: "template1",
    totalPayment: 300000,
    processedOn: "25 Aug 2022",
    status: "SUCCESS",
    currencySymbol: "USDC",
  },
  {
    templateName: "template2",
    totalPayment: 1200,
    processedOn: "28 Aug 2022",
    status: "PENDING",
    currencySymbol: "AAPX",
  },
];
</script>

<template>
  <div>
    <div class="rounded-t-md border-t border-x border-slate-200">
      <div
        class="bg-slate-100 rounded-t-md text-black font-bold text-sm grid grid-cols-12 py-4 px-5"
      >
        <span class="col-span-4">Template used</span>
        <span class="col-span-2">Total payment</span>
        <span class="col-span-2">Processed on</span>
        <span class="col-span-2">Status</span>
        <span class="col-span-2 text-center">Actions</span>
      </div>

      <div>
        <PayrollsPreviousPayment
          v-for="(payment, index) in prevPayments"
          :key="index"
          :template-name="payment.templateName"
          :total-payment="payment.totalPayment"
          :currency-symbol="payment.currencySymbol"
          :processed-date="payment.processedOn"
          :status="payment.status"
        ></PayrollsPreviousPayment>
      </div>
    </div>
  </div>
</template>

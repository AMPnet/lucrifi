<script setup lang="ts">
import { PropType } from "vue";
import { MultiSendPaymentListItem } from "@/types/payrolls/MultiSend";
import { useNetworksStore } from "@/stores/networks";

const props = defineProps({
  payment: Object as PropType<MultiSendPaymentListItem>,
});

const networkStore = useNetworksStore();
const network = networkStore.networksList.find(
  (x) => x.chainId === props.payment.chainId
);

const statusMapping = {
  SUCCESS: {
    title: "Paid",
    class: "text-green-400",
  },
  PENDING_APPROVE: {
    title: "Pending Authorization",
    class: "text-gray-400",
  },
  PENDING_EXECUTION: {
    title: "Pending Execution",
    class: "text-gray-400",
  },
  FAILED: {
    title: "Failed",
    class: "text-red-400",
  },
};

const showMenu = ref(false);

const prettyAmount = computed(() => {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 10 }).format(
    props.payment.totalPayment
  );
});
</script>

<template>
  <div class="bg-white text-gray-700 py-6 px-5 border-b border-slate-200">
    <div class="grid grid-cols-12">
      <span class="col-span-3 flex items-center gap-1.5 text-xs">
        <span>{{ prettyAmount }} {{ props.payment.currencySymbol }}</span>
      </span>

      <div class="col-span-2 flex items-center text-xs">
        <img class="w-4 h-4 mr-1.5" :src="network?.logoURI" loading="lazy" />
        <span>{{ network?.name }}</span>
      </div>

      <span class="col-span-2 text-xs text-slate-500 self-center">{{
        props.payment.processedOn
      }}</span>

      <div class="col-span-3 text-xs">
        <div
          class="flex items-center"
          :class="statusMapping[props.payment.status].class"
        >
          <div class="mr-1">
            <svg
              v-if="props.payment.status.toLowerCase() === 'success'"
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <svg
              v-else-if="props.payment.status.toLowerCase() === 'failed'"
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
                d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <svg
              v-else
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span>{{ statusMapping[props.payment.status].title }}</span>

          <a
            v-if="props.payment.status.toLowerCase() === 'success'"
            :href="`${network.blockExplorerUrl}/${props.payment.txHash}`"
            target="_blank norelopener"
            class="ml-2 rounded-full bg-gray-100 p-1.5 hover:bg-gray-300 text-gray-700"
          >
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
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>

      <div class="col-span-2 flex items-center justify-center">
        <div class="relative flex justify-start sm:justify-end">
          <button @click="showMenu = !showMenu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
          </button>

          <div
            v-show="showMenu"
            class="absolute z-10 left-0 sm:left-auto sm:right-0 top-6"
          >
            <div class="min-h-full py-3 sm:py-0 text-center">
              <div
                class="bg-white flex flex-col gap-3 rounded-lg py-2 text-sm text-left overflow-hidden shadow-lg sm:w-full"
              >
                <NuxtLink
                  :to="`/payrolls/previous-payments/${props.payment.id}`"
                  class="hover:bg-slate-100 whitespace-nowrap w-full px-4 py-1.5"
                >
                  <div class="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-5 h-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>

                    <div>Show Details</div>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

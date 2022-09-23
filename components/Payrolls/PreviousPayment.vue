<script setup lang="ts">
const props = defineProps({
  templateName: {
    type: String,
    required: true,
  },
  totalPayment: {
    type: Number,
    required: true,
  },
  currencySymbol: {
    type: String,
    required: true,
  },
  processedDate: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

const statusMapping = {
  SUCCESS: {
    title: "Paid",
    class: "text-green-400",
  },
  PENDING: {
    title: "Waiting payment",
    class: "text-gray-400",
  },
  FAILED: {
    title: "Failed",
    class: "text-red-400",
  },
};

const showMenu = ref(false);

const prettyAmount = computed(() => {
  return new Intl.NumberFormat().format(props.totalPayment);
});
</script>

<template>
  <div class="bg-white text-gray-700 py-6 px-5 border-b border-slate-200">
    <div class="grid grid-cols-12">
      <span class="col-span-4 self-center text-sm font-bold">
        {{ props.templateName }}</span
      >

      <span class="col-span-2 flex items-center gap-1.5 text-xs">
        <span>{{ prettyAmount }} {{ props.currencySymbol }}</span>
      </span>

      <span class="col-span-2 text-xs text-slate-500 self-center">{{
        props.processedDate
      }}</span>

      <div class="col-span-2">
        <div
          class="flex items-center"
          :class="statusMapping[props.status].class"
        >
          <div class="mr-1">
            <svg
              v-if="props.status.toLowerCase() === 'success'"
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
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
              v-else-if="props.status.toLowerCase() === 'failed'"
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
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
              class="h-6 w-6"
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
          <span>{{ statusMapping[props.status].title }}</span>

          <a
            v-if="props.status.toLowerCase() === 'success'"
            href="#"
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
                <button
                  @click=""
                  class="hover:bg-slate-100 whitespace-nowrap w-full px-4 py-1.5"
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
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                      />
                    </svg>

                    <span>Repeat Payment</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

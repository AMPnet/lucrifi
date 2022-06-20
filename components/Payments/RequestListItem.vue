<script setup lang="ts">
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  chainLogoUrl: {
    type: String,
    required: true,
  },
  created: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
});

const showMenu = ref(false);

const statusColorClass = computed(() => {
  if (props.status.toLowerCase() === "paid") {
    return "text-green-400";
  } else if (props.status.toLowerCase() === "failed") {
    return "text-red-400";
  } else {
    return "text-gray-400";
  }
});
</script>
<template>
  <div
    class="grid grid-cols-12 py-5 items-center border-b border-slate-2 text-sm font-bold px-6 text-slate-400"
  >
    <div class="col-span-3 text-gray-700 text-base">{{ amount }}</div>
    <div>{{ chainLogoUrl }}</div>
    <div class="col-span-2 text-xs">{{ created }}</div>
    <div class="col-span-2">
      <div class="flex items-center" :class="statusColorClass">
        <div class="mr-1">
          <svg
            v-if="status.toLowerCase() === 'paid'"
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
            v-else-if="status.toLowerCase() === 'failed'"
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
        <span>{{ status }}</span>

        <a
          href="https://www.google.com"
          target="_blank"
          class="ml-2 rounded-full bg-gray-100 p-1.5 hover:bg-gray-300 text-gray-700"
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
    <div class="col-span-3 truncate text-xs">{{ note }}</div>
    <div class="relative">
      <div class="flex justify-end">
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
      </div>

      <div v-show="showMenu" class="absolute z-10 right-0 top-4">
        <div class="min-h-full py-3 sm:py-0 text-center">
          <div
            class="bg-white rounded-lg py-2 text-sm text-left overflow-hidden shadow-xl sm:w-full"
          >
            <button
              class="hover:bg-slate-100 whitespace-nowrap w-full px-4 py-1.5"
            >
              <div class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span> Preview</span>
              </div>
            </button>
            <button
              class="hover:bg-slate-100 whitespace-nowrap w-full px-4 py-1.5"
            >
              <div class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span> Use as template </span>
              </div>
            </button>
            <button
              class="hover:bg-slate-100 whitespace-nowrap w-full px-4 py-1.5"
            >
              <div class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                  />
                </svg>
                <span>Copy link </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

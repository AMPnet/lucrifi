<script setup>
import { useClipboard } from "@vueuse/core";
const { copy } = useClipboard();

const transferUrl = ref("www.ampnetpa24234934abcd");

const showCopyDialog = ref(false);

function openCopiedDialog() {
  showCopyDialog.value = true;
  setTimeout(() => (showCopyDialog.value = false), 1000);
}
</script>

<template>
  <div class="text-center">
    <Transition>
      <LinkCopiedDialog v-show="showCopyDialog" />
    </Transition>

    <div class="text-gray-700 bg-white py-6 px-5 inline-flex rounded-xl">
      <div class="w-full sm:w-96">
        <h2 class="text-lg font-bold">Transfer request</h2>
        <div class="flex items-center justify-center mt-5">
          <img
            src="https://seeklogo.com/images/U/usd-coin-usdc-logo-CB4C5B1C51-seeklogo.com.png"
            class="w-5 h-5"
          />
          <span class="ml-1.5 text-2xl font-bold">2030 USDC</span>
        </div>

        <div class="flex items-center justify-center mt-1.5">
          <img
            src="https://seeklogo.com/images/U/usd-coin-usdc-logo-CB4C5B1C51-seeklogo.com.png"
            class="w-4 h-4"
          />
          <span class="ml-1.5 text-sm font-bold">Polygon</span>
        </div>

        <div class="text-xs mt-3.5">
          To: 0x829BD824B016326A401d083B33D092293333A830
        </div>

        <div class="mt-7 flex justify-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/QR_icon.svg/1200px-QR_icon.svg.png"
            class="w-36 h-36"
          />
        </div>

        <button
          @click="
            copy(transferUrl);
            openCopiedDialog();
          "
          class="rounded-full bg-slate-200 px-3 py-1 mt-1.5"
        >
          <div class="flex items-center text-sm">
            <span> {{ transferUrl }} </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
        </button>

        <div class="flex items-center justify-center mt-7 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-1.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
          <span>Ser, thank you ser</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

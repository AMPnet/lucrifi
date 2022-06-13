<template>
  <div
    class="relative z-10"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="fixed z-10 inset-0 overflow-y-auto">
      <div
        class="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0"
      >
        <div
          class="relative bg-white p-6 rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-xs sm:w-full"
        >
          <h2 class="md:text-xl">Link Copied</h2>
          <div class="flex justify-center mt-4">
            <img
              src="/icons/copy-to-clipboard.svg"
              class="w-12 h-12 sm:w-32 sm:h-32"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

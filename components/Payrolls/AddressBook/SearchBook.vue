<script setup lang="ts">
import { useAddressBook } from "@/stores/addressBook";
import { AddressAlias } from "@/types/payrolls/AddressAlias";

const addressBook = useAddressBook();
const aliases = addressBook.data;

const searchQuery = ref("");
const queriedAliases = computed(() => {
  if (searchQuery.value == "") {
    return aliases;
  } else {
    const queried: Array<AddressAlias> = [];
    const queryLowerCase = searchQuery.value.toLowerCase();

    for (const alias of aliases) {
      if (alias.alias.toLowerCase().includes(queryLowerCase)) {
        queried.push(alias);
      }
    }
    return queried;
  }
});
</script>

<template>
  <div
    class="relative z-10"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75"></div>

    <div class="fixed z-10 inset-0 overflow-y-auto">
      <div
        class="flex items-center justify-center min-h-full p-4 text-center sm:p-0"
      >
        <div
          class="w-96 relative bg-white pt-4 pb-4 rounded-lg overflow-hidden shadow-xl sm:my-8 sm:max-w-lg sm:w-full"
        >
          <div class="px-6 mb-4">
            <div class="flex flex-row-reverse">
              <button @click="$emit('close')">
                <svg
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <h3 class="text-center font-bold">Search in Address Book</h3>
            <input
              class="w-full px-4 py-3 mt-3 border border-slate-300 rounded focus:outline-none"
              v-model="searchQuery"
              type="text"
              placeholder="Search alias name"
            />
          </div>

          <div class="h-72 overflow-y-scroll">
            <h4
              v-if="queriedAliases.length === 0"
              class="text-slate-400 w-full"
            >
              No results found
            </h4>
            <button
              class="w-full text-left px-7 py-2 hover:bg-violet-100"
              v-for="alias in queriedAliases"
              :key="alias.alias"
              @click="$emit('selectAlias', alias)"
            >
              <div class="flex items-center">
                <span class="w-3/6 font-bold">{{ alias.alias }}</span>
                <span class="w-3s/6 text-xs text-slate-400">{{
                  alias.address
                }}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

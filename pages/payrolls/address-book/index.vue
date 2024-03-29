<script setup lang="ts">
import { useAddressBook } from "@/stores/addressBook";

const addressBook = useAddressBook();

const pending = ref(true);
addressBook.fetchAliases().finally(() => {
  pending.value = false;
});

definePageMeta({
  layout: "payrolls",
});

const searchQuery = ref("");

const queriedAliases = computed(() => {
  if (searchQuery.value == "") {
    return addressBook.aliases;
  } else {
    const queried = [];
    const queryLowerCase = searchQuery.value.toLowerCase();
    for (const alias of addressBook.aliases) {
      if (alias.alias.toLowerCase().includes(queryLowerCase)) {
        queried.push(alias);
      }
    }
    return queried;
  }
});

const showAddAliasModal = ref(false);
</script>

<template>
  <div>
    <PayrollsAddressBookAddAlias
      v-if="showAddAliasModal"
      address=""
      @close="showAddAliasModal = false"
    />

    <div>
      <div class="flex items-center justify-between">
        <button
          @click="showAddAliasModal = true"
          class="rounded-full bg-gradient-to-r px-12 font-bold from-violet-700 to-purple-500 text-white py-2.5 text-xs"
        >
          <div class="flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <span class="uppercase">Add Address</span>
          </div>
        </button>
        <div class="border-b-2 border-slate-300 text-slate-600 pl-4 py-1.5">
          <div class="flex items-center gap-3">
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
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>

            <input
              class="w-full focus:outline-none text-sm"
              type="text"
              placeholder="Search name"
              v-model="searchQuery"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-t-md border-t border-x border-slate-200 mt-6">
      <div
        class="bg-slate-100 uppercase rounded-t-md text-slate-700 font-bold text-sm grid grid-cols-9 py-4 px-5"
      >
        <span class="col-span-4">Alias</span>
        <span class="col-span-2">Address</span>
        <span class="col-span-2">Email</span>
        <span class="col-span-1 text-center">Actions</span>
      </div>

      <div v-if="pending" class="border-b">
        <h3 class="text-slate-400 text-base my-8 text-center">
          Loading data...
        </h3>
      </div>

      <div v-else>
        <div v-if="queriedAliases.length > 0">
          <PayrollsAddressBookListItem
            v-for="(alias, index) in queriedAliases"
            :key="index"
            :alias="alias"
          ></PayrollsAddressBookListItem>
        </div>
        <div v-else class="border-b">
          <h3 class="text-slate-400 text-base my-8 text-center">
            No aliases found
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

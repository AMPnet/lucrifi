<script setup lang="ts">
import { useAddressBook } from "@/stores/addressBook";

const addressBook = useAddressBook();

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
      <div class="flex items-center justify-between pl-10">
        <div class="flex items-center gap-16">
          <button class="text-slate-500 font-bold text-base p-2">
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
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>

              <span class="uppercase">Address Book</span>
            </div>
          </button>

          <button
            @click="showAddAliasModal = true"
            class="text-slate-500 font-bold text-base py-2 px-4 border border-slate-300 rounded-full"
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
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <span class="uppercase">ADD NEW</span>
            </div>
          </button>
        </div>
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
        class="bg-slate-100 rounded-t-md text-black font-bold text-sm grid grid-cols-9 py-4 px-5"
      >
        <span class="col-span-4">Name</span>
        <span class="col-span-2">Address</span>
        <span class="col-span-2">Company</span>
        <span class="col-span-1 text-center">Actions</span>
      </div>

      <div>
        <PayrollsAddressBookListItem
          v-for="(alias, index) in queriedAliases"
          :key="index"
          :alias="alias"
        ></PayrollsAddressBookListItem>
      </div>
    </div>
  </div>
</template>

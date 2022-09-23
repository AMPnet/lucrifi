<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import { AddressAlias } from "@/types/payrolls/AddressAlias";
import { useAddressBook } from "@/stores/addressBook";
import { PropType } from "vue";

const { copy } = useClipboard();

const props = defineProps({
  alias: {
    type: Object as PropType<AddressAlias>,
    required: true,
  },
});

const showCopied = ref(false);
function copyAddr() {
  copy(props.alias.address);
  showCopied.value = true;

  setTimeout(function () {
    showCopied.value = false;
  }, 1200);
}

const addressBook = useAddressBook();

const showMenu = ref(false);
const showEditAliasModal = ref(false);
</script>

<template>
  <div
    class="bg-white text-gray-700 grid grid-cols-9 py-7 px-5 border-b border-slate-200 font-semibold"
  >
    <PayrollsAddressBookEditAlias
      v-if="showEditAliasModal"
      :alias="props.alias"
      @close="showEditAliasModal = false"
    />

    <span class="col-span-4 self-center">{{ props.alias.alias }}</span>

    <div class="col-span-2 flex items-center gap-1.5">
      <span :title="props.alias.address">{{
        shortAddr(props.alias.address, 5, 4)
      }}</span>
      <div class="relative">
        <div
          v-show="showCopied"
          class="absolute rounded-xl px-2 py-1 bg-violet-700 text-white text-xs z-11 left-8 -top-4"
        >
          Copied
        </div>
        <button
          @click="copyAddr"
          class="ml-2 rounded-full bg-gray-100 p-1.5 hover:bg-gray-300 text-gray-700"
        >
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
              d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
            />
          </svg>
        </button>
      </div>
    </div>
    <span class="col-span-2 text-xs text-slate-500 self-center">{{
      props.alias.organization
    }}</span>
    <div class="col-span-1 flex items-center justify-center">
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
          class="absolute z-10 left-0 sm:left-auto sm:right-0 top-4"
        >
          <div class="min-h-full py-3 sm:py-0 text-center">
            <div
              class="bg-white flex flex-col gap-3 rounded-lg py-2 text-sm text-left overflow-hidden shadow-xl sm:w-full"
            >
              <button
                @click="
                  showEditAliasModal = true;
                  showMenu = false;
                "
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
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>

                  <span>Edit</span>
                </div>
              </button>

              <button
                @click="
                  addressBook.removeFromAddressBook(props.alias.id);
                  showMenu = false;
                "
                class="hover:bg-slate-100 text-red-700 whitespace-nowrap w-full px-4 py-1.5"
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
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>

                  <span>Delete</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
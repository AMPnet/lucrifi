<script setup lang="ts">
import { useAddressBook } from "@/stores/addressBook";
import { NewAddressAlias } from "@/types/payrolls/AddressAlias";
import { validateAlias } from "@/validators/addressBook";

const emit = defineEmits(["close"]);

const addressBook = useAddressBook();

const props = defineProps({
  address: {
    type: String,
    required: true,
  },
});

const address = ref(props.address);
const name = ref("");
const email = ref("");

function saveToAddressBook() {
  const alias: NewAddressAlias = {
    address: address.value,
    alias: name.value,
    email: email.value,
    phone_number: null,
  };
  addressBook.addToAddressBook(alias);
  emit("close");
}

const isValidData = computed(() => {
  return validateAlias(address.value, name.value);
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
            <h3 class="text-center font-bold mb-10">Add to Address Book</h3>
            <div class="text-left flex flex-col gap-8 mb-10">
              <div>
                <h4 class="font-bold text-sm">Wallet Address</h4>
                <label class="text-xs"
                  >Paste the wallet address you want to add to your Address
                  Book</label
                >
                <input
                  class="w-full px-4 py-3 mt-3 border border-slate-300 rounded focus:outline-none text-sm"
                  v-model="address"
                  type="text"
                  placeholder="Wallet address"
                />
              </div>
              <div>
                <h4 class="font-bold text-sm">Alias</h4>
                <input
                  class="w-full px-4 py-3 mt-3 border border-slate-300 rounded focus:outline-none text-sm"
                  v-model="name"
                  type="text"
                  placeholder="Alias name"
                />
              </div>
              <div>
                <h4 class="font-bold text-sm">Email</h4>
                <input
                  class="w-full px-4 py-3 mt-3 border border-slate-300 rounded focus:outline-none text-sm"
                  v-model="email"
                  type="text"
                />
              </div>
            </div>

            <button
              :disabled="!isValidData"
              class="rounded-full bg-slate-700 text-white py-2 px-3 text-xs disabled:bg-slate-200 disabled:text-gray-400"
              @click="saveToAddressBook"
            >
              <div class="flex items-center gap-1.5">
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
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                <span>Save Address</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Token } from "@/types/Token";
import { Recipient } from "@/types/payrolls/TemplateData";
import { AddressAlias } from "@/types/payrolls/AddressAlias";
import { useAddressBook } from "@/stores/addressBook";
import { isValidAddress } from "@/validators/blockchain";
import { isValidCurrencyAmount } from "@/composables/token";

import type { PropType, Ref } from "vue";

const addressBook = useAddressBook();

const props = defineProps({
  recipient: {
    type: Object as PropType<Recipient>,
    required: false,
  },
});

let editRecipient: Ref<boolean>;

if (props.recipient) {
  editRecipient = ref(false);
} else {
  editRecipient = ref(true);
}

const selectedToken = useState<Token>("selectedToken");
const templateRecipients = useState<Array<Recipient>>("newTemplateRecipients");

let recipientData: Ref<Recipient>;
if (editRecipient.value) {
  recipientData = ref({
    item_name: null,
    wallet_address: "",
    amount: "",
    id: Date.now().toString(),
  });
} else {
  recipientData = ref(props.recipient);
}

const isValidRecipient = computed(() => {
  const addressValid =
    isValidAddress(recipientData.value.wallet_address) === true;

  const isValidAmount = isValidCurrencyAmount(
    recipientData.value.amount,
    selectedToken.value.decimals
  );
  return addressValid && isValidAmount;
});

function editOrAddToList() {
  const existingRecipient = templateRecipients.value.find(
    (x) => x.id === recipientData.value.id
  );
  if (existingRecipient) {
    editRecipient.value = false;
  } else {
    // Add new recipient
    recipientData.value.amount = recipientData.value.amount.replace(",", ".");
    templateRecipients.value.push(recipientData.value);

    recipientData.value = {
      item_name: null,
      wallet_address: "",
      amount: "",
      id: Date.now().toString(),
    };
  }
}
function deleteFromList() {
  templateRecipients.value = templateRecipients.value.filter(
    (x) => x.id !== recipientData.value.id
  );
}

function selectAddressBook(alias: AddressAlias) {
  recipientData.value.wallet_address = alias.address;
  recipientData.value.item_name = alias.alias;
  showSearchAddressBookModal.value = false;
}

const recipientInAddressBook = computed(() => {
  if (recipientData.value.wallet_address.length > 0) {
    const alias = addressBook.data.find(
      (x) =>
        x.address.toLowerCase() ===
        recipientData.value.wallet_address.toLowerCase()
    );
    if (alias) {
      recipientData.value.item_name = alias.alias;
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
});

const showSearchAddressBookModal = ref(false);
const showAddAliasModal = ref(false);

watch(recipientData, (oldData, newData) => {
  if (oldData.wallet_address !== newData.wallet_address) {
    const alias = addressBook.aliases.find(
      (x) => x.address === newData.wallet_address
    );
    if (alias) {
      recipientData.value.item_name = alias.alias;
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
});
</script>

<template>
  <div>
    <PayrollsAddressBookSearchBook
      v-if="showSearchAddressBookModal"
      @close="showSearchAddressBookModal = false"
      @selectAlias="selectAddressBook"
    />

    <PayrollsAddressBookAddAlias
      v-if="showAddAliasModal"
      :address="recipientData.wallet_address"
      @close="showAddAliasModal = false"
    />

    <div v-if="editRecipient" class="bg-slate-100 rounded-lg p-2">
      <div class="flex items-center justify-between gap-4">
        <div
          class="flex items-center justify-between bg-white gap-x-2 p-2 rounded-lg text-xs w-4/6"
        >
          <svg
            class="w-6 h-6 stroke-current"
            fill="none"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            stroke-width="1"
          >
            <path
              d="M16.8913 1.4674a.359.359 0 0 0 .3587-.3587.359.359 0 0 0-.3587-.3587H2.5435C1.5546.75.75 1.5546.75 2.5435v12.913c0 .9889.8046 1.7935 1.7935 1.7935h14.3478a.3586.3586 0 0 0 .3587-.3587V3.9783a.359.359 0 0 0-.3587-.3587c-.5932 0-1.0761-.483-1.0761-1.0761 0-.5932.4829-1.0761 1.0761-1.0761Zm-14.3478 0h12.9137a1.7866 1.7866 0 0 0-.3594 1.076c0 .4036.1342.7763.3594 1.0762H2.5435c-.5932 0-1.0761-.483-1.0761-1.0761 0-.5932.4829-1.0761 1.076-1.0761Zm13.9891 10.7609h-6.0978c-.9889 0-1.7935-.8047-1.7935-1.7935 0-.9889.8046-1.7935 1.7935-1.7935h6.0978v3.587Zm0-7.8913v3.587h-6.0978c-1.3845 0-2.5109 1.1263-2.5109 2.5108 0 1.3841 1.1264 2.5109 2.5109 2.5109h6.0978v3.5869H2.5435c-.5932 0-1.0761-.4829-1.0761-1.0761V3.9775a1.7864 1.7864 0 0 0 1.076.3595h13.9892Z"
            />
          </svg>

          <div
            v-if="recipientData.item_name"
            class="flex items-center w-full gap-3"
            @click="recipientData.item_name = null"
          >
            <span :title="recipientData.wallet_address">
              {{ shortAddr(recipientData.wallet_address, 5, 4) }}
            </span>
            <span class="font-bold">{{ recipientData.item_name }}</span>
          </div>

          <div v-else class="w-full">
            <input
              v-model="recipientData.wallet_address"
              type="text"
              class="w-full focus:outline-none bg-inherit"
              id="transfer-to"
              placeholder="Wallet address"
            />
          </div>

          <button
            class="bg-slate-800 p-2 rounded-lg text-white whitespace-nowrap"
            @click="showSearchAddressBookModal = true"
          >
            Address Book
          </button>
        </div>

        <div class="flex items-center gap-3">
          <span class="font-bold">{{ selectedToken.symbol }}</span>

          <div class="bg-white rounded-lg p-2">
            <input
              v-model="recipientData.amount"
              id="amount"
              type="text"
              inputmode="decimal"
              placeholder="Amount"
              class="text-right placeholder:text-xs placeholder:sm:text-sm w-full text-xl bg-inherit focus:outline-none"
            />
          </div>

          <button
            :disabled="!isValidRecipient"
            class="bg-slate-800 text-xs py-1 px-4 rounded-full text-white whitespace-nowrap flex items-center gap-1.5 disabled:bg-slate-200 disabled:text-gray-400"
            @click="editOrAddToList"
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
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>

            <span>Done</span>
          </button>

          <button
            class="text-xs py-1 px-4 rounded-full whitespace-nowrap flex items-center gap-1.5 text-red-700 disabled:text-slate-400"
            @click="deleteFromList"
            :disabled="editRecipient"
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
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>

            <span>Delete</span>
          </button>
        </div>
      </div>

      <div
        v-if="!recipientInAddressBook"
        class="flex items-center mt-3 text-xs font-bold gap-1.5"
      >
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
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
        <span>Be careful! This wallet address isn't in your Address Book.</span>
        <button @click="showAddAliasModal = true" class="text-violet-600 ml-4">
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
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Add to Address Book</span>
          </div>
        </button>
      </div>
    </div>

    <div
      v-else
      class="bg-white-100 rounded-lg p-2 flex items-center justify-between gap-4 text-slate-800"
    >
      <div
        class="grid grid-cols-12 items-center w-full gap-x-2 p-2 rounded-lg text-sm"
      >
        <div class="col-span-5 flex items-center gap-2">
          <svg
            class="w-5 h-5 stroke-current"
            fill="none"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            stroke-width="1"
          >
            <path
              d="M16.8913 1.4674a.359.359 0 0 0 .3587-.3587.359.359 0 0 0-.3587-.3587H2.5435C1.5546.75.75 1.5546.75 2.5435v12.913c0 .9889.8046 1.7935 1.7935 1.7935h14.3478a.3586.3586 0 0 0 .3587-.3587V3.9783a.359.359 0 0 0-.3587-.3587c-.5932 0-1.0761-.483-1.0761-1.0761 0-.5932.4829-1.0761 1.0761-1.0761Zm-14.3478 0h12.9137a1.7866 1.7866 0 0 0-.3594 1.076c0 .4036.1342.7763.3594 1.0762H2.5435c-.5932 0-1.0761-.483-1.0761-1.0761 0-.5932.4829-1.0761 1.076-1.0761Zm13.9891 10.7609h-6.0978c-.9889 0-1.7935-.8047-1.7935-1.7935 0-.9889.8046-1.7935 1.7935-1.7935h6.0978v3.587Zm0-7.8913v3.587h-6.0978c-1.3845 0-2.5109 1.1263-2.5109 2.5108 0 1.3841 1.1264 2.5109 2.5109 2.5109h6.0978v3.5869H2.5435c-.5932 0-1.0761-.4829-1.0761-1.0761V3.9775a1.7864 1.7864 0 0 0 1.076.3595h13.9892Z"
            />
          </svg>

          <div class="flex items-center gap-2.5" v-if="recipientData.item_name">
            <span :title="recipientData.wallet_address">{{
              shortAddr(recipientData.wallet_address, 5, 4)
            }}</span>
            <span class="font-bold">{{ recipientData.item_name }}</span>
          </div>

          <div v-else>
            <span>{{ recipientData.wallet_address }}</span>
          </div>
        </div>

        <div class="flex items-center col-span-7">
          <img :src="`/tokens/${selectedToken.logoURI}`" class="h-5 w-5 mr-2" />
          <span class="font-bold mr-3">{{ selectedToken.symbol }}</span>
          <span>
            {{ recipientData.amount }}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          class="bg-slate-800 text-xs py-1 px-4 rounded-full text-white whitespace-nowrap flex items-center gap-2"
          @click="editRecipient = true"
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
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
            />
          </svg>

          <span>Edit</span>
        </button>

        <button
          class="text-xs py-1 px-4 rounded-full whitespace-nowrap flex items-center gap-1.5 text-red-700 disabled:text-slate-400"
          @click="deleteFromList"
          :disabled="editRecipient"
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
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>

          <span>Delete</span>
        </button>
      </div>
    </div>
  </div>
</template>

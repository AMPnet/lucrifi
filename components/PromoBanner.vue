<script setup lang="ts">
import { useWallet } from "@/stores/wallet";
import { useAddressBook } from "@/stores/addressBook";
import { NewAddressAlias } from "@/types/payrolls/AddressAlias";

const wallet = useWallet();
const addressBook = useAddressBook();

await addressBook.fetchAliases();

const showBanner = computed(
  () => wallet.isWalletConnected && !addressBook.promoUsed
);

const email = ref("");

function submitMail() {
  const alias: NewAddressAlias = {
    address: wallet.walletAddress,
    alias: PROMO_HOLIDAYS_CODE,
    email: email.value,
    phone_number: null,
  };
  addressBook.addToAddressBook(alias);
}
</script>

<template>
  <div>
    <div
      v-if="showBanner"
      class="bg-gradient-to-r from-teal-400 to-purple-600 px-8 py-2 rounded-xl lg:rounded-full flex items-center text-sm justify-center gap-y-4 gap-x-6 text-white font-semibold flex-wrap mx-3"
    >
      <div class="bg-slate-700 rounded-md py-2 px-3 text-xs">
        HOLIDAYS PROMO
      </div>
      <div class="text-center">Get UNLIMITED Subscription for FREE</div>
      <div>
        <input
          class="px-3 py-2 w-56 rounded-md text-slate-800 text-xs focus:outline-none"
          placeholder="Your Email Address"
          type="email"
          v-model="email"
        />
      </div>
      <button
        :disabled="!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)"
        @click="submitMail"
        class="rounded-full bg-violet-700 px-3 py-2 text-xs hover:bg-violet-600 disabled:opacity-50"
      >
        Get UNLIMITED
      </button>
    </div>
  </div>
</template>

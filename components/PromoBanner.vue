<script setup lang="ts">
import { useWallet } from "@/stores/wallet";
import { useAddressBook } from "@/stores/addressBook";
import { NewAddressAlias } from "@/types/payrolls/AddressAlias";

export interface EmailVerfierResponse {
  email: string;
  user: string;
  domain: string;
  status: string;
  reason: string;
  disposable: boolean;
}

const wallet = useWallet();
const addressBook = useAddressBook();

await addressBook.fetchAliases();

const showBanner = computed(
  () => wallet.isWalletConnected && !addressBook.promoUsed
);

const email = ref("");
const errorMessage = ref("");
const successMessage = ref("");

async function submitMail() {
  errorMessage.value = "";
  const { public: publicVars } = useRuntimeConfig();
  const encodedMail = encodeURIComponent(email.value);
  try {
    const resp = await $fetch<EmailVerfierResponse>(
      `https://email-checker.p.rapidapi.com/verify/v1?email=${encodedMail}`,
      {
        headers: {
          "X-RapidAPI-Key": publicVars.mailVerifierApiKey,
          "X-RapidAPI-Host": "email-checker.p.rapidapi.com",
        },
      }
    );
    if (resp.status === "invalid") {
      errorMessage.value = "Please use a valid email.";
      email.value = "";
      setTimeout(() => {
        errorMessage.value = "";
      }, 5000);
      return;
    }
    if (resp.disposable) {
      errorMessage.value = "Please use a non-temporary email.";
      email.value = "";
      setTimeout(() => {
        errorMessage.value = "";
      }, 5000);
      return;
    }
  } catch (error) {
    console.error(error);
    errorMessage.value = "Something went wrong. Please try again later.";
    email.value = "";
    setTimeout(() => {
      errorMessage.value = "";
    }, 5000);
    return;
  }
  const alias: NewAddressAlias = {
    address: wallet.walletAddress,
    alias: PROMO_HOLIDAYS_CODE,
    email: email.value,
    phone_number: null,
  };
  addressBook.addToAddressBook(alias);
  email.value = "";

  successMessage.value =
    "We have received your email. Enjoy the Unlimited LucriFi Subscription!";
  setTimeout(() => {
    successMessage.value = "";
  }, 10000);
}
</script>

<template>
  <div>
    <div
      v-if="showBanner || successMessage.length > 0"
      class="bg-gradient-to-r from-teal-400 to-purple-600 px-8 py-2 rounded-xl lg:rounded-full text-sm justify-center text-white font-semibold mx-3"
    >
      <div
        v-if="successMessage.length > 0"
        class="flex items-center gap-x-2 justify-center py-1"
      >
        <div>{{ successMessage }} fjeiofjeoijfoij</div>
        <div>
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
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
      <div
        v-else
        class="gap-x-6 gap-y-4 flex items-center justify-center flex-wrap"
      >
        <div class="bg-slate-700 rounded-md py-2 px-3 text-xs flex-wrap">
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
        <div class="text-amber-400 text-xs" v-if="errorMessage.length > 0">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

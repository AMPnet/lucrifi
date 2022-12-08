<script setup lang="ts">
import { useField } from "vee-validate";
import { isValidAddress } from "@/validators/blockchain";

import { useWallet } from "@/stores/wallet";

const wallet = useWallet();

function connectWallet() {
   dev3Sdks().get(1)!.present(wallet.connectData.redirectUrl).then(result => {
    if (result.status === 'PENDING') {
      wallet.isConnecting = false;
    } else {
      wallet.connectWallet();
    }
   });
}

const pending = ref(false);
if (!wallet.isWalletConnected) {
  pending.value = true;
  wallet.preFetchConnectData().finally(() => {
    pending.value = false;
  });
}

const { value: validAddress, meta } = useField(
  "selectedAddress",
  isValidAddress,
  { initialValue: "" }
);

const myWalletBtnClass = ref(
  "text-violet-700 hover:bg-violet-700 hover:text-white"
);
const selectedAddress = useState("selectedTransferAddress", () => validAddress);

watch(validAddress, async (newAddr, oldAddr) => {
  selectedAddress.value = newAddr;

  if (validAddress.value.toLowerCase() === wallet.walletAddress.toLowerCase()) {
    myWalletBtnClass.value =
      "text-white bg-gradient-to-r from-violet-700 to-purple-500 hover:from-violet-800 hover:to-purple-600";
  } else {
    myWalletBtnClass.value =
      "text-violet-700 hover:bg-violet-700 hover:text-white";
  }
});

const addressValid = useState("addressValid", () => false);
watch(meta, async (newMeta, oldMeta) => {
  addressValid.value = newMeta.valid;
});

const dirtyClass = computed(() => {
  if (!meta.valid) {
    return "bg-orange-50 border-orange-300";
  } else {
    return "bg-white border-slate-300";
  }
});
</script>

<template>
  <div>
    <h3>Transfer to</h3>
    <ClientOnly>

    <div class="px-4 py-3 border rounded mt-2" :class="dirtyClass">
      <div class="flex items-center justify-between">
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

        <input
          v-model="validAddress"
          type="text"
          class="w-full focus:outline-none mx-2 bg-inherit text-sm"
          id="transfer-to"
          placeholder="Input address"
        />
          <button
            v-if="wallet.isWalletConnected"
            class="py-1 px-3 whitespace-nowrap rounded-full text-xs font-bold border border-violet-700"
            @click="validAddress = wallet.walletAddress"
            :class="myWalletBtnClass"
          >
            <div class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>My Wallet</span>
            </div>
          </button>

          <button
            v-else
            :disabled="pending"
            class="py-1 px-3 whitespace-nowrap rounded-full text-xs font-bold border border-violet-700 text-violet-700 hover:bg-violet-700 hover:text-white"
            @click="connectWallet"
          >
            <div class="flex items-center">
              <span>Select My Wallet</span>
            </div>
          </button>
      </div>
    </div>
    </ClientOnly
        >
  </div>
</template>

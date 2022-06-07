<script setup>
const myWallet = useState("myWallet", () => {
  return { address: "0x1234abcfebartol" };
});

const selectedAddress = useState(
  "seletedTransferAddress",
  () => myWallet.value.address
);

const myWalletSelected = computed(() => {
  return selectedAddress.value === myWallet.value.address;
});
</script>

<template>
  <h3>Transfer to</h3>
  <div class="px-4 py-3 border border-slate-300 rounded mt-2">
    <div class="flex items-center justify-between">
      <svg
        class="w-7 h-7 stroke-current"
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
        v-model="selectedAddress"
        type="text"
        class="w-full focus:outline-none mx-2"
        id="transfer-to"
        placeholder="Input address"
      />

      <button
        v-if="!myWalletSelected"
        @click="selectedAddress = myWallet.address"
        class="whitespace-nowrap px-2 py-1 rounded-full border border-violet-600 text-violet-600 flex-nowrap text-sm hover:bg-violet-600 hover:text-white"
      >
        <div class="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 mr-1"
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
          <span> My wallet</span>
        </div>
      </button>

      <button
        v-else
        class="whitespace-nowrap px-2 py-1 rounded-full border border-violet-600 bg-violet-600 text-white flex-nowrap text-sm"
      >
        <div class="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <span> My wallet</span>
        </div>
      </button>
    </div>
  </div>
</template>

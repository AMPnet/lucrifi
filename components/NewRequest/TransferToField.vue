<script setup lang="ts">
import { useField } from "vee-validate";
import { ethers } from "ethers";

function isValidAddress(value: string) {
  if (!value || !value.trim()) return "Please set address";

  if (!ethers.utils.isAddress(value)) {
    return "Please set valid contract address";
  }

  return true;
}

const { value: validAddress, meta } = useField(
  "selectedAddress",
  isValidAddress,
  { initialValue: "" }
);
const selectedAddress = useState("selectedTransferAddress", () => validAddress);
watch(validAddress, async (newAddr, oldAddr) => {
  selectedAddress.value = newAddr;
});

const addressValid = useState("addressValid", () => false);
watch(meta, async (newMeta, oldMeta) => {
  addressValid.value = newMeta.valid;
});

const dirtyClass = computed(() => {
  if (!meta.valid) {
    return "bg-red-50 border-red-300";
  } else {
    return "bg-white border-slate-300";
  }
});
</script>

<template>
  <h3>Transfer to</h3>
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
        class="w-full focus:outline-none mx-2 bg-inherit"
        id="transfer-to"
        placeholder="Input address"
      />
    </div>
  </div>
</template>

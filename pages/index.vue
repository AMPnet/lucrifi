<script setup>
import { countDecimals } from "@/validators/blockchain";

const runtimeConfig = useRuntimeConfig();

const selectedToken = useState("selectedToken");
const selectedNetwork = useState("selectedNetwork");
const selectedAmount = useState("selectedCurrencyAmount");
const selectedToAddress = useState("selectedTransferAddress");
const selectedCustomTokenAddres = useState("selectedCustomTokenAddres");
const noteData = ref("");

const isAmountValid = useState("currencyAmountValid");
const isAddressValid = useState("addressValid");
const isRpcValid = useState("rpcUrlValid");
const isCustomTokenAddrValid = useState("customTokenAddressValid");

const formValid = computed(() => {
  if (isAmountValid.value && isAddressValid.value) {
    // Custom rpc is not specified
    if (selectedNetwork.value.chainId !== undefined) {
      return true;
    }

    // Custom rpc is specified
    if (isRpcValid.value && isCustomTokenAddrValid.value) {
      return true;
    } else {
      return false;
    }
  }
  return false;
});

async function createRequest() {
  const nDecimals = countDecimals(selectedAmount.value);
  const zeros = "0".repeat(selectedToken.value.decimals - nDecimals);
  const shiftedAmount = `${selectedAmount.value.replace(".", "")}${zeros}`;

  let payload = {
    redirect_url: runtimeConfig.public.requestPaymentRedirect,
    recipient_address: selectedToAddress.value,
    amount: shiftedAmount,
    arbitrary_data: {
      note: noteData.value,
    },
  };
  let headers = {};

  if (selectedNetwork.value.chainId !== undefined) {
    payload = {
      ...payload,
      chain_id: selectedNetwork.value.chainId,
      token_address: selectedToken.value.address,
    };
  } else {
    payload = {
      ...payload,
      chain_id: undefined,
      token_address: selectedCustomTokenAddres.value,
    };
    headers = {
      ...headers,
      "X-RPC-URL-OVERRIDE": selectedNetwork.value.rpcURL,
    };
  }

  const { data, error } = await useFetch(
    `${runtimeConfig.public.backendUrl}/send`,
    {
      method: "post",
      headers: headers,
      body: payload,
    }
  );

  if (error.value) {
  } else {
    navigateTo({
      path: `/payments/requested/${data.value.id}`,
    });
  }
}
</script>

<template>
  <div class="text-center">
    <div class="text-gray-700 bg-white py-4 px-5 inline-flex rounded-xl">
      <div class="w-full sm:w-96">
        <NewRequestNetworkChooser />

        <div class="mt-5">
          <NewRequestCurrencyAmountChooser />
        </div>

        <div class="mt-5">
          <NewRequestTransferToField />
        </div>

        <div class="mt-5">
          <div class="px-4 py-3 border border-slate-300 rounded">
            <div class="flex items-center">
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
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              <input
                v-model="noteData"
                type="text"
                placeholder="Add note (optional)"
                class="w-full focus:outline-none mx-2"
              />
            </div>
          </div>
        </div>

        <button
          :disabled="!formValid"
          @click="createRequest"
          class="mt-3 w-full font-bold uppercase text-xs rounded-full bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 py-3 px-6 text-white disabled:from-slate-400 disabled:to-slate-400"
        >
          Create Request<br />
        </button>
      </div>
    </div>
  </div>
</template>

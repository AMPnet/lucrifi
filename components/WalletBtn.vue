<script setup lang="ts">
const props = defineProps({
  walletAddr: {
    type: String,
    required: true,
  },
});

const shortAddr = computed(() => {
  return `${props.walletAddr.slice(0, 4)}...${props.walletAddr.slice(-4)}`;
});
</script>

<template>
  <button
    class="rounded-full text-sm font-bold px-0.5 text-white bg-gradient-to-r from-violet-700 to-purple-500 hover:from-violet-800 hover:to-purple-600"
  >
    <div class="flex items-center justify-between">
      <span class="py-2.5 pl-6 pr-3">{{ shortAddr }}</span>
      <div class="bg-gray-700 text-slate-100 rounded-full py-2 px-2">
        <svg
          class="w-4 h-4 stroke-current"
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
      </div>
    </div>
  </button>
</template>

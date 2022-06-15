<script setup>
function goHome() {
  navigateTo("/");
}
</script>
<template>
  <div class="text-center">
    <h1 class="text-xl">Something went wrong 😓</h1>
    <button
      class="rounded-full font-bold mt-8 mb-5 px-5 py-2 text-white bg-gradient-to-r from-violet-700 to-purple-500 hover:from-violet-800 hover:to-purple-600"
      @click="goHome"
    >
      Return home
    </button>
  </div>
</template>

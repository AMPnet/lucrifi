<script setup lang="ts">
import { useWallet } from "@/stores/wallet";

let wallet = useWallet();
</script>

<template>
  <div class="bg-slate-100 min-h-screen">
    <div class="container mx-auto lg:px-14">
      <TheNavbar />

      <div
        v-show="wallet.isWalletConnected"
        class="pt-5 md:pt-20 pb-5 grid grid-cols-12 px-8 xl:px-14 gap-x-3"
      >
        <div class="col-span-2">
          <PayrollsSideMenu />
        </div>
        <div class="col-span-10 bg-white rounded-2xl py-10 px-6">
          <slot />
        </div>
      </div>

      <div
        v-show="!wallet.isWalletConnected"
        class="col-span-12 bg-white rounded-2xl py-10 px-6 text-center text-lg"
      >
        <h3 class="mb-8">Please connect your wallet to see this screen</h3>
        <AuthorizationSignIn />
      </div>
    </div>
    <TheFooter />
  </div>
</template>

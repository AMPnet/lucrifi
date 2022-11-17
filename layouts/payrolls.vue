<script setup lang="ts">
import { useWallet } from "@/stores/wallet";

const wallet = useWallet();
</script>

<template>
  <div class="bg-slate-100 min-h-screen">
    <div class="container mx-auto lg:px-14">
      <TheNavbar />

      <ClientOnly>
        <div class="hidden lg:block">
          <div
            v-if="wallet.isWalletConnected"
            class="pt-5 md:pt-20 pb-5 grid grid-cols-10 px-8 xl:px-14 gap-x-3"
          >
            <div class="col-span-2">
              <PayrollsSideMenu />
            </div>
            <div class="col-span-8 bg-white rounded-2xl p-8">
              <slot />
            </div>
          </div>

          <div
            v-else
            class="bg-white rounded-2xl py-10 px-6 text-center text-lg"
          >
            <h3 class="mb-8">Please connect your wallet to see this screen</h3>
            <AuthorizationSignIn />
          </div>
        </div>
        <div class="lg:hidden text-center py-5 text-lg">
          This screen isn't supported on mobile and tablet displays.
        </div>
      </ClientOnly>
    </div>
    <TheFooter />
  </div>
</template>

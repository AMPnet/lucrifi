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
        <div class="lg:hidden text-center pt-5 pb-8 text-lg">
          <div class="flex justify-center pb-6">
            <img class="w-96" src="/rocket.webp" />
          </div>
          <div>
            <div class="text-violet-700 text-sm uppercase font-semibold mb-4">
              Mobile view not supported
            </div>
            <div class="text-slate-600 text-base">
              Switch to desktop to jumpstart your payrolls
            </div>
          </div>
        </div>
      </ClientOnly>
    </div>
    <TheFooter />
  </div>
</template>

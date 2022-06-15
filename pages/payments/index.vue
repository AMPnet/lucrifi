<script setup lang="ts">
import { useWallet } from "@/stores/wallet";

const wallet = useWallet();
</script>
<template>
  <div v-if="wallet.isWalletConnected">
    <h1>Payments list</h1>
  </div>
  <div v-else>
    <AuthorizationSignIn />
  </div>
</template>

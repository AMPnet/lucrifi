<script setup lang="ts">
import { useTemplates } from "@/stores/templates";
import { useWallet } from "@/stores/wallet";
import { TemplateItem } from "@/types/payrolls/TemplateData";

definePageMeta({
  layout: "payrolls",
});

interface TemplatesList {
  templates: Array<TemplateItem>;
}

const wallet = useWallet();
const runtimeConfig = useRuntimeConfig();

const templatesStore = useTemplates();

if (wallet.isWalletConnected) {
  const data = await $fetch<TemplatesList>(
    `${runtimeConfig.public.backendUrl}/multi-payment-template/by-wallet-address/${wallet.walletAddress}`,
    {
      headers: { Authorization: `Bearer ${wallet.jwt.accessToken}` },
    }
  );
  templatesStore.data = data.templates;
}
</script>

<template>
  <div>
    <div class="rounded-t-md border-t border-x border-slate-200">
      <div
        class="bg-slate-100 rounded-t-md text-black font-bold text-sm grid grid-cols-7 py-4 px-5"
      >
        <span class="col-span-1">Created at</span>
        <span class="col-span-4">Template name</span>
        <span class="col-span-1">Last edited</span>
        <span class="col-span-1 text-center">Actions</span>
      </div>

      <div>
        <PayrollsTemplatesListItem
          v-for="(template, index) in templatesStore.templates"
          :key="index"
          :template="template"
        ></PayrollsTemplatesListItem>
      </div>
    </div>
  </div>
</template>

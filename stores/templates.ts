import { defineStore } from "pinia";
import {
  TemplateItemWRecipients,
  TemplateItem,
  NewTemplate,
  NewRecipient,
} from "@/types/payrolls/TemplateData";
import { useWallet } from "@/stores/wallet";

interface TemplateItems {
  data: Array<TemplateItem>;
}

interface TemplatesFetchList {
  templates: Array<TemplateItem>;
}

export const useTemplates = defineStore("templatesStore", {
  state: (): TemplateItems => {
    return {
      data: [],
    };
  },
  getters: {
    templates: (state) => state.data,
  },
  actions: {
    async fetchTemplateDetails(id: string | string[]) {
      const wallet = useWallet();
      const runtimeConfig = useRuntimeConfig();
      const data = await $fetch<TemplateItemWRecipients>(
        `${runtimeConfig.public.backendUrl}/multi-payment-template/${id}`,
        {
          headers: { Authorization: `Bearer ${wallet.jwt.accessToken}` },
        }
      );
      return data;
    },
    async fetchTemplates() {
      const wallet = useWallet();
      const runtimeConfig = useRuntimeConfig();

      if (wallet.isWalletConnected) {
        const data = await $fetch<TemplatesFetchList>(
          `${runtimeConfig.public.backendUrl}/multi-payment-template/by-wallet-address/${wallet.walletAddress}`,
          {
            headers: { Authorization: `Bearer ${wallet.jwt.accessToken}` },
          }
        );
        this.data = data.templates;
      }
    },
    async addTemplate(template: NewTemplate) {
      const wallet = useWallet();
      const runtimeConfig = useRuntimeConfig();

      const data = await $fetch<TemplateItemWRecipients>(
        `${runtimeConfig.public.backendUrl}/multi-payment-template`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${wallet.jwt.accessToken}` },
          body: template,
        }
      );

      const newTemplate = { ...template, id: data.id };
      this.data.push(newTemplate);
    },
    async addTemplateRecipient(template_id: string, recipient: NewRecipient) {
      const wallet = useWallet();
      const runtimeConfig = useRuntimeConfig();

      await $fetch<TemplateItemWRecipients>(
        `${runtimeConfig.public.backendUrl}/multi-payment-template/${template_id}/items`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${wallet.jwt.accessToken}` },
          body: recipient,
        }
      );
    },
    async removeTemplateRecipient(template_id: string, recipient_id: string) {
      const wallet = useWallet();
      const runtimeConfig = useRuntimeConfig();

      await $fetch<TemplateItemWRecipients>(
        `${runtimeConfig.public.backendUrl}/multi-payment-template/${template_id}/items/${recipient_id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${wallet.jwt.accessToken}` },
        }
      );
    },
    async updateTemplateRecipient(
      template_id: string,
      recpient_id: string,
      walletAddress: string,
      amount: string
    ) {
      // TODO sync with backend API
    },
    async updateTemplate(template_id: string, template_name: string) {
      const wallet = useWallet();
      const runtimeConfig = useRuntimeConfig();

      return await $fetch<TemplateItemWRecipients>(
        `${runtimeConfig.public.backendUrl}/multi-payment-template/${template_id}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${wallet.jwt.accessToken}` },
          body: {
            template_name: template_name,
          },
        }
      );
    },

    async removeTemplate(id: string) {
      const wallet = useWallet();
      const runtimeConfig = useRuntimeConfig();

      await $fetch<TemplateItemWRecipients>(
        `${runtimeConfig.public.backendUrl}/multi-payment-template/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${wallet.jwt.accessToken}` },
        }
      );

      this.data = this.data.filter((x: TemplateItem) => x.id !== id);
    },
  },
});

import { defineStore } from "pinia";
import {
  TemplateItemWRecipients,
  TemplateItem,
  NewTemplate,
  NewRecipient,
  Recipient,
} from "@/types/payrolls/TemplateData";
import { useWallet } from "@/stores/wallet";
import { MultiSendPayment } from "@/types/payrolls/MultiSend";

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
    fetchTemplateDetails(id: string | string[]) {
      const wallet = useWallet();
      const runtimeConfig = useRuntimeConfig();

      if (!wallet.accessTokenValid) {
        wallet.refreshAccessToken();
      }

      return $fetch<TemplateItemWRecipients>(
        `${runtimeConfig.public.backendUrl}/multi-payment-template/${id}`,
        {
          headers: { Authorization: `Bearer ${wallet.jwt.accessToken}` },
        }
      );
    },
    async fetchTemplates() {
      const wallet = useWallet();
      const runtimeConfig = useRuntimeConfig();

      if (wallet.isWalletConnected) {
        if (!wallet.accessTokenValid) {
          wallet.refreshAccessToken();
        }
        try {
          const data = await $fetch<TemplatesFetchList>(
            `${runtimeConfig.public.backendUrl}/multi-payment-template/by-wallet-address/${wallet.walletAddress}`,
            {
              headers: { Authorization: `Bearer ${wallet.jwt.accessToken}` },
            }
          );
          this.data = data.templates;
        } catch (error) {}
      }
    },
    async addTemplate(template: NewTemplate) {
      const wallet = useWallet();
      const runtimeConfig = useRuntimeConfig();

      if (!wallet.accessTokenValid) {
        wallet.refreshAccessToken();
      }

      try {
        const data = await $fetch<TemplateItemWRecipients>(
          `${runtimeConfig.public.backendUrl}/multi-payment-template`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${wallet.jwt.accessToken}` },
            body: template,
          }
        );
        const newTemplate = {
          ...template,
          id: data.id,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
        this.data.push(newTemplate);
      } catch (error) {}
    },
    addTemplateRecipient(template_id: string, recipient: NewRecipient) {
      const wallet = useWallet();
      const runtimeConfig = useRuntimeConfig();

      if (!wallet.accessTokenValid) {
        wallet.refreshAccessToken();
      }

      return $fetch<TemplateItemWRecipients>(
        `${runtimeConfig.public.backendUrl}/multi-payment-template/${template_id}/items`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${wallet.jwt.accessToken}` },
          body: recipient,
        }
      );
    },
    removeTemplateRecipient(template_id: string, recipient_id: string) {
      const wallet = useWallet();
      const runtimeConfig = useRuntimeConfig();

      if (!wallet.accessTokenValid) {
        wallet.refreshAccessToken();
      }

      return $fetch<TemplateItemWRecipients>(
        `${runtimeConfig.public.backendUrl}/multi-payment-template/${template_id}/items/${recipient_id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${wallet.jwt.accessToken}` },
        }
      );
    },
    updateTemplateRecipient(
      template_id: string,
      recipient_id: string,
      walletAddress: string,
      amount: string,
      itemName: string
    ) {
      const wallet = useWallet();
      const runtimeConfig = useRuntimeConfig();

      if (!wallet.accessTokenValid) {
        wallet.refreshAccessToken();
      }

      return $fetch<TemplateItemWRecipients>(
        `${runtimeConfig.public.backendUrl}/multi-payment-template/${template_id}/items/${recipient_id}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${wallet.jwt.accessToken}` },
          body: {
            wallet_addres: walletAddress,
            amount: amount,
            item_name: itemName,
          },
        }
      );
    },
    async updateTemplate(template_id: string, template_name: string) {
      const wallet = useWallet();
      const runtimeConfig = useRuntimeConfig();

      if (!wallet.accessTokenValid) {
        wallet.refreshAccessToken();
      }

      return $fetch<TemplateItemWRecipients>(
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

      if (!wallet.accessTokenValid) {
        wallet.refreshAccessToken();
      }

      try {
        await $fetch<TemplateItemWRecipients>(
          `${runtimeConfig.public.backendUrl}/multi-payment-template/${id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${wallet.jwt.accessToken}` },
          }
        );

        this.data = this.data.filter((x: TemplateItem) => x.id !== id);
      } catch (error) {}
    },

    executeTemplatePayment(items: Recipient[], assetType: "TOKEN" | "NATIVE") {
      const wallet = useWallet();
      const runtimeConfig = useRuntimeConfig();

      return $fetch<MultiSendPayment>(
        `${runtimeConfig.public.backendUrl}/multi-send`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${wallet.jwt.accessToken}` },
          body: {
            asset_type: assetType,
            items: items,
            disperse_contract_address: "TODO",
          },
        }
      );
    },
  },
});

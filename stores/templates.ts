import { defineStore } from "pinia";
import {
  TemplateItemWRecipients,
  TemplateItem,
  NewTemplate,
  NewRecipient,
  Recipient,
  UpdateTemplate,
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

      const payload = template;
      if (template.asset_type === "NATIVE") {
        delete payload.token_address;
      }

      try {
        const data = await $fetch<TemplateItemWRecipients>(
          `${runtimeConfig.public.backendUrl}/multi-payment-template`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${wallet.jwt.accessToken}` },
            body: payload,
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
            wallet_address: walletAddress,
            amount: amount,
            item_name: itemName,
          },
        }
      );
    },
    async updateTemplate(templateData: UpdateTemplate) {
      const wallet = useWallet();
      const runtimeConfig = useRuntimeConfig();

      if (!wallet.accessTokenValid) {
        wallet.refreshAccessToken();
      }
      const payload = {
        template_name: templateData.template_name,
        asset_type: templateData.asset_type,
        chain_id: templateData.chain_id,
      };

      if (templateData.asset_type === "TOKEN") {
        payload["token_address"] = templateData.token_address;
      }

      return $fetch<TemplateItemWRecipients>(
        `${runtimeConfig.public.backendUrl}/multi-payment-template/${templateData.id}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${wallet.jwt.accessToken}` },
          body: payload,
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

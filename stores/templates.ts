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
import { useNetworksStore } from "@/stores/networks";
import { FunctionCallResponse } from "@/types/ampnet/FunctionCall";

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

          this.data = data.templates.sort((a, b) => {
            if (a.created_at && b.created_at) {
              const date1 = Date.parse(a.created_at);
              const date2 = Date.parse(b.created_at);
              return date2 - date1;
            }
            return 0;
          });
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

    async createMultiPayment(
      items: Recipient[],
      assetType: "TOKEN" | "NATIVE",
      disperseAddress: string,
      tokenAddress: string | undefined,
      tokenSum: string
    ): Promise<string> {
      const runtimeConfig = useRuntimeConfig();

      const networksStore = useNetworksStore();
      const apiKey = networksStore.networksList[0].apiKey;
      const headers = {
        "X-API-KEY": `${apiKey}`,
      };

      const payload = {
        asset_type: assetType,
        items: items,
        disperse_contract_address: disperseAddress,
      };

      if (assetType === "TOKEN") {
        payload["token_address"] = tokenAddress;
      }

      const multiSendResp = await $fetch<MultiSendPayment>(
        `${runtimeConfig.public.backendUrl}/multi-send`,
        {
          method: "POST",
          headers: headers,
          body: payload,
        }
      );

      const callPayload = {
        deployed_contract_id: "c0e6bd39-b3f2-4b60-b8a5-d6b694855524",
        function_name: "approve",
        function_params: [
          {
            type: "address",
            value: disperseAddress,
          },
          {
            type: "uint256",
            value: tokenSum,
          },
        ],
        eth_amount: "0",
      };

      const callData = await $fetch<FunctionCallResponse>(
        `${runtimeConfig.public.backendUrl}/function-call`,
        {
          method: "POST",
          headers: headers,
          body: callPayload,
        }
      );

      window.open(callData.redirect_url, "_blank");

      let statusData: FunctionCallResponse;
      let status: string = callData.status;

      while (status === "PENDING") {
        statusData = await $fetch<FunctionCallResponse>(
          `${runtimeConfig.public.backendUrl}/function-call/${callData.id}`,
          {
            headers: headers,
          }
        );
        status = statusData.status;
        await new Promise((r) => setTimeout(r, 1500));
      }

      if (statusData.status === "SUCCESS") {
        await $fetch(
          `${runtimeConfig.public.backendUrl}/multi-send/${multiSendResp.id}/approve`,
          {
            method: "PUT",
            headers: headers,
            body: {
              tx_hash: statusData.function_call_tx.tx_hash,
              caller_address: statusData.caller_address,
            },
          }
        );
        return multiSendResp.id;
      } else {
        throwError("Received non success status");
      }
    },

    async disperseFunctionCall(
      contractAddr: string,
      tokenAddr: string,
      addresses: string[],
      amounts: string[],
      multiSendId: string
    ) {
      const callPayload = {
        deployed_contract_id: contractAddr,
        function_name: "disperseToken",
        function_params: [
          {
            type: "address",
            value: tokenAddr,
          },
          {
            type: "address[]",
            value: addresses,
          },
          {
            type: "uint256[]",
            value: amounts,
          },
        ],
        eth_amount: "0",
      };

      const runtimeConfig = useRuntimeConfig();

      const networksStore = useNetworksStore();
      const apiKey = networksStore.networksList[0].apiKey;
      const headers = {
        "X-API-KEY": `${apiKey}`,
      };

      let disperseStatus = await $fetch<FunctionCallResponse>(
        `${runtimeConfig.public.backendUrl}/function-call`,
        {
          method: "POST",
          headers: headers,
          body: callPayload,
        }
      );

      window.open(disperseStatus.redirect_url, "_blank");

      while (disperseStatus.status === "PENDING") {
        disperseStatus = await $fetch<FunctionCallResponse>(
          `${runtimeConfig.public.backendUrl}/function-call/${disperseStatus.id}`,
          {
            headers: headers,
          }
        );
        await new Promise((r) => setTimeout(r, 1500));
      }

      if (disperseStatus.status === "SUCCESS") {
        await $fetch(
          `${runtimeConfig.public.backendUrl}/multi-send/${multiSendId}/disperse`,
          {
            method: "PUT",
            headers: headers,
            body: {
              tx_hash: disperseStatus.function_call_tx.tx_hash,
              caller_address: disperseStatus.caller_address,
            },
          }
        );
      } else {
        throwError("Received non success status");
      }
    },
  },
});

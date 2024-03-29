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
            const date1 = Date.parse(a.updated_at || a.created_at);
            const date2 = Date.parse(b.updated_at || b.created_at);
            return date2 - date1;
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
        this.data.unshift(newTemplate);
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
      chainId: number,
      disperseAddress: string,
      tokenAddress: string | undefined,
      tokenSum: string
    ): Promise<string> {
      const runtimeConfig = useRuntimeConfig();

      const networksStore = useNetworksStore();
      const apiKey = networksStore.networksList.find(
        (x) => x.chainId === chainId
      ).apiKey;
      const headers = {
        "X-API-KEY": `${apiKey}`,
      };

      const payload = {
        asset_type: "TOKEN",
        items: items,
        disperse_contract_address: disperseAddress,
        token_address: tokenAddress,
      };

      const multiSendResp = await $fetch<MultiSendPayment>(
        `${runtimeConfig.public.backendUrl}/multi-send`,
        {
          method: "POST",
          headers: headers,
          body: payload,
        }
      );

      const callPayload = {
        contract_address: tokenAddress,
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
      

      const result = await dev3Sdks().get(chainId)!.present(callData.redirect_url);
      if (result.status === 'PENDING') { throw new Error("User canceled"); }  

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
        throw new Error("Received non success status");
      }
    },
    async createNativeMultiPayment(
      items: Recipient[],
      chainId: number,
      disperseAddress: string
    ): Promise<string> {
      const runtimeConfig = useRuntimeConfig();

      const networksStore = useNetworksStore();
      const apiKey = networksStore.networksList.find(
        (x) => x.chainId === chainId
      ).apiKey;
      const headers = {
        "X-API-KEY": `${apiKey}`,
      };

      const payload = {
        asset_type: "NATIVE",
        items: items,
        disperse_contract_address: disperseAddress,
      };

      const multiSendResp = await $fetch<MultiSendPayment>(
        `${runtimeConfig.public.backendUrl}/multi-send`,
        {
          method: "POST",
          headers: headers,
          body: payload,
        }
      );

      return multiSendResp.id;
    },

    async disperseFunctionCall(
      tokenAddr: string,
      chainId: number,
      disperseContract: string,
      addresses: string[],
      amounts: string[],
      multiSendId: string,
      isNativeToken: boolean
    ) {
      let sumGwei = "0";
      let functionName = "disperseToken";
      if (isNativeToken) {
        sumGwei = amounts.reduce((a, b) => a + parseInt(b), 0).toString();
        functionName = "disperseEther";
      }

      const callPayload = {
        contract_address: disperseContract,
        function_name: functionName,
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
        eth_amount: sumGwei,
      };

      if (isNativeToken) {
        // address param is not supported for native tokens
        callPayload.function_params.shift();
      }

      const runtimeConfig = useRuntimeConfig();

      const networksStore = useNetworksStore();

      const network = networksStore.networksList.find(
        (x) => x.chainId === chainId
      );

      const headers = {
        "X-API-KEY": `${network?.apiKey}`,
      };

      let disperseStatus = await $fetch<FunctionCallResponse>(
        `${runtimeConfig.public.backendUrl}/function-call`,
        {
          method: "POST",
          headers: headers,
          body: callPayload,
        }
      );

      const result = await dev3Sdks().get(chainId)!.present(disperseStatus.redirect_url);
      if (result.status === 'PENDING') { throw new Error("Action canceled"); }

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
        return await $fetch<MultiSendPayment>(
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
        throw new Error("Received non success status");
      }
    },
  },
});

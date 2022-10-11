import { defineStore } from "pinia";
import {
  TemplateItemWRecipients,
  TemplateItem,
  NewTemplate,
} from "@/types/payrolls/TemplateData";
import { useWallet } from "@/stores/wallet";

interface TemplateItems {
  data: Array<TemplateItem>;
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
    async fetchTemplateDetails(id: string) {
      //TODO
    },
    async fetchTemplates() {
      //TODO
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
    updateTemplate(id: string) {
      // TODO sync with backend API
    },
    removeTemplate(id: string) {
      // TODO Call api
      this.data = this.data.filter((x: TemplateItem) => x.id !== id);
    },
  },
});

import { defineStore } from "pinia";
import { TemplateListItem, NewTemplate } from "@/types/payrolls/TemplateData";
import { useWallet } from "@/stores/wallet";

interface templateItems {
  data: Array<TemplateListItem>;
}

export const useTemplates = defineStore("templatesStore", {
  state: (): templateItems => {
    return {
      data: [
        {
          name: "AMpnet payroll",
          createdAt: "25. Aug 2022",
          id: "1",
          lastEdited: "25. Aug 2022",
        },
        {
          name: "Shell payroll",
          createdAt: "25. Aug 2022",
          id: "2",
          lastEdited: "25. Aug 2022",
        },
      ],
    };
  },
  getters: {
    templates: (state) => state.data,
  },
  actions: {
    addTemplate(template: NewTemplate) {
      // TODO sync with backend API
      const wallet = useWallet();

      const newTemplate = { ...template, id: "3049" };
      this.data.push(newTemplate);
    },
    updateTemplate(id: String) {
      // TODO sync with backend API
    },
    removeTemplate(id: String) {
      // TODO Call api
      this.data = this.data.filter((x: TemplateListItem) => x.id !== id);
    },
  },
});

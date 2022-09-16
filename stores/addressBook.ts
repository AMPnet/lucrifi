import { defineStore } from "pinia";
import { AddressAlias } from "@/types/payrolls/AddressAlias";

interface addressBookObject {
  data: Array<AddressAlias>;
}

export const useAddressBook = defineStore("addressBook", {
  state: (): addressBookObject => {
    return {
      data: [
        {
          alias: "bartol",
          address: "0xD6eB5f17209140825d8A79bF23147B5A2AE5C374",
          organization: null,
        },
        {
          alias: "Jonnny",
          address: "0xD6eB5f17209140825d8A79bF23147B5A2AE5C374",
          organization: null,
        },
      ],
    };
  },
  actions: {
    addToAddressBook(address: AddressAlias) {
      // TODO sync with backend API
      this.data.push(address);
    },
    removeFromAddressBook(address: AddressAlias) {
      // TODO
    },
  },
});

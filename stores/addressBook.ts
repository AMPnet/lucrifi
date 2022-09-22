import { defineStore } from "pinia";
import { AddressAlias, NewAddressAlias } from "@/types/payrolls/AddressAlias";

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
          organization: "aimages",
          id: "1",
        },
        {
          alias: "Jonnny",
          address: "0xD6eB5f17209140825d8A79bF23147B5A2AE5C374",
          organization: "Emirates",
          id: "2",
        },
      ],
    };
  },
  getters: {
    aliases: (state) => state.data,
  },
  actions: {
    addToAddressBook(address: NewAddressAlias) {
      // TODO sync with backend API
      const newAddress = { ...address, id: "3049" };
      this.data.push(newAddress);
    },
    editAddressBookItem(address: AddressAlias) {
      // TODO sync with backend API
    },
    removeFromAddressBook(address: AddressAlias) {
      // TODO Call api
      this.data = this.data.filter((x: AddressAlias) => x.id !== address.id);
    },
  },
});

import { defineStore } from "pinia";
import { AddressAlias, NewAddressAlias } from "@/types/payrolls/AddressAlias";

interface addressBookObject {
  data: Array<AddressAlias>;
}

export const useAddressBook = defineStore("addressBook", {
  state: (): addressBookObject => {
    return {
      data: [],
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
    editAddressBookItem(
      id: string,
      name: string,
      email: string,
      address: string
    ) {
      // TODO sync with backend API
    },
    removeFromAddressBook(id: String) {
      // TODO Call api
      this.data = this.data.filter((x: AddressAlias) => x.id !== id);
    },
  },
});

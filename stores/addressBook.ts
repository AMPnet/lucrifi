import { defineStore } from "pinia";
import { AddressAlias, NewAddressAlias } from "@/types/payrolls/AddressAlias";
import { useWallet } from "@/stores/wallet";

interface addressBookObject {
  data: Array<AddressAlias>;
}

interface addressesList {
  entries: Array<AddressAlias>;
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
    async fetchAliases() {
      const wallet = useWallet();

      if (wallet.isWalletConnected) {
        const runtimeConfig = useRuntimeConfig();

        try {
          const data = await $fetch<addressesList>(
            `${runtimeConfig.public.backendUrl}/address-book/by-wallet-address/${wallet.walletAddress}`
          );
          this.data = data["entries"];
        } catch (error) {}
      }
    },
    async addToAddressBook(address: NewAddressAlias) {
      const runtimeConfig = useRuntimeConfig();
      const wallet = useWallet();

      try {
        const data = await $fetch<AddressAlias>(
          `${runtimeConfig.public.backendUrl}/address-book/`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${wallet.jwt.accessToken}` },
            body: { ...address },
          }
        );
        const newAddress = { ...address, id: data.id };
        this.data.push(newAddress);
      } catch (error) {}
    },
    async editAddressBookItem(
      id: string,
      name: string,
      email: string,
      address: string
    ) {
      const runtimeConfig = useRuntimeConfig();
      const wallet = useWallet();
      const item = this.data.find((x: AddressAlias) => x.id === id);

      try {
        await $fetch<AddressAlias>(
          `${runtimeConfig.public.backendUrl}/address-book/${id}`,
          {
            method: "PATCH",
            headers: { Authorization: `Bearer ${wallet.jwt.accessToken}` },
            body: { alias: name, email, address },
          }
        );
        item.alias = name;
        item.email = email;
        item.address = address;
      } catch (error) {}
    },
    async removeFromAddressBook(id: String) {
      const runtimeConfig = useRuntimeConfig();
      const wallet = useWallet();

      try {
        await $fetch<AddressAlias>(
          `${runtimeConfig.public.backendUrl}/address-book/${id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${wallet.jwt.accessToken}` },
          }
        );
        this.data = this.data.filter((x: AddressAlias) => x.id !== id);
      } catch (error) {}
    },
  },
});

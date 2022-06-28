import { defineStore } from "pinia";
import { Network } from "@/types/Network";

export const useNetworksStore = defineStore("networksList", {
  state: () => {
    return {
      networks: [
        {
          name: "Ethereum",
          logoURI:
              "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/480px-Ethereum-icon-purple.svg.png",
          chainId: 1,
          rpcURL: undefined,
        },
        {
          name: "BSC",
          logoURI: "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_binance.jpg&w=32&q=75",
          chainId: 56,
          rpcURL: undefined,
        },
        {
          name: "Gnosis",
          logoURI: "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_xdai.jpg&w=32&q=75",
          chainId: 100,
          rpcURL: undefined,
        },
        {
          name: "Polygon",
          logoURI:
            "https://seeklogo.com/images/P/polygon-matic-logo-86F4D6D773-seeklogo.com.png",
          chainId: 137,
          rpcURL: undefined,
        },
        {
          name: "Fantom Opera",
          logoURI: "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_fantom.jpg&w=32&q=75",
          chainId: 250,
          rpcURL: undefined,
        },
        {
          name: "Moonriver",
          logoURI: "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_moonriver.jpg&w=32&q=75",
          chainId: 1285,
          rpcURL: undefined,
        },
        {
          name: "Avalanche",
          logoURI: "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_avalanche.jpg&w=32&q=75",
          chainId: 43114,
          rpcURL: undefined,
        },
        {
          name: "Aurora",
          logoURI: "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_aurora.jpg&w=32&q=75",
          chainId: 1313161554,
          rpcURL: undefined,
        },
      ],
    };
  },
  getters: {
    networksList: (state): Array<Network> => state.networks,
  },
});

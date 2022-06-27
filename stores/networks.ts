import { defineStore } from "pinia";
import { Network } from "@/types/Network";

export const useNetworksStore = defineStore("networksList", {
  state: () => {
    const runtimeConfig = useRuntimeConfig();

    return {
      networks: [
        {
          name: "Polygon",
          logoURI:
            "https://seeklogo.com/images/P/polygon-matic-logo-86F4D6D773-seeklogo.com.png",
          chainId: 137,
          rpcURL: undefined,
          blockExplorerUrl: "https://polygonscan.com/tx",
          apiKey: runtimeConfig.polygonApiKey,
        },
        {
          name: "Ethereum",
          logoURI:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/480px-Ethereum-icon-purple.svg.png",
          chainId: 1,
          rpcURL: undefined,
          blockExplorerUrl: "https://etherscan.io/tx",
          apiKey: runtimeConfig.ethereumApiKey,
        },
      ],
    };
  },
  getters: {
    networksList: (state): Array<Network> => state.networks,
  },
});

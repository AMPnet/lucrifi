import { defineStore } from "pinia";
import { Network } from "@/types/Network";

export const useNetworksStore = defineStore("networksList", {
  state: () => {
    const runtimeConfig = useRuntimeConfig();

    return {
      networks: [
        {
          name: "Polygon",
          logoURI: "https://cryptologos.cc/logos/polygon-matic-logo.png",
          chainId: 137,
          rpcURL: undefined,
          apiKey: runtimeConfig.polygonApiKey,
          blockExplorerUrl: "https://polygonscan.com/tx",
        },
        {
          name: "Ethereum",
          logoURI:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/480px-Ethereum-icon-purple.svg.png",
          chainId: 1,
          rpcURL: undefined,
          apiKey: runtimeConfig.ethereumApiKey,
          blockExplorerUrl: "https://etherscan.io/tx",
        },
        {
          name: "BSC",
          logoURI:
            "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_binance.jpg&w=32&q=75",
          chainId: 56,
          rpcURL: undefined,
          apiKey: runtimeConfig.bscApiKey,
          blockExplorerUrl: "https://bscscan.com/tx",
        },
        {
          name: "xDai/Gnosis",
          logoURI:
            "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_xdai.jpg&w=32&q=75",
          chainId: 100,
          rpcURL: undefined,
          apiKey: runtimeConfig.gnosisApiKey,
          blockExplorerUrl: "https://blockscout.com/xdai/mainnet/tx",
        },
        {
          name: "Fantom Opera",
          logoURI:
            "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_fantom.jpg&w=32&q=75",
          chainId: 250,
          rpcURL: undefined,
          apiKey: runtimeConfig.fantomApiKey,
          blockExplorerUrl: "https://ftmscan.com/tx",
        },
        {
          name: "Moonriver",
          logoURI:
            "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_moonriver.jpg&w=32&q=75",
          chainId: 1285,
          rpcURL: undefined,
          apiKey: runtimeConfig.moonriverApiKey,
          blockExplorerUrl: "https://moonriver.moonscan.io/tx",
        },
        {
          name: "Avalanche",
          logoURI:
            "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_avalanche.jpg&w=32&q=75",
          chainId: 43114,
          rpcURL: undefined,
          apiKey: runtimeConfig.avaxApiKey,
          blockExplorerUrl: "https://snowtrace.io/tx",
        },
        {
          name: "Aurora",
          logoURI:
            "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_aurora.jpg&w=32&q=75",
          chainId: 1313161554,
          rpcURL: undefined,
          apiKey: runtimeConfig.auroraApiKey,
          blockExplorerUrl: "https://explorer.mainnet.aurora.dev/tx",
        },
      ],
    };
  },
  getters: {
    networksList: (state): Array<Network> => state.networks,
  },
});

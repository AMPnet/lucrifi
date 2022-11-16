import { defineStore } from "pinia";
import { Network } from "@/types/Network";

export const useNetworksStore = defineStore("networksList", {
  state: () => {
    const { public: publicKey } = useRuntimeConfig();

    return {
      networks: [
        {
          name: "Ethereum",
          logoURI:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/480px-Ethereum-icon-purple.svg.png",
          chainId: 1,
          rpcURL: undefined,
          apiKey: publicKey.ethereumApiKey,
          blockExplorerUrl: "https://etherscan.io/tx",
          disperseContract: "0xff8e425b4982b58b3220d9de004b2ac832266915",
        },
        {
          name: "Polygon",
          logoURI: "https://cryptologos.cc/logos/polygon-matic-logo.png",
          chainId: 137,
          rpcURL: undefined,
          apiKey: publicKey.polygonApiKey,
          blockExplorerUrl: "https://polygonscan.com/tx",
          disperseContract: "0xff8e425b4982b58b3220d9de004b2ac832266915",
        },
        {
          name: "BSC",
          logoURI:
            "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_binance.jpg&w=32&q=75",
          chainId: 56,
          rpcURL: undefined,
          apiKey: publicKey.bscApiKey,
          blockExplorerUrl: "https://bscscan.com/tx",
          disperseContract: "0xc50CDD22f65538A2e6C15Eee7638873e659a4877",
        },
        {
          name: "xDai/Gnosis",
          logoURI:
            "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_xdai.jpg&w=32&q=75",
          chainId: 100,
          rpcURL: undefined,
          apiKey: publicKey.gnosisApiKey,
          blockExplorerUrl: "https://blockscout.com/xdai/mainnet/tx",
          disperseContract: "0x94c0Ca3a6131Ca985BFA3c818Fba8bf4E912c0E7",
        },
        {
          name: "Fantom Opera",
          logoURI:
            "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_fantom.jpg&w=32&q=75",
          chainId: 250,
          rpcURL: undefined,
          apiKey: publicKey.fantomApiKey,
          blockExplorerUrl: "https://ftmscan.com/tx",
          disperseContract: "0x94c0Ca3a6131Ca985BFA3c818Fba8bf4E912c0E7",
        },
        {
          name: "Moonriver",
          logoURI:
            "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_moonriver.jpg&w=32&q=75",
          chainId: 1285,
          rpcURL: undefined,
          apiKey: publicKey.moonriverApiKey,
          blockExplorerUrl: "https://moonriver.moonscan.io/tx",
          disperseContract: "0x7da52848eda4ae10af06e88adf7da8960fa92b8e",
        },
        {
          name: "Avalanche",
          logoURI:
            "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_avalanche.jpg&w=32&q=75",
          chainId: 43114,
          rpcURL: undefined,
          apiKey: publicKey.avaxApiKey,
          blockExplorerUrl: "https://snowtrace.io/tx",
          disperseContract: "0x8eb2f385c878bef4f5674fc8bcedbad1246a57b0",
        },
        {
          name: "Aurora",
          logoURI:
            "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_aurora.jpg&w=32&q=75",
          chainId: 1313161554,
          rpcURL: undefined,
          apiKey: publicKey.auroraApiKey,
          blockExplorerUrl: "https://explorer.mainnet.aurora.dev/tx",
          disperseContract: "0x0db4d3139edf99958f3b73844eeefa11bc0ed6c0",
        },
      ],
    };
  },
  getters: {
    networksList: (state): Array<Network> => state.networks,
  },
});

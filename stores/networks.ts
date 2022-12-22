import { defineStore } from "pinia";
import { Network } from "@/types/Network";

export const useNetworksStore = defineStore("networksList", {
  state: () => {
    const { public: publicKey } = useRuntimeConfig();
    return {
      networks: [
        {
          name: "Ethereum",
          logoURI: "/networks/ethereum.svg",
          chainId: 1,
          rpcURL: undefined,
          apiKey: publicKey.ethereumApiKey,
          blockExplorerUrl: "https://etherscan.io/tx",
          disperseContract: "0xd152f549545093347a162dce210e7293f1452150",
        },
        {
          name: "Polygon",
          logoURI: "/networks/polygon.svg",
          chainId: 137,
          rpcURL: undefined,
          apiKey: publicKey.polygonApiKey,
          blockExplorerUrl: "https://polygonscan.com/tx",
          disperseContract: "0xff8e425b4982b58b3220d9de004b2ac832266915",
        },
        {
          name: "BSC",
          logoURI: "/networks/bsc.svg",
          chainId: 56,
          rpcURL: undefined,
          apiKey: publicKey.bscApiKey,
          blockExplorerUrl: "https://bscscan.com/tx",
          disperseContract: "0xc50CDD22f65538A2e6C15Eee7638873e659a4877",
        },
        {
          name: "xDai/Gnosis",
          logoURI: "/networks/gnosis.svg",
          chainId: 100,
          rpcURL: undefined,
          apiKey: publicKey.gnosisApiKey,
          blockExplorerUrl: "https://blockscout.com/xdai/mainnet/tx",
          disperseContract: "0x94c0Ca3a6131Ca985BFA3c818Fba8bf4E912c0E7",
        },
        {
          name: "Fantom Opera",
          logoURI: "/networks/fantom.svg",
          chainId: 250,
          rpcURL: undefined,
          apiKey: publicKey.fantomApiKey,
          blockExplorerUrl: "https://ftmscan.com/tx",
          disperseContract: "0x7da52848eda4ae10af06e88adf7da8960fa92b8e",
        },
        {
          name: "Moonriver",
          logoURI: "/networks/moonriver.svg",
          chainId: 1285,
          rpcURL: undefined,
          apiKey: publicKey.moonriverApiKey,
          blockExplorerUrl: "https://moonriver.moonscan.io/tx",
          disperseContract: "0x7da52848eda4ae10af06e88adf7da8960fa92b8e",
        },
        {
          name: "Avalanche",
          logoURI: "/networks/avalanche.svg",
          chainId: 43114,
          rpcURL: undefined,
          apiKey: publicKey.avaxApiKey,
          blockExplorerUrl: "https://snowtrace.io/tx",
          disperseContract: "0x8eb2f385c878bef4f5674fc8bcedbad1246a57b0",
        },
        {
          name: "Aurora",
          logoURI: "/networks/aurora.webp",
          chainId: 1313161554,
          rpcURL: undefined,
          apiKey: publicKey.auroraApiKey,
          blockExplorerUrl: "https://aurorascan.dev/tx",
          disperseContract: "0x0db4d3139edf99958f3b73844eeefa11bc0ed6c0",
        },
        {
          name: "Mumbai (Testnet)",
          logoURI: "/networks/polygon.svg",
          chainId: 80001,
          rpcURL: undefined,
          apiKey: publicKey.mumbaiApiKey,
          blockExplorerUrl: "https://mumbai.polygonscan.com/tx",
          disperseContract: "0x74dbe3de8d83ce0c4fe44de615c2539e2bb23259",
        },
      ],
    };
  },
  getters: {
    networksList: (state): Array<Network> => state.networks,
  },
});

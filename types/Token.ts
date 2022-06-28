interface Version {
  major: number;
  minor: number;
  patch: number;
}

interface Tags {}

export interface Token {
  chainId: string;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
}

export interface TokensListResponse {
  "1": Token[];
  "56": Token[];
  "100": Token[];
  "137": Token[];
  "250": Token[];
  "1285": Token[];
  "43114": Token[];
  "1313161554": Token[];
}

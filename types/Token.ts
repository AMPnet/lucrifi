interface Version {
  major: number;
  minor: number;
  patch: number;
}

interface Tags {}

export interface Token {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
}

export interface TokensListResponse {
  name: string;
  timestamp: Date;
  version: Version;
  tags: Tags;
  logoURI: string;
  keywords: string[];
  tokens: Token[];
}

export default interface Network {
  chainId: number | undefined;
  name: string;
  logoURI: string;
  rpcURL: string | undefined;
}

function shortAddr(walletAddr: string, firstN: number, lastN: number): string {
  return `${walletAddr.slice(0, firstN)}...${walletAddr.slice(-lastN)}`;
}

export { shortAddr };

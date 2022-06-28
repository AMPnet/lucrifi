function ipfsToHttp(url: string): string {
  if (url.startsWith("ipfs")) {
    const hash = url.split("//")[1];
    return `https://ipfs.io/ipfs/${hash}`;
  }
  return url;
}

export { ipfsToHttp };

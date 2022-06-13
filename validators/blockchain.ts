import { ethers } from "ethers";

function isValidAddress(value: string): string | boolean {
  if (!value || !value.trim()) return "Please set address";

  if (!ethers.utils.isAddress(value)) {
    return "Please set valid contract address";
  }

  return true;
}

export { isValidAddress };

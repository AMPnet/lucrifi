import { ethers } from "ethers";

function isValidAddress(value: string): string | boolean {
  if (!value || !value.trim()) return "Please set address";

  if (!ethers.utils.isAddress(value)) {
    return "Please set valid contract address";
  }

  return true;
}

function countDecimals(value: string): number {
  if (!value.includes(".") && !value.includes(",")) return 0;

  let delimeter = value.includes(".") ? "." : ",";
  return value.split(delimeter)[1].length || 0;
}

export { isValidAddress, countDecimals };

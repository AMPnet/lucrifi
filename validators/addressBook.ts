import { isValidAddress } from "@/validators/blockchain";

export function validateAlias(address: string, name: string) {
  const validAddr = isValidAddress(address) === true;
  const validName = name.length > 0;

  return validAddr && validName;
}

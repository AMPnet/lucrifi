import { isValidAddress } from "@/validators/blockchain";

export function validateAlias(address: string, name: string) {
  const validAddr = isValidAddress(address) === true;

  const re = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  const validName = name.length > 0;
  const formValid = name.match(re);

  return validAddr && validName && formValid;
}

import { isValidAddress } from "@/validators/blockchain";

export function isValidAliasForm(address: string, name: string) {
  const validAddr = isValidAddress(address) === true;
  const validAlias = isValidAlias(name);

  return validAddr && validAlias;
}

export function isValidAlias(alias: string) {
  const re = /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/;
  return alias.length > 0 && alias.match(re);
}

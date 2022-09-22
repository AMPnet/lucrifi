export interface NewAddressAlias {
  address: string;
  alias: string;
  organization: string;
}

export interface AddressAlias extends NewAddressAlias {
  id: string;
}

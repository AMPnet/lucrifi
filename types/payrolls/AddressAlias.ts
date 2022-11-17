export interface NewAddressAlias {
  alias: string;
  address: string;
  phone_number: string | undefined;
  email: string | undefined;
}

export interface AddressAlias extends NewAddressAlias {
  id: string;
  created_at: string;
}

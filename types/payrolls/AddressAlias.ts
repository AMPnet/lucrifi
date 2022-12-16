export interface NewAddressAlias {
  alias: string;
  address: string;
  phone_number: string | null;
  email: string | null;
}

export interface AddressAlias extends NewAddressAlias {
  id: string;
  created_at: string;
}

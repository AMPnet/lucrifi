export interface NewRecipient {
  wallet_address: string;
  item_name: string | undefined;
  amount: string;
}
export interface Recipient extends NewRecipient {
  id: string;
}

export interface NewTemplate {
  template_name: string;
  chain_id: number;
  token_address: string;
  asset_type: "NATIVE" | "TOKEN";
  items: Array<NewRecipient>;
}

export interface TemplateItem {
  id: string;
  template_list: string;
  template_name: string;
  asset_type: "NATIVE" | "TOKEN";
  chain_id: number;
  created_at: string;
  updated_at: string | undefined;
}

export interface TemplateItemWRecipients extends TemplateItem {
  items: Array<Recipient>;
}

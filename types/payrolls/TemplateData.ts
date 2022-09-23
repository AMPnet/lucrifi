export interface Recipient {
  address: string;
  name: string | undefined;
  amount: string;
  id: number;
}

export interface TemplateListItem {
  createdAt: string;
  name: string;
  lastEdited: string;
  id: string;
}

export interface NewTemplate {
  name: string;
  recipients: Array<Recipient>;
  chainId: number;
  tokenAddress: string;
}

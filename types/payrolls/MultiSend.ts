import { Recipient } from "./TemplateData";

interface ArbitraryData {
  test: boolean;
}

interface ApproveScreenConfig {
  before_action_message: string;
  after_action_message: string;
}

interface DisperseScreenConfig {
  before_action_message: string;
  after_action_message: string;
}

interface ApproveTx {
  tx_hash: string;
  from: string;
  to: string;
  data: string;
  value: string;
  block_confirmations: string;
  timestamp: Date;
}

interface DisperseTx {
  tx_hash: string;
  from: string;
  to: string;
  data: string;
  value: string;
  block_confirmations: string;
  timestamp: Date;
}

export interface MultiSendPayment {
  id: string;
  project_id: string;
  approve_status: string;
  disperse_status: string;
  chain_id: number;
  token_address: string | undefined;
  disperse_contract_address: string;
  asset_type: string;
  items: Recipient[];
  sender_address: string | undefined;
  arbitrary_data: ArbitraryData;
  approve_screen_config: ApproveScreenConfig;
  disperse_screen_config: DisperseScreenConfig;
  redirect_url: string;
  approve_tx: ApproveTx;
  disperse_tx: DisperseTx;
  created_at: string;
}

export interface MultiSendPaymentListItem {
  totalPayment: number;
  currencySymbol: string;
  processedOn: string;
  status: string;
  chainId: number;
  txHash: string | undefined;
  id: string;
}

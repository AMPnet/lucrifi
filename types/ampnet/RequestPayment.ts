interface ScreenConfig {
  before_action_message: string;
  after_action_message: string;
}

interface SendTx {
  tx_hash: string | undefined;
  from: string | undefined;
  to: string;
  data: string;
  block_confirmations: string | undefined;
  timestamp: Date | undefined;
}

export interface FetchSendRequestResponse {
  id: string;
  status: string;
  chain_id: number;
  token_address: string;
  amount: string;
  sender_address: string;
  recipient_address: string;
  arbitrary_data: any | undefined;
  screen_config: ScreenConfig | undefined;
  redirect_url: string;
  send_tx: SendTx;
}

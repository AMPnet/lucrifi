interface ArbitraryData {
  test: boolean;
}

interface ScreenConfig {
  before_action_message: string;
  after_action_message: string;
}

interface Balance {
  wallet: string;
  block_number: string;
  timestamp: Date;
  amount: string;
}

export interface BalanceCheckRequestResponse {
  id: string;
  status: "SUCCESS" | "PENDING" | "FAILED";
  chain_id: number;
  redirect_url: string;
  token_address: string;
  block_number: string;
  wallet_address: string;
  arbitrary_data: ArbitraryData;
  screen_config: ScreenConfig;
  balance: Balance;
  message_to_sign: string;
  signed_message: string;
}

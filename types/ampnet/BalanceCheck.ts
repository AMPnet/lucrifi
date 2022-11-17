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
export interface CreateWalletAuthRequest {
  redirect_url: string;
  id: string;
  status: "SUCCESS" | "PENDING" | "FAILED";
  wallet_address: string | undefined;
  message_to_sign: string;
  signed_message: string | undefined;
  arbitrary_data: ArbitraryData;
  screen_config: ScreenConfig;
}

export interface FetchWalletAuthRequest {
  id: string;
  status: "SUCCESS" | "PENDING" | "FAILED";
  redirect_url: string;
  token_address: string;
  block_number: string;
  wallet_address: string;
  arbitrary_data: ArbitraryData;
  screen_config: ScreenConfig;
  message_to_sign: string;
  signed_message: string;
  created_at: string;
}

export interface GetPayloadByMessage {
  payload: string;
}

export interface GetJWTByMessage {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
}

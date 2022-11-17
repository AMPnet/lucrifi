export interface FunctionParam {
  type: string;
  value: string;
}

export interface ArbitraryData {
  test: boolean;
}

export interface ScreenConfig {
  before_action_message: string;
  after_action_message: string;
}

export interface FunctionCallTx {
  tx_hash: string;
  from: string;
  to: string;
  data: string;
  value: string;
  block_confirmations: string;
  timestamp: Date;
}

export interface FunctionCallResponse {
  id: string;
  status: string;
  deployed_contract_id?: any;
  contract_address: string;
  function_name: string;
  function_params: FunctionParam[];
  function_call_data: string;
  eth_amount: string;
  chain_id: number;
  redirect_url: string;
  project_id: string;
  created_at: Date;
  arbitrary_data: ArbitraryData;
  screen_config: ScreenConfig;
  caller_address: string;
  function_call_tx: FunctionCallTx;
}

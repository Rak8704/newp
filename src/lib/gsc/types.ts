export type GscBatchRequest = { member_account: string; product_code: number };
export type GscTransaction = {
  id: string; action: string; wager_code?: string; wager_status?: string; round_id?: string;
  amount: number | string; bet_amount?: number | string; valid_bet_amount?: number | string;
  prize_amount?: number | string; tip_amount?: number | string; settled_at?: number; game_code?: string;
  channel_code?: string; wager_type?: string; reference_transaction_id?: string;
};
export type GscWager = {
  member_account: string; bet_amount: string|number; valid_bet_amount: string|number;
  prize_amount: string|number; tip_amount?: string|number; wager_type: string; wager_code: string;
  wager_status: string; round_id?: string; channel_code?: string; game_type?: string;
  settled_at?: number; created_at?: number; payload?: unknown; product_code?: number; game_code?: string; currency: string;
};

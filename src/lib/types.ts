export type SignalDirection = "BUY" | "SELL";
export type SignalResult = "WIN" | "LOSS" | "PENDING";

export type Signal = {
  id: string;
  pair: string;
  direction: SignalDirection;
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  result: SignalResult | null;
  pips: number | null;
  created_at: string;
  status: string;
};

export type Stats = {
  id: string;
  win_rate: number;
  pips_month: number;
  monthly_return: number;
  active_traders: number;
  updated_at: string;
};

export type Testimonial = {
  id: string;
  name: string;
  location: string | null;
  quote: string;
  rating: number;
  member_type: string | null;
  image_url: string | null;
  created_at: string;
};

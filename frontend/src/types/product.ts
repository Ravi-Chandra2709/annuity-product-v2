export interface Product {
  id: string;
  product_name: string | null;
  carrier_name: string | null;
  carrier_rating: string | null;
  product_type: string | null;
  state_availability: string[] | null;
  surrender_period: number | null;
  base_rate: number | null;
  cap_rate: number | null;
  participation_rate: number | null;
  annual_fee: number | null;
  has_bonus: boolean | null;
  bonus_percentage: number | null;
  bonus_vesting_years: number | null;
  minimum_investment: number | null;
  maximum_investment: number | null;
  issue_ages_min: number | null;
  issue_ages_max: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface IncomeRider {
  id: string;
  rider_name: string | null;
  rider_fee: number | null;
  deferral_bonus_rate: number | null;
  payout_percentage_single_age_65: number | null;
  payout_percentage_single_age_70: number | null;
  payout_percentage_single_age_75: number | null;
  payout_percentage_joint_age_65: number | null;
  payout_percentage_joint_age_70: number | null;
  payout_percentage_joint_age_75: number | null;
  lifetime_guarantee: boolean | null;
  inflation_protection: boolean | null;
}

export interface IndexOption {
  id: string;
  index_name: string | null;
  index_type: string | null;
  cap_rate: number | null;
  participation_rate: number | null;
  spread_fee: number | null;
  floor_rate: number | null;
}

export interface HistoricalPerformance {
  id: string;
  year: number | null;
  credited_rate: number | null;
  index_return: number | null;
  effective_return: number | null;
}

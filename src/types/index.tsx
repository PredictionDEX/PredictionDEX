import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types"
import { MarketStatus } from "./generic"

export type ValidatorType = {
  name: string
  address: string
  emission: number
  incentive: number
  dividends: number
  regblock: number
  last_update: number
  balance: number
  stake: number
  stake_from: []
  total_validators: number
  total_stakers: number
  delegation_fee: number
  type: string
  key: string
  apy: number
  weights: any[]
  wallet_staked?: number
  expire_at?: number
  verified_type: string
  subnet_id: number
  discord?: string
  twitter?: string
  website?: string
  description?: string
  image?: string
}

export type ValidatorExtendedType = {
  name: string
  subnet_data: [
    {
      name: string
      subnet_id: number
      apy: number
      delegation_fee: number
      incentive: number
      dividends: number
      emission: number
      regblock: number
      uid: number
      subnet_name: string
      tempo: number
    },
  ]
  address: string
  emission: number
  incentive: number
  dividends: number
  regblock: number
  last_update: number
  balance: number
  stake: number
  stake_from: []
  total_validators: number
  total_stakers: number
  delegation_fee: number
  type: string
  key: string
  apy: number
  wallet_staked?: number
  expire_at?: number
  verified_type: string
  subnet_id: number
  discord?: string
  twitter?: string
  website?: string
  description?: string
  image?: string
}

export interface InterfacePagination<Data> {
  total: number
  page: number
  limit: number
  validators: Data
}
export interface InterfacePaginationSubnet<Data> {
  total: number
  page: number
  limit: number
  subnets: Data
}

export interface InterfacePaginatedUsers<Data> {
  total: number
  page: number
  limit: number
  holders: Data
}

export type IAddStaking = {
  validator: string
  amount: string
  callback?: () => void
}

export type ITransfer = {
  to: string
  amount: string
  callback?: (txHash: string | null) => void
}
export type ITransferStaking = {
  validatorFrom: string
  amount: string
  validatorTo: string
  callback?: () => void
}
export interface IStats {
  circulating_supply: number
  total_stake: number
  total_subnets: number
  total_validators: number
  total_miners: number
  total_modules: number
  price: number
  marketcap: number
  daily_emission: number
  total_stakers: number
  avg_apy: number
}
export interface IBalanceType {
  balance: number
  staked: number
  stakes: { amount: number; validator: ValidatorType }[]
  daily_reward: number
}

export interface SubnetInterface {
  name: string
  emission: number
  total_modules: number
  founder: string
  immunity_period: number
  incentive_ratio: number
  subnet_id: number
  emission_percent: number
}

export interface IVerifyModule {
  key: string
  verificationType: "golden" | "verified"
  duration: "monthly" | "yearly"
  subnetId: number
  callback?: () => void
}

export type RichListType = {
  rank: number
  address: string
  balance: number
  stake: number
  total: number
}

export interface MessageResponse {
  public_address: string
  sign_message: string
}
export interface ApiResponse<T> {
  data: T
  ok: boolean
}

export interface Prediction {
  id: number
  user_id: number
  outcome_id: number
  amount: number
  created_at: string
  updated_at: string
}

export interface Outcome {
  id: number
  market_id: number
  label: string
  total_amount: number
  created_at: string
  updated_at: string
  predictions: Prediction[]
  self_prediction: {
    data: Prediction[]
    total_amount: number
  }
}

export interface Market {
  id: number
  title: string
  type: string
  images: string[]
  resolution_date: string
  status: MarketStatus
  disputer_id: number | null
  creator_id: number
  resolved_outcome_id: number | null
  resolved_outcome: Outcome | null
  result_date: string | null
  distribution: []
  creator: User | null
  disputer: User | null
  // user_distributions:{}
  pool_amount: number
  created_at: string
  updated_at: string
  outcomes: Outcome[]
}

export interface PaginatedApiResponse<T> {
  data: T[]
  ok: boolean
  pagination: {
    count: number
    current: number
    next: number
    prev: number
    total: number
    total_pages: number
  }
}
export interface User {
  id: number
  username: string
  public_address: string
  nonce: number
  role: string
  verified: boolean
  tokens: number
  total_points: number
  created_at: string
  updated_at: string
}
export interface LoginResponse {
  user: User
  access_token: string
  expires_at: string
}

export interface UserStorage {
  accessToken: string
  selectedWallet: InjectedAccountWithMeta
}

export interface MarketStats {
  volume: number
  users: number
  rewards: number
  live_markets: number
  predictions: number
}

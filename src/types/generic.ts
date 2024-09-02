export enum MarketStatus {
  LIVE = "LIVE",
  CLOSED = "CLOSED",
  FLASHED = "FLASHED",
  DISPUTED = "DISPUTED",
  RESOLVED = "RESOLVED",
  DISPUTE_RESOLVED = "DISPUTE_RESOLVED",
}

export enum TransactionType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

export type UserTransaction = TransactionType | "DISTRIBUTION";

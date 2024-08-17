import { Market, Outcome } from "@/types"

export function truncateWalletAddress(
  address: string,
  startLength: number = 6,
  endLength: number = 4,
): string {
  // Check if the address length is greater than the sum of startLength and endLength
  if (address.length > startLength + endLength) {
    // Extract the beginning and end of the address
    const start = address.slice(0, startLength)
    const end = address.slice(-endLength)
    // Return the truncated address
    return `${start}...${end}`
  }
  // If the address is not long enough to truncate, return it as is
  return address
}

export function formatTokenAmount(amount?: number, decimal = 9): number {
  if (amount === undefined) {
    return 0
  }
  return Number(
    (parseFloat(amount.toString()) / Math.pow(10, decimal)).toFixed(2),
  )
}

export const computeWinPool = (
  outcomes: Outcome[] | undefined,
  winningOutcomeId: number | undefined | null,
) => {
  if (!outcomes || !winningOutcomeId) return 0
  const losingOutcomes = outcomes.filter(
    (outcome) => outcome.id !== winningOutcomeId,
  )
  let total = 0
  for (const loser of losingOutcomes) {
    total += loser.total_amount
  }
  return total
}

export const userPredictionOnWinPool = (
  outcomes: Outcome[] | undefined,
  winningOutcomeId: number | undefined | null,
) => {
  if (!outcomes || !winningOutcomeId) return 0
  let userPrediction = 0
  outcomes.map((outcome) => {
    if (
      outcome.id === winningOutcomeId &&
      outcome.self_prediction &&
      outcome.self_prediction.total_amount > 0
    ) {
      userPrediction += outcome.self_prediction?.total_amount
    }
  })
  return userPrediction
}

export const highestPrediction = (outcomes: Outcome[]) => {
  let highestPrediction = 0
  for (const outcome of outcomes) {
    for (const prediction of outcome.predictions) {
      if (prediction.amount > highestPrediction) {
        highestPrediction = prediction.amount
      }
    }
  }
  return highestPrediction
}

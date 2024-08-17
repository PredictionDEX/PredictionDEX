import MarketOutcomeCard from "@/components/outcome"
import { Market } from "@/types"
import { computeWinPool, userPredictionOnWinPool } from "@/utils"
import React from "react"

const ResolvedMarket = ({ marketData }: { marketData: Market }) => {
  const winningOutcome = marketData.outcomes.find(
    (outcome) => outcome.id === marketData?.resolved_outcome_id,
  )
  const losePool =
    computeWinPool(marketData?.outcomes, marketData?.resolved_outcome_id) * 0.7
  const winPool = marketData.outcomes.find(
    (outcome) => outcome.id === marketData.resolved_outcome_id,
  )
  const userWinningPrediction = userPredictionOnWinPool(
    marketData?.outcomes,
    marketData?.resolved_outcome_id,
  )

  const userEarnings =
    userWinningPrediction && losePool && winPool
      ? (userWinningPrediction / winPool.total_amount) * losePool
      : 0

  return (
    <>
      <h4 className="text-md font-semibold">Market Results</h4>
      <div className="mt-2 text-sm flex flex-row gap-x-3 ">
        <MarketOutcomeCard
          title="Winning Outcome "
          value={winningOutcome?.label}
        />
        <MarketOutcomeCard
          title="Win Pool"
          value={`${losePool.toFixed(2)} COMAI`}
        />
      </div>
      <div className="mt-2 text-sm flex flex-row gap-x-3 ">
        <MarketOutcomeCard
          title="Your Winpool Prediction"
          value={`${userWinningPrediction.toFixed(2) ?? 0} COMAI`}
        />
        <MarketOutcomeCard
          title="Your Earning"
          value={`${userEarnings?.toFixed(2) ?? 0} COMAI`}
        />
      </div>
    </>
  )
}

export default ResolvedMarket

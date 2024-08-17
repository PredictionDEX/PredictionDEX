import { Market } from "@/types"
import React from "react"

const DisputedMarket = ({ marketData }: { marketData: Market }) => {
  const winningOutcome = marketData.outcomes.find(
    (outcome) => outcome.id === marketData?.resolved_outcome_id,
  )
  return (
    <>
      <h4 className="text-md font-semibold">View Result</h4>
      <div className="mt-1 text-sm flex flex-col">
        <h1 className="text-md font-semibold">
          <span className="font-medium text-xs text-secondary ">
            Winning Outcome:
          </span>{" "}
          {winningOutcome?.label}
        </h1>
        <p className="mt-3">
          Result of the market has been disputed! Please wait until the result
          is settled up for the rewards!
        </p>
      </div>
    </>
  )
}

export default DisputedMarket

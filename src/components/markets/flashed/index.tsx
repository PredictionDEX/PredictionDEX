import AmountWarning from "@/components/balance/message"
import Button from "@/components/button"
import ClockComponent from "@/components/clock"
import MarketOutcomeCard from "@/components/outcome"
import { Market } from "@/types"
import React from "react"

const FlashedMarket = ({
  marketData,
  setDisputeModal,
}: {
  marketData: Market
  setDisputeModal: (args: boolean) => void
}) => {
  const winningOutcome = marketData.outcomes.find(
    (outcome) => outcome.id === marketData?.resolved_outcome_id,
  )
  return (
    <>
      <h4 className="text-md font-semibold">Market Results</h4>
      <div className="mt-2 text-sm flex flex-row gap-x-3">
        <MarketOutcomeCard
          title="Winning Outcome"
          value={String(winningOutcome?.label)}
        />
        <MarketOutcomeCard
          title="Reward Distribution in "
          value={<ClockComponent endTime={String(marketData.result_date)} />}
        />
      </div>
      <div className="mt-3">
        <AmountWarning amount="50" action="dispute" />
      </div>
      <div className="mt-3">
        <Button
          type="button"
          variant="primary"
          onClick={() => setDisputeModal(true)}
        >
          Dispute Market
        </Button>
      </div>
    </>
  )
}

export default FlashedMarket

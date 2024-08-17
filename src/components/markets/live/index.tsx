import CreatePredictionForm from "@/components/forms/predict"
import { Market } from "@/types"
import React from "react"

const LiveMarket = ({ marketData }: { marketData: Market }) => {
  return (
    <>
      <h4 className="text-md font-semibold">Place your bet</h4>
      <CreatePredictionForm marketData={marketData} />
    </>
  )
}

export default LiveMarket

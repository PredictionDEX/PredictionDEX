import React, { useState } from "react"
import Sidebar from ".."
import { usePolkadot } from "@/context"
import { useForm } from "react-hook-form"
import {
  useCreatePredictionMutation,
  useGetMarketByIdQuery,
  useGetMyDetailsQuery,
} from "@/store/api/statsApi"
import OutcomeProgress from "@/components/progress/outcome"
import { InputComponent } from "@/components/input"
import { SelectComponent } from "@/components/select"
import Button from "@/components/button"
import Moment from "react-moment"
import { Outcome } from "@/types"
import { successToast } from "@/components/toast"
import Image from "next/image"
import { MarketStatus } from "@/types/generic"
import DisputeModal from "@/components/modal/dispute"
import { computeWinPool } from "@/utils"
import ResolvedMarket from "@/components/markets/resolved"
import DisputedMarket from "@/components/markets/disputed"
import FlashedMarket from "@/components/markets/flashed"
import ClosedMarket from "@/components/markets/closed"
import LiveMarket from "@/components/markets/live"

interface IMarketSidebarType {
  isSidebarOpen: boolean
  toggleSidebar: () => void
  marketId: number
}

const MarketSidebar = ({
  isSidebarOpen,
  toggleSidebar,
  marketId,
}: IMarketSidebarType) => {
  const { data: marketData } = useGetMarketByIdQuery(marketId, {
    skip: !marketId && !isSidebarOpen,
  })

  const status = marketData?.data.status
  const [disputeModal, setDisputeModal] = useState(false)

  return (
    <Sidebar title="" isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
      <h1 className="text-md font-semibold">{marketData?.data.title}</h1>
      <p className="text-xs font-normal pt-1 text-gray-300">
        Market {status === "LIVE" ? "closes" : "closed"}{" "}
        <Moment fromNow>{marketData?.data?.resolution_date}</Moment>
      </p>
      <div className="flex mt-3 ring-1 w-full ring-gray-600  p-3 rounded-md">
        <div className="flex gap-x-2 items-center">
          <div className="relative h-8 w-8">
            <Image src="/total.png" alt="category" fill />
          </div>
          <div className="flex gap-x-1 flex-col">
            <h6 className="text-xs tracking-normal font-normal text-gray-200">
              Total Bets
            </h6>
            <h1 className="text-sm font-semibold break-all">
              {marketData?.data?.pool_amount} COMAI
            </h1>
          </div>
        </div>
      </div>
      <div className="flex w-full my-4 flex-col gap-y-3">
        {marketData?.data.outcomes.map((outcome: Outcome, index: number) => (
          <div className="flex items-center" key={index}>
            <OutcomeProgress
              outcomeName={outcome.label}
              totalVolume={Number(marketData?.data.pool_amount)}
              totalPrediction={outcome.total_amount}
              userPrediction={outcome.self_prediction?.total_amount}
            />
          </div>
        ))}
      </div>
      <div className="pt-3">
        <div className="ring-1 ring-gray-700 rounded-xl p-3">
          {status === MarketStatus.LIVE && (
            <LiveMarket marketData={marketData!.data} />
          )}
          {status === MarketStatus.CLOSED && <ClosedMarket />}
          {status === MarketStatus.FLASHED && (
            <FlashedMarket
              marketData={marketData!.data}
              setDisputeModal={setDisputeModal}
            />
          )}
          {status === MarketStatus.DISPUTED && (
            <DisputedMarket marketData={marketData!.data} />
          )}
          {(status === MarketStatus.RESOLVED ||
            status === MarketStatus.DISPUTE_RESOLVED) && (
            <ResolvedMarket marketData={marketData!.data} />
          )}

          <DisputeModal
            open={disputeModal}
            setOpen={setDisputeModal}
            marketId={String(marketId)}
          />
        </div>
      </div>
    </Sidebar>
  )
}

export default MarketSidebar

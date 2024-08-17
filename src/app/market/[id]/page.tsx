"use client"

import MarketCard from "@/components/card/market"
import StatsCard from "@/components/card/stats"
import { useGetMarketByIdQuery } from "@/store/api/statsApi"
import { highestPrediction } from "@/utils"
import React from "react"
import { FaArrowLeft, FaBaby } from "react-icons/fa"
import { FaMedal } from "react-icons/fa"

const InvidiualMarketCard = ({
  params,
}: {
  params: {
    id: string
  }
}) => {
  const marketId = params.id as string
  const { data: marketData, isLoading } = useGetMarketByIdQuery(
    Number(marketId),
    {
      skip: !marketId,
    },
  )

  return (
    <div className="flex gap-x-3">
      <div className="w-[70%]">
        <div className="mb-2 mt-4">
          <button className="ring-1 ring-gray-400 p-2 rounded-xl">
            <FaArrowLeft />
          </button>
        </div>
        {marketData?.data && (
          <MarketCard
            key={marketData.data.id}
            id={marketData.data.id}
            image={`https://ecg.nyc3.digitaloceanspaces.com/${marketData?.data?.images[0]}`}
            outcomes={marketData.data.outcomes}
            name={marketData.data.title}
            time={marketData.data.resolution_date}
            category={marketData.data.type}
            totalVolume={marketData.data.pool_amount}
            status={marketData.data.status}
            isFullWidth
            isClickable={false}
          />
        )}
        {!isLoading && (
          <div className="flex flex-row mt-3 px-3 gap-x-3">
            <div className="flex-1">
              <StatsCard
                title="Highest Prediction"
                value={highestPrediction(marketData?.data.outcomes!)}
                icon={<FaMedal className="text-secondary" size={24} />}
              />
            </div>
            <div className="flex-1">
              <StatsCard
                title="Total Pool"
                value={`${String(marketData?.data.pool_amount)} COMAI`}
                icon={<FaMedal className="text-secondary" size={24} />}
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 mt-14">
        <div className="ring-2 ring-gray-700 min-h-[600px] rounded-2xl p-4 bg-black/50">
          <h1 className="font-semibold">Recent Predictions</h1>
          <p className="text-secondary mt-3">Coming Soon</p>
        </div>
      </div>
    </div>
  )
}

export default InvidiualMarketCard

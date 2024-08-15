"use client"

import { AiFillAccountBook } from "react-icons/ai"
import { LuLayoutDashboard } from "react-icons/lu"
import { FaGifts } from "react-icons/fa"
import { FaUsers } from "react-icons/fa"
import { IoBarChartSharp } from "react-icons/io5"
import { CgMediaLive } from "react-icons/cg"
import StatsCard from "@/components/card/stats"
import MarketCard from "@/components/card/market"
import { useGetMarketsQuery, useGetStatsQuery } from "@/store/api/statsApi"

export default function Home() {
  const { data: marketsData } = useGetMarketsQuery()
  const { data: marketStats, isLoading: marketStatsLoading } =
    useGetStatsQuery()
  return (
    <div>
      <div className="flex gap-4 py-5 flex-wrap">
        <StatsCard
          isLoading={marketStatsLoading}
          title="Total Volume"
          value={marketStats?.volume!}
          icon={<AiFillAccountBook size={36} className="text-secondary" />}
        />
        <StatsCard
          isLoading={marketStatsLoading}
          title="Total Predictions"
          value={marketStats?.predictions!}
          icon={<LuLayoutDashboard size={36} className="text-secondary" />}
        />
        <StatsCard
          isLoading={marketStatsLoading}
          title="Total Rewards"
          value={marketStats?.rewards!}
          icon={<FaGifts size={36} className="text-secondary" />}
        />
        <StatsCard
          isLoading={marketStatsLoading}
          title="Total Users"
          value={marketStats?.users!}
          icon={<FaUsers size={36} className="text-secondary" />}
        />
        <StatsCard
          isLoading={marketStatsLoading}
          title="Live Markets"
          value={marketStats?.live_markets!}
          icon={<IoBarChartSharp size={36} className="text-secondary" />}
        />
      </div>
      <section>
        <h1 className="text-xl py-2 font-semibold flex gap-x-2 items-center">
          <CgMediaLive className="text-secondary animate-pulse" />
          Live Markets
        </h1>
        <div className="flex flex-wrap">
          {marketsData?.data.map((market) => (
            <MarketCard
              key={market.id}
              id={market.id}
              image={`https://ecg.nyc3.digitaloceanspaces.com/${market.images[0]}`}
              outcomes={market.outcomes}
              name={market.title}
              time={market.resolution_date}
              category={market.type}
              totalVolume={market.pool_amount}
              status={market.status}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

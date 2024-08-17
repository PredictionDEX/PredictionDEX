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
import { MarketStatus } from "@/types/generic"
import useInfiniteScroll from "react-infinite-scroll-hook"
import { useState } from "react"

export default function Home() {
  const [page, setPage] = useState(1)
  const {
    data: marketsData,
    isLoading: marketLoading,
    isError: marketError,
  } = useGetMarketsQuery(
    {
      status: MarketStatus.LIVE,
      page: String(page),
      count: "10",
    },
    {
      pollingInterval: 100000,
      skipPollingIfUnfocused: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
    },
  )
  const { data: marketStats, isLoading: marketStatsLoading } = useGetStatsQuery(
    undefined,
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
      skipPollingIfUnfocused: true,
      refetchOnMountOrArgChange: true,
    },
  )

  const [sentryRef] = useInfiniteScroll({
    loading: marketLoading,
    hasNextPage: marketsData?.pagination?.next !== null,
    onLoadMore: () => {
      console.log("Loading more")
      setPage((prev) => prev + 1)
    },
    disabled: marketError,
    rootMargin: "0px 0px 20px 0px",
    delayInMs: 1000,
  })
  return (
    <div>
      <div className="flex gap-4 py-5 px-3 flex-col md:flex-wrap md:flex-row md:px-0">
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
          value={Number(marketStats?.rewards!.toFixed(2))}
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
          Trending Markets
        </h1>

        <div className="flex flex-col md:flex-wrap md:flex-row">
          {!marketLoading &&
            marketsData?.data.map((market) => (
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
          {(marketLoading || marketsData?.pagination?.next !== null) && (
            <div ref={sentryRef} className="px-3">
              Loading ...
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

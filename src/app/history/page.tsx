"use client"
import MarketCard from "@/components/card/market"
import TabButton from "@/components/tabButton"
import { useGetMarketsQuery } from "@/store/api/statsApi"
import { MarketStatus } from "@/types/generic"
import React, { useState } from "react"
import useInfiniteScroll from "react-infinite-scroll-hook"

const History = () => {
  const [page, setPage] = useState(1)
  const [market, setMarket] = useState<MarketStatus>(MarketStatus.CLOSED)

  const {
    data: marketData,
    isLoading,
    isError,
  } = useGetMarketsQuery({
    status: market,
    page: String(page),
    count: "10",
  })

  const [sentryRef] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: marketData?.pagination?.next !== null,
    onLoadMore: () => {
      console.log("Loading more")
      setPage((prev) => prev + 1)
    },
    disabled: isError,
    rootMargin: "0px 0px 20px 0px",
    delayInMs: 1000,
  })
  const handleKeyChange = (key: MarketStatus) => {
    setMarket(key)
    setPage(1)
  }
  return (
    <div>
      <div className="text-2xl font-semibold">
        <div className="text-2xl font-semibold pt-4">Market History</div>
        <p className="text-sm italic text-gray-500">
          View all the older markets in the platform
        </p>
      </div>
      <div className="flex gap-x-1 my-3 mt-4">
        <TabButton
          isActive={market === MarketStatus.CLOSED}
          handleChange={() => handleKeyChange(MarketStatus.CLOSED)}
        >
          Completed Markets
        </TabButton>
        <TabButton
          isActive={market === MarketStatus.FLASHED}
          handleChange={() => handleKeyChange(MarketStatus.FLASHED)}
        >
          Closed Markets
        </TabButton>
        <TabButton
          isActive={market === MarketStatus.DISPUTED}
          handleChange={() => handleKeyChange(MarketStatus.DISPUTED)}
        >
          Disputed Markets
        </TabButton>
        <TabButton
          isActive={market === MarketStatus.RESOLVED}
          handleChange={() => handleKeyChange(MarketStatus.RESOLVED)}
        >
          Resolved Markets
        </TabButton>
      </div>

      <div className="flex flex-1 flex-col md:flex-wrap md:flex-row">
        {!isLoading && marketData?.data?.length === 0 && (
          <div className="text-center w-full mt-4">No markets found</div>
        )}
        {!isLoading &&
          marketData?.data?.map((market) => (
            <MarketCard
              key={market.id}
              id={market.id}
              image={
                market?.images?.length > 0
                  ? `https://ecg.nyc3.digitaloceanspaces.com/${market.images[0]}`
                  : ""
              }
              outcomes={market.outcomes ?? []}
              name={market.title}
              time={market.resolution_date}
              category={market.type}
              totalVolume={market.pool_amount}
              status={market.status}
            />
          ))}
        {(isLoading || marketData?.pagination?.next !== null) && (
          <div ref={sentryRef} className="px-3">
            Loading ...
          </div>
        )}
      </div>
    </div>
  )
}

export default History

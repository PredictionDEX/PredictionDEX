"use client"
import MarketCard from "@/components/card/market"
import TabButton from "@/components/tabButton"
import { useGetMySelfMarketQuery } from "@/store/api/statsApi"
import React, { useState } from "react"
import { CgMediaLive } from "react-icons/cg"
import useInfiniteScroll from "react-infinite-scroll-hook"

const Profile = () => {
  const [page, setPage] = useState(1)
  const [market, setMarket] = useState<"prediction" | "created">("prediction")
  const {
    data: myMarket,
    isLoading,
    isError,
  } = useGetMySelfMarketQuery({
    status: market,
    page: String(page),
    count: "10",
  })
  const [sentryRef] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: myMarket?.pagination?.next !== null,
    onLoadMore: () => {
      console.log("Loading more")
      setPage((prev) => prev + 1)
    },
    disabled: isError,
    rootMargin: "0px 0px 20px 0px",
    delayInMs: 1000,
  })
  const handleKeyChange = (key: "prediction" | "created") => {
    setMarket(key)
    setPage(1)
  }
  return (
    <div>
      <div className="flex">
        <div className="text-2xl font-semibold">
          <div className="text-2xl font-semibold pt-4">Your Markets</div>
          <p className="text-sm italic text-gray-500">
            Your predicted and created markets in a single place!!
          </p>
        </div>
      </div>
      <div className="flex gap-x-1 my-3 mt-4">
        <TabButton
          isActive={market === "prediction"}
          handleChange={() => handleKeyChange("prediction")}
        >
          Predicted Markets
        </TabButton>
        <TabButton
          isActive={market === "created"}
          handleChange={() => handleKeyChange("created")}
        >
          Created Markets
        </TabButton>
      </div>

      <div className="flex flex-1 flex-col md:flex-wrap md:flex-row">
        {!isLoading &&
          myMarket?.data?.map((market) => (
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
        {(isLoading || myMarket?.pagination?.next !== null) && (
          <div ref={sentryRef} className="px-3">
            Loading ...
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile

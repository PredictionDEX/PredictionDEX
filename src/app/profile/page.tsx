"use client";
import MarketCard from "@/components/card/market";
import TabButton from "@/components/tabButton";
import {
  useGetMySelfMarketCreatedQuery,
  useGetMySelfMarketPredictedQuery,
} from "@/store/api/statsApi";
import React, { useState } from "react";
import { CgMediaLive } from "react-icons/cg";
import useInfiniteScroll from "react-infinite-scroll-hook";

const Profile = () => {
  const [page, setPage] = useState(1);
  const [market, setMarket] = useState<"prediction" | "created">("prediction");
  const {
    data: myMarketCreated,
    isLoading: marketCreatedLoading,
    isError: marketCreatingError,
  } = useGetMySelfMarketCreatedQuery({
    page: String(page),
    count: "10",
  });
  const {
    data: myMarketPredicted,
    isLoading: marketPredictedLoading,
    isError: marketPredictedError,
  } = useGetMySelfMarketPredictedQuery({
    page: String(page),
    count: "10",
  });
  const hasNextPage =
    market === "created"
      ? myMarketCreated?.pagination.next
      : myMarketPredicted?.pagination.next;
  const isLoading = marketCreatedLoading || marketPredictedLoading;
  const isError = marketCreatingError || marketPredictedError;
  const [sentryRef] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: hasNextPage !== null,
    onLoadMore: () => {
      console.log("Loading more");
      setPage((prev) => prev + 1);
    },
    disabled: isError,
    rootMargin: "0px 0px 20px 0px",
    delayInMs: 1000,
  });
  const handleKeyChange = (key: "prediction" | "created") => {
    setMarket(key);
    setPage(1);
  };

  return (
    <div>
      <div className="flex">
        <div className="text-2xl font-semibold">
          <div className="text-2xl font-semibold pt-4">Your Markets</div>
          <p className="text-sm italic text-gray-500">
            A place to view all the markets you&apos;ve created and predicted.
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
        {market === "created" && (
          <>
            {!marketCreatedLoading && myMarketCreated?.data?.length === 0 && (
              <div className="text-center w-full mt-4">No markets found</div>
            )}
            {!marketCreatedLoading &&
              myMarketCreated?.data?.map((market) => (
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
            {(marketCreatedLoading ||
              myMarketCreated?.pagination?.next !== null) && (
              <div ref={sentryRef} className="px-3">
                Loading ...
              </div>
            )}
          </>
        )}
        {market === "prediction" && (
          <>
            {!marketPredictedLoading &&
              myMarketPredicted?.data?.length === 0 && (
                <div className="text-center w-full mt-4">No markets found</div>
              )}
            {!marketPredictedLoading &&
              myMarketPredicted?.data?.map((market) => {
                // const { market } = outcome
                return (
                  <MarketCard
                    key={market!.id}
                    id={market!.id}
                    image={
                      market!.images?.length > 0
                        ? `https://ecg.nyc3.digitaloceanspaces.com/${
                            market!.images[0]
                          }`
                        : ""
                    }
                    outcomes={market!.outcomes ?? []}
                    name={market!.title}
                    time={market!.resolution_date}
                    category={market!.type}
                    totalVolume={market!.pool_amount}
                    status={market!.status}
                  />
                );
              })}
            {(marketPredictedLoading ||
              myMarketPredicted?.pagination?.next !== null) && (
              <div ref={sentryRef} className="px-3">
                Loading ...
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;

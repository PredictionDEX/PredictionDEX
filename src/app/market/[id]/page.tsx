"use client";

import MarketCard from "@/components/card/market";
import StatsCard from "@/components/card/stats";
import TableComponent from "@/components/table";
import { usePolkadot } from "@/context";
import {
  useGetMarketByIdQuery,
  useGetRecentPredictionsQuery,
} from "@/store/api/statsApi";
import { highestPrediction } from "@/utils";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FaMedal } from "react-icons/fa";
import Moment from "react-moment";

const InvidiualMarketCard = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const marketId = params.id as string;
  const [page, setPage] = useState(1);
  const { data: marketData, isLoading } = useGetMarketByIdQuery(
    Number(marketId),
    {
      skip: !marketId,
    }
  );
  const { data: marketPredictions, isLoading: marketLoading } =
    useGetRecentPredictionsQuery({
      marketId: marketId,
      page: String(page),
      count: "10",
    });
  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };
  const totalPages = marketPredictions?.pagination.total_pages ?? 0;
  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };
  const router = useRouter();
  const { selectedAccount } = usePolkadot();
  return (
    <div className="flex flex-col md:flex-row gap-x-3">
      <div className="w-[100%] md:w-[70%]">
        <div className="mb-2 mt-4">
          <button
            className="ring-1 ring-gray-400 p-2 rounded-xl cursor-pointer"
            onClick={() => router.back()}
          >
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
            isMarketCreator={
              selectedAccount?.address ===
              marketData.data.creator?.public_address
            }
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
          <TableComponent
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            tableHeadings={["Outcome", "Amount", "Timestamp"]}
            isLoading={marketLoading}
            page={page}
            tableBody={marketPredictions?.data.map((item, index) => (
              <tr key={item.id} className="text-sm">
                <td className="py-1 px-6">{item.outcome.label}</td>
                <td className="py-1 px-6">{item.amount} COMAI</td>
                <td className="py-1 px-6">
                  <Moment fromNow>{item.created_at}</Moment>
                </td>
              </tr>
            ))}
            totalPages={10}
          />
        </div>
      </div>
    </div>
  );
};

export default InvidiualMarketCard;

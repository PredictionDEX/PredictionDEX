"use client"
import Image from "next/image"
import React, { useState } from "react"
import OutcomeCard from "../outcome"
import Button from "../../button"
import { Outcome } from "@/types"
import Moment from "react-moment"
import MarketSidebar from "@/components/sidebar/market"
import { MarketStatus } from "@/types/generic"
import { GoDotFill } from "react-icons/go"
import categories from "@/app/_lib/category.json"
interface IMarketCard {
  id: number
  name: string
  time: string
  category: string
  status: MarketStatus
  totalVolume: number
  outcomes: Outcome[]
  isFullWidth?: boolean
  image: string
  isPreview?: boolean
  isLoading?: boolean
}
const MarketCard = ({
  id,
  name,
  image,
  time,
  category,
  status,
  totalVolume,
  outcomes,
  isLoading = false,
  isFullWidth = false,
  isPreview = false,
}: IMarketCard) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<number>(-1)
  const toggleSidebar = () => {
    if (isSidebarOpen === -1) {
      setIsSidebarOpen(id)
      return
    }
    setIsSidebarOpen(-1)
  }

  const getMarketStatus = () => {
    switch (status) {
      case MarketStatus.LIVE:
        return (
          <div className="flex items-center text-xs font-semibold">
            <GoDotFill className="text-green-300" size={20} />
            <p>Live</p>
          </div>
        )
      case MarketStatus.CLOSED:
        return (
          <div className="flex items-center text-xs font-semibold">
            <GoDotFill className="text-gray-300" size={20} />
            <p>Completed</p>
          </div>
        )
      case MarketStatus.FLASHED:
        return (
          <div className="flex items-center text-xs font-semibold">
            <GoDotFill className="text-gray-300" size={20} />
            <p>Announced </p>
          </div>
        )
      case MarketStatus.DISPUTED:
        return (
          <div className="flex items-center text-xs font-semibold">
            <GoDotFill className="text-red-300" size={20} />
            <p>Disputed </p>
          </div>
        )
      case MarketStatus.DISPUTE_RESOLVED:
        return (
          <div className="flex items-center text-xs font-semibold">
            <GoDotFill className="text-primary" size={20} />
            <p>Resolved </p>
          </div>
        )
      case MarketStatus.RESOLVED:
        return (
          <div className="flex items-center text-xs font-semibold">
            <GoDotFill className="text-primary" size={20} />
            <p>Completed </p>
          </div>
        )
    }
  }

  const getMarketCategory = () => {
    const selectedCategory = categories.find((cat) => cat.value === category)

    return (
      <div className="flex items-center gap-x-1">
        <div className=" relative h-5 w-5  rounded-full overflow-hidden">
          <Image
            src={
              selectedCategory?.image
                ? String(selectedCategory?.image)
                : "/default.jpg"
            }
            alt="category"
            fill
          />
        </div>
        <h6 className="text-xs font-medium capitalize">{category}</h6>
      </div>
    )
  }

  return (
    <div className={`p-2 min-h-48 w-full md:w-1/3 ${isFullWidth && `!w-full`}`}>
      <div className="flex border-[1px] bg-gray-900 border-gray-700 rounded-2xl  text-blackflex-col shadow-md flex-col pt-3">
        <div className="py-3 px-3 text-white">
          <div className="flex justify-between ">
            <div className="flex  gap-x-3 items-center w-full">
              {isLoading ? (
                <div className="h-10 w-10  rounded-full bg-gray-800 mb-2" />
              ) : (
                <div className="min-h-10 min-w-10 rounded-full bg-gray-200 relative p-4 overflow-hidden">
                  <Image
                    src={image ? image : "/default.jpeg"}
                    alt="Ethereum"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex flex-col w-full">
                <h1 className="text-sm font-semibold line-clamp-3">
                  {isLoading ? (
                    <div className="h-4 bg-gray-800 w-full rounded-xl mb-1" />
                  ) : (
                    name
                  )}
                </h1>
                {isLoading && (
                  <div className="h-4 bg-gray-800 w-[90px] rounded-xl mb-1" />
                )}

                {!isLoading && time && time !== "" && (
                  <p className="text-xs font-normal pt-1 text-gray-300">
                    Market {status === MarketStatus.LIVE ? "closes" : "closed"}{" "}
                    <Moment fromNow>{time}</Moment>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-x-3 mt-4">
            {outcomes.map((outcome) => (
              <OutcomeCard
                key={outcome.id}
                name={outcome.label}
                isLoading={isLoading}
                value={
                  totalVolume > 0
                    ? Number(
                        ((outcome.total_amount / totalVolume) * 100).toFixed(2),
                      )
                    : 0
                }
                id={outcome.id}
              />
            ))}
          </div>

          <div className="mt-3">
            {isLoading ? (
              <div className="h-10 w-full rounded-xl bg-gray-800 mb-2" />
            ) : (
              <Button
                type="button"
                variant="primary"
                onClick={toggleSidebar}
                disabled={isPreview}
              >
                {status !== MarketStatus.LIVE ? "View Market" : "Predict Now"}
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center h-12 mt-1 py-2 px-3 border-t-[1px] border-t-gray-700 justify-between">
          {isLoading ? (
            <div className="h-5 w-16  rounded-full bg-gray-800 mb-0" />
          ) : (
            getMarketStatus()
          )}
          {isLoading ? (
            <div className="h-5 w-16  rounded-full bg-gray-800 mb-0" />
          ) : (
            getMarketCategory()
          )}
          {isLoading ? (
            <div className="h-5 w-16  rounded-full bg-gray-800 mb-0" />
          ) : (
            <div className="flex items-center gap-x-1">
              <div className=" relative h-5 w-5  rounded-full overflow-hidden">
                <Image src="/total.png" alt="category" fill />
              </div>
              <h6 className="text-xs font-medium">{totalVolume}</h6>
            </div>
          )}
        </div>
      </div>
      {isSidebarOpen === id && (
        <MarketSidebar
          isSidebarOpen={isSidebarOpen === id}
          toggleSidebar={toggleSidebar}
          marketId={id}
        />
      )}
    </div>
  )
}

export default MarketCard

"use client"
import Image from "next/image"
import React, { useState } from "react"
import OutcomeCard from "../outcome"
import Button from "../../button"
import { BiCategory } from "react-icons/bi"
import { FaChartLine, FaRegUser } from "react-icons/fa"

interface IMarketCard {
  name: string
  time: string
  category: string
  createdBy: string
  totalVolume: string
  outcomes: [any, any, any]
  isFullWidth?: boolean
}
const MarketCard = ({
  name,
  time,
  category,
  createdBy,
  totalVolume,
  outcomes,
  isFullWidth = false,
}: IMarketCard) => {
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null)

  const handleSelectedOutcome = (value: string) => {
    setSelectedOutcome(value)
  }
  return (
    <div className={`p-2 min-h-48 ${isFullWidth ? "w-full" : "w-1/3"}`}>
      <div className="flex border-[1px] bg-gray-900 border-gray-700 rounded-2xl  text-blackflex-col shadow-md flex-col pt-3">
        <div className="py-3 px-3 text-white">
          <div className="flex gap-x-3 items-center ">
            <div className="flex">
              <div className="h-10 w-10 rounded-full bg-gray-200 relative p-4 ring-1 ring-gray-50 overflow-hidden">
                <Image
                  src="/kamala.webp"
                  alt="Ethereum"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="h-10 w-10 rounded-full bg-gray-200 relative p-4 -ml-2 ring-1 ring-gray-50 overflow-hidden">
                <Image
                  src="/trump.jpeg"
                  alt="Ethereum"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              {" "}
              <h1 className="text-md font-semibold">{name}</h1>
              <p className="text-xs font-normal pt-1 text-gray-300">
                Market resolves in {String(time)}
              </p>
            </div>
          </div>

          <div className="flex gap-x-3 my-4">
            <OutcomeCard
              name="Outcome A"
              value={10}
              id="0"
              isActive={selectedOutcome === "0"}
            />
            <OutcomeCard
              name="Outcome B"
              value={60}
              id="1"
              isActive={selectedOutcome === "1"}
            />
            <OutcomeCard
              name="Outcome C"
              value={30}
              id="2"
              isActive={selectedOutcome === "2"}
            />
          </div>
          <Button type="button" variant="primary">
            Predict Now
          </Button>
        </div>
        <div className="flex items-center h-12 mt-2 py-2 px-3 border-t-[1px] border-t-gray-700 justify-between">
          <div className="flex items-center gap-x-1">
            <p className="text-xs capitalize leading-tight text-gray-400">
              <BiCategory size={20} />
            </p>
            <h6 className="text-sm font-medium">{category}</h6>
          </div>
          <div className="flex items-center gap-x-1">
            <p className="text-xs capitalize leading-tight text-gray-400">
              <FaChartLine size={20} />
            </p>
            <h6 className="text-sm font-medium">{totalVolume}</h6>
          </div>
          <div className="flex items-center gap-x-1">
            <p className="text-xs capitalize leading-tight text-gray-400">
              <FaRegUser size={20} />
            </p>
            <h6 className="text-sm font-medium">{createdBy}</h6>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketCard

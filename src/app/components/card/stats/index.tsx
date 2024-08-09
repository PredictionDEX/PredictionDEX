import React from "react"
import { AiFillAccountBook } from "react-icons/ai"

interface IStatsCard {
  title: string
  value: number
}

const StatsCard = ({ title, value }: IStatsCard) => {
  return (
    <div className="flex flex-row items-center shadow-lg p-4 ring-1 ring-gray-700  text-white bg-gray-900 flex-1 rounded-lg gap-x-3">
      <div className="">
        <AiFillAccountBook size={36} className="text-gray-500" />
      </div>
      <div className="">
        <h1 className="text-2xl font-semibold">{value}</h1>
        <h6 className="text-xs uppercase leading-tight mt-1 text-gray-500">
          {title}
        </h6>
      </div>
    </div>
  )
}

export default StatsCard

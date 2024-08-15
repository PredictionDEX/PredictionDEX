import React, { ReactNode } from "react"

interface IStatsCard {
  title: string
  value: number | string
  icon: ReactNode
  isLoading?: boolean
}

const StatsCard = ({ title, value, icon, isLoading = false }: IStatsCard) => {
  return (
    <div className="flex flex-row items-center shadow-lg p-4 ring-1 ring-gray-700  text-white bg-gray-900 flex-1 rounded-lg gap-x-3">
      <div className="">
        {isLoading ? (
          <div className="h-2 w-[80%] rounded-xl bg-gray-200" />
        ) : (
          icon
        )}
      </div>
      <div className="">
        <h1 className="text-2xl font-semibold">
          {isLoading ? (
            <div className="h-2 w-[80%] rounded-xl bg-gray-200" />
          ) : (
            value
          )}
        </h1>
        <h6 className="text-xs uppercase leading-tight mt-1 text-gray-300 font-medium">
          {isLoading ? (
            <div className="h-2 w-[80%] rounded-xl bg-gray-200" />
          ) : (
            title
          )}
        </h6>
      </div>
    </div>
  )
}

export default StatsCard
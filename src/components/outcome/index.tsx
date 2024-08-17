import React, { ReactNode } from "react"

const MarketOutcomeCard = ({
  title,
  value,
}: {
  title: string
  value: ReactNode
}) => {
  return (
    <div className="bg-gray-900 ring-1 ring-gray-700 px-4 py-3 w-1/2 rounded-xl flex justify-center items-start flex-col">
      <h5 className="text-xs text-secondary">{title}</h5>
      <div className="font-bold">{value}</div>
    </div>
  )
}

export default MarketOutcomeCard

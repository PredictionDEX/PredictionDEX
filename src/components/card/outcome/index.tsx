import React from "react"

interface IOutcomeTypes {
  id: number
  name: string
  value: number
  isActive?: boolean
  isLoading?: boolean
}
const OutcomeCard = ({
  id,
  name,
  value,
  isActive = false,
  isLoading = false,
}: IOutcomeTypes) => {
  return (
    <button
      className={`flex flex-1 ${
        isActive ? "ring-blue-300" : "ring-gray-200"
      } ring-1 ring-gray-800  rounded-md justify-start items-center flex-col cursor-pointer py-1`}
    >
      <p className="text-xs text-wrap font-normal">
        {isLoading ? (
          <div className="h-4 bg-gray-800 w-[80px] rounded-xl mb-1" />
        ) : (
          name
        )}
      </p>
      <p className="text-sm font-medium">
        {isLoading ? (
          <div className="h-4 bg-gray-800 w-[80px] rounded-xl mb-1" />
        ) : (
          `${value}%`
        )}
      </p>
    </button>
  )
}

export default OutcomeCard

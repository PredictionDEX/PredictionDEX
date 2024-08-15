import React from "react"

interface IOutcomeTypes {
  id: number
  name: string
  value: number
  isActive?: boolean
}
const OutcomeCard = ({ id, name, value, isActive = false }: IOutcomeTypes) => {
  return (
    <button
      className={`flex flex-1 ${
        isActive ? "ring-blue-300" : "ring-gray-200"
      } ring-1 ring-gray-800  rounded-md justify-start items-center flex-col cursor-pointer py-1`}
    >
      <p className="text-xs text-wrap font-normal">{name}</p>
      <p className="text-sm font-medium">{value}%</p>
    </button>
  )
}

export default OutcomeCard

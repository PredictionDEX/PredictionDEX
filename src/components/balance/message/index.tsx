import React from "react"
import { FaInfoCircle } from "react-icons/fa"

const AmountWarning = ({
  amount,
  action,
}: {
  amount: string
  action: string
}) => {
  return (
    <div className="flex w-full ring-1 ring-gray-700 shadow-sm shadow-black text-secondary font-semibold px-4 py-3 rounded-xl text-xs items-center gap-x-2">
      <FaInfoCircle />
      You need to pay {amount} COMAI to {action} the game.
    </div>
  )
}

export default AmountWarning

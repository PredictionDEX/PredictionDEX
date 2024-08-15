import React, { useEffect } from "react"
import { LuSquareDot } from "react-icons/lu"

const OutcomeProgress = ({
  totalPrediction = 0,
  totalVolume,
  outcomeName,
  userPrediction = 0,
}: {
  totalVolume: number
  outcomeName: string
  totalPrediction?: number
  userPrediction?: number
}) => {
  const [totalPredictionPercentage, setTotalPredictionPercentage] =
    React.useState(0)
  const [userPredictionPercentage, setUserPredictionPercentage] =
    React.useState(0)
  useEffect(() => {
    setTotalPredictionPercentage(
      totalPrediction ? (totalPrediction / totalVolume) * 100 : 0,
    )
    setUserPredictionPercentage(
      userPrediction ? (userPrediction / totalVolume) * 100 : 0,
    )
  }, [totalPrediction, userPrediction])

  return (
    <div className="flex flex-col gap-y-2 mt-2 w-full">
      <div className="flex items-center text-sm text-gray-300 gap-x-1">
        <LuSquareDot className="text-secondary" size={14} />
        {`${outcomeName}`}
      </div>
      <div className="flex w-full gap-x-3">
        <button className="flex-1 relative h-5 mb-2 text-md  w-full  px-3 rounded-lg font-medium flex justify-between items-center bg-gray-500">
          <div
            className={`absolute top-0 left-0 h-full bg-green-600 -z-1 rounded-lg`}
            style={{ width: `${totalPredictionPercentage}%` }}
          />
          <div className="absolute top-0 left-3 h-full text-xs flex items-center justify-center -z-1 rounded-lg drop-shadow-lg">
            {totalPrediction} COMAI
          </div>
          <small className="absolute -bottom-5 text-[10px] text-gray-300">
            Total Bets
          </small>
        </button>
        <button className="flex-1 relative h-5 text-md  w-full  px-3 rounded-lg font-medium flex justify-between items-center bg-gray-500">
          <div
            className={`absolute top-0 left-0 h-full bg-purple-600 -z-1 rounded-lg`}
            style={{ width: `${userPredictionPercentage}%` }}
          />
          <div className="absolute top-0 left-3 h-full text-xs flex items-center justify-center -z-1 rounded-lg drop-shadow-lg">
            {userPrediction} COMAI
          </div>
          <small className="absolute -bottom-5 text-[10px] text-gray-300">
            Your Bets
          </small>
        </button>
      </div>
    </div>
  )
}

export default OutcomeProgress

import { useGetMyDetailsQuery } from "@/store/api/statsApi"
import React from "react"
import { FaSpinner } from "react-icons/fa"

const UserBalance = () => {
  const { data: userData, isLoading } = useGetMyDetailsQuery(undefined, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    skipPollingIfUnfocused: true,
  })
  return (
    <div className="flex text-xs">
      Balance:{" "}
      {isLoading ? (
        <FaSpinner className="animate-spin" />
      ) : (
        userData?.tokens?.toFixed(2) || 0
      )}{" "}
      COMAI
    </div>
  )
}

export default UserBalance

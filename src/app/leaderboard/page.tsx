"use client"
import StatsCard from "@/components/card/stats"
import {
  useGetLeaderboardQuery,
  useGetMyDetailsQuery,
} from "@/store/api/statsApi"
import React from "react"
import { AiFillCrown } from "react-icons/ai"
import { VscActivateBreakpoints } from "react-icons/vsc"
import { FaGifts } from "react-icons/fa"

const LeaderboardPage = () => {
  const { data: leaderboardData } = useGetLeaderboardQuery()
  const { data: userData } = useGetMyDetailsQuery()
  return (
    <div className="">
      <div className="flex">
        <div className="text-2xl font-semibold">
          <div className="text-2xl font-semibold pt-4">Leaderboard</div>
          <p className="text-sm italic text-gray-500">
            Get in top of leaderboard to win exicting rewards!
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-x-4 mt-4">
        <StatsCard
          title="My Rank"
          value={leaderboardData?.rank!}
          icon={<AiFillCrown className="text-secondary" size={30} />}
        />
        <StatsCard
          title="Points"
          value={Number(userData?.total_points).toFixed(2)}
          icon={<VscActivateBreakpoints className="text-secondary" size={30} />}
        />
        <StatsCard
          title="Rewards"
          value="-"
          icon={<FaGifts className="text-secondary" size={30} />}
        />
      </div>

      <table
        border={1}
        className="w-full table-auto  border-separate border-spacing-y-2"
      >
        <tr className="">
          <td className="py-3">Rank</td>
          <td>Address</td>
          <td>Points</td>
        </tr>
        {leaderboardData?.leaderboard.map((leaderboard, index) => (
          <tr className="bg-gray-900 text-sm ring-1 ring-gray-700">
            <td className="py-3 pl-4">{index + 1}</td>
            <td className="">{leaderboard.public_address}</td>
            <td className="right-0">
              {Number(leaderboard.total_points).toFixed(2)}
            </td>
          </tr>
        ))}
      </table>
    </div>
  )
}

export default LeaderboardPage

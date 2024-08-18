"use client"
import TabButton from "@/components/tabButton"
import { useGetUserTransactionQuery } from "@/store/api/statsApi"
import { TransactionType } from "@/types/generic"
import React, { useState } from "react"
import { FaAngleLeft, FaAngleRight } from "react-icons/fa"
import Moment from "react-moment"

const TransactionHistory = () => {
  const [page, setPage] = useState(1)
  const [market, setMarket] = useState<TransactionType>(TransactionType.DEPOSIT)

  const { data: userTransactions, isLoading } = useGetUserTransactionQuery({
    status: market,
    page: String(page),
    count: "10",
  })

  const handleKeyChange = (key: TransactionType) => {
    setMarket(key)
    setPage(1)
  }
  const handlePrevious = () => {
    if (page > 1) setPage(page - 1)
  }
  const totalPages = userTransactions?.pagination.total_pages ?? 0
  const handleNext = () => {
    if (page < totalPages) setPage(page + 1)
  }
  return (
    <div>
      <div className="flex">
        <div className="text-2xl font-semibold">
          <div className="text-2xl font-semibold pt-4">Your Transactions</div>
          <p className="text-sm italic text-gray-500">
            Find all the deposits,withdrawls and predictions here.
          </p>
        </div>
      </div>
      <div className=" bg-black/50 min-h-[600px] rounded-2xl px-4 py-1 mt-5">
        <div className="flex gap-x-1 my-3 mt-4">
          <TabButton
            isActive={market === TransactionType.DEPOSIT}
            handleChange={() => handleKeyChange(TransactionType.DEPOSIT)}
          >
            Deposits
          </TabButton>
          <TabButton
            isActive={market === TransactionType.WITHDRAW}
            handleChange={() => handleKeyChange(TransactionType.WITHDRAW)}
          >
            Withdrawl
          </TabButton>
        </div>
        <table className="min-w-full  rounded-xl shadow-md overflow-scroll hide-scrollbar">
          <thead>
            <tr className=" text-white">
              <th className="py-3 px-6 text-left">S.N</th>
              <th className="py-3 px-6 text-left">Amount</th>
              <th className="py-3 px-6 text-left hidden lg:block">
                Transaction Hash
              </th>
              <th className="py-3 px-6 text-left">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : (
              userTransactions?.data.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-700">
                  <td className="py-3 px-6">{(page - 1) * 10 + index + 1}</td>
                  <td className="py-3 px-6">{item.amount} COMAI</td>
                  <td className="py-3 px-6 hidden lg:block">{item.tx_hash}</td>
                  <td className="py-3 px-6">
                    <Moment format="YYYY/MM/DD HH:mm:ssA">
                      {item.created_at}
                    </Moment>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrevious}
            disabled={page === 1}
            className="px-4 py-2 text-white rounded disabled:opacity-50"
          >
            <FaAngleLeft />
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className="px-4 py-2  text-white rounded disabled:opacity-50"
          >
            <FaAngleRight />
          </button>
        </div>
      </div>

   
    </div>
  )
}

export default TransactionHistory

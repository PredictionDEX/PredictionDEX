import React, { useState } from "react"
import Sidebar from ".."
import { usePolkadot } from "@/context"
import { useForm } from "react-hook-form"
import {
  useCreatePredictionMutation,
  useGetMarketByIdQuery,
  useGetMyDetailsQuery,
} from "@/store/api/statsApi"
import OutcomeProgress from "@/components/progress/outcome"
import { InputComponent } from "@/components/input"
import { SelectComponent } from "@/components/select"
import Button from "@/components/button"
import Moment from "react-moment"
import { Outcome } from "@/types"
import { successToast } from "@/components/toast"
import { FaLayerGroup } from "react-icons/fa"
import Image from "next/image"
import { MarketStatus } from "@/types/generic"
import FundsModal from "@/components/modal/funds/deposit"

interface IMarketSidebarType {
  isSidebarOpen: boolean
  toggleSidebar: () => void
  marketId: number
}

const MarketSidebar = ({
  isSidebarOpen,
  toggleSidebar,
  marketId,
}: IMarketSidebarType) => {
  const { data: marketData } = useGetMarketByIdQuery(marketId, {
    skip: !marketId && !isSidebarOpen,
  })
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "all",
  })
  const { data: userData } = useGetMyDetailsQuery()
  const [createPrediction] = useCreatePredictionMutation()
  const [isBetting, setIsBetting] = useState(false)
  const handleSubmitBet = async (data: any) => {
    setIsBetting(true)
    try {
      const response = await createPrediction({
        amount: data.amount,
        outcome_id: String(data.outcome.value),
      }).unwrap()
      setIsBetting(false)
      successToast("Predicted on market successfully")
    } catch (e) {
      setIsBetting(false)
      console.log(e)
    }
  }
  const status = marketData?.data.status
  // const status = MarketStatus.RESOLVED
  const { selectedAccount, isInitialized } = usePolkadot()

  return (
    <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
      <h1 className="text-md font-semibold">{marketData?.data.title}</h1>
      <p className="text-xs font-normal pt-1 text-gray-300">
        Market {status === "LIVE" ? "closes" : "closed"}{" "}
        <Moment fromNow>{marketData?.data?.resolution_date}</Moment>
      </p>
      <div className="flex mt-3 ring-1 w-full ring-gray-600  p-3 rounded-md">
        <div className="flex gap-x-2 items-center">
          <div className="relative h-8 w-8">
            <Image src="/total.png" alt="category" fill />
          </div>
          <div className="flex gap-x-1 flex-col">
            <h6 className="text-xs tracking-normal font-normal text-gray-200">
              Total Bets
            </h6>
            <h1 className="text-sm font-semibold break-all">
              {marketData?.data?.pool_amount} COMAI
            </h1>
          </div>
        </div>
      </div>
      <div className="flex w-full my-4 flex-col gap-y-3">
        {marketData?.data.outcomes.map((outcome: Outcome, index: number) => (
          <div className="flex items-center" key={index}>
            <OutcomeProgress
              outcomeName={outcome.label}
              totalVolume={Number(marketData?.data.pool_amount)}
              totalPrediction={outcome.total_amount}
              userPrediction={outcome.self_prediction?.total_amount}
            />
          </div>
        ))}
      </div>
      <div className="pt-3">
        <div className="ring-1 ring-gray-700 rounded-xl p-3">
          {status === MarketStatus.LIVE && (
            <>
              <h4 className="text-md font-semibold">Place your bet</h4>
              <form onSubmit={handleSubmit(handleSubmitBet)}>
                <div className="mt-2">
                  <InputComponent
                    label="Enter your bet amount"
                    name="amount"
                    placeholder="Enter amount"
                    type="number"
                    register={register}
                    errors={errors["amount"]}
                    rules={{ required: "Amount is required" }}
                  />
                  <h6 className="text-xs font-semibold mt-2 text-secondary">
                    Balance: {userData?.tokens} COMAI
                  </h6>
                </div>
                <div className="mt-2">
                  <SelectComponent
                    name="outcome"
                    label="Select Outcome"
                    isSearchable
                    placeholder=""
                    options={
                      marketData?.data.outcomes.map((outcome: Outcome) => ({
                        label: outcome.label,
                        value: String(outcome.id),
                      })) || []
                    }
                    control={control}
                    errors={errors["outcome"]}
                    rules={{ required: "Outcome is required" }}
                  />
                </div>
                <div className="mt-4">
                  {!isInitialized && !selectedAccount && (
                    <small className="text-xs text-[#d72c0d] !font-normal">
                      Please connect your wallet to place a bet
                    </small>
                  )}
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isBetting}
                    disabled={!isInitialized && !selectedAccount}
                  >
                    Place Bet
                  </Button>
                </div>
              </form>
            </>
          )}
          {status === MarketStatus.CLOSED && (
            <>
              <h4 className="text-md font-semibold">View Result</h4>
              <div className="mt-3 text-sm">
                <p>
                  Market is closed for prediction. Results will be announced
                  shortly!
                </p>
              </div>
            </>
          )}
          {status === MarketStatus.FLASHED && (
            <>
              <h4 className="text-md font-semibold">View Result</h4>
              <div className="mt-1 text-sm flex flex-col">
                <h1 className="text-md font-semibold">
                  <span className="font-medium text-xs text-secondary ">
                    Winning Outcome:
                  </span>{" "}
                  Tradeu
                </h1>
                <h4 className="my-1 text-xs text-secondary font-medium">
                  Rewards will be distributed in 2 hrs
                </h4>
                <small className="italic text-[10px] pt-1">
                  Note: You need to pay 200 COMAI to dispute the market.
                </small>
                <div className="mt-3">
                  <Button type="button" variant="primary">
                    Dispute Market
                  </Button>
                </div>
              </div>
            </>
          )}
          {status === MarketStatus.DISPUTED && (
            <>
              <h4 className="text-md font-semibold">View Result</h4>
              <div className="mt-1 text-sm flex flex-col">
                <h1 className="text-md font-semibold">
                  <span className="font-medium text-xs text-secondary ">
                    Winning Outcome:
                  </span>{" "}
                  Tradeu
                </h1>
                <p className="mt-3">
                  Result of the market has been disputed! Please wait until the
                  result is settled up for the rewards!
                </p>
              </div>
            </>
          )}
          {(status === MarketStatus.RESOLVED ||
            status === MarketStatus.DISPUTE_RESOLVED) && (
            <>
              <h4 className="text-md font-semibold">View Result</h4>
              <div className="mt-1 text-sm flex flex-col">
                <h1 className="text-md font-semibold">
                  <span className="font-medium text-xs text-secondary ">
                    Winning Outcome:
                  </span>{" "}
                  Tradeu
                </h1>
                <h1 className="text-md font-semibold mt-1">
                  <span className="font-medium text-xs text-secondary ">
                    Win Pool Amount:
                  </span>{" "}
                  0 COMAI
                </h1>
                <h1 className="text-md font-semibold mt-1">
                  <span className="font-medium text-xs text-secondary ">
                    Your Bet on Winning Outcome:
                  </span>{" "}
                  0 COMAI
                </h1>
                <h1 className="text-md font-semibold mt-1">
                  <span className="font-medium text-xs text-secondary ">
                    Your Earnings:
                  </span>{" "}
                  0 COMAI
                </h1>
              </div>
            </>
          )}
        </div>
      </div>
    </Sidebar>
  )
}

export default MarketSidebar

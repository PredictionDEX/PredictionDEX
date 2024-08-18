import { MIN_PREDICTION_AMOUNT } from "@/app/_lib/constants"
import UserBalance from "@/components/balance/token"
import Button from "@/components/button"
import { InputComponent } from "@/components/input"
import { SelectComponent } from "@/components/select"
import { successToast } from "@/components/toast"
import { usePolkadot } from "@/context"
import {
  useCreatePredictionMutation,
  useGetMyDetailsQuery,
} from "@/store/api/statsApi"
import { Market, Outcome } from "@/types"
import { predictPotentialEarning } from "@/utils"
import React, { useState } from "react"
import { useForm } from "react-hook-form"

const CreatePredictionForm = ({ marketData }: { marketData: Market }) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    mode: "all",
  })
  const [createPrediction] = useCreatePredictionMutation()
  const [isBetting, setIsBetting] = useState(false)
  const { data: userData } = useGetMyDetailsQuery()
  const { selectedAccount, isInitialized, isConnected } = usePolkadot()

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
  return (
    <form onSubmit={handleSubmit(handleSubmitBet)}>
      <div className="mt-2">
        <InputComponent
          label="Enter your bet amount"
          name="amount"
          placeholder="Enter amount"
          type="number"
          register={register}
          errors={errors["amount"]}
          rules={{
            required: "Bet Amount is required",
            min: { value: MIN_PREDICTION_AMOUNT, message: `Bet amount must be greater than ${MIN_PREDICTION_AMOUNT}` },
            max: {
              value: userData?.tokens,
              message: "Amount cannot be more than your balance",
            },
          }}
        />
        <div className="mt-1">
          <UserBalance />
        </div>
      </div>
      <div className="mt-2">
        <SelectComponent
          name="outcome"
          label="Select Outcome"
          isSearchable
          placeholder=""
          options={
            marketData?.outcomes.map((outcome: Outcome) => ({
              label: outcome.label,
              value: String(outcome.id),
            })) || []
          }
          control={control}
          errors={errors["outcome"]}
          rules={{ required: "Outcome is required" }}
        />
      </div>
      {marketData && watch("outcome") && watch("amount") && <p className="text-xs font-semibold mt-3 text-secondary">
        Potential Winnings: {predictPotentialEarning(marketData?.outcomes!,watch("outcome").value, watch("amount"))} COMAI
      </p>}
      <div className="mt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isBetting}
          disabled={
            isInitialized && (selectedAccount?.address === "" || !isConnected)
          }
        >
          Place Bet
        </Button>
      </div>
    </form>
  )
}

export default CreatePredictionForm

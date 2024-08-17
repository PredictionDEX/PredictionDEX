import UserBalance from "@/components/balance/token"
import Button from "@/components/button"
import { InputComponent } from "@/components/input"
import { errorToast } from "@/components/toast"
import { usePolkadot } from "@/context"
import {
  useCompleteWithdrawlMutation,
  useGetMyDetailsQuery,
  useInitializeWithdrawMutation,
} from "@/store/api/statsApi"

import React from "react"
import { useForm } from "react-hook-form"

interface IWithdrawForm {
  amount: number
}
const WithdrawForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IWithdrawForm>({
    mode: "all",
    defaultValues: {
      amount: 1,
    },
  })
  const { data: userData } = useGetMyDetailsQuery()
  const [isWithdraw, setIsWithdraw] = React.useState(false)
  const { signMessage } = usePolkadot()
  const [initWithdraw] = useInitializeWithdrawMutation()
  const [completeWithdraw] = useCompleteWithdrawlMutation()
  const handleCreateMarket = async (data: IWithdrawForm) => {
    try {
      setIsWithdraw(true)
      const response = await initWithdraw({
        amount: data.amount.toString(),
      }).unwrap()
      if (response.data) {
        const signature = await signMessage(response.data.message)
        if (!signature) {
          alert("Withdraw Error")
          setIsWithdraw(false)
          return
        }
        const completeResponse = await completeWithdraw({
          signature: String(signature),
        }).unwrap()
        if (completeResponse.data) {
          alert("Withdraw Success")
        }
        setIsWithdraw(false)
      }
    } catch (e) {
      console.log(e)
      setIsWithdraw(false)
      errorToast((e as Error).message)
    }
  }
  const userBalance = userData?.tokens ?? 0

  return (
    <form onSubmit={handleSubmit(handleCreateMarket)}>
      <div className="mt-4">
        <InputComponent
          label="Withdraw Amount"
          name="amount"
          placeholder="Enter amount to deposit"
          register={register}
          type="text"
          errors={errors["amount"]}
          rules={{
            required: "Amount is required",
            max: {
              value: userBalance,
              message: "Amount cannot be more than your balance",
            },
            min: {
              value: 1,
              message: "Amount must be greater than 0",
            },
          }}
        />
        <div className="mt-2">
          <UserBalance />
        </div>
      </div>
      <div className="mt-4">
        <Button type="submit" variant="primary" isLoading={isWithdraw}>
          Withdraw Funds
        </Button>
      </div>
    </form>
  )
}

export default WithdrawForm

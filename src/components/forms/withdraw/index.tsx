import Button from "@/components/button"
import { InputComponent } from "@/components/input"
import { useBalance } from "@/context/balanceContext"
import { useGetMyDetailsQuery } from "@/store/api/statsApi"
import { formatTokenAmount } from "@/utils"
import { min } from "moment"
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
  const handleCreateMarket = async (data: IWithdrawForm) => {
    setIsWithdraw(true)
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
        <small className="text-xs text-gray-500">
          Balance: {userBalance} COMAI
        </small>
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

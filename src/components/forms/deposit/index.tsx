import Button from "@/components/button"
import { InputComponent } from "@/components/input"
import { successToast } from "@/components/toast"
import { usePolkadot } from "@/context"
import { useBalance } from "@/context/balanceContext"
import { formatTokenAmount } from "@/utils"
import React from "react"
import { useForm } from "react-hook-form"

interface IDepositForm {
  amount: number
}
const DepositForm = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IDepositForm>({
    mode: "all",
    defaultValues: {
      amount: 1,
    },
  })
  const { userBalance } = useBalance()
  const [isDepositing, setIsDepositing] = React.useState(false)
  const { transfer } = usePolkadot()
  const handleCreateMarket = async (data: IDepositForm) => {
    setIsDepositing(true)
    transfer({
      amount: String(data.amount),
      to: "5G3nNt5W44KUnygyRVLHxxbkZCYyYSsUJAbZZuQ2SzNia5jF",
      callback(txHash) {
        if (!txHash) return
        setIsDepositing(false)
        successToast("Deposit successful")
      },
    })
  }
  const balance = formatTokenAmount(userBalance?.balance)
  return (
    <form onSubmit={handleSubmit(handleCreateMarket)}>
      <div className="mt-4">
        <InputComponent
          label="Deposit Amount"
          name="amount"
          placeholder="Enter amount to deposit"
          register={register}
          type="text"
          errors={errors["amount"]}
          rules={{
            required: "Amount is required",
            min: { value: 1, message: "Amount must be greater than 0" },
            max: {
              value: balance,
              message: "Amount cannot be more than your balance",
            },
          }}
        />
        <small className="text-xs text-gray-500">
          Balance: {balance} COMAI
        </small>
      </div>
      <div className="mt-4">
        <Button type="submit" variant="primary" isLoading={isDepositing}>
          Deposit Funds
        </Button>
      </div>
    </form>
  )
}

export default DepositForm

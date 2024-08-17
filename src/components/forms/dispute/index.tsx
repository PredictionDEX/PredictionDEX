import AmountWarning from "@/components/balance/message"
import UserBalance from "@/components/balance/token"
import Button from "@/components/button"
import { errorToast } from "@/components/toast"
import { useCreateDisputeMutation } from "@/store/api/statsApi"
import React from "react"
import { useForm } from "react-hook-form"
import { FaInfoCircle } from "react-icons/fa"

interface IDisputeForm {
  reason: string
}
const DisputeForm = ({ marketId }: { marketId: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IDisputeForm>({
    mode: "all",
    defaultValues: {
      reason: "",
    },
  })
  const [isDispute, setIsDispute] = React.useState(false)
  const [createDispute] = useCreateDisputeMutation()
  const handleCreateDispute = async (data: IDisputeForm) => {
    setIsDispute(true)
    try {
      const response = await createDispute({
        market_id: marketId,
        reason: data.reason,
      }).unwrap()
      setIsDispute(false)
      if (response.data) {
        alert("Dispute created successfully")
      }
    } catch (e) {
      console.log(e)
      setIsDispute(false)
      errorToast((e as Error).message)
    }
    // const response = await initWithdraw({
    //   amount: data.amount.toString(),
    // }).unwrap()
    // if (response.data) {
    //   const signature = await signMessage(response.data.message)
    //   if (!signature) {
    //     alert("Withdraw Error")
    //     setIsWithdraw(false)
    //     return
    //   }
    //   const completeResponse = await completeWithdraw({
    //     signature: String(signature),
    //   }).unwrap()
    //   if (completeResponse.data) {
    //     alert("Withdraw Success")
    //   }
    //   setIsWithdraw(false)
    // }
  }

  return (
    <form onSubmit={handleSubmit(handleCreateDispute)}>
      <div className="mt-4">
        <label className="text-sm text-gray-400">Reason for dispute</label>
        <textarea
          className="w-full p-3 rounded-md bg-gray-900 text-white ring-0 focus:ring-0"
          placeholder="Enter reason for dispute"
          {...register("reason", { required: "Reason is required" })}
        />
      </div>
      <div className="pb-2">
        <UserBalance />
      </div>
      <AmountWarning amount="10" action="dispute" />

      <div className="mt-4">
        <Button type="submit" variant="primary" isLoading={isDispute}>
          Create Dispute
        </Button>
      </div>
    </form>
  )
}

export default DisputeForm

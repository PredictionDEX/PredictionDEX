import { WITHDRAWL_AMOUNT } from "@/app/_lib/constants";
import UserBalance from "@/components/balance/token";
import Button from "@/components/button";
import { InputComponent } from "@/components/input";
import { errorToast, successToast } from "@/components/toast";
import { usePolkadot } from "@/context";
import {
  useCompleteWithdrawlMutation,
  useGetMyDetailsQuery,
  useInitializeWithdrawMutation,
} from "@/store/api/statsApi";

import React from "react";
import { useForm } from "react-hook-form";
import { FaInfoCircle } from "react-icons/fa";

interface IWithdrawForm {
  amount: number;
}
const WithdrawForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IWithdrawForm>({
    mode: "all",
    defaultValues: {
      amount: 1,
    },
  });
  const { data: userData } = useGetMyDetailsQuery();
  const [isWithdraw, setIsWithdraw] = React.useState(false);
  const { signMessage } = usePolkadot();
  const [initWithdraw] = useInitializeWithdrawMutation();
  const [completeWithdraw] = useCompleteWithdrawlMutation();
  const handleCreateMarket = async (data: IWithdrawForm) => {
    try {
      setIsWithdraw(true);
      const response = await initWithdraw({
        amount: data.amount.toString(),
      }).unwrap();
      if (response.data) {
        const signature = await signMessage(response.data.message);
        if (!signature) {
          alert("Withdraw Error");
          setIsWithdraw(false);
          return;
        }
         await completeWithdraw({
          signature: String(signature),
        }).unwrap();
        successToast("Amount withdrawn successfully");
        setIsWithdraw(false);
      }
    } catch (e) {
      setIsWithdraw(false);
      errorToast((e as Error).message);
    }
  };
  const userBalance = userData?.tokens ?? 0;

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
      <div className="flex w-full ring-1 ring-gray-700 shadow-sm shadow-black text-secondary font-semibold px-4 py-3 rounded-xl text-xs items-center gap-x-2 mt-2">
      <FaInfoCircle />
      You will receive {watch("amount")?(watch("amount")*WITHDRAWL_AMOUNT).toFixed(2):0} COMAI after withdrawal.
    </div>
      <div className="mt-4">
        <Button type="submit" variant="primary" isLoading={isWithdraw}>
          Withdraw Funds
        </Button>
      </div>
    </form>
  );
};

export default WithdrawForm;

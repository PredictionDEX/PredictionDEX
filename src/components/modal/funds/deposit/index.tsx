import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types"
import React, { useState } from "react"
import Modal from "react-responsive-modal"
import { Wallet } from "@subwallet/wallet-connect/types"
import { InputComponent } from "@/components/input"
import { useForm } from "react-hook-form"
import DepositForm from "@/components/forms/deposit"

const FundsModal = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (args: boolean) => void
}) => {
  return (
    <Modal
      classNames={{
        modal:
          "md:!max-w-[800px] !max-w-[95vw] md:!min-w-[500px] !min-w-[90vw] !bg-gray-800 rounded-xl shadow-md !text-white",
      }}
      open={open}
      onClose={() => setOpen(false)}
      center
    >
      <div className="">Deposit Balance</div>
      <hr className="mt-2 -mx-4 border-gray-700" />
      <DepositForm />
    </Modal>
  )
}

export default FundsModal

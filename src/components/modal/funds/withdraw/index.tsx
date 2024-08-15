import React from "react"
import Modal from "react-responsive-modal"
import WithdrawForm from "@/components/forms/withdraw"

const WithdrawModal = ({
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
          "md:!max-w-[800px] !max-w-[95vw] md:!min-w-[500px] !min-w-[90vw] !bg-gray-800 rounded-xl shadow-md",
      }}
      open={open}
      onClose={() => setOpen(false)}
      center
    >
      Withdraw Funds
      <WithdrawForm />
    </Modal>
  )
}

export default WithdrawModal

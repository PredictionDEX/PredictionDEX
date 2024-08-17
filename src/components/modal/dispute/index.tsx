import React from "react"
import Modal from "react-responsive-modal"
import DisputeForm from "@/components/forms/dispute"

const DisputeModal = ({
  open,
  setOpen,
  marketId,
}: {
  open: boolean
  setOpen: (args: boolean) => void
  marketId: string
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
      <div className="">Dispute Market</div>
      <hr className="mt-2 -mx-4 border-gray-700" />
      <DisputeForm marketId={marketId} />
    </Modal>
  )
}

export default DisputeModal

import React from "react"
import { AiOutlineClose } from "react-icons/ai"

interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
  children: React.ReactNode
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleSidebar,
  children,
}) => {
  return (
    <div className="relative">
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-30"></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full bg-gray-800 drop-shadow bg-blend-darken text-white w-96 transition-transform transform z-40 px-3 py-4 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end ">
          <button
            onClick={toggleSidebar}
            className="h-8 w-8 ring-2 flex justify-center items-center ring-gray-700 rounded-lg"
          >
            <AiOutlineClose />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Sidebar

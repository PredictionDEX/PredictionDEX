import React, { ReactNode } from "react"

interface ITabButton {
  isActive: boolean
  handleChange: () => void
  children: ReactNode
}
const TabButton = ({ isActive, handleChange, children }: ITabButton) => {
  return (
    <button
      className={`py-2  px-4 rounded-xl cursor-pointer font-medium ${
        isActive ? "ring-1 ring-secondary bg-gray-900" : ""
      }`}
      onClick={handleChange}
    >
      {children}
    </button>
  )
}

export default TabButton

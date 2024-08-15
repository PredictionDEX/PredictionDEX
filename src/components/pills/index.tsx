import React, { ReactNode } from "react"

const PillComponent = ({
  icon,
  name,
  isActive = false,
  handleClick = () => "",
}: {
  icon: ReactNode
  name: string
  isActive?: boolean
  handleClick?: () => void
}) => {
  return (
    <div
      className={`flex items-center gap-x-2 border-[1px] px-3 py-1 rounded-xl cursor-pointer ${
        isActive ? "bg-primary border-secondary" : "bg-transparent"
      }`}
      onClick={handleClick}
    >
      {icon}
      <h6 className="text-sm font-medium">{name}</h6>
    </div>
  )
}

export default PillComponent

import React from "react"
import { FaSpinner } from "react-icons/fa"

interface IButtonProps extends React.HTMLProps<HTMLButtonElement> {
  children: React.ReactNode
  variant: "primary" | "secondary" | "outlined"
  type: "button" | "submit" | "reset"
  isLoading?: boolean
}
const Button = ({
  type,
  children,
  variant,
  isLoading = false,
  ...props
}: IButtonProps) => {
  const getButtonStyle = () => {
    switch (variant) {
      case "primary":
        return "bg-primary text-white"
      case "secondary":
        return "bg-secondary disabled:bg-gray-700"
      case "outlined":
        return "bg-transparent border border-primary"
      default:
        return "bg-primary"
    }
  }
  return (
    <button
      type={type}
      className={`${getButtonStyle()} px-3 py-2 rounded-lg text-sm font-semibold w-full focus:outline-none flex justify-center items-center gap-x-2 disabled:!bg-gray-700`}
      disabled={props.disabled || isLoading}
      {...props}
    >
      {isLoading && <FaSpinner className="animate-spin" />}
      {children}
    </button>
  )
}

export default Button

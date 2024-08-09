import React from "react"

interface IButtonProps extends React.HTMLProps<HTMLButtonElement> {
  children: React.ReactNode
  variant: "primary" | "secondary" | "outlined"
  type: "button" | "submit" | "reset"
}
const Button = ({ type, children, variant, ...props }: IButtonProps) => {
  const getButtonStyle = () => {
    switch (variant) {
      case "primary":
        return "bg-primary text-white"
      case "secondary":
        return "bg-secondary"
      case "outlined":
        return "bg-transparent border border-primary"
      default:
        return "bg-primary"
    }
  }
  return (
    <button
      type={type}
      className={`${getButtonStyle()} px-3 py-2 rounded-lg text-sm font-semibold`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button

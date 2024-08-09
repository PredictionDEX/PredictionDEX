import React, { ReactNode } from "react"
import Navbar from "./components/navbar"

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container">{children}</div>
    </div>
  )
}

export default Providers

"use client"

import React, { ReactNode } from "react"
import { PolkadotProvider } from "../context"
import { BalanceProvider } from "../context/balanceContext"
import { ToastContainer } from "react-toastify"
import Navbar from "@/components/navbar"
import { Provider } from "react-redux"
import { store } from "@/store"

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <PolkadotProvider
        wsEndpoint={String(process.env.NEXT_PUBLIC_COMMUNE_API)}
      >
        <BalanceProvider>
          <div className="min-h-screen">
            <Navbar />
            <div className="container">{children}</div>
          </div>
          <ToastContainer />
        </BalanceProvider>
      </PolkadotProvider>
    </Provider>
  )
}

export default Providers

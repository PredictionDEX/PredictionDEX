"use client"

import React, { ReactNode } from "react"
import { PolkadotProvider } from "../context"
import { BalanceProvider } from "../context/balanceContext"
import { Toaster } from "react-hot-toast"
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
          <div className="min-h-screen text-white">
            <Navbar />
            <div className="container">{children}</div>
          </div>
          <Toaster />
        </BalanceProvider>
      </PolkadotProvider>
    </Provider>
  )
}

export default Providers

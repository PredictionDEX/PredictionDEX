"use client"
import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"
import Button from "../button"
import { usePolkadot } from "@/context"
import { truncateWalletAddress } from "@/utils"
import { usePathname, useRouter } from "next/navigation"
import UserSidebar from "../sidebar/user"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { isInitialized, handleConnect, selectedAccount } = usePolkadot()

  const router = useRouter()

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }
  const pathname = usePathname()

  return (
    <nav className="p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <div className="text-white text-md flex items-center gap-x-2 font-semibold">
            <Image src="/logo.png" alt="logo" width={40} height={40} />
            <h6>
              Prediction<span className="text-secondary">DEX</span>
            </h6>
          </div>
        </Link>
        <div className="hidden md:flex space-x-6 text-md items-center">
          <Link
            href="/history"
            className={`text-white font-medium ${
              pathname.includes("history") ? "border-b-2 border-secondary" : ""
            } hover:text-secondary`}
          >
            History
          </Link>
          <Link
            href="/leaderboard"
            className={`text-white font-medium ${
              pathname.includes("leaderboard")
                ? "border-b-2 border-secondary"
                : ""
            } hover:text-secondary`}
          >
            Leaderboard
          </Link>
          {isInitialized && selectedAccount && (
            <Button
              type="button"
              variant="outlined"
              onClick={() => {
                router.push("/market/create")
              }}
            >
              Add a new market
            </Button>
          )}
          {selectedAccount ? (
            <div
              className="flex items-center py-1 gap-x-1 ring-1 ring-secondary rounded-xl px-2 shadow-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <div className="relative h-6 w-6 rounded-full">
                <Image
                  src="/profile.png"
                  alt="avatar"
                  fill
                  className="rounded-full"
                />
              </div>
              <div>
                <h6 className="text-xs font-semibold">
                  {truncateWalletAddress(selectedAccount.address)}
                </h6>
              </div>
            </div>
          ) : (
            <Button type="button" variant="primary" onClick={handleConnect}>
              Connect Wallet
            </Button>
          )}
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            {isOpen ? <p>Close</p> : <p>Menu</p>}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden mt-2 space-y-2">
          <a href="/" className="block text-gray-300 hover:text-white">
            Markets
          </a>
          <a href="/about" className="block text-gray-300 hover:text-white">
            Leaderboard
          </a>
          <a href="/services" className="block text-gray-300 hover:text-white">
            Connect Wallet
          </a>
        </div>
      )}
      <UserSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
    </nav>
  )
}

export default Navbar

"use client"
import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"
import Button from "../button"
// import { MenuIcon, XIcon } from "@heroicons/react/outline" // You can use Heroicons for icons

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <div className="text-white text-md flex items-center gap-x-2 font-semibold">
            <Image src="/logo.jpeg" alt="logo" width={40} height={40} />
            PredictionDEX
          </div>
        </Link>
        <div className="hidden md:flex space-x-4 text-sm items-center">
          <Link href="/about" className="text-gray-300 hover:text-white">
            Leaderboard
          </Link>
          <Button type="button" variant="outlined">
            Add a new market
          </Button>
          <Button type="button" variant="primary">
            Connect Wallet
          </Button>
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
    </nav>
  )
}

export default Navbar

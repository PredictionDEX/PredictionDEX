"use client"
import React, { useState } from "react"
import Sidebar from ".."
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types"
import { Wallet } from "@subwallet/wallet-connect/types"
import { BiCheckCircle } from "react-icons/bi"
import Image from "next/image"
import { useMobileDetect } from "@/hooks/useMobileDetect"
import Button from "@/components/button"

const WalletSidebar = ({
  open,
  setOpen,
  wallets,
  handleWalletSelections,
  extensions,
  extensionSelected,
  setSelectExtension,
  setWallets,
}: {
  open: boolean
  setOpen: (args: boolean) => void
  wallets: InjectedAccountWithMeta[] | []
  handleWalletSelections: (arg: InjectedAccountWithMeta) => void
  extensions: Wallet[]
  extensionSelected: Wallet | null
  setSelectExtension: (arg: Wallet) => void
  isConnected: boolean
  setWallets: (arg: InjectedAccountWithMeta[]) => void
}) => {
  const [selectedAccount, setSelectedAccount] =
    useState<InjectedAccountWithMeta>()
  const isMobile = useMobileDetect()
  const [isProcessing, setIsProcessing] = useState(false)
  const handleWalletSelection = async (wallet: Wallet) => {
    if (!wallet.installed) return
    setIsProcessing(true)
    setWallets([])
    wallet
      .enable()
      .then(() => {
        setSelectExtension(wallet)
        wallet
          .getAccounts()
          .then((accounts) => {
            accounts &&
              setWallets(
                accounts.map((account) => ({
                  address: account.address,
                  meta: {
                    name: account.name,
                    source: wallet.title,
                    genesisHash: "",
                  },
                  type: "sr25519",
                })),
              )
            setIsProcessing(false)
          })
          .catch(() => {
            setIsProcessing(false)
          })
      })
      .catch(() => {
        setIsProcessing(false)
      })
  }
  const filteredExtensions =
    extensions?.length > 0
      ? extensions
          .sort((a, b) => {
            if (a.installed && !b.installed) return -1
            if (!a.installed && b.installed) return 1
            return 0
          })
          .filter((each) => {
            return !isMobile ? each.title !== "Nova Wallet" : true
          })
      : []

  return (
    <Sidebar
      title="Connect your wallet"
      isOpen={open}
      toggleSidebar={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between mt-4">
        {filteredExtensions.map((wallet) => (
          <div
            key={wallet.title}
            className={`${
              extensionSelected?.title === wallet.title
                ? "bg-gray-900 ring-1 ring-gray-700"
                : "bg-info/60"
            } w-full p-3 rounded-lg `}
          >
            <button
              type="button"
              className={`flex flex-col items-center disabled:cursor-not-allowed hover:bg-info/60  cursor-pointer shadow-md`}
              onClick={() => handleWalletSelection(wallet)}
              disabled={!wallet.installed}
            >
              <div className="relative h-6 w-6">
                <Image
                  src={(wallet.logo.src as any)?.src ?? ""}
                  alt={wallet.logo.alt}
                  fill
                />
              </div>
              <h4 className="text-sm text-gray-300 mt-2 truncate">
                {wallet.title}
              </h4>
              <small className="flex justify-between flex-grow">
                {!wallet.installed ? (
                  <a
                    className="block text-secondary text-xs cursor-pointer"
                    href={wallet.installUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Install
                  </a>
                ) : (
                  <p className="text-gray-400 text-xs text">Installed</p>
                )}
              </small>
            </button>
          </div>
        ))}
      </div>

      {!isProcessing && (
        <div className="flex flex-col gap-y-4 max-h-[280px] overflow-y-auto no-scrollbar mt-3 break-all">
          {wallets.length === 0 && (
            <div className="text-center">No Account found</div>
          )}

          {wallets.map((item) => (
            <button
              type="button"
              key={item.address}
              className={`text-sm rounded-md py-2 px-3 cursor-pointer shadow-md flex items-center gap-x-3 border-[1px] ${
                selectedAccount === item
                  ? "border-green-400"
                  : "border-gray-700"
              } `}
              onClick={() => setSelectedAccount(item)}
            >
              <BiCheckCircle
                size={30}
                className={`${
                  selectedAccount === item ? "text-green-400" : "text-gray-400"
                }`}
              />
              <div className="text-start">
                <p className="text-sm font-semibold">{item.meta.name}</p>
                <h5 className="text-xs tracking-tight">{item.address}</h5>
              </div>
            </button>
          ))}
        </div>
      )}

      {wallets.length > 0 && (
        <div className="mt-4">
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              if (!selectedAccount) {
                return
              }
              window.localStorage.setItem(
                "selectedCommuneExtension",
                extensionSelected?.title || "",
              )
              handleWalletSelections(selectedAccount as InjectedAccountWithMeta)
              //   setOpen(false)
            }}
          >
            Select Account
          </Button>
        </div>
      )}
    </Sidebar>
  )
}

export default WalletSidebar

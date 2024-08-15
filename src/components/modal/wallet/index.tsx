import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types"
import React, { useState } from "react"
import Modal from "react-responsive-modal"
import Button from "../../button"
import { AiFillCheckCircle } from "react-icons/ai"
// import { infoToast } from "../../toast"
import { BiCheckCircle } from "react-icons/bi"
import { Wallet } from "@subwallet/wallet-connect/types"
import { useMobileDetect } from "@/hooks/useMobileDetect"
import Image from "next/image"

const WalletModal = ({
  open,
  setOpen,
  wallets,
  handleWalletSelections,
  extensions,
  extensionSelected,
  setSelectExtension,
  isConnected,
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
  const [menuType, setMenuType] = useState("wallet")
  const handleWalletSelection = async (wallet: Wallet) => {
    if (!wallet.installed) return
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
          })
          .catch(console.error)
      })
      .catch(console.error)
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
    <Modal
      classNames={{
        modal:
          "md:!max-w-[800px] !max-w-[95vw] md:!min-w-[500px] !min-w-[90vw] !bg-gray-800 rounded-xl shadow-md",
      }}
      open={open}
      onClose={() => setOpen(false)}
      center
    >
      <h2 className="text-lg font-semibold">Please select your wallet</h2>
      <hr className="my-3 -mx-4" />
      <div className="flex items-center justify-between mt-1">
        {filteredExtensions.map((wallet) => (
          <div key={wallet.title} className="w-full">
            <button
              type="button"
              className={`flex flex-col items-center disabled:cursor-not-allowed hover:bg-info/60 p-2 rounded-lg ${
                extensionSelected?.title === wallet.title
                  ? "bg-gray-600"
                  : "bg-info/60"
              } cursor-pointer shadow-md`}
              onClick={() => handleWalletSelection(wallet)}
              disabled={!wallet.installed}
            >
              <div className="relative h-12 w-12">
                <Image
                  src={(wallet.logo.src as any)?.src ?? ""}
                  alt={wallet.logo.alt}
                  fill
                />
              </div>
              <h4 className="text-sm text-gray-300 mt-1">{wallet.title}</h4>
              {/* <div className="flex justify-between flex-grow">
                    {!wallet.installed && (
                      <div>
                        <a
                          className="block text-purple-400"
                          href={wallet.installUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Install
                        </a>
                      </div>
                    )}
                  </div> */}
            </button>
          </div>
        ))}
      </div>
      {/* <div className="flex flex-col md:flex-row gap-4"> */}
      {/* <div className="flex flex-col gap-y-4 max-h-[280px] overflow-y-auto no-scrollbar">
          {extensions?.length > 0 &&
            extensions
              .sort((a, b) => {
                if (a.installed && !b.installed) return -1
                if (!a.installed && b.installed) return 1
                return 0
              })
              .filter((each) => {
                return !isMobile ? each.title !== "Nova Wallet" : true
              })
              .map((wallet) => (
                <div key={wallet.title} className="w-full">
                  <button
                    type="button"
                    className={`flex w-full items-center disabled:cursor-not-allowed hover:bg-info/60 gap-4 ${
                      extensionSelected?.title === wallet.title
                        ? "bg-gray-600"
                        : "bg-info/60"
                    } px-4 py-2 rounded-xl cursor-pointer shadow-md`}
                    onClick={async () => {
                      if (!wallet.installed) return
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
                            })
                            .catch(console.error)
                        })
                        .catch(console.error)
                    }}
                    disabled={!wallet.installed}
                  >
                    <img
                      src={(wallet.logo.src as any)?.src ?? ""}
                      alt={wallet.logo.alt}
                      className="w-8 h-8"
                    />
                    <div className="flex justify-between flex-grow">
                      <div>{wallet.title}</div>
                      {!wallet.installed && (
                        <div>
                          <a
                            className="block text-purple-400"
                            href={wallet.installUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Install
                          </a>
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              ))}
        </div> */}
      {menuType === "account" && (
        <div className="flex flex-col gap-y-4 max-h-[280px] overflow-y-auto no-scrollbar mt-3">
          {wallets.length === 0 && (
            <div className="text-center">No Account found</div>
          )}

          {wallets.map((item) => (
            <button
              type="button"
              key={item.address}
              className={`border-[1px] text-sm rounded-md ${
                selectedAccount === item ? "bg-primary" : ""
              } py-1 px-3 cursor-pointer shadow-md flex items-center gap-x-3`}
              onClick={() => setSelectedAccount(item)}
            >
              <BiCheckCircle
                size={30}
                className={`${
                  selectedAccount === item ? "text-green-400" : "text-gray-400"
                }`}
              />
              <div
                className={`text-start ${
                  selectedAccount === item ? "text-white" : ""
                }`}
              >
                <p className={`font-semibold`}>{item.meta.name}</p>
                {item.address}
              </div>
            </button>
          ))}
        </div>
      )}
      {/* </div> */}
      {(isConnected || wallets.length > 0) && (
        <div className="mt-4">
          <button
            type="button"
            className="flex items-center justify-center gap-x-2 ease-in-out duration-300 transition-all text-sm px-3 py-3 font-medium tracking-tight sm:text-md rounded-2xl bg-button border-2 border-white text-white hover:bg-none hover:border-purple hover:text-purple disabled:opacity-50 disabled:bg-button disabled:border-none disabled:text-white disabled:cursor-not-allowed w-full"
            onClick={() => {
              if (!selectedAccount) {
                // infoToast("Select at least one wallet!")
                return
              }
              window.localStorage.setItem(
                "selectedCommuneExtension",
                extensionSelected?.title || "",
              )
              handleWalletSelections(selectedAccount as InjectedAccountWithMeta)
              setOpen(false)
            }}
          >
            Select Wallet
          </button>
        </div>
      )}
    </Modal>
  )
}

export default WalletModal

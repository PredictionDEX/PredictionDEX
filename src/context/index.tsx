"use client"
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { ApiPromise, WsProvider } from "@polkadot/api"
import { ITransfer } from "@/types"
import {
  InjectedAccountWithMeta,
  InjectedExtension,
} from "@polkadot/extension-inject/types"
import { errorToast } from "@/components/toast"
import { getWallets } from "@subwallet/wallet-connect/dotsama/wallets"
import { Wallet } from "@subwallet/wallet-connect/types"
import {
  useGetSignMessageMutation,
  useVerifySignatureMutation,
} from "@/store/api/statsApi"
import { getUser, removeUser, setUser } from "@/utils/token"
import WalletSidebar from "@/components/sidebar/wallet"

interface PolkadotApiState {
  web3Accounts: (() => Promise<InjectedAccountWithMeta[]>) | null
  web3Enable: ((appName: string) => Promise<InjectedExtension[]>) | null
  web3FromAddress: ((address: string) => Promise<InjectedExtension>) | null
}

interface PolkadotContextType {
  api: ApiPromise | null
  blockNumber: number
  isConnected: boolean
  isInitialized: boolean
  signMessage: (message: string) => Promise<string | undefined>
  isConnecting: boolean
  accounts: InjectedAccountWithMeta[]
  selectedAccount: InjectedAccountWithMeta | undefined
  handleConnect: () => void
  logoutUser: () => void
  transfer: (args: ITransfer) => void
  extensionSelected: Wallet | null
  setExtensionSelected: (wallet: Wallet) => void
  wallets: Wallet[]
}

const PolkadotContext = createContext<PolkadotContextType | undefined>(
  undefined,
)

interface PolkadotProviderProps {
  children: React.ReactNode
  wsEndpoint: string
}

export const PolkadotProvider: React.FC<PolkadotProviderProps> = ({
  children,
  wsEndpoint,
}) => {
  const [dotsamaWallets, setDotsamaWallets] = useState<Wallet[]>([])
  const [api, setApi] = useState<ApiPromise | null>(null)
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[] | []>([])
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [extensionSelected, setExtensionSelected] = useState<Wallet | null>(
    null,
  )
  const [blockNumber, setBlockNumber] = useState(0)
  const [polkadotApi, setPolkadotApi] = useState<PolkadotApiState>({
    web3Accounts: null,
    web3Enable: null,
    web3FromAddress: null,
  })
  async function loadPolkadotApi() {
    try {
      const { web3Accounts, web3Enable, web3FromAddress } = await import(
        "@polkadot/extension-dapp"
      )
      setPolkadotApi({
        web3Accounts,
        web3Enable,
        web3FromAddress,
      })
      const provider = new WsProvider(wsEndpoint)
      const newApi = await ApiPromise.create({ provider })
      setApi(newApi)
      setIsInitialized(true)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    async function init() {
      await loadPolkadotApi()
    }
    init()
    return () => {
      api?.disconnect()
    }
  }, [wsEndpoint])

  useEffect(() => {
    if (!api) return
    handleConnect()
  }, [isInitialized, api])

  useEffect(() => {
    if (!window) return
    const wallets = getWallets()
    setDotsamaWallets(wallets)
  }, [])

  useEffect(() => {
    async function init() {
      const userSession = getUser()
      const savedWallet = userSession?.selectedWallet
      if (!!savedWallet) {
        if (!polkadotApi.web3Enable || !polkadotApi.web3Accounts) return
        const extensions = await polkadotApi.web3Enable("PredictionDex")
        if (!extensions) {
          throw Error("NO_EXTENSION_FOUND")
        }
        const allAccounts = await polkadotApi.web3Accounts()
        setAccounts(allAccounts)
        setSelectedAccount(savedWallet)
        setIsConnected(true)
      }
    }
    if (isInitialized) init()
  }, [isInitialized])

  useEffect(() => {
    if (api) {
      api.rpc.chain.subscribeNewHeads((header) => {
        setBlockNumber(header.number.toNumber())
      })
    }
  }, [api])

  const handleConnect = async () => {
    if (!polkadotApi.web3Enable || !polkadotApi.web3Accounts) return
    const selectedCommuneExtension = window.localStorage.getItem(
      "selectedCommuneExtension",
    )
    if (selectedCommuneExtension) {
      const extension = dotsamaWallets.find(
        (wallet) => wallet.title === selectedCommuneExtension,
      )

      if (!extension) return
      if (extension.installed) {
        setExtensionSelected(extension)
        await extension?.enable()
        const accounts = await extension?.getAccounts()
        accounts &&
          setAccounts(
            accounts.map((account) => ({
              address: account.address,
              meta: {
                name: account.name,
                source: extension?.title || "",
                genesisHash: "",
              },
              type: "sr25519",
            })),
          )
        const selectedAccount = window.localStorage.getItem("selectedAccount")!
        if (selectedAccount) {
          const account = JSON.parse(selectedAccount)
          handleWalletSelections(account)
        }
        window.localStorage.setItem(
          "selectedCommuneExtension",
          extension?.title || "",
        )
      }
    }
  }

  const [selectedAccount, setSelectedAccount] =
    useState<InjectedAccountWithMeta>()

  async function transfer({ to, amount, callback }: ITransfer) {
    if (!api || !selectedAccount || !polkadotApi.web3FromAddress) return
    if (extensionSelected === null || !extensionSelected.signer) return

    const amt = Math.floor(Number(amount) * 10 ** 9)
    const balance: any = await api.query.system.account(selectedAccount.address)
    const freeBalance = balance.data.free.toNumber()
    if (freeBalance < amt + 1000 - 8 * 10 ** 8) {
      errorToast(
        `Insufficient balance. You need at least ${(
          (amt + 1000 - 8 * 10 ** 8) /
          10 ** 9
        ).toFixed(2)} $COMAI to transfer ${(amt / 10 ** 9).toFixed(2)} $COMAI`,
      )
      return
    }
    const tx = api.tx.balances.transferKeepAlive(to, amt)

    const unsub = await tx.signAndSend(
      selectedAccount.address,
      { signer: extensionSelected.signer as any },
      async (result: any) => {
        console.log(result.txHash.toHex())
        const { status } = result
        if (status.isInBlock) {
          console.log(
            "Transaction included at block hash",
            status.asInBlock.toHex(),
          )
        } else if (status.isFinalized) {
          console.log(
            "Transaction finalized at block hash",
            status.asFinalized.toHex(),
          )
          unsub()
          callback?.(status?.asFinalized?.toHex())
        } else if (status.isError) {
          unsub()
          callback?.(null)
        }
        // if (status.isFinalized) {
        //   const isSuccess = events.every(
        //     ({ event: { method } }: { event: { method: string } }) =>
        //       method !== "ExtrinsicFailed",
        //   )
        //   if (isSuccess) {
        //     unsub()
        //     callback?.(status?.asFinalized?.toHex())
        //   }
        // } else if (result.isError) {
        //   unsub()
        //   callback?.(null)
        // }
      },
    )
  }

  const [getSignMessage] = useGetSignMessageMutation()
  const [getVerifySignature] = useVerifySignatureMutation()
  const signMessage = async (message: string) => {
    if (!api || !selectedAccount || !polkadotApi.web3FromAddress) return
    if (extensionSelected === null || !extensionSelected.signer) return
    const tx = await api?.sign(
      selectedAccount.address,
      {
        data: message,
      },
      {
        // @ts-ignore
        signer: extensionSelected?.signer,
      },
    )
    return String(tx)
    // const response= await api?.sign(
    //         wallet.address,
    //         {
    //           data: response.data.sign_message,
    //         },
    //         {
    //           // @ts-ignore
    //           signer: extensionSelected?.signer,
    //         },
    //       )
  }

  const handleWalletSelections = useCallback(
    async (wallet: InjectedAccountWithMeta) => {
      try {
        const user = getUser()
        if (!user?.accessToken) {
          const response = await getSignMessage({
            public_address: wallet.address,
          }).unwrap()
          const tx = await api?.sign(
            wallet.address,
            {
              data: response.data.sign_message,
            },
            {
              // @ts-ignore
              signer: extensionSelected?.signer,
            },
          )
          const loginResponse = await getVerifySignature({
            public_address: wallet.address,
            signature: String(tx),
          }).unwrap()

          window.localStorage.setItem("selectedAccount", JSON.stringify(wallet))
          setUser({
            accessToken: loginResponse.data.access_token,
            selectedWallet: wallet,
          })
          setSelectedAccount(wallet)
          setIsConnected(true)
          setOpenModal(false)
        } else {
          setSelectedAccount(wallet)
          setIsConnected(true)
          setOpenModal(false)
        }
      } catch (e) {
        console.log("error", e)
      }
    },
    [extensionSelected],
  )

  const logoutUser = () => {
    removeUser()
    setSelectedAccount(undefined)
    setIsConnected(false)
    window.localStorage.removeItem("selectedCommuneExtension")
  }

  return (
    <PolkadotContext.Provider
      value={{
        api,
        blockNumber,
        isInitialized,
        isConnected,
        accounts,
        selectedAccount,
        handleConnect: () => {
          setOpenModal(true)
        },
        isConnecting,
        transfer,
        signMessage,
        wallets: dotsamaWallets,
        extensionSelected,
        setExtensionSelected,
        logoutUser,
      }}
    >
      <WalletSidebar
        open={openModal}
        setOpen={setOpenModal}
        wallets={accounts}
        isConnected={isConnected}
        extensionSelected={extensionSelected}
        setSelectExtension={setExtensionSelected}
        extensions={dotsamaWallets}
        handleWalletSelections={handleWalletSelections}
        setWallets={setAccounts}
      />
      {children}
    </PolkadotContext.Provider>
  )
}

export const usePolkadot = (): PolkadotContextType => {
  const context = useContext(PolkadotContext)
  if (context === undefined) {
    throw new Error("usePolkadot must be used within a PolkadotProvider")
  }
  return context
}

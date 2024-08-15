"use client"
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { ApiPromise, WsProvider } from "@polkadot/api"
import { IAddStaking, ITransfer, ITransferStaking } from "@/types"
import {
  InjectedAccountWithMeta,
  InjectedExtension,
} from "@polkadot/extension-inject/types"
import { errorToast } from "@/components/toast"
import { toast } from "react-toastify"
import { SubmittableExtrinsic } from "@polkadot/api-base/types"
import { getWallets } from "@subwallet/wallet-connect/dotsama/wallets"
import { Wallet } from "@subwallet/wallet-connect/types"
import BigNumber from "bignumber.js"
import WalletModal from "../components/modal/wallet"
import {
  useGetSignMessageMutation,
  useVerifySignatureMutation,
} from "@/store/api/statsApi"
import { getUser, setUser } from "@/utils/token"

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
  accounts: InjectedAccountWithMeta[]
  selectedAccount: InjectedAccountWithMeta | undefined
  handleConnect: () => void
  addStake: (args: IAddStaking) => void
  removeStake: (args: IAddStaking) => void
  transfer: (args: ITransfer) => void
  transferStake: (args: ITransferStaking) => void
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
        const extensions = await polkadotApi.web3Enable("ComStats")
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
    )!
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

  async function addStake({ validator, amount, callback }: IAddStaking) {
    if (!api || !selectedAccount || !polkadotApi.web3FromAddress) return

    const amt = Math.floor(Number(amount) * 10 ** 9)
    if (amt <= 0) {
      errorToast("Stake amount must be greater than 0")
      return
    }
    const balance: any = await api.query.system.account(selectedAccount.address)
    const freeBalance = balance.data.free.toNumber()
    if (freeBalance < amt + 2 * 10 ** 9) {
      errorToast(
        `Insufficient balance. You need at least ${(
          (amt + 2 * 10 ** 9) /
          10 ** 9
        ).toFixed(2)} $COMAI to stake ${(amt / 10 ** 9).toFixed(2)} $COMAI`,
      )
      return
    }
    const tx = api.tx.utility.batchAll([
      api.tx.subspaceModule.addStake(validator, amt),
    ])
    await completeTransaction(tx, callback)
  }

  async function completeTransaction(
    tx: SubmittableExtrinsic<"promise", any>,
    callback?: (txHash: string | null) => void,
  ) {
    if (selectedAccount === undefined) return
    if (extensionSelected === null || !extensionSelected.signer) return

    const balance: any = await api?.query.system.account(
      selectedAccount.address,
    )
    console.log("balance", balance)
    const freeBalance = balance.data.free.toNumber()
    if (freeBalance === 0) {
      errorToast(
        "You need to have certain amount of $COMAI to perform this transaction",
      )
      return
    }
    if (!extensionSelected.signer) return
    const unsub = await tx.signAndSend(
      selectedAccount.address,
      { signer: extensionSelected.signer },
      async (result: any) => {
        console.log(result)
        const { events, txHash } = result
        console.log(txHash.toHex(), txHash.toHuman(), events)
        if (result.isFinalized || result.isInBlock) {
          const isSuccess = events.every(
            ({ event: { method } }: { event: { method: string } }) =>
              method !== "ExtrinsicFailed",
          )
          if (isSuccess) {
            unsub()
            callback?.(txHash.toHuman())
          }
        } else if (result.isError) {
          unsub()
          callback?.(null)
        }
      },
    )
  }

  async function removeStake({ validator, amount, callback }: IAddStaking) {
    if (!api || !selectedAccount || !polkadotApi.web3FromAddress) return
    console.log("extensionSelected", extensionSelected)
    const amt = Math.floor(Number(amount) * 10 ** 9)
    const tx = api.tx.subspaceModule.removeStake(validator, amt)

    await completeTransaction(tx, callback)
  }
  async function transferStake({
    validatorFrom,
    validatorTo,
    amount,
    callback,
  }: ITransferStaking) {
    if (!api || !selectedAccount || !polkadotApi.web3FromAddress) return

    const amt = Math.floor(Number(amount) * 10 ** 9)
    const balance: any = await api.query.system.account(selectedAccount.address)
    const freeBalance = balance.data.free.toNumber()
    if (freeBalance < 1 * 10 ** 9) {
      errorToast(
        "Insufficient balance. You need at least 1 $COMAI in your account to transfer",
      )
      return
    }
    const tx = api.tx.utility.batchAll([
      api.tx.subspaceModule.transferStake(validatorFrom, validatorTo, amt),
    ])
    await completeTransaction(tx, callback)
  }

  // public async transferAmount(to: string, amount: number) {
  //   try {
  //     // @ts-ignore
  //     const { nonce } = await this.api.query.system.account(this.wallet.address);
  //     console.log('Nonce:', nonce.toNumber());
  //     // @ts-ignore
  //     const transfer = this.api.tx.balances.transferKeepAlive(to, amount);

  //     const hash = await new Promise<string>((resolve, reject) => {
  //       transfer
  //         .signAndSend(this.wallet, ({ events = [], status }: unsafe) => {
  //           logger.info('[Transaction] status:', status.type);
  //           if (status.isInBlock) {
  //             console.log('Transaction included at block hash', status.asInBlock.toHex());
  //             events.forEach(({ event: { data, method, section } }: unsafe) => {
  //               console.log('\t', ${section}.${method}, (data as string).toString());
  //             });
  //           } else if (status.isFinalized) {
  //             console.log('Transaction finalized at block hash', status.asFinalized.toHex());
  //             resolve(status.asFinalized.toHex());
  //           }
  //         })
  //         .catch((error) => {
  //           reject(error);
  //         });
  //     });
  //     return hash;
  //   } catch (error) {
  //     logger.error('Error sending transfer:', error);
  //   }
  // }
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

  async function getBalance(wallet: InjectedAccountWithMeta) {
    if (!api || !wallet) return
    const { data } = (await api.query.system.account(wallet.address)) as any
    return new BigNumber(data.free.toString()).div(10 ** 9)
  }
  const [getSignMessage] = useGetSignMessageMutation()
  const [getVerifySignature] = useVerifySignatureMutation()
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
        } else {
          setSelectedAccount(wallet)
          setIsConnected(true)
        }
      } catch (e) {
        console.log("error", e)
      }
    },
    [extensionSelected],
  )

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
        addStake,
        transfer,
        removeStake,
        transferStake,
        wallets: dotsamaWallets,

        extensionSelected,
        setExtensionSelected,
      }}
    >
      <WalletModal
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

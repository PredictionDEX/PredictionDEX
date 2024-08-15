"use client"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { usePolkadot } from "."

export type BalanceContextType = {
  userBalance: {
    balance: number
  }

  fetchUserStats?: () => void
}

const BalanceContext = createContext<BalanceContextType>({
  userBalance: {
    balance: 0,
  },
})

export const BalanceProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const { selectedAccount, api } = usePolkadot()
  const [balanceAmount, setBalanceAmount] = useState(0)
  const fetchBalance = useCallback(async () => {
    if (!selectedAccount || !api) return
    const balance: any = await api.query.system.account(selectedAccount.address)
    setBalanceAmount(Number(balance.data.free))
  }, [selectedAccount, api])

  const fetchUserStats = useCallback(async () => {
    await fetchBalance()
  }, [fetchBalance])
  useEffect(() => {
    fetchBalance()
  }, [selectedAccount])

  return (
    <BalanceContext.Provider
      value={{
        userBalance: {
          balance: balanceAmount,
        },
        fetchUserStats,
      }}
    >
      {children}
    </BalanceContext.Provider>
  )
}

export const useBalance = () => {
  return useContext(BalanceContext)
}

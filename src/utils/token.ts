"use client"

import { UserStorage } from "@/types"

export const setUser = (data: UserStorage) => {
  typeof window !== "undefined" &&
    localStorage.setItem("user", JSON.stringify(data))
}

export const getUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user")
    return user ? (JSON.parse(user) as UserStorage) : null
  }
}
export const removeUser = () => {
  typeof window !== "undefined" && localStorage.removeItem("user")
}

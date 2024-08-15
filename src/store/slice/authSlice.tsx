import { createSlice } from "@reduxjs/toolkit"

export type AuthState = {
  isAuthenticated: boolean
}

const authInitial = {
  isAuthenticated: false,
}

const initialState: AuthState = {
  isAuthenticated: false,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthenticated: (state: AuthState) => {
      state.isAuthenticated = true
    },
  },
})

export const { setIsAuthenticated } = authSlice.actions

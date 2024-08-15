import { createApi } from "@reduxjs/toolkit/query/react"
import apiWrapper from "@/store/api/wrapper/apiWrapper"
import {
  ApiResponse,
  LoginResponse,
  Market,
  MarketStats,
  MessageResponse,
  PaginatedApiResponse,
  User,
} from "@/types"
export const statsApi = createApi({
  reducerPath: "statsApi",
  baseQuery: apiWrapper,
  tagTypes: [
    "MarketList",
    "MarketById",
    "GetMyInfo",
    "Leaderboard",
    "GetStats",
  ],
  endpoints: (builder) => ({
    getSignMessage: builder.mutation<
      ApiResponse<MessageResponse>,
      { public_address: string }
    >({
      query: ({ public_address }) => {
        return {
          method: "POST",
          url: "auth/wallet",
          body: {
            public_address,
          },
        }
      },
      transformResponse: (response: ApiResponse<MessageResponse>) => {
        return response
      },
    }),
    verifySignature: builder.mutation<
      ApiResponse<LoginResponse>,
      { public_address: string; signature: string }
    >({
      query: ({ public_address, signature }) => {
        return {
          method: "POST",
          url: "auth/wallet/verify",
          body: {
            public_address,
            signature,
          },
        }
      },
      transformResponse: (response: ApiResponse<LoginResponse>) => {
        return response
      },
    }),
    createMarket: builder.mutation<ApiResponse<LoginResponse>, FormData>({
      query: (formData) => {
        return {
          method: "POST",
          url: "market",
          body: formData,
        }
      },
      invalidatesTags: ["MarketList", "GetMyInfo", "Leaderboard", "GetStats"],
      transformResponse: (response: ApiResponse<LoginResponse>) => {
        return response
      },
      transformErrorResponse: (err) => {
        return err.data
      },
    }),
    createPrediction: builder.mutation<
      ApiResponse<LoginResponse>,
      {
        outcome_id: string
        amount: string
      }
    >({
      query: (formData) => {
        return {
          method: "POST",
          url: "prediction",
          body: formData,
        }
      },
      invalidatesTags: (_, __, args) => [
        "MarketList",
        "MarketById",
        "GetMyInfo",
        "Leaderboard",
        "GetStats",
      ],
      transformResponse: (response: ApiResponse<LoginResponse>) => {
        return response
      },
      transformErrorResponse: (err) => {
        return err.data
      },
    }),
    getMarkets: builder.query<PaginatedApiResponse<Market>, void>({
      query: () => {
        return {
          method: "GET",
          url: "market",
        }
      },
      transformResponse: (response: PaginatedApiResponse<Market>) => {
        return response
      },
      transformErrorResponse: (err) => {
        console.log("FROM HERE ERROR", err)
        return err.data
      },
    }),
    getMarketById: builder.query<ApiResponse<Market>, number>({
      query: (marketId) => {
        return {
          method: "GET",
          url: `market/${marketId}`,
        }
      },
      providesTags: (result, error, marketId) => [
        { type: "MarketById", id: marketId },
      ],
      transformResponse: (response: ApiResponse<Market>) => {
        return response
      },
      transformErrorResponse: (err) => {
        return err.data
      },
    }),
    getMyDetails: builder.query<User, void>({
      query: () => {
        return {
          method: "GET",
          url: "user/me",
        }
      },
      providesTags: ["GetMyInfo"],
      transformResponse: (response: ApiResponse<User>) => {
        return response.data
      },
      transformErrorResponse: (err) => {
        return err.data
      },
    }),
    getLeaderboard: builder.query<
      {
        leaderboard: User[]
        rank: number
      },
      void
    >({
      query: () => {
        return {
          method: "GET",
          url: "leaderboard",
        }
      },
      providesTags: ["Leaderboard"],
      transformResponse: (
        response: ApiResponse<{
          leaderboard: User[]
          rank: number
        }>,
      ) => {
        return response.data
      },
      transformErrorResponse: (err) => {
        return err.data
      },
    }),
    getStats: builder.query<MarketStats, void>({
      query: () => {
        return {
          method: "GET",
          url: "public-stats",
        }
      },
      providesTags: ["GetStats"],
      transformResponse: (response: ApiResponse<MarketStats>) => {
        return response.data
      },
      transformErrorResponse: (err) => {
        return err.data
      },
    }),
  }),
})

export const {
  useGetSignMessageMutation,
  useVerifySignatureMutation,
  useCreateMarketMutation,
  useGetMarketsQuery,
  useGetMyDetailsQuery,
  useCreatePredictionMutation,
  useGetMarketByIdQuery,
  useGetLeaderboardQuery,
  useGetStatsQuery,
} = statsApi

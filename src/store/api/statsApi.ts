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
import { MarketStatus } from "@/types/generic"
export const statsApi = createApi({
  reducerPath: "statsApi",
  baseQuery: apiWrapper,
  tagTypes: [
    "MarketList",
    "MarketById",
    "GetMyInfo",
    "Leaderboard",
    "GetStats",
    "GetMyMarket",
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
    getMarkets: builder.query<
      PaginatedApiResponse<Market>,
      {
        status: MarketStatus
        page?: string
        count?: string
        type?: string
      }
    >({
      query: ({ status, page, count, type }) => {
        let url = `market?status=${status}`
        if (page) {
          url += `&page=${page}`
        }
        if (count) {
          url += `&count=${count}`
        }
        if (type && type !== "all") {
          url += `&type=${type}`
        }

        return {
          method: "GET",
          url: url,
        }
      },
      providesTags: (result, error, { status, type }) => [
        { type: "MarketList", status },
        { type: "MarketList", status: type },
      ],

      transformResponse: (response: PaginatedApiResponse<Market>) => {
        return response
      },
      transformErrorResponse: (err) => {
        console.error("Error fetching markets:", err)
        return err.data
      },
      merge: (currentCache, newItems) => {
        if (newItems && newItems.data) {
          const existingIds = new Set(currentCache.data.map((item) => item.id))
          const newUniqueItems = newItems.data.filter(
            (item) => !existingIds.has(item.id),
          )
          currentCache.pagination = newItems.pagination
          currentCache.data.push(...newUniqueItems)
        }
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${queryArgs.status}`
      },
      keepUnusedDataFor: 0,
      forceRefetch({ currentArg, previousArg }) {
        return (
          currentArg?.page !== previousArg?.page ||
          currentArg?.count !== previousArg?.count
        )
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
    getMySelfMarket: builder.query<
      PaginatedApiResponse<Market>,
      {
        status: "created" | "prediction"
        page: string
        count: string
      }
    >({
      query: ({ status, page, count }) => {
        let url
        if (status === "created") {
          url = `market/me?page=${page}&count=${count}`
        } else {
          url = `prediction?page=${page}&count=${count}`
        }
        return {
          method: "GET",
          url: url,
        }
      },
      providesTags: ["GetMyMarket"],
      transformResponse: (response: PaginatedApiResponse<Market>) => {
        return response
      },
      transformErrorResponse: (err) => {
        return err.data
      },
      merge: (currentCache, newItems) => {
        if (newItems && newItems.data) {
          const existingIds = new Set(currentCache.data.map((item) => item.id))
          const newUniqueItems = newItems.data.filter(
            (item) => !existingIds.has(item.id),
          )
          currentCache.pagination = newItems.pagination
          currentCache.data.push(...newUniqueItems)
        }
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${queryArgs.status}`
      },
      keepUnusedDataFor: 0,
      forceRefetch({ currentArg, previousArg }) {
        return (
          currentArg?.page !== previousArg?.page ||
          currentArg?.count !== previousArg?.count
        )
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
  useLazyGetMarketsQuery,
  useGetLeaderboardQuery,
  useGetStatsQuery,
  useGetMySelfMarketQuery,
} = statsApi

import { getUser } from "@/utils/token"
import { fetchBaseQuery } from "@reduxjs/toolkit/query"
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query"

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_API,
  prepareHeaders: (headers) => {
    const userSession = getUser()
    if (headers.get("Authorization") !== "" && userSession?.accessToken) {
      headers.set("Authorization", `Bearer ${userSession?.accessToken}`)
    }
    return headers
  },
})

const apiWrapper: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
  }
  return result
}

export default apiWrapper

import { DefaultToastOptions, toast, ToastOptions } from "react-hot-toast"

type AsyncOperation<T> = () => Promise<T>

interface ToastMessages {
  loading: string
  success: string
  error: (err: any) => string
}

const toastConfig: DefaultToastOptions = {
  position: "top-center",
  style: {
    backgroundColor: "#1E293B",
    color: "#F9FAFB",
  },
}

// export const handleToastAsyncOperation = async <T,>(
//   asyncOperation: AsyncOperation<T>,
//   messages: ToastMessages,
// ): Promise<T | null> => {
//   const toastId = toast.loading(messages.loading, toastConfig)

//   try {
//     const result = await asyncOperation()
//     console.log(result)
//     if (
//       (result as DeliverTxResponse).code !== undefined &&
//       (result as DeliverTxResponse).code !== 0
//     ) {
//       toast.error(messages.error((result as DeliverTxResponse).rawLog), {
//         id: toastId,
//       })
//       return null
//     }

//     toast.success(messages.success, { id: toastId })
//     return result
//   } catch (error) {
//     toast.error(messages.error(error), { id: toastId })
//     console.error("Operation failed:", error)
//     return null
//   }
// }

export const successToast = (message: string) => {
  return toast.success(message, toastConfig)
}

export const errorToast = (message: string) => {
  return toast.error(message, toastConfig)
}

import { ReactNode } from "react"
import {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  Path,
  UseFormRegister,
} from "react-hook-form"
import { IconType } from "react-icons"

interface InputProps<T extends FieldValues> {
  id?: string
  name: Path<T>
  type: string
  accept?: string
  label?: string
  placeholder?: string
  register: UseFormRegister<T>
  classes?: string
  errors?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
  rules?: any
  defaultVal?: string
  disabled?: boolean
}

export function InputComponent<T extends FieldValues>({
  id,
  name,
  type,
  placeholder = "",
  register,
  accept,
  label = "",
  classes = "",
  errors,
  rules,
  defaultVal = "",
  disabled = false,
  ...props
}: InputProps<T>) {
  const errorMessage = errors?.message as string
  return (
    <div>
      <div className={label !== undefined ? "space-y-1" : ""}>
        {label && <label className="text-sm text-gray-200">{label}</label>}
        <div className="relative text-sm">
          <input
            placeholder={placeholder}
            type={type}
            accept={accept}
            autoComplete="off"
            defaultValue={defaultVal}
            className={`w-full rounded-lg py-2 text-sm px-2 !bg-transparent shadow-none ring-1 ring-gray-500 text-md text-white focus:outline-none focus:bg-transparent 
              ${classes} 
              ${errorMessage ? "!ring-[#d72c0d]" : ""}
           `}
            disabled={disabled}
            {...register(name, rules)}
            {...props}
          />
        </div>
      </div>
      {errorMessage && errorMessage.length > 0 && (
        <small className="text-sm text-[#d72c0d] !font-normal">
          {errorMessage}
        </small>
      )}
    </div>
  )
}

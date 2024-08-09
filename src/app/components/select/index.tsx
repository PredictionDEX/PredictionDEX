"use client"

import {
  Control,
  Controller,
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  Path,
} from "react-hook-form"
import Select, { StylesConfig } from "react-select"

type Options = {
  value: string
  label: string
}
type SelectProps<T extends FieldValues> = {
  name: Path<T>
  options: Array<Options> | undefined
  placeholder?: string
  errors?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
  label?: string
  handleChange?: (() => void) | null
  value?: Options
  isSearchable?: boolean
  isClearable?: boolean
  disabled?: boolean
  control: Control<T, any>
  rules?: any
}

export function SelectComponent<T extends FieldValues>({
  name,
  label,
  errors,
  control,
  options,
  placeholder,
  rules,
  handleChange = null,
  disabled = false,
  isSearchable = false,
  isClearable = false,
}: SelectProps<T>) {
  const errorMessage: any = errors?.message
  const customStyles: StylesConfig = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "transparent",
      border: `1px solid ${
        errorMessage ? "#d72c0d" : "rgb(107,114,128)"
      } !important`,
      fontSize: "14px",
      lineHeight: "24px",
      fontWeight: 500,
      borderRadius: 0,
      color: `${disabled ? "#bdc1cc" : "white"} !important`,
      padding: "1.5px",
      textAlign: "left",
      boxShadow: `${
        errorMessage ? "inset 0px 1px 0px 0px #898F94" : "none !important"
      }`,
      outline: "none",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "rgb(72, 50, 179,0.8)"
        : "transparent",
      color: "white !important",
      fontSize: 12,
    }),
    menu: (provided) => ({
      ...provided,
      marginTop: "2px",
      width: "100%",
      background: "#20334B",
      position: "relative",
      zIndex: "999",
      color: "white !important",
    }),
  }

  return (
    <div>
      <div
        className={`flex flex-col justify-between ${
          label != undefined && label.length > 0 ? "space-y-1.5" : ""
        }`}
      >
        {label && <label className="text-sm text-gray-200">{label}</label>}

        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => (
            <Select
              isDisabled={disabled}
              menuPortalTarget={
                typeof document !== "undefined" ? document.body : undefined
              }
              menuPosition="fixed"
              className="flex-1 !capitalize"
              isSearchable={isSearchable}
              isClearable={isClearable}
              options={options}
              value={options?.find(
                (c) => String(c.value) === String(value?.value),
              )}
              defaultValue={options?.find(
                (c) => String(c.value) === String(value?.value),
              )}
              onChange={(val: any) => {
                onChange(val)
                if (handleChange) {
                  handleChange()
                }
              }}
              styles={customStyles}
              placeholder={placeholder}
            />
          )}
          rules={rules}
        />
      </div>
      {errorMessage && errorMessage.length > 0 && (
        <small className="text-sm text-[#d72c0d] !font-normal">
          {errorMessage}
        </small>
      )}
    </div>
  )
}

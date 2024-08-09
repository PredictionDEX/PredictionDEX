"use client"
import { ReactElement } from "react"
import DatePicker, { DatePickerProps } from "react-datepicker"
import {
  Control,
  Controller,
  FieldError,
  Merge,
  FieldValues,
  FieldErrorsImpl,
  Path,
} from "react-hook-form"

interface HookFormDatePickerProps<T extends FieldValues>
  extends Omit<DatePickerProps, "onChange" | "selectsRange"> {
  name: Path<T>
  control: Control<T, any>
  errors?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
  label?: string
  placeholder?: string
  rules?: any
  icon?: ReactElement
  minDate: Date | undefined
  dateToFilter?: Date | null
  onChange?: (date: Date | null) => void // Custom onChange handler
}

export function DatePickerComponent<T extends FieldValues>({
  name,
  control,
  errors,
  showIcon,
  dateFormat,
  icon,
  closeOnScroll,
  minDate = undefined,
  startDate,
  selectsStart,
  endDate,
  calendarContainer,
  label,
  dateToFilter,
  placeholder = "Select date",
  rules,
  ...rest
}: HookFormDatePickerProps<T>) {
  const errorMessage: any = errors?.message
  const filterPassedTime = (time: Date) => {
    if (minDate) {
      return time.getTime() > minDate.getTime()
    }
    return true
  }
  return (
    <div>
      <div
        className={`flex flex-col ${
          label !== undefined ? "space-y-1 justify-between" : ""
        } w-full`}
      >
        {label && <label className="text-sm text-gray-200">{label}</label>}

        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field }) => (
            <>
              {console.log(field.value)}
              <DatePicker
                placeholderText={placeholder}
                showIcon={showIcon}
                dateFormat={dateFormat}
                icon={icon}
                closeOnScroll={closeOnScroll}
                minDate={minDate}
                startDate={startDate}
                filterTime={filterPassedTime}
                selectsStart={selectsStart}
                endDate={endDate}
                calendarContainer={calendarContainer}
                selected={field.value}
                className={` px-2 !bg-transparent shadow-none ring-1 ring-gray-500 text-md w-full !pl-7 !py-2 pr-3 text-sm leading-[25px] font-medium focus:outline-none ${
                  errorMessage
                    ? "border-red-500 !shadow-none"
                    : "border-gray-300"
                }
            `}
                onChange={(date) => field.onChange(date)}
                {...rest}
                selectsMultiple={undefined}
              />
            </>
          )}
        />
      </div>
      {errorMessage && (
        <small className="text-sm text-red-500">{errorMessage}</small>
      )}
    </div>
  )
}

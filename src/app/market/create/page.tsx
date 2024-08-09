"use client"
import Button from "@/app/components/button"
import MarketCard from "@/app/components/card/market"
import { DatePickerComponent } from "@/app/components/datepicker"
import { InputComponent } from "@/app/components/input"
import ClockContainer from "@/app/components/misc/clock"
import { SelectComponent } from "@/app/components/select"
import { UploaderPreview } from "@/app/components/uploader"
import { useRouter } from "next/navigation"
import React from "react"
import { useForm } from "react-hook-form"
import { FaArrowLeft } from "react-icons/fa"
import { LuCalendar } from "react-icons/lu"
import { PiUploadSimple } from "react-icons/pi"

const CreateMarket = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "all",
  })
  const router = useRouter()
  return (
    <div>
      <button
        onClick={() => router.back()}
        className="ring-2 ring-gray-700 p-2 my-3 rounded-lg"
      >
        <FaArrowLeft />
      </button>
      <div className="flex">
        <div className="flex-1">
          <form>
            <div className="mt-4">
              <InputComponent
                label="Market Name"
                name="title"
                placeholder="Enter a market name"
                register={register}
                type="text"
                errors={errors["title"]}
                rules={{ required: "Market name is required" }}
              />
            </div>
            <div className="flex mt-4 gap-x-3">
              <div className="flex-1">
                <SelectComponent
                  name="type"
                  label="Market Type"
                  isSearchable
                  placeholder=""
                  options={[
                    {
                      label: "E-Sports",
                      value: "E-Sports",
                    },
                    {
                      label: "Crypto",
                      value: "Crypto",
                    },
                  ]}
                  control={control}
                  errors={errors["type"]}
                  rules={{ required: "Market type is required" }}
                />
              </div>
              <div className="flex-1">
                <DatePickerComponent
                  minDate={new Date()}
                  name="resolution_date"
                  control={control}
                  showIcon
                  dateFormat="yyyy-MM-dd | hh:mm a"
                  icon={<LuCalendar size={20} className="mt-1" />}
                  closeOnScroll={(e) => e.target === document}
                  selectsStart
                  showTimeSelect
                  label="Market Resolution Date"
                  errors={errors["resolution_date"]}
                  rules={{ required: "Required Field" }}
                  calendarContainer={ClockContainer}
                />
              </div>
            </div>
            <div className="flex gap-x-3">
              <div className="flex-1">
                <InputComponent
                  label="Outcome 1"
                  name="outcomes[0]"
                  placeholder="Enter Outcome 1"
                  register={register}
                  type="text"
                  errors={errors["outcomes[0]"]}
                  rules={{ required: "Outcome is required" }}
                />
              </div>
              <div className="flex-1">
                <InputComponent
                  label="Outcome 2"
                  name="outcomes[1]"
                  placeholder="Enter Outcome 2"
                  register={register}
                  type="text"
                  errors={errors["outcomes[1]"]}
                  rules={{ required: "Outcome is required" }}
                />
              </div>
              <div className="flex-1">
                <InputComponent
                  label="Outcome 3"
                  name="outcomes[2]"
                  placeholder="Enter Outcome 3"
                  register={register}
                  type="text"
                />
              </div>
            </div>

            <div className="mt-4">
              <UploaderPreview
                name="image"
                label="Market Image"
                register={register}
                setValue={setValue}
                control={control}
                icon={<PiUploadSimple />}
                watch={watch}
                errors={errors["image"]}
              />
            </div>
            <div className="mt-4">
              <Button type="submit" variant="primary">
                Create Market
              </Button>
            </div>
          </form>
        </div>
        <div className="flex-1">
          <h6>Preview</h6>
          <MarketCard
            name={watch("title")}
            category={watch("type")?.value}
            time={watch("resolution_date")}
            outcomes={[
              watch("outcomes[0]"),
              watch("outcomes[1]"),
              watch("outcomes[2]"),
            ]}
            createdBy="Admin"
            totalVolume="0"
            isFullWidth
          />
        </div>
      </div>
    </div>
  )
}

export default CreateMarket

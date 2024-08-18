"use client"
import Button from "@/components/button"
import MarketCard from "@/components/card/market"
import { DatePickerComponent } from "@/components/datepicker"
import { InputComponent } from "@/components/input"
import ClockContainer from "@/components/misc/clock"
import { SelectComponent } from "@/components/select"
import { errorToast, successToast } from "@/components/toast"
import { UploaderPreview } from "@/components/uploader"
import { usePolkadot } from "@/context"
import { useCreateMarketMutation } from "@/store/api/statsApi"
import { MarketStatus } from "@/types/generic"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { FaArrowLeft } from "react-icons/fa"
import { LuCalendar } from "react-icons/lu"
import { PiUploadSimple } from "react-icons/pi"
import categories from "@/app/_lib/category.json"
import { Outcome } from "@/types"
import UserBalance from "@/components/balance/token"
import AmountWarning from "@/components/balance/message"
import { HOST_FEE } from "@/app/_lib/constants"
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
    defaultValues: {
      type: {
        label: categories[0].label,
        value: categories[0].value,
      },
      title: "",
      resolution_date: "",
      outcomes: ["Outcome 1", "Outcome 2", ""],
      image: "",
    },
  })
  const router = useRouter()
  const [createMarket] = useCreateMarketMutation()
  const [isCreating, setIsCreating] = useState(false)
  const handleCreateMarket = async (data: any) => {
    setIsCreating(true)
    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("type", data.type.value)
    formData.append("resolution_date", data.resolution_date)
    data.outcomes?.filter((oc:string) => oc !== "").map((outcome: string, index: number) => {
      formData.append(`outcomes[${index}]`, outcome)
    })
    formData.append("images", data.image)
    try {
      const response = await createMarket(formData).unwrap()
      console.log(response)
      setIsCreating(false)
      successToast("Market created successfully")
      router.push("/")
    } catch (e) {
      setIsCreating(false)
      errorToast((e as Error).message)
      console.log(e)
    }
  }

  const categoryOptions = categories.map((category) => ({
    value: category.value,
    label: category.label,
  }))
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
          <form onSubmit={handleSubmit(handleCreateMarket)}>
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
                  options={categoryOptions || []}
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
                  label="Market Closing Date"
                  errors={errors["resolution_date"]}
                  rules={{ required: "Closing date is required" }}
                  calendarContainer={ClockContainer}
                />
              </div>
            </div>
            <div className="flex gap-x-3">
              {(watch("outcomes") as string[])?.map((_, index: number) => (
                <div className="flex-1" key={index}>
                  <InputComponent
                    label={`Outcome ${index + 1}`}
                    name={`outcomes.${index}`}
                    placeholder="Enter Outcome 1"
                    register={register}
                    type="text"
                    errors={errors["outcomes"]?.[index]}
                    rules={
                      index === 2
                        ? { required: false }
                        : { required: "Outcome is required" }
                    }
                  />
                </div>
              ))}
            </div>

            <div className="mt-4">
              <UploaderPreview
                name="image"
                label="Upload Market Image"
                register={register}
                setValue={setValue}
                control={control}
                icon={<PiUploadSimple />}
                watch={watch}
                errors={errors["image"]}
              />
            </div>
            <hr className="my-2 bg-gray-700" />
            <div className="pb-2">
              <UserBalance />
            </div>
            <AmountWarning amount={String(HOST_FEE)} action="create" />
            <div className="mt-4">
              <Button type="submit" variant="primary" isLoading={isCreating}>
                Create Market
              </Button>
            </div>
          </form>
        </div>
        <div className="flex-1">
          <h6>Preview</h6>
          <MarketCard
            id={0}
            name={watch("title")}
            category={watch("type")?.value}
            time={watch("resolution_date")}
            outcomes={
              watch("outcomes")
                ?.filter((oc) => oc !== "")
                .map(
                  (outcome: any, key: any) =>
                    ({
                      id: key,
                      market_id: 0,
                      label: outcome,
                      total_amount: 0,
                      created_at: "",
                      updated_at: "",
                      predictions: [],
                      self_prediction: {
                        data: [],
                        total_amount: 0,
                      },
                    } as Outcome),
                ) || []
            }
            image={
              watch("image") != "" && watch("image") != undefined
                ? URL.createObjectURL(new Blob([watch("image")]))
                : "/default.jpeg"
            }
            status={MarketStatus.LIVE}
            totalVolume={0}
            isFullWidth
            isPreview
            isMarketCreator
          />
        </div>
      </div>
    </div>
  )
}

export default CreateMarket

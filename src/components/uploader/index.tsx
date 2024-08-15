"use client"
import Image from "next/image"
import React, { ReactNode, useState } from "react"
import { useDropzone } from "react-dropzone"
import {
  Control,
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  Path,
  UseFormRegister,
  useController,
} from "react-hook-form"
import { FaSpinner, FaUpload } from "react-icons/fa"

type IUploaderPreviewProps<T extends FieldValues> = {
  name: Path<T>
  accept?: string
  register: UseFormRegister<T>
  setValue: any
  watch: any
  label?: string
  errors?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
  icon?: ReactNode
  control: Control<T, any>
  rules?: any
  isUploadVisible?: boolean
  buttonClass?: string
  classes?: string
  resolutionText?: string
  fullWidth?: boolean
}

export function UploaderPreview<T extends FieldValues>({
  name,
  register,
  control,
  label,
  errors,
  rules,
  isUploadVisible = true,
  classes = "",
  fullWidth = false,
}: IUploaderPreviewProps<T>) {
  const errorMessage: any = errors?.message
  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
    rules: {
      required: "Required Field",
    },
  })

  const [uploading, setUploading] = useState(false)

  const onDrop = (acceptedFiles: File[]) => {
    setUploading(true)
    onChange(acceptedFiles[0])
    setUploading(false)
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  })

  return (
    <>
      {label && <label className="text-sm text-gray-200">{label}</label>}

      <div
        className={`space-y-spacing_xs ${
          fullWidth ? "w-full" : "!max-w-[270px]"
        } flex-col justify-center`}
      >
        {isUploadVisible && (
          <div className="w-full flex mt-4">
            <div
              {...getRootProps()}
              className={`
              relative w-[100px] h-[100px] rounded-lg border 
              ${errorMessage ? "border-[#d72c0d]" : "border-neutralSubdued"}
              rounded-curved cursor-pointer flex justify-center items-center
              ${classes}`}
            >
              {uploading ? (
                <FaSpinner className="loading-icon" />
              ) : (
                <div className="flex flex-col">
                  <input
                    {...register(name, rules)}
                    {...getInputProps()}
                    accept="image/png, image/jpeg, image/jpg"
                  />
                  {value ? (
                    <Image
                      src={URL.createObjectURL(value)}
                      key={value}
                      alt="Preview"
                      fill
                      className="object-cover rounded-curved"
                    />
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-center">
                        <FaUpload />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {errorMessage && errorMessage.length > 0 && (
          <div className="w-full text-center">
            <small className="text-sm text-[#d72c0d] !font-normal">
              {errorMessage}
            </small>
          </div>
        )}
      </div>
    </>
  )
}

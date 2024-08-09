import React, { ReactNode } from "react"
import { CalendarContainer } from "react-datepicker"

const ClockContainer = ({
  className,
  children,
}: {
  className: string
  children: ReactNode
}) => {
  return (
    <div>
      <CalendarContainer className={`${className} !text-sm !rounded-curved`}>
        <div>{children}</div>
      </CalendarContainer>
    </div>
  )
}

export default ClockContainer

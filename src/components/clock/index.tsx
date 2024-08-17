import React, { useEffect, useState } from "react"
import moment from "moment"

interface TimerProps {
  endTime: string // Expecting a string in a format that moment can parse
}

const Timer: React.FC<TimerProps> = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState<string>("00:00:00")

  useEffect(() => {
    const end = moment(endTime)

    const intervalId = setInterval(() => {
      const now = moment()
      const duration = moment.duration(end.diff(now))

      if (duration.asMilliseconds() <= 0) {
        clearInterval(intervalId)
        setTimeLeft("00:00:00")
      } else {
        const hours = Math.floor(duration.asHours())
        const minutes = duration.minutes()
        const seconds = duration.seconds()

        setTimeLeft(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
        )
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [endTime])

  return <div>{timeLeft}</div>
}

export default Timer

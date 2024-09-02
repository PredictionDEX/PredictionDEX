"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "react-responsive-modal";

type ComingSoonProps = {
  offset: Date;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const useCountDown = (targetDate: Date) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimaRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimaRemaining());
    }, 1000);
    return () => clearInterval(interval);
  });

  function calculateTimaRemaining() {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const difference = target - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      ),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  }
  return timeLeft;
};

const ComingSoon: React.FC<ComingSoonProps> = ({ offset }) => {
  const { days, hours, minutes, seconds } = useCountDown(offset);

  return (
    <Modal
      open={true}
      center
      classNames={{
        modal: "!bg-gray-900 rounded-2xl",
      }}
      onClose={() => {}}
      closeIcon={<></>}
    >
      <div className="flex flex-col items-center justify-center p-4 gap-5">
        <h1 className="text-3xl font-bold text-white">
          Get Ready To Predict With $COMAI
        </h1>

        <div className="flex gap-2 text-white">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{days}</span>
            <span className="text-sm">Days</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{hours}</span>
            <span className="text-sm">Hours</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{minutes}</span>
            <span className="text-sm">Minutes</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{seconds}</span>
            <span className="text-sm">Seconds</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ComingSoon;

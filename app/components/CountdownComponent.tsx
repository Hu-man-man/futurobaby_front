"use client"

import {useState, useEffect} from 'react'

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

type CountdownProps = {
    targetDate: string | Date;
};

const CountdownComponent = ({targetDate}: CountdownProps) => {
    const calculateTimeLeft = (): TimeLeft => {
        const différence = +new Date(targetDate) - +new Date()
        let timeLeft:TimeLeft = {
            days: Math.floor(différence / (1000 * 60 * 60 * 24)),
            hours: Math.floor((différence / (1000 * 60 * 60) % 24)),
            minutes: Math.floor((différence / 1000 / 60) % 60),
            seconds: Math.floor((différence / 1000) % 60),
        }
        return timeLeft
    }

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        return () => clearTimeout(timer)
    })

  return (
    <div>
      {Object.entries(timeLeft).map(([key, value]) => (
        <span key={key}>
          {value} {key}{" "}
        </span>
      ))}
      {Object.values(timeLeft).every(val => val === 0) && <span>Le bébé est né!</span>}
    </div>
  )
}

export default CountdownComponent
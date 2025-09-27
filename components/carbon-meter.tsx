"use client"

import { useEffect, useState } from "react"

interface CarbonMeterProps {
  value: number
  maxValue: number
  label: string
  unit: string
}

export function CarbonMeter({ value, maxValue, label, unit }: CarbonMeterProps) {
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value)
    }, 500)
    return () => clearTimeout(timer)
  }, [value])

  const percentage = Math.min((animatedValue / maxValue) * 100, 100)
  const strokeDasharray = 2 * Math.PI * 90 // circumference
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100

  const getColor = () => {
    if (percentage <= 25) return "#10B981" // Green
    if (percentage <= 50) return "#34D399" // Light green
    if (percentage <= 75) return "#F59E0B" // Amber
    return "#EF4444" // Red
  }

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted opacity-20"
        />

        {/* Progress circle */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke={getColor()}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-2000 ease-out"
          style={{
            filter: "drop-shadow(0 0 8px rgba(16, 185, 129, 0.3))",
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold text-foreground">{animatedValue.toFixed(1)}</div>
        <div className="text-sm text-muted-foreground">{unit}</div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </div>
    </div>
  )
}

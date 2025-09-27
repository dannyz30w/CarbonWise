"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { calculateCarbonFootprint, type CarbonInputs, type CarbonResult } from "@/lib/carbon-calculator"
import { TrendingDown, TrendingUp, Zap, Car, Utensils, ShoppingBag } from "lucide-react"

interface WhatIfSlidersProps {
  originalInputs: CarbonInputs
  originalResult: CarbonResult
}

export function WhatIfSliders({ originalInputs, originalResult }: WhatIfSlidersProps) {
  const [modifiedInputs, setModifiedInputs] = useState<CarbonInputs>(originalInputs)
  const modifiedResult = calculateCarbonFootprint(modifiedInputs)

  const scenarios = [
    {
      id: "renewable_energy",
      title: "Switch to Renewable Energy",
      icon: <Zap className="w-5 h-5" />,
      description: "Increase renewable energy percentage",
      currentValue: modifiedInputs.energyDetails?.renewablePercent || 0,
      maxValue: 100,
      unit: "%",
      onChange: (value: number) => {
        setModifiedInputs({
          ...modifiedInputs,
          energyDetails: { ...modifiedInputs.energyDetails, renewablePercent: value },
        })
      },
    },
    {
      id: "reduce_driving",
      title: "Reduce Driving",
      icon: <Car className="w-5 h-5" />,
      description: "Reduce car travel by percentage",
      currentValue: 0,
      maxValue: 100,
      unit: "%",
      onChange: (value: number) => {
        const newCommute = modifiedInputs.commute.map((transport) => {
          if (transport.mode.includes("car")) {
            return {
              ...transport,
              miles:
                originalInputs.commute.find((orig) => orig.mode === transport.mode)?.miles * (1 - value / 100) || 0,
            }
          }
          return transport
        })
        setModifiedInputs({ ...modifiedInputs, commute: newCommute })
      },
    },
    {
      id: "reduce_meat",
      title: "Reduce Meat Consumption",
      icon: <Utensils className="w-5 h-5" />,
      description: "Reduce meat servings by percentage",
      currentValue: 0,
      maxValue: 100,
      unit: "%",
      onChange: (value: number) => {
        const originalBeef = originalInputs.dietDetails?.beefServingsPerWeek || 0
        const originalChicken = originalInputs.dietDetails?.chickenServingsPerWeek || 0
        setModifiedInputs({
          ...modifiedInputs,
          dietDetails: {
            ...modifiedInputs.dietDetails,
            beefServingsPerWeek: originalBeef * (1 - value / 100),
            chickenServingsPerWeek: originalChicken * (1 - value / 100),
          },
        })
      },
    },
    {
      id: "reduce_shopping",
      title: "Reduce Shopping",
      icon: <ShoppingBag className="w-5 h-5" />,
      description: "Reduce overall spending by percentage",
      currentValue: 0,
      maxValue: 50,
      unit: "%",
      onChange: (value: number) => {
        const originalClothing = originalInputs.shopping.clothingSpend
        const originalElectronics = originalInputs.shopping.electronicsSpend
        const originalGeneral = originalInputs.shopping.generalSpend
        setModifiedInputs({
          ...modifiedInputs,
          shopping: {
            clothingSpend: originalClothing * (1 - value / 100),
            electronicsSpend: originalElectronics * (1 - value / 100),
            generalSpend: originalGeneral * (1 - value / 100),
          },
        })
      },
    },
  ]

  const totalReduction = originalResult.annual.total - modifiedResult.annual.total
  const percentageReduction = (totalReduction / originalResult.annual.total) * 100

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🎛️</span>
          What-If Scenarios
        </CardTitle>
        <CardDescription>
          Adjust the sliders below to see how different actions would impact your carbon footprint
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Impact Summary */}
        <div className="p-4 rounded-lg bg-muted/50 border">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Potential Impact</span>
            <div className="flex items-center gap-2">
              {totalReduction > 0 ? (
                <TrendingDown className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingUp className="w-4 h-4 text-red-600" />
              )}
              <Badge variant={totalReduction > 0 ? "default" : "destructive"}>
                {totalReduction > 0 ? "-" : "+"}
                {Math.abs(totalReduction).toFixed(0)} kg CO₂e/year
              </Badge>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {percentageReduction > 0 ? (
              <>Reduction of {percentageReduction.toFixed(1)}% from your current footprint</>
            ) : (
              <>This would increase your footprint by {Math.abs(percentageReduction).toFixed(1)}%</>
            )}
          </div>
          <div className="mt-2 text-lg font-semibold">
            New Annual Total: {(modifiedResult.annual.total / 1000).toFixed(1)} tonnes CO₂e
          </div>
        </div>

        {/* Scenario Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scenarios.map((scenario) => (
            <Card key={scenario.id} className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">{scenario.icon}</div>
                <div>
                  <div className="font-medium">{scenario.title}</div>
                  <div className="text-sm text-muted-foreground">{scenario.description}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    Current: {scenario.currentValue}
                    {scenario.unit}
                  </span>
                  <span>
                    Max: {scenario.maxValue}
                    {scenario.unit}
                  </span>
                </div>
                <Slider
                  value={[scenario.currentValue]}
                  onValueChange={([value]) => scenario.onChange(value)}
                  max={scenario.maxValue}
                  step={scenario.maxValue === 100 ? 5 : 1}
                  className="mt-2"
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={() => setModifiedInputs(originalInputs)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Reset all scenarios
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

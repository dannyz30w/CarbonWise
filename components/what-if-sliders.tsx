"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { calculateCarbonFootprint, type CarbonInputs, type CarbonResult } from "@/lib/carbon-calculator"
import { TrendingDown, TrendingUp, Zap, Car, Utensils, ShoppingBag, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WhatIfSlidersProps {
  originalInputs: CarbonInputs
  originalResult: CarbonResult
}

export function WhatIfSliders({ originalInputs, originalResult }: WhatIfSlidersProps) {
  const [modifiedInputs, setModifiedInputs] = useState<CarbonInputs>(originalInputs)
  const modifiedResult = calculateCarbonFootprint(modifiedInputs)

  const handleRenewableEnergyChange = (value: number) => {
    setModifiedInputs({
      ...modifiedInputs,
      energyDetails: {
        ...modifiedInputs.energyDetails,
        renewablePercent: value,
      },
    })
  }

  const handleDrivingReduction = (value: number) => {
    const newCommute = modifiedInputs.commute.map((transport) => {
      if (transport.mode.includes("car")) {
        const originalTransport = originalInputs.commute.find((orig) => orig.mode === transport.mode)
        return {
          ...transport,
          miles: (originalTransport?.miles || 0) * (1 - value / 100),
        }
      }
      return transport
    })
    setModifiedInputs({ ...modifiedInputs, commute: newCommute })
  }

  const handleMeatReduction = (value: number) => {
    const originalBeef = originalInputs.dietDetails?.beefServingsPerWeek || 0
    const originalPork = originalInputs.dietDetails?.porkServingsPerWeek || 0
    const originalChicken = originalInputs.dietDetails?.chickenServingsPerWeek || 0
    const originalLamb = originalInputs.dietDetails?.lambServingsPerWeek || 0

    setModifiedInputs({
      ...modifiedInputs,
      dietDetails: {
        ...modifiedInputs.dietDetails,
        beefServingsPerWeek: originalBeef * (1 - value / 100),
        porkServingsPerWeek: originalPork * (1 - value / 100),
        chickenServingsPerWeek: originalChicken * (1 - value / 100),
        lambServingsPerWeek: originalLamb * (1 - value / 100),
      },
    })
  }

  const handleShoppingReduction = (value: number) => {
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
  }

  const [renewableSlider, setRenewableSlider] = useState(modifiedInputs.energyDetails?.renewablePercent || 0)
  const [drivingSlider, setDrivingSlider] = useState(0)
  const [meatSlider, setMeatSlider] = useState(0)
  const [shoppingSlider, setShoppingSlider] = useState(0)

  const scenarios = [
    {
      id: "renewable_energy",
      title: "Switch to Renewable Energy",
      icon: <Zap className="w-5 h-5" />,
      description: "Increase renewable energy percentage",
      currentValue: renewableSlider,
      maxValue: 100,
      unit: "%",
      onChange: (value: number) => {
        setRenewableSlider(value)
        handleRenewableEnergyChange(value)
      },
    },
    {
      id: "reduce_driving",
      title: "Reduce Driving",
      icon: <Car className="w-5 h-5" />,
      description: "Reduce car travel by percentage",
      currentValue: drivingSlider,
      maxValue: 100,
      unit: "%",
      onChange: (value: number) => {
        setDrivingSlider(value)
        handleDrivingReduction(value)
      },
    },
    {
      id: "reduce_meat",
      title: "Reduce Meat Consumption",
      icon: <Utensils className="w-5 h-5" />,
      description: "Reduce meat servings by percentage",
      currentValue: meatSlider,
      maxValue: 100,
      unit: "%",
      onChange: (value: number) => {
        setMeatSlider(value)
        handleMeatReduction(value)
      },
    },
    {
      id: "reduce_shopping",
      title: "Reduce Shopping",
      icon: <ShoppingBag className="w-5 h-5" />,
      description: "Reduce overall spending by percentage",
      currentValue: shoppingSlider,
      maxValue: 50,
      unit: "%",
      onChange: (value: number) => {
        setShoppingSlider(value)
        handleShoppingReduction(value)
      },
    },
  ]

  const totalReduction = originalResult.annual.total - modifiedResult.annual.total
  const percentageReduction = (totalReduction / originalResult.annual.total) * 100

  const resetAllScenarios = () => {
    setModifiedInputs(originalInputs)
    setRenewableSlider(originalInputs.energyDetails?.renewablePercent || 0)
    setDrivingSlider(0)
    setMeatSlider(0)
    setShoppingSlider(0)
  }

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
            <span className="font-medium text-foreground">Potential Impact</span>
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
          <div className="mt-2 text-lg font-semibold text-foreground">
            New Annual Total: {(modifiedResult.annual.total / 1000).toFixed(1)} tonnes CO₂e
          </div>
        </div>

        {/* Scenario Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scenarios.map((scenario) => (
            <Card key={scenario.id} className="p-4 border-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {scenario.icon}
                </div>
                <div>
                  <div className="font-medium text-foreground">{scenario.title}</div>
                  <div className="text-sm text-muted-foreground">{scenario.description}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-foreground">
                  <span>
                    Current: {scenario.currentValue.toFixed(0)}
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
          <Button
            onClick={resetAllScenarios}
            variant="outline"
            size="sm"
            className="text-muted-foreground hover:text-foreground bg-transparent"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset all scenarios
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

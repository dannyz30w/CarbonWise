"use client"

import { useState, useMemo } from "react"
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
  const [renewableSlider, setRenewableSlider] = useState(originalInputs.energyDetails?.renewablePercent || 0)
  const [drivingSlider, setDrivingSlider] = useState(0)
  const [meatSlider, setMeatSlider] = useState(0)
  const [shoppingSlider, setShoppingSlider] = useState(0)

  const modifiedResult = useMemo(() => {
    const modifiedInputs: CarbonInputs = { ...originalInputs }

    // Apply renewable energy changes
    if (modifiedInputs.energyDetails) {
      modifiedInputs.energyDetails = {
        ...modifiedInputs.energyDetails,
        renewablePercent: renewableSlider,
      }
    }

    // Apply driving reduction - fix for all transport modes
    if (drivingSlider > 0 && modifiedInputs.commute) {
      modifiedInputs.commute = modifiedInputs.commute.map((transport) => {
        if (
          transport.mode.toLowerCase().includes("car") ||
          transport.mode.toLowerCase().includes("drive") ||
          transport.mode.toLowerCase().includes("suv") ||
          transport.mode.toLowerCase().includes("truck")
        ) {
          return {
            ...transport,
            miles: Math.max(0, transport.miles * (1 - drivingSlider / 100)),
          }
        }
        return transport
      })
    }

    // Apply meat reduction - fix for all meat types
    if (meatSlider > 0 && modifiedInputs.dietDetails) {
      const reductionFactor = 1 - meatSlider / 100
      modifiedInputs.dietDetails = {
        ...modifiedInputs.dietDetails,
        beefServingsPerWeek: Math.max(0, (originalInputs.dietDetails?.beefServingsPerWeek || 0) * reductionFactor),
        porkServingsPerWeek: Math.max(0, (originalInputs.dietDetails?.porkServingsPerWeek || 0) * reductionFactor),
        chickenServingsPerWeek: Math.max(
          0,
          (originalInputs.dietDetails?.chickenServingsPerWeek || 0) * reductionFactor,
        ),
        lambServingsPerWeek: Math.max(0, (originalInputs.dietDetails?.lambServingsPerWeek || 0) * reductionFactor),
      }
    }

    // Apply shopping reduction - fix for all shopping categories
    if (shoppingSlider > 0 && modifiedInputs.shopping) {
      const reductionFactor = 1 - shoppingSlider / 100
      modifiedInputs.shopping = {
        clothingSpend: Math.max(0, originalInputs.shopping.clothingSpend * reductionFactor),
        electronicsSpend: Math.max(0, originalInputs.shopping.electronicsSpend * reductionFactor),
        generalSpend: Math.max(0, originalInputs.shopping.generalSpend * reductionFactor),
      }
    }

    console.log("[v0] Modified inputs:", modifiedInputs)
    const result = calculateCarbonFootprint(modifiedInputs)
    console.log("[v0] Modified result:", result)
    return result
  }, [originalInputs, renewableSlider, drivingSlider, meatSlider, shoppingSlider])

  const scenarios = [
    {
      id: "renewable_energy",
      title: "Switch to Renewable Energy",
      icon: <Zap className="w-5 h-5" />,
      description: "Increase renewable energy percentage",
      currentValue: renewableSlider,
      maxValue: 100,
      unit: "%",
      onChange: setRenewableSlider,
      color: "text-green-600",
    },
    {
      id: "reduce_driving",
      title: "Reduce Driving",
      icon: <Car className="w-5 h-5" />,
      description: "Reduce car travel by percentage",
      currentValue: drivingSlider,
      maxValue: 100,
      unit: "%",
      onChange: setDrivingSlider,
      color: "text-blue-600",
    },
    {
      id: "reduce_meat",
      title: "Reduce Meat Consumption",
      icon: <Utensils className="w-5 h-5" />,
      description: "Reduce meat servings by percentage",
      currentValue: meatSlider,
      maxValue: 100,
      unit: "%",
      onChange: setMeatSlider,
      color: "text-orange-600",
    },
    {
      id: "reduce_shopping",
      title: "Reduce Shopping",
      icon: <ShoppingBag className="w-5 h-5" />,
      description: "Reduce overall spending by percentage",
      currentValue: shoppingSlider,
      maxValue: 80,
      unit: "%",
      onChange: setShoppingSlider,
      color: "text-purple-600",
    },
  ]

  const totalReduction = originalResult.annual.total - modifiedResult.annual.total
  const percentageReduction = (totalReduction / originalResult.annual.total) * 100

  const resetAllScenarios = () => {
    setRenewableSlider(originalInputs.energyDetails?.renewablePercent || 0)
    setDrivingSlider(0)
    setMeatSlider(0)
    setShoppingSlider(0)
  }

  const getScenarioImpact = (scenarioId: string, value: number) => {
    if (value === 0) return 0

    const tempInputs = { ...originalInputs }

    switch (scenarioId) {
      case "renewable_energy":
        if (tempInputs.energyDetails) {
          tempInputs.energyDetails.renewablePercent = value
        }
        break
      case "reduce_driving":
        if (tempInputs.commute) {
          tempInputs.commute = tempInputs.commute.map((transport) => {
            if (
              transport.mode.toLowerCase().includes("car") ||
              transport.mode.toLowerCase().includes("drive") ||
              transport.mode.toLowerCase().includes("suv") ||
              transport.mode.toLowerCase().includes("truck")
            ) {
              return { ...transport, miles: transport.miles * (1 - value / 100) }
            }
            return transport
          })
        }
        break
      case "reduce_meat":
        if (tempInputs.dietDetails) {
          const factor = 1 - value / 100
          tempInputs.dietDetails = {
            ...tempInputs.dietDetails,
            beefServingsPerWeek: (originalInputs.dietDetails?.beefServingsPerWeek || 0) * factor,
            porkServingsPerWeek: (originalInputs.dietDetails?.porkServingsPerWeek || 0) * factor,
            chickenServingsPerWeek: (originalInputs.dietDetails?.chickenServingsPerWeek || 0) * factor,
            lambServingsPerWeek: (originalInputs.dietDetails?.lambServingsPerWeek || 0) * factor,
          }
        }
        break
      case "reduce_shopping":
        if (tempInputs.shopping) {
          const factor = 1 - value / 100
          tempInputs.shopping = {
            clothingSpend: originalInputs.shopping.clothingSpend * factor,
            electronicsSpend: originalInputs.shopping.electronicsSpend * factor,
            generalSpend: originalInputs.shopping.generalSpend * factor,
          }
        }
        break
    }

    const tempResult = calculateCarbonFootprint(tempInputs)
    return originalResult.annual.total - tempResult.annual.total
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
        <div className="p-6 rounded-lg bg-gradient-to-r from-muted/50 to-muted/30 border-2 border-muted">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-foreground text-lg">Combined Impact</span>
            <div className="flex items-center gap-2">
              {totalReduction > 0 ? (
                <TrendingDown className="w-5 h-5 text-green-600" />
              ) : totalReduction < 0 ? (
                <TrendingUp className="w-5 h-5 text-red-600" />
              ) : null}
              <Badge
                variant={totalReduction > 0 ? "default" : totalReduction < 0 ? "destructive" : "secondary"}
                className="text-sm px-3 py-1"
              >
                {totalReduction > 0 ? "-" : totalReduction < 0 ? "+" : ""}
                {Math.abs(totalReduction).toFixed(0)} kg CO₂e/year
              </Badge>
            </div>
          </div>
          <div className="text-sm text-muted-foreground mb-2">
            {percentageReduction > 0 ? (
              <>🎉 Reduction of {percentageReduction.toFixed(1)}% from your current footprint</>
            ) : percentageReduction < 0 ? (
              <>⚠️ This would increase your footprint by {Math.abs(percentageReduction).toFixed(1)}%</>
            ) : (
              <>No changes applied yet - adjust the sliders to see potential impacts</>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Original:</div>
              <div className="text-lg font-semibold text-foreground">
                {(originalResult.annual.total / 1000).toFixed(1)} tonnes CO₂e
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">New Total:</div>
              <div
                className={`text-lg font-semibold ${
                  totalReduction > 0 ? "text-green-600" : totalReduction < 0 ? "text-red-600" : "text-foreground"
                }`}
              >
                {(modifiedResult.annual.total / 1000).toFixed(1)} tonnes CO₂e
              </div>
            </div>
          </div>
        </div>

        {/* Scenario Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scenarios.map((scenario) => {
            const scenarioImpact = getScenarioImpact(scenario.id, scenario.currentValue)
            return (
              <Card key={scenario.id} className="p-4 border-2 hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center ${scenario.color}`}
                  >
                    {scenario.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{scenario.title}</div>
                    <div className="text-sm text-muted-foreground">{scenario.description}</div>
                  </div>
                  {scenarioImpact > 0 && (
                    <Badge variant="outline" className="text-xs">
                      -{scenarioImpact.toFixed(0)} kg/yr
                    </Badge>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Current:{" "}
                      <span className="font-medium text-foreground">
                        {scenario.currentValue.toFixed(0)}
                        {scenario.unit}
                      </span>
                    </span>
                    <span className="text-muted-foreground">
                      Max: {scenario.maxValue}
                      {scenario.unit}
                    </span>
                  </div>
                  <Slider
                    value={[scenario.currentValue]}
                    onValueChange={([value]) => scenario.onChange(value)}
                    max={scenario.maxValue}
                    step={scenario.maxValue >= 100 ? 5 : 1}
                    className="mt-2"
                  />
                </div>
              </Card>
            )
          })}
        </div>

        {/* Reset Button */}
        <div className="text-center pt-4">
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

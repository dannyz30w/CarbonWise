"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Plus, Minus, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { CarbonInputs } from "@/lib/carbon-calculator"

interface CalculationWizardProps {
  onComplete: (inputs: CarbonInputs) => void
  initialInputs?: CarbonInputs
}

const parsePositiveNumber = (value: string, fallback = 0, max?: number): number => {
  const num = Number.parseFloat(value)
  if (!Number.isFinite(num) || num < 0) return fallback
  if (max !== undefined && num > max) return max
  return num
}

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC",
]

export function CalculationWizard({ onComplete, initialInputs }: CalculationWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [inputs, setInputs] = useState<CarbonInputs>(
    initialInputs || {
      householdSize: 1,
      state: "CA",
      commute: [{ mode: "car_gasoline", miles: 0, daysPerWeek: 5 }],
      flights: [],
      dietProfile: "average_omnivore",
      dietDetails: {
        beefServingsPerWeek: 3,
        porkServingsPerWeek: 2,
        chickenServingsPerWeek: 4,
        fishServingsPerWeek: 2,
        dairyServingsPerDay: 3,
        eggsPerWeek: 6,
        localFoodPercent: 20,
        organicFoodPercent: 10,
        processedFoodPercent: 40,
        foodWastePercent: 25,
      },
      energy: { electricityKwh: 0, naturalGasTherms: 0, heatingOilGallons: 0, propaneGallons: 0 },
      energyDetails: {
        homeType: "apartment",
        homeSize: 1200,
        heatingType: "gas",
        coolingType: "electric",
        waterHeaterType: "gas",
        renewablePercent: 0,
        energyEfficiencyRating: "average",
      },
      shopping: { clothingSpend: 0, electronicsSpend: 0, generalSpend: 0 },
      shoppingDetails: {
        newClothingItems: 20,
        secondhandClothingPercent: 10,
        electronicsReplacementYears: 4,
        carReplacementYears: 10,
        repairVsReplacePercent: 30,
        packagesPerMonth: 8,
        localShoppingPercent: 40,
      },
      waste: { totalKg: 0, recyclePercent: 0, compostPercent: 0 },
      water: { tapLiters: 0, bottledLiters: 0, showerMinutes: 0 },
    },
  )

  const steps = [
    { id: "profile", title: "Profile", icon: "👤", description: "Basic household information" },
    { id: "transport", title: "Transportation", icon: "🚗", description: "Daily commuting and travel" },
    { id: "flights", title: "Air Travel", icon: "✈️", description: "Flights and long-distance travel" },
    { id: "diet", title: "Diet & Food", icon: "🍽️", description: "Detailed dietary habits" },
    { id: "energy", title: "Home Energy", icon: "⚡", description: "Electricity, heating, and cooling" },
    { id: "shopping", title: "Consumption", icon: "🛍️", description: "Shopping and purchasing habits" },
    { id: "waste", title: "Waste", icon: "🗑️", description: "Waste generation and recycling" },
    { id: "water", title: "Water", icon: "💧", description: "Water usage and consumption" },
  ]

  const progress = ((currentStep + 1) / steps.length) * 100

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(inputs)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const addTransportMode = () => {
    setInputs({
      ...inputs,
      commute: [...inputs.commute, { mode: "car_gasoline", miles: 0, daysPerWeek: 5 }],
    })
  }

  const removeTransportMode = (index: number) => {
    const newCommute = inputs.commute.filter((_, i) => i !== index)
    setInputs({ ...inputs, commute: newCommute })
  }

  const updateTransportMode = (index: number, field: string, value: any) => {
    const newCommute = [...inputs.commute]
    newCommute[index] = { ...newCommute[index], [field]: value }
    setInputs({ ...inputs, commute: newCommute })
  }

  const LabelWithUnit = ({
    htmlFor,
    children,
    unit,
    tooltip,
  }: { htmlFor: string; children: React.ReactNode; unit?: string; tooltip?: string }) => (
    <div className="flex items-center gap-2">
      <Label htmlFor={htmlFor} className="text-foreground">
        {children}
        {unit && <span className="text-muted-foreground font-normal"> ({unit})</span>}
      </Label>
      {tooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Calculate Your Carbon Footprint
          </h2>
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        <Progress value={progress} className="h-3 mb-4" />
        <div className="flex justify-between text-xs text-muted-foreground">
          {steps.map((step, index) => (
            <div key={step.id} className={`text-center ${index <= currentStep ? "text-primary font-medium" : ""}`}>
              <div className="text-lg mb-1">{step.icon}</div>
              <div className="hidden md:block">{step.title}</div>
            </div>
          ))}
        </div>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="text-3xl">{steps[currentStep].icon}</span>
            <div>
              <div>{steps[currentStep].title}</div>
              <CardDescription className="text-base">{steps[currentStep].description}</CardDescription>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Step */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <LabelWithUnit
                    htmlFor="householdSize"
                    unit="people"
                    tooltip="Number of people living in your household. This helps calculate per-person emissions for shared resources like energy and waste."
                  >
                    Household Size
                  </LabelWithUnit>
                  <Select
                    value={inputs.householdSize.toString()}
                    onValueChange={(value) => setInputs({ ...inputs, householdSize: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size} {size === 1 ? "person" : "people"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <LabelWithUnit
                    htmlFor="state"
                    tooltip="Your state determines the carbon intensity of your electricity grid. Different states have different mixes of renewable vs fossil fuel energy."
                  >
                    State/Region
                  </LabelWithUnit>
                  <Select value={inputs.state} onValueChange={(value) => setInputs({ ...inputs, state: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Transportation Step - Enhanced */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Transportation Modes</h3>
                <Button onClick={addTransportMode} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Mode
                </Button>
              </div>

              {inputs.commute.map((transport, index) => (
                <Card key={index} className="p-4 border-2">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-foreground">Transportation Mode {index + 1}</h4>
                    {inputs.commute.length > 1 && (
                      <Button onClick={() => removeTransportMode(index)} size="sm" variant="destructive">
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <LabelWithUnit tooltip="Choose your primary mode of transportation for this trip">
                        Mode of Transport
                      </LabelWithUnit>
                      <Select
                        value={transport.mode}
                        onValueChange={(value) => updateTransportMode(index, "mode", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="car_gasoline">🚗 Car (Gasoline)</SelectItem>
                          <SelectItem value="car_electric">🔋 Electric Car</SelectItem>
                          <SelectItem value="car_hybrid">🌿 Hybrid Car</SelectItem>
                          <SelectItem value="car_diesel">⛽ Car (Diesel)</SelectItem>
                          <SelectItem value="motorcycle">🏍️ Motorcycle</SelectItem>
                          <SelectItem value="bus">🚌 Bus</SelectItem>
                          <SelectItem value="train_commuter">🚊 Commuter Train</SelectItem>
                          <SelectItem value="train_subway">🚇 Subway/Metro</SelectItem>
                          <SelectItem value="bike">🚴 Bicycle</SelectItem>
                          <SelectItem value="walk">🚶 Walking</SelectItem>
                          <SelectItem value="rideshare">🚕 Rideshare/Taxi</SelectItem>
                          <SelectItem value="carpool">👥 Carpool</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <LabelWithUnit
                        unit="miles"
                        tooltip="One-way distance for this trip. For round trips, enter the one-way distance - we'll calculate the return automatically."
                      >
                        Distance per Trip
                      </LabelWithUnit>
                      <Input
                        type="number"
                        value={transport.miles}
                        onChange={(e) =>
                          updateTransportMode(index, "miles", parsePositiveNumber(e.target.value, 0, 500))
                        }
                        placeholder="e.g., 15"
                        min="0"
                        max="500"
                      />
                    </div>

                    <div>
                      <LabelWithUnit
                        unit="days"
                        tooltip="How many days per week do you make this trip? We'll calculate round trips automatically."
                      >
                        Days per Week
                      </LabelWithUnit>
                      <Select
                        value={transport.daysPerWeek?.toString() || "5"}
                        onValueChange={(value) => updateTransportMode(index, "daysPerWeek", Number.parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                            <SelectItem key={days} value={days.toString()}>
                              {days} days
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Flights Step */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <LabelWithUnit
                  htmlFor="shortFlights"
                  unit="flights/year"
                  tooltip="Flights under 300 miles, typically regional or short domestic flights. Each flight counts as one-way."
                >
                  Short Flights (&lt;300 miles)
                </LabelWithUnit>
                <Input
                  id="shortFlights"
                  type="number"
                  placeholder="e.g., 2"
                  min="0"
                  max="50"
                  onChange={(e) => {
                    const trips = parsePositiveNumber(e.target.value, 0, 50)
                    const newFlights = [...inputs.flights]
                    const existingIndex = newFlights.findIndex((f) => f.distance === 250)
                    if (existingIndex >= 0) {
                      newFlights[existingIndex] = { distance: 250, trips, class: "economy" }
                    } else if (trips > 0) {
                      newFlights.push({ distance: 250, trips, class: "economy" })
                    }
                    setInputs({ ...inputs, flights: newFlights })
                  }}
                />
              </div>
              <div>
                <LabelWithUnit
                  htmlFor="mediumFlights"
                  unit="flights/year"
                  tooltip="Medium-haul flights between 300-2300 miles, typically cross-country domestic flights."
                >
                  Medium Flights (300-2300 miles)
                </LabelWithUnit>
                <Input
                  id="mediumFlights"
                  type="number"
                  placeholder="e.g., 1"
                  min="0"
                  max="20"
                  onChange={(e) => {
                    const trips = parsePositiveNumber(e.target.value, 0, 20)
                    const newFlights = [...inputs.flights]
                    const existingIndex = newFlights.findIndex((f) => f.distance === 1000)
                    if (existingIndex >= 0) {
                      newFlights[existingIndex] = { distance: 1000, trips, class: "economy" }
                    } else if (trips > 0) {
                      newFlights.push({ distance: 1000, trips, class: "economy" })
                    }
                    setInputs({ ...inputs, flights: newFlights })
                  }}
                />
              </div>
              <div>
                <LabelWithUnit
                  htmlFor="longFlights"
                  unit="flights/year"
                  tooltip="Long-haul flights over 2300 miles, typically international or transcontinental flights."
                >
                  Long Flights (&gt;2300 miles)
                </LabelWithUnit>
                <Input
                  id="longFlights"
                  type="number"
                  placeholder="e.g., 1"
                  min="0"
                  max="10"
                  onChange={(e) => {
                    const trips = parsePositiveNumber(e.target.value, 0, 10)
                    const newFlights = [...inputs.flights]
                    const existingIndex = newFlights.findIndex((f) => f.distance === 3000)
                    if (existingIndex >= 0) {
                      newFlights[existingIndex] = { distance: 3000, trips, class: "economy" }
                    } else if (trips > 0) {
                      newFlights.push({ distance: 3000, trips, class: "economy" })
                    }
                    setInputs({ ...inputs, flights: newFlights })
                  }}
                />
              </div>
            </div>
          )}

          {/* Diet Step - Much More Detailed */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <LabelWithUnit tooltip="Your overall dietary pattern affects your carbon footprint significantly. Meat production, especially beef, has high emissions.">
                  Overall Diet Type
                </LabelWithUnit>
                <Select
                  value={inputs.dietProfile}
                  onValueChange={(value) => setInputs({ ...inputs, dietProfile: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="heavy_meat">🥩 Heavy Meat Eater (10+ servings/week)</SelectItem>
                    <SelectItem value="average_omnivore">🍖 Average Omnivore (6-10 servings/week)</SelectItem>
                    <SelectItem value="low_meat">🥗 Low Meat (2-6 servings/week)</SelectItem>
                    <SelectItem value="pescatarian">🐟 Pescatarian (fish only)</SelectItem>
                    <SelectItem value="vegetarian">🥬 Vegetarian (no meat/fish)</SelectItem>
                    <SelectItem value="vegan">🌱 Vegan (no animal products)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {inputs.dietProfile !== "vegan" && inputs.dietProfile !== "vegetarian" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <LabelWithUnit
                      unit="servings/week"
                      tooltip="Beef has the highest carbon footprint of all foods. One serving = 3-4 oz (85-113g)."
                    >
                      Beef Servings: {inputs.dietDetails?.beefServingsPerWeek || 0}
                    </LabelWithUnit>
                    <Slider
                      value={[inputs.dietDetails?.beefServingsPerWeek || 0]}
                      onValueChange={([value]) =>
                        setInputs({
                          ...inputs,
                          dietDetails: { ...inputs.dietDetails, beefServingsPerWeek: value },
                        })
                      }
                      max={14}
                      step={0.5}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <LabelWithUnit
                      unit="servings/week"
                      tooltip="Chicken has a lower carbon footprint than red meat. One serving = 3-4 oz (85-113g)."
                    >
                      Chicken Servings: {inputs.dietDetails?.chickenServingsPerWeek || 0}
                    </LabelWithUnit>
                    <Slider
                      value={[inputs.dietDetails?.chickenServingsPerWeek || 0]}
                      onValueChange={([value]) =>
                        setInputs({
                          ...inputs,
                          dietDetails: { ...inputs.dietDetails, chickenServingsPerWeek: value },
                        })
                      }
                      max={14}
                      step={0.5}
                      className="mt-2"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <LabelWithUnit
                    unit="%"
                    tooltip="Local and seasonal foods have lower transportation emissions. Includes farmers markets, local farms, and seasonal produce."
                  >
                    Local/Seasonal Food: {inputs.dietDetails?.localFoodPercent || 0}%
                  </LabelWithUnit>
                  <Slider
                    value={[inputs.dietDetails?.localFoodPercent || 0]}
                    onValueChange={([value]) =>
                      setInputs({
                        ...inputs,
                        dietDetails: { ...inputs.dietDetails, localFoodPercent: value },
                      })
                    }
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                </div>

                <div>
                  <LabelWithUnit
                    unit="%"
                    tooltip="Food waste generates methane in landfills. Reducing waste is one of the most impactful actions you can take."
                  >
                    Food Waste: {inputs.dietDetails?.foodWastePercent || 0}%
                  </LabelWithUnit>
                  <Slider
                    value={[inputs.dietDetails?.foodWastePercent || 0]}
                    onValueChange={([value]) =>
                      setInputs({
                        ...inputs,
                        dietDetails: { ...inputs.dietDetails, foodWastePercent: value },
                      })
                    }
                    max={50}
                    step={5}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Energy Step */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <LabelWithUnit
                  htmlFor="electricity"
                  unit="kWh/month"
                  tooltip="Check your electricity bill for kWh usage. Average US household uses 877 kWh/month. This will be adjusted for your household size."
                >
                  Monthly Electricity Usage
                </LabelWithUnit>
                <Input
                  id="electricity"
                  type="number"
                  placeholder="e.g., 800"
                  value={inputs.energy.electricityKwh}
                  min="0"
                  max="5000"
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      energy: { ...inputs.energy, electricityKwh: parsePositiveNumber(e.target.value, 0, 5000) },
                    })
                  }
                />
              </div>
              <div>
                <LabelWithUnit
                  htmlFor="gas"
                  unit="therms/month"
                  tooltip="Natural gas usage from your utility bill. One therm = 100,000 BTU. Average US household uses 40-80 therms/month."
                >
                  Monthly Natural Gas Usage
                </LabelWithUnit>
                <Input
                  id="gas"
                  type="number"
                  placeholder="e.g., 50"
                  value={inputs.energy.naturalGasTherms}
                  min="0"
                  max="500"
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      energy: { ...inputs.energy, naturalGasTherms: parsePositiveNumber(e.target.value, 0, 500) },
                    })
                  }
                />
              </div>
            </div>
          )}

          {/* Shopping Step */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <LabelWithUnit
                  htmlFor="clothing"
                  unit="$/year"
                  tooltip="Annual spending on new clothing. Fast fashion has higher emissions than quality, durable clothing."
                >
                  Annual Clothing Spending
                </LabelWithUnit>
                <Input
                  id="clothing"
                  type="number"
                  placeholder="e.g., 500"
                  value={inputs.shopping.clothingSpend}
                  min="0"
                  max="10000"
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      shopping: { ...inputs.shopping, clothingSpend: parsePositiveNumber(e.target.value, 0, 10000) },
                    })
                  }
                />
              </div>
              <div>
                <LabelWithUnit
                  htmlFor="electronics"
                  unit="$/year"
                  tooltip="Spending on phones, computers, TVs, and other electronics. Manufacturing electronics has high carbon intensity."
                >
                  Annual Electronics Spending
                </LabelWithUnit>
                <Input
                  id="electronics"
                  type="number"
                  placeholder="e.g., 800"
                  value={inputs.shopping.electronicsSpend}
                  min="0"
                  max="20000"
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      shopping: { ...inputs.shopping, electronicsSpend: parsePositiveNumber(e.target.value, 0, 20000) },
                    })
                  }
                />
              </div>
              <div>
                <LabelWithUnit
                  htmlFor="general"
                  unit="$/year"
                  tooltip="Other purchases including furniture, home goods, books, and miscellaneous items."
                >
                  Annual General Shopping
                </LabelWithUnit>
                <Input
                  id="general"
                  type="number"
                  placeholder="e.g., 2000"
                  value={inputs.shopping.generalSpend}
                  min="0"
                  max="50000"
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      shopping: { ...inputs.shopping, generalSpend: parsePositiveNumber(e.target.value, 0, 50000) },
                    })
                  }
                />
              </div>
            </div>
          )}

          {/* Waste Step */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div>
                <LabelWithUnit
                  htmlFor="wasteTotal"
                  unit="kg/week"
                  tooltip="Total household waste including all trash, recycling, and compost. Average US household generates 30-50 kg/week."
                >
                  Weekly Waste Generation
                </LabelWithUnit>
                <Input
                  id="wasteTotal"
                  type="number"
                  placeholder="e.g., 10"
                  value={inputs.waste.totalKg}
                  min="0"
                  max="200"
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      waste: { ...inputs.waste, totalKg: parsePositiveNumber(e.target.value, 0, 200) },
                    })
                  }
                />
              </div>
              <div>
                <LabelWithUnit
                  htmlFor="recycle"
                  unit="%"
                  tooltip="Percentage of waste that gets recycled. Recycling reduces emissions by avoiding virgin material production."
                >
                  Recycling Percentage
                </LabelWithUnit>
                <Input
                  id="recycle"
                  type="number"
                  placeholder="e.g., 30"
                  value={inputs.waste.recyclePercent}
                  min="0"
                  max="100"
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      waste: { ...inputs.waste, recyclePercent: parsePositiveNumber(e.target.value, 0, 100) },
                    })
                  }
                />
              </div>
              <div>
                <LabelWithUnit
                  htmlFor="compost"
                  unit="%"
                  tooltip="Percentage of organic waste that gets composted. Composting prevents methane emissions from landfills."
                >
                  Composting Percentage
                </LabelWithUnit>
                <Input
                  id="compost"
                  type="number"
                  placeholder="e.g., 20"
                  value={inputs.waste.compostPercent}
                  min="0"
                  max="100"
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      waste: { ...inputs.waste, compostPercent: parsePositiveNumber(e.target.value, 0, 100) },
                    })
                  }
                />
              </div>
            </div>
          )}

          {/* Water Step */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <div>
                <LabelWithUnit
                  htmlFor="tapWater"
                  unit="liters/day"
                  tooltip="Daily tap water consumption including drinking, cooking, and other uses. Average person uses 150-300 liters/day."
                >
                  Daily Tap Water Consumption
                </LabelWithUnit>
                <Input
                  id="tapWater"
                  type="number"
                  placeholder="e.g., 150"
                  value={inputs.water.tapLiters}
                  min="0"
                  max="1000"
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      water: { ...inputs.water, tapLiters: parsePositiveNumber(e.target.value, 0, 1000) },
                    })
                  }
                />
              </div>
              <div>
                <LabelWithUnit
                  htmlFor="bottledWater"
                  unit="liters/day"
                  tooltip="Bottled water has 1000x higher carbon footprint than tap water due to plastic production and transportation."
                >
                  Daily Bottled Water
                </LabelWithUnit>
                <Input
                  id="bottledWater"
                  type="number"
                  placeholder="e.g., 1"
                  value={inputs.water.bottledLiters}
                  min="0"
                  max="20"
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      water: { ...inputs.water, bottledLiters: parsePositiveNumber(e.target.value, 0, 20) },
                    })
                  }
                />
              </div>
              <div>
                <LabelWithUnit
                  htmlFor="shower"
                  unit="minutes/day"
                  tooltip="Daily shower time. Heating water for showers is energy-intensive. Average shower is 8-10 minutes."
                >
                  Daily Shower Time
                </LabelWithUnit>
                <Input
                  id="shower"
                  type="number"
                  placeholder="e.g., 10"
                  value={inputs.water.showerMinutes}
                  min="0"
                  max="60"
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      water: { ...inputs.water, showerMinutes: parsePositiveNumber(e.target.value, 0, 60) },
                    })
                  }
                />
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
              Previous
            </Button>
            <Button onClick={nextStep} className="animate-pulse-green">
              {currentStep === steps.length - 1 ? "Calculate Results" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

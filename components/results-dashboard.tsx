"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import type { CarbonResult, CarbonInputs } from "@/lib/carbon-calculator"
import { CarbonMeter } from "./carbon-meter"
import { WorldMap } from "./world-map"
import { WhatIfSliders } from "./what-if-sliders"
import { CalculationStorage } from "@/lib/storage"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingDown, TrendingUp, Target, Lightbulb, Save, BookOpen } from "lucide-react"

interface ResultsDashboardProps {
  result: CarbonResult
  onReset: () => void
  inputs: CarbonInputs
}

const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4"]

export function ResultsDashboard({ result, onReset, inputs }: ResultsDashboardProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [calculationName, setCalculationName] = useState("")
  const [showMethodology, setShowMethodology] = useState(false)

  const categoryData = [
    {
      name: "Transportation",
      value: Number((result.annual.transport / 1000).toFixed(2)),
      color: "#10B981",
      percentage: ((result.annual.transport / result.annual.total) * 100).toFixed(1),
    },
    {
      name: "Flights",
      value: Number((result.annual.flights / 1000).toFixed(2)),
      color: "#3B82F6",
      percentage: ((result.annual.flights / result.annual.total) * 100).toFixed(1),
    },
    {
      name: "Diet",
      value: Number((result.annual.diet / 1000).toFixed(2)),
      color: "#F59E0B",
      percentage: ((result.annual.diet / result.annual.total) * 100).toFixed(1),
    },
    {
      name: "Energy",
      value: Number((result.annual.energy / 1000).toFixed(2)),
      color: "#EF4444",
      percentage: ((result.annual.energy / result.annual.total) * 100).toFixed(1),
    },
    {
      name: "Shopping",
      value: Number((result.annual.shopping / 1000).toFixed(2)),
      color: "#8B5CF6",
      percentage: ((result.annual.shopping / result.annual.total) * 100).toFixed(1),
    },
    {
      name: "Waste",
      value: Number((result.annual.waste / 1000).toFixed(2)),
      color: "#EC4899",
      percentage: ((result.annual.waste / result.annual.total) * 100).toFixed(1),
    },
    {
      name: "Water",
      value: Number((result.annual.water / 1000).toFixed(2)),
      color: "#06B6D4",
      percentage: ((result.annual.water / result.annual.total) * 100).toFixed(1),
    },
  ]
    .filter((item) => item.value > 0.01) // Only show categories with meaningful emissions
    .sort((a, b) => b.value - a.value)

  const comparisonData = [
    { name: "Your Footprint", value: Number((result.annual.total / 1000).toFixed(1)), color: "#10B981" },
    { name: "US Average", value: 16.0, color: "#EF4444" },
    { name: "Global Average", value: 4.8, color: "#3B82F6" },
    { name: "Paris Target", value: 2.3, color: "#F59E0B" },
  ]

  const saveCalculation = () => {
    if (calculationName.trim()) {
      CalculationStorage.saveCalculation(calculationName.trim(), inputs, result)
      setSaveDialogOpen(false)
      setCalculationName("")
    }
  }

  const getComparisonIcon = (percentage: number) => {
    if (percentage < 0) return <TrendingDown className="w-4 h-4 text-success" />
    return <TrendingUp className="w-4 h-4 text-destructive" />
  }

  const getComparisonColor = (percentage: number) => {
    if (percentage < -20) return "bg-success/20 text-success border-success"
    if (percentage < 0) return "bg-success/10 text-success border-success"
    if (percentage < 20) return "bg-warning/20 text-warning border-warning"
    return "bg-destructive/20 text-destructive border-destructive"
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full animate-pulse"></div>
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-accent/5 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-40 left-1/4 w-20 h-20 bg-success/5 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 right-1/3 w-28 h-28 bg-warning/5 rounded-full animate-bounce"
          style={{ animationDelay: "3s" }}
        ></div>

        {/* Animated globe-like elements */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-5">
          <div
            className="w-full h-full rounded-full border-2 border-primary animate-spin"
            style={{ animationDuration: "20s" }}
          ></div>
          <div
            className="absolute inset-8 rounded-full border border-accent animate-spin"
            style={{ animationDuration: "15s", animationDirection: "reverse" }}
          ></div>
          <div
            className="absolute inset-16 rounded-full border border-success animate-spin"
            style={{ animationDuration: "10s" }}
          ></div>
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-4 relative z-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Your Carbon Footprint Results
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Based on your lifestyle inputs, here's your estimated annual carbon footprint and personalized recommendations
          for reduction.
        </p>
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMethodology(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            View Methodology & Data Sources
          </Button>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <Card className="glass animate-float">
          <CardContent className="p-6">
            <CarbonMeter value={result.daily.total} maxValue={50} label="Daily Footprint" unit="kg CO₂e" />
          </CardContent>
        </Card>

        <Card className="glass animate-float" style={{ animationDelay: "0.2s" }}>
          <CardContent className="p-6">
            <CarbonMeter value={result.annual.total / 1000} maxValue={20} label="Annual Footprint" unit="tonnes CO₂e" />
          </CardContent>
        </Card>

        <Card className="glass animate-float" style={{ animationDelay: "0.4s" }}>
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <Target className="w-12 h-12 mx-auto text-primary" />
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {result.comparisons.vsParisTarget > 0 ? "+" : ""}
                  {result.comparisons.vsParisTarget.toFixed(0)}%
                </div>
                <div className="text-sm text-muted-foreground">vs Paris Target</div>
              </div>
              <Badge className={getComparisonColor(result.comparisons.vsParisTarget)}>
                {result.comparisons.vsParisTarget < 0 ? "Below Target" : "Above Target"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* What-If Sliders */}
      <div className="relative z-10">
        <WhatIfSliders originalInputs={inputs} originalResult={result} />
      </div>

      {/* Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Emissions Breakdown</CardTitle>
            <CardDescription>Your carbon footprint by category (tonnes CO₂e/year)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className="font-medium text-foreground">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">{category.value} tonnes</div>
                    <div className="text-sm text-muted-foreground">{category.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Global Comparison</CardTitle>
            <CardDescription>How you compare to global averages (tonnes CO₂e/year)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`${Number(value).toFixed(1)} tonnes CO₂e`, "Annual Emissions"]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* World Map */}
      <div className="relative z-10">
        <WorldMap userEmissions={result.annual.total} />
      </div>

      {/* Comparisons */}
      <Card className="glass relative z-10">
        <CardHeader>
          <CardTitle>Detailed Comparisons</CardTitle>
          <CardDescription>See how your footprint compares to key benchmarks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <div className="font-medium text-foreground">vs US Average</div>
                <div className="text-sm text-muted-foreground">16.0 tonnes CO₂e/year</div>
              </div>
              <div className="flex items-center gap-2">
                {getComparisonIcon(result.comparisons.vsUSAverage)}
                <Badge className={getComparisonColor(result.comparisons.vsUSAverage)}>
                  {result.comparisons.vsUSAverage > 0 ? "+" : ""}
                  {result.comparisons.vsUSAverage.toFixed(0)}%
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <div className="font-medium text-foreground">vs Global Average</div>
                <div className="text-sm text-muted-foreground">4.8 tonnes CO₂e/year</div>
              </div>
              <div className="flex items-center gap-2">
                {getComparisonIcon(result.comparisons.vsGlobalAverage)}
                <Badge className={getComparisonColor(result.comparisons.vsGlobalAverage)}>
                  {result.comparisons.vsGlobalAverage > 0 ? "+" : ""}
                  {result.comparisons.vsGlobalAverage.toFixed(0)}%
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <div className="font-medium text-foreground">vs Paris Target</div>
                <div className="text-sm text-muted-foreground">2.3 tonnes CO₂e/year</div>
              </div>
              <div className="flex items-center gap-2">
                {getComparisonIcon(result.comparisons.vsParisTarget)}
                <Badge className={getComparisonColor(result.comparisons.vsParisTarget)}>
                  {result.comparisons.vsParisTarget < 0 ? "Below Target" : "Above Target"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggestions */}
      <Card className="glass relative z-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Personalized Recommendations
          </CardTitle>
          <CardDescription>Top actions to reduce your carbon footprint</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {result.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">{suggestion.category}</Badge>
                    <Badge
                      variant={
                        suggestion.difficulty === "easy"
                          ? "default"
                          : suggestion.difficulty === "medium"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {suggestion.difficulty}
                    </Badge>
                  </div>
                  <div className="font-medium mb-1 text-foreground">{suggestion.action}</div>
                  <div className="text-sm text-muted-foreground">
                    Potential savings:{" "}
                    <span className="font-medium text-green-600">
                      {suggestion.savingsKgPerYear.toFixed(0)} kg CO₂e/year
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-center relative z-10">
        <Button onClick={onReset} variant="outline">
          Calculate Again
        </Button>

        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
              <Save className="w-4 h-4 mr-2" />
              Save This Calculation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Your Carbon Footprint Calculation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Give this calculation a memorable name to track your progress over time.
                </p>
                <Input
                  placeholder="e.g., 'January 2025 - Before Changes'"
                  value={calculationName}
                  onChange={(e) => setCalculationName(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={saveCalculation} disabled={!calculationName.trim()}>
                  Save Calculation
                </Button>
                <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={showMethodology} onOpenChange={setShowMethodology}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Methodology & Data Sources</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Scientific Methodology</h3>
              <p className="text-muted-foreground">
                CARBONWISE uses the latest EPA emission factors (2024) and internationally recognized methodologies for
                calculating personal carbon footprints. All calculations follow the GHG Protocol standards and are based
                on life-cycle assessments.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Data Sources</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>
                  • <strong>Transportation:</strong> EPA 2024 Emission Factors for Greenhouse Gas Inventories
                </li>
                <li>
                  • <strong>Electricity:</strong> eGRID 2023 database with state-specific grid factors
                </li>
                <li>
                  • <strong>Food:</strong> FAO studies and peer-reviewed LCA research
                </li>
                <li>
                  • <strong>Consumer goods:</strong> DEFRA and EPA lifecycle emission factors
                </li>
                <li>
                  • <strong>Waste:</strong> EPA WARM model for waste management emissions
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Calculation Approach</h3>
              <p className="text-muted-foreground">
                We use the formula: <strong>Emissions = Activity Data × Emission Factor</strong>
              </p>
              <p className="text-muted-foreground mt-2">
                All results are adjusted for household size and include both direct and indirect emissions. Regional
                variations in electricity grid composition are accounted for using state-specific factors.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Accuracy & Limitations</h3>
              <p className="text-muted-foreground">
                Personal carbon calculators provide estimates based on average emission factors. Actual emissions may
                vary based on specific products, behaviors, and local conditions. Results are intended for educational
                purposes and relative comparisons.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Privacy & Data</h3>
              <p className="text-muted-foreground">
                All calculations are performed locally in your browser. No personal data is transmitted to external
                servers. Saved calculations are stored locally on your device only.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

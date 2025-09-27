"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import type { CarbonResult } from "@/lib/carbon-calculator"
import { CarbonMeter } from "./carbon-meter"
import { WorldMap } from "./world-map"
import { CalculationStorage } from "@/lib/storage"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { TrendingDown, TrendingUp, Target, Lightbulb, Share2, Download, Save } from "lucide-react"

interface ResultsDashboardProps {
  result: CarbonResult
  onReset: () => void
  inputs: any
}

const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4"]

export function ResultsDashboard({ result, onReset, inputs }: ResultsDashboardProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [calculationName, setCalculationName] = useState("")

  const pieData = [
    { name: "Transportation", value: result.annual.transport, color: COLORS[0] },
    { name: "Flights", value: result.annual.flights, color: COLORS[1] },
    { name: "Diet", value: result.annual.diet, color: COLORS[2] },
    { name: "Energy", value: result.annual.energy, color: COLORS[3] },
    { name: "Shopping", value: result.annual.shopping, color: COLORS[4] },
    { name: "Waste", value: result.annual.waste, color: COLORS[5] },
    { name: "Water", value: result.annual.water, color: COLORS[6] },
  ].filter((item) => item.value > 0)

  const comparisonData = [
    { name: "Your Footprint", value: result.annual.total, color: COLORS[0] },
    { name: "US Average", value: 16000, color: COLORS[3] },
    { name: "Global Average", value: 4800, color: COLORS[1] },
    { name: "Paris Target", value: 2300, color: COLORS[2] },
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

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    if (percent < 0.05) return null // Don't show labels for very small slices

    return (
      <text
        x={x}
        y={y}
        fill="var(--color-foreground)"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Your Carbon Footprint Results
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Based on your lifestyle inputs, here's your estimated annual carbon footprint and personalized recommendations
          for reduction.
        </p>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Emissions Breakdown</CardTitle>
            <CardDescription>Your carbon footprint by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(0)} kg CO₂e`, "Annual Emissions"]}
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    color: "var(--color-foreground)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Global Comparison</CardTitle>
            <CardDescription>How you compare to global averages</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" tick={{ fill: "var(--color-foreground)", fontSize: 12 }} />
                <YAxis tick={{ fill: "var(--color-foreground)", fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(0)} kg CO₂e`, "Annual Emissions"]}
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    color: "var(--color-foreground)",
                  }}
                />
                <Bar dataKey="value" fill="var(--color-primary)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* World Map */}
      <WorldMap userEmissions={result.annual.total} />

      {/* Comparisons */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Detailed Comparisons</CardTitle>
          <CardDescription>See how your footprint compares to key benchmarks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <div className="font-medium">vs US Average</div>
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
                <div className="font-medium">vs Global Average</div>
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
                <div className="font-medium">vs Paris Target</div>
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
      <Card className="glass">
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
                  <div className="font-medium mb-1">{suggestion.action}</div>
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
      <div className="flex flex-wrap gap-4 justify-center">
        <Button onClick={onReset} variant="outline">
          Calculate Again
        </Button>

        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button className="animate-pulse-green">
              <Save className="w-4 h-4 mr-2" />
              Save Calculation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Your Calculation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter a name for this calculation..."
                value={calculationName}
                onChange={(e) => setCalculationName(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={saveCalculation} disabled={!calculationName.trim()}>
                  Save
                </Button>
                <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="outline">
          <Share2 className="w-4 h-4 mr-2" />
          Share Results
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalculationStorage, type SavedCalculation } from "@/lib/storage"
import { TimelineView } from "./timeline-view"
import { Trash2, Eye, Calendar, TrendingUp, BarChart3 } from "lucide-react"
import type { CarbonInputs, CarbonResult } from "@/lib/carbon-calculator"

interface SavedCalculationsProps {
  onLoadCalculation: (inputs: CarbonInputs) => void
  onCompareCalculations: (calculations: SavedCalculation[]) => void
}

export function SavedCalculations({ onLoadCalculation, onCompareCalculations }: SavedCalculationsProps) {
  const [calculations, setCalculations] = useState<SavedCalculation[]>([])
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([])

  useEffect(() => {
    setCalculations(CalculationStorage.getAllCalculations())
  }, [])

  const deleteCalculation = (id: string) => {
    CalculationStorage.deleteCalculation(id)
    setCalculations(CalculationStorage.getAllCalculations())
    setSelectedForComparison((prev) => prev.filter((calcId) => calcId !== id))
  }

  const toggleComparisonSelection = (id: string) => {
    setSelectedForComparison((prev) => {
      if (prev.includes(id)) {
        return prev.filter((calcId) => calcId !== id)
      } else if (prev.length < 3) {
        return [...prev, id]
      }
      return prev
    })
  }

  const handleCompare = () => {
    const selectedCalcs = calculations.filter((calc) => selectedForComparison.includes(calc.id))
    onCompareCalculations(selectedCalcs)
  }

  if (calculations.length === 0) {
    return (
      <Card className="glass">
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">No saved calculations yet</h3>
            <p className="mb-2">Complete a calculation to save and track your progress over time.</p>
            <p className="text-sm">
              💡 <strong>Tip:</strong> Save multiple calculations to see your timeline and track improvements!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Your Carbon Journey
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Track your progress over time and see the impact of your sustainability efforts.
          {calculations.length < 3 && (
            <span className="block mt-2 text-sm font-medium text-primary">
              💡 Save more calculations to unlock detailed timeline analysis!
            </span>
          )}
        </p>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="grid" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            All Calculations
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Timeline View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {calculations.length} saved calculation{calculations.length !== 1 ? "s" : ""}
              </span>
              {selectedForComparison.length > 0 && (
                <Badge variant="outline">{selectedForComparison.length} selected for comparison</Badge>
              )}
            </div>
            {selectedForComparison.length >= 2 && (
              <Button onClick={handleCompare} className="animate-pulse-green">
                Compare Selected ({selectedForComparison.length})
              </Button>
            )}
          </div>

          {calculations.length >= 2 && selectedForComparison.length === 0 && (
            <div className="p-4 rounded-lg bg-muted/50 border border-dashed">
              <p className="text-sm text-muted-foreground text-center">
                💡 <strong>Tip:</strong> Click on calculation cards to select them for comparison (up to 3 at once)
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {calculations.map((calc) => {
              const result = calc.result as CarbonResult
              const isSelected = selectedForComparison.includes(calc.id)

              return (
                <Card
                  key={calc.id}
                  className={`glass cursor-pointer transition-all hover:scale-105 ${
                    isSelected ? "ring-2 ring-primary shadow-lg" : ""
                  }`}
                  onClick={() => toggleComparisonSelection(calc.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-foreground">{calc.name}</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            onLoadCalculation(calc.inputs)
                          }}
                          title="Load and edit this calculation"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteCalculation(calc.id)
                          }}
                          title="Delete this calculation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(calc.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{(result.annual.total / 1000).toFixed(1)}</div>
                        <div className="text-sm text-muted-foreground">tonnes CO₂e/year</div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">vs US Average:</span>
                          <Badge variant={result.comparisons.vsUSAverage < 0 ? "default" : "destructive"}>
                            {result.comparisons.vsUSAverage > 0 ? "+" : ""}
                            {result.comparisons.vsUSAverage.toFixed(0)}%
                          </Badge>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">vs Paris Target:</span>
                          <Badge variant={result.comparisons.vsParisTarget < 0 ? "default" : "destructive"}>
                            {result.comparisons.vsParisTarget < 0 ? "Below" : "Above"} Target
                          </Badge>
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <div className="text-xs text-muted-foreground">Top emission source:</div>
                        <div className="text-sm font-medium text-foreground">
                          {result.annual.transport > result.annual.energy &&
                          result.annual.transport > result.annual.diet
                            ? "Transportation"
                            : result.annual.energy > result.annual.diet
                              ? "Energy"
                              : "Diet"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <TimelineView />
        </TabsContent>
      </Tabs>
    </div>
  )
}

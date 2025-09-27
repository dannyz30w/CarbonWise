"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalculationStorage, type SavedCalculation } from "@/lib/storage"
import { Trash2, Eye, Calendar } from "lucide-react"
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
            <p>No saved calculations yet.</p>
            <p className="text-sm">Complete a calculation to save and track your progress over time.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Saved Calculations</h2>
        {selectedForComparison.length >= 2 && (
          <Button onClick={handleCompare} className="animate-pulse-green">
            Compare Selected ({selectedForComparison.length})
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {calculations.map((calc) => {
          const result = calc.result as CarbonResult
          const isSelected = selectedForComparison.includes(calc.id)

          return (
            <Card
              key={calc.id}
              className={`glass cursor-pointer transition-all hover:scale-105 ${
                isSelected ? "ring-2 ring-primary" : ""
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
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{new Date(calc.date).toLocaleDateString()}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{(result.annual.total / 1000).toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">tonnes CO₂e/year</div>
                  </div>

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
                      {result.comparisons.vsParisTarget > 0 ? "+" : ""}
                      {result.comparisons.vsParisTarget.toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

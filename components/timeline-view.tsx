"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { CalculationStorage } from "@/lib/storage"
import { TrendingDown, TrendingUp, Calendar } from "lucide-react"
import { useMemo } from "react"

export function TimelineView() {
  const savedCalculations = CalculationStorage.getAllCalculations()

  const timelineData = useMemo(() => {
    return savedCalculations
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((calc) => ({
        date: new Date(calc.date).toLocaleDateString(),
        fullDate: calc.date,
        total: calc.result.annual.total / 1000, // Convert to tonnes
        transport: calc.result.annual.transport / 1000,
        energy: calc.result.annual.energy / 1000,
        diet: calc.result.annual.diet / 1000,
        name: calc.name,
      }))
  }, [savedCalculations])

  if (timelineData.length < 2) {
    return (
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Timeline View
          </CardTitle>
          <CardDescription>Save at least 2 calculations to see your progress over time</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Your carbon footprint timeline will appear here once you have multiple saved calculations.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const latestTotal = timelineData[timelineData.length - 1]?.total || 0
  const previousTotal = timelineData[timelineData.length - 2]?.total || 0
  const change = latestTotal - previousTotal
  const percentChange = previousTotal > 0 ? (change / previousTotal) * 100 : 0

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Your Carbon Footprint Timeline
        </CardTitle>
        <CardDescription>Track your progress over time and see the impact of your changes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="text-sm text-muted-foreground">Latest Footprint</div>
            <div className="text-2xl font-bold">{latestTotal.toFixed(1)} tonnes CO₂e</div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="text-sm text-muted-foreground">Change from Previous</div>
            <div className="flex items-center gap-2">
              {change < 0 ? (
                <TrendingDown className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingUp className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-2xl font-bold ${change < 0 ? "text-green-600" : "text-red-600"}`}>
                {change > 0 ? "+" : ""}
                {change.toFixed(1)} tonnes
              </span>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="text-sm text-muted-foreground">Percentage Change</div>
            <div className={`text-2xl font-bold ${percentChange < 0 ? "text-green-600" : "text-red-600"}`}>
              {percentChange > 0 ? "+" : ""}
              {percentChange.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="date"
                tick={{ fill: "var(--color-foreground)", fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fill: "var(--color-foreground)", fontSize: 12 }}
                label={{ value: "Tonnes CO₂e/year", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value.toFixed(1)} tonnes CO₂e`,
                  name === "total"
                    ? "Total Footprint"
                    : name === "transport"
                      ? "Transportation"
                      : name === "energy"
                        ? "Energy"
                        : name === "diet"
                          ? "Diet"
                          : name,
                ]}
                labelFormatter={(label, payload) => {
                  const data = payload?.[0]?.payload
                  return data ? `${data.name} (${label})` : label
                }}
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  color: "var(--color-foreground)",
                }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="var(--color-primary)"
                strokeWidth={3}
                dot={{ fill: "var(--color-primary)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "var(--color-primary)", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="transport"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="energy"
                stroke="var(--color-chart-2)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="diet"
                stroke="var(--color-chart-3)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span>Total Footprint</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-chart-1" style={{ borderTop: "2px dashed" }}></div>
            <span>Transportation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-chart-2" style={{ borderTop: "2px dashed" }}></div>
            <span>Energy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-chart-3" style={{ borderTop: "2px dashed" }}></div>
            <span>Diet</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

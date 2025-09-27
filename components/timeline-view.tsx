"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { CalculationStorage } from "@/lib/storage"
import { TrendingDown, TrendingUp, Calendar } from "lucide-react"
import { useMemo } from "react"

export function TimelineView() {
  const savedCalculations = CalculationStorage.getAllCalculations()

  const timelineData = useMemo(() => {
    const data = savedCalculations
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((calc, index) => {
        return {
          date: new Date(calc.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: new Date(calc.date).getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
          }),
          fullDate: calc.date,
          total: Number((calc.result?.annual?.total || 0) / 1000), // Convert to tonnes
          transport: Number((calc.result?.annual?.transport || 0) / 1000),
          energy: Number((calc.result?.annual?.energy || 0) / 1000),
          diet: Number((calc.result?.annual?.diet || 0) / 1000),
          flights: Number((calc.result?.annual?.flights || 0) / 1000),
          shopping: Number((calc.result?.annual?.shopping || 0) / 1000),
          name: calc.name,
          index: index + 1,
        }
      })

    return data
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
            <p className="text-xs mt-2">Tip: Try different scenarios and save each one to track your progress!</p>
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
            <div className="text-2xl font-bold text-foreground">{latestTotal.toFixed(1)} tonnes CO₂e</div>
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
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                dataKey="date"
                tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
                stroke="hsl(var(--foreground))"
              />
              <YAxis
                tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                stroke="hsl(var(--foreground))"
                label={{
                  value: "Tonnes CO₂e/year",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle", fill: "hsl(var(--foreground))" },
                }}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${Number(value).toFixed(1)} tonnes CO₂e`,
                  name === "total"
                    ? "Total Footprint"
                    : name === "transport"
                      ? "Transportation"
                      : name === "energy"
                        ? "Energy"
                        : name === "diet"
                          ? "Diet"
                          : name === "flights"
                            ? "Flights"
                            : name === "shopping"
                              ? "Shopping"
                              : name,
                ]}
                labelFormatter={(label, payload) => {
                  const data = payload?.[0]?.payload
                  return data ? `${data.name} (${label})` : label
                }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                labelStyle={{
                  color: "hsl(var(--foreground))",
                  fontWeight: "600",
                }}
              />
              <Legend
                wrapperStyle={{
                  color: "hsl(var(--foreground))",
                  fontSize: "14px",
                }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#10B981"
                strokeWidth={4}
                dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: "#10B981", strokeWidth: 2, fill: "#10B981" }}
                name="Total Footprint"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="transport"
                stroke="#3B82F6"
                strokeWidth={2}
                strokeDasharray="8 4"
                dot={{ fill: "#3B82F6", strokeWidth: 1, r: 4 }}
                name="Transportation"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="energy"
                stroke="#F59E0B"
                strokeWidth={2}
                strokeDasharray="8 4"
                dot={{ fill: "#F59E0B", strokeWidth: 1, r: 4 }}
                name="Energy"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="diet"
                stroke="#EF4444"
                strokeWidth={2}
                strokeDasharray="8 4"
                dot={{ fill: "#EF4444", strokeWidth: 1, r: 4 }}
                name="Diet"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="flights"
                stroke="#8B5CF6"
                strokeWidth={2}
                strokeDasharray="8 4"
                dot={{ fill: "#8B5CF6", strokeWidth: 1, r: 4 }}
                name="Flights"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="shopping"
                stroke="#EC4899"
                strokeWidth={2}
                strokeDasharray="8 4"
                dot={{ fill: "#EC4899", strokeWidth: 1, r: 4 }}
                name="Shopping"
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CountryData {
  name: string
  code: string
  emissions: number
  population: number
  perCapita: number
}

const COUNTRY_DATA: CountryData[] = [
  { name: "United States", code: "US", emissions: 5416, population: 331, perCapita: 16.4 },
  { name: "China", code: "CN", emissions: 10065, population: 1439, perCapita: 7.0 },
  { name: "India", code: "IN", emissions: 2654, population: 1380, perCapita: 1.9 },
  { name: "Russia", code: "RU", emissions: 1711, population: 146, perCapita: 11.7 },
  { name: "Japan", code: "JP", emissions: 1162, population: 126, perCapita: 9.2 },
  { name: "Germany", code: "DE", emissions: 759, population: 83, perCapita: 9.1 },
  { name: "Iran", code: "IR", emissions: 720, population: 84, perCapita: 8.6 },
  { name: "South Korea", code: "KR", emissions: 616, population: 52, perCapita: 11.9 },
  { name: "Saudi Arabia", code: "SA", emissions: 517, population: 35, perCapita: 14.8 },
  { name: "Indonesia", code: "ID", emissions: 615, population: 274, perCapita: 2.2 },
  { name: "Canada", code: "CA", emissions: 672, population: 38, perCapita: 17.7 },
  { name: "Mexico", code: "MX", emissions: 475, population: 129, perCapita: 3.7 },
  { name: "Brazil", code: "BR", emissions: 462, population: 213, perCapita: 2.2 },
  { name: "Australia", code: "AU", emissions: 415, population: 26, perCapita: 16.0 },
  { name: "United Kingdom", code: "GB", emissions: 379, population: 67, perCapita: 5.6 },
  { name: "Turkey", code: "TR", emissions: 353, population: 84, perCapita: 4.2 },
  { name: "Italy", code: "IT", emissions: 330, population: 60, perCapita: 5.5 },
  { name: "France", code: "FR", emissions: 323, population: 68, perCapita: 4.8 },
  { name: "Poland", code: "PL", emissions: 319, population: 38, perCapita: 8.4 },
  { name: "South Africa", code: "ZA", emissions: 456, population: 60, perCapita: 7.6 },
]

export function WorldMap({ userEmissions }: { userEmissions: number }) {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null)
  const [hoveredCountry, setHoveredCountry] = useState<CountryData | null>(null)

  const getEmissionColor = (perCapita: number) => {
    if (perCapita < 3) return "#10B981" // Green
    if (perCapita < 6) return "#F59E0B" // Yellow
    if (perCapita < 10) return "#EF4444" // Red
    return "#7C2D12" // Dark red
  }

  const userPerCapita = userEmissions / 1000

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">🌍 Global Carbon Emissions Map</CardTitle>
        <p className="text-sm text-muted-foreground">
          Compare your footprint ({userPerCapita.toFixed(1)} tonnes CO₂e) with countries worldwide
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "#10B981" }}></div>
              <span>Low (&lt;3t)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "#F59E0B" }}></div>
              <span>Medium (3-6t)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "#EF4444" }}></div>
              <span>High (6-10t)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "#7C2D12" }}></div>
              <span>Very High (&gt;10t)</span>
            </div>
          </div>

          {/* Country Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {COUNTRY_DATA.map((country) => (
              <div
                key={country.code}
                className="p-3 rounded-lg border cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
                style={{
                  backgroundColor: getEmissionColor(country.perCapita) + "20",
                  borderColor: getEmissionColor(country.perCapita),
                }}
                onClick={() => setSelectedCountry(country)}
                onMouseEnter={() => setHoveredCountry(country)}
                onMouseLeave={() => setHoveredCountry(null)}
              >
                <div className="text-sm font-medium text-foreground">{country.name}</div>
                <div className="text-xs text-muted-foreground">{country.perCapita.toFixed(1)} tonnes CO₂e</div>
                {userPerCapita > country.perCapita ? (
                  <Badge variant="destructive" className="text-xs mt-1">
                    +{(((userPerCapita - country.perCapita) / country.perCapita) * 100).toFixed(0)}%
                  </Badge>
                ) : (
                  <Badge variant="default" className="text-xs mt-1 bg-success text-success-foreground">
                    -{(((country.perCapita - userPerCapita) / country.perCapita) * 100).toFixed(0)}%
                  </Badge>
                )}
              </div>
            ))}
          </div>

          {/* Selected Country Details */}
          {selectedCountry && (
            <Card className="border-primary">
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{selectedCountry.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Per Capita:</span>
                    <div className="font-medium">{selectedCountry.perCapita.toFixed(1)} tonnes CO₂e</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Emissions:</span>
                    <div className="font-medium">{selectedCountry.emissions.toLocaleString()} Mt CO₂e</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Population:</span>
                    <div className="font-medium">{selectedCountry.population}M people</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">vs Your Footprint:</span>
                    <div className="font-medium">
                      {userPerCapita > selectedCountry.perCapita ? "+" : ""}
                      {(((userPerCapita - selectedCountry.perCapita) / selectedCountry.perCapita) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

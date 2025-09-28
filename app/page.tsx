"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalculationWizard } from "@/components/calculation-wizard"
import { ResultsDashboard } from "@/components/results-dashboard"
import { SavedCalculations } from "@/components/saved-calculations"
import { calculateCarbonFootprint, type CarbonInputs, type CarbonResult } from "@/lib/carbon-calculator"
import {
  Leaf,
  Calculator,
  TrendingDown,
  Users,
  Globe,
  Target,
  History,
  Sparkles,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Zap,
} from "lucide-react"

export default function Home() {
  const [currentView, setCurrentView] = useState<"landing" | "wizard" | "results" | "saved">("landing")
  const [result, setResult] = useState<CarbonResult | null>(null)
  const [currentInputs, setCurrentInputs] = useState<CarbonInputs | null>(null)
  const [comparisonData, setComparisonData] = useState<any[] | null>(null)

  const handleStartCalculation = () => {
    setCurrentView("wizard")
  }

  const handleCalculationComplete = (inputs: CarbonInputs) => {
    const calculatedResult = calculateCarbonFootprint(inputs)
    setResult(calculatedResult)
    setCurrentInputs(inputs)
    setCurrentView("results")
  }

  const handleReset = () => {
    setCurrentView("landing")
    setResult(null)
    setCurrentInputs(null)
    setComparisonData(null)
  }

  const handleLoadCalculation = (inputs: CarbonInputs) => {
    setCurrentInputs(inputs)
    setCurrentView("wizard")
  }

  const handleViewSaved = () => {
    setCurrentView("saved")
  }

  const handleCompareCalculations = (calculations: any[]) => {
    if (calculations.length >= 2) {
      const comparisonData = calculations.map((calc) => ({
        name: calc.name,
        date: new Date(calc.date).toLocaleDateString(),
        total: (calc.result?.annual?.total || 0) / 1000,
        transport: (calc.result?.annual?.transport || 0) / 1000,
        energy: (calc.result?.annual?.energy || 0) / 1000,
        diet: (calc.result?.annual?.diet || 0) / 1000,
        flights: (calc.result?.annual?.flights || 0) / 1000,
        shopping: (calc.result?.annual?.shopping || 0) / 1000,
        waste: (calc.result?.annual?.waste || 0) / 1000,
        water: (calc.result?.annual?.water || 0) / 1000,
      }))
      setComparisonData(comparisonData)
    }
  }

  if (currentView === "wizard") {
    return <CalculationWizard onComplete={handleCalculationComplete} initialInputs={currentInputs || undefined} />
  }

  if (currentView === "results" && result && currentInputs) {
    return <ResultsDashboard result={result} onReset={handleReset} inputs={currentInputs} />
  }

  if (currentView === "saved") {
    return (
      <div className="min-h-screen gradient-surface relative overflow-hidden">
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-40 h-40 bg-primary/10 rounded-full animate-float blur-xl"></div>
          <div
            className="absolute top-40 right-20 w-32 h-32 bg-accent/10 rounded-full animate-float blur-xl"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-40 left-1/4 w-28 h-28 bg-chart-5/10 rounded-full animate-float blur-xl"
            style={{ animationDelay: "4s" }}
          ></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-5">
            <div
              className="w-full h-full rounded-full border border-primary/20 animate-spin"
              style={{ animationDuration: "30s" }}
            ></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 p-6">
          <div className="mb-8 flex items-center justify-between">
            <Button variant="outline" onClick={handleReset} className="glass-premium hover-lift bg-transparent">
              ← Back to Home
            </Button>
          </div>
          <SavedCalculations
            onLoadCalculation={handleLoadCalculation}
            onCompareCalculations={handleCompareCalculations}
          />

          {comparisonData && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <Card className="max-w-6xl w-full max-h-[85vh] overflow-y-auto glass-card animate-slide-up">
                <CardHeader className="border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-3xl gradient-text">Calculation Comparison</CardTitle>
                      <p className="text-muted-foreground mt-2">
                        Detailed analysis of your carbon footprint calculations
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => setComparisonData(null)} className="hover-lift">
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {comparisonData.map((calc, index) => (
                        <Card key={index} className="glass-card hover-lift">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-xl">{calc.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{calc.date}</p>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="text-center p-4 rounded-xl bg-primary/5">
                                <div className="text-3xl font-bold gradient-text">{calc.total.toFixed(1)}</div>
                                <div className="text-sm text-muted-foreground font-medium">tonnes CO₂e/year</div>
                              </div>
                              <div className="space-y-3 text-sm">
                                {[
                                  { label: "Transport", value: calc.transport, color: "text-chart-1" },
                                  { label: "Energy", value: calc.energy, color: "text-chart-2" },
                                  { label: "Diet", value: calc.diet, color: "text-chart-3" },
                                  { label: "Flights", value: calc.flights, color: "text-chart-4" },
                                  { label: "Shopping", value: calc.shopping, color: "text-chart-5" },
                                  { label: "Waste", value: calc.waste, color: "text-warning" },
                                  { label: "Water", value: calc.water, color: "text-success" },
                                ].map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between items-center p-2 rounded-lg bg-muted/30"
                                  >
                                    <span className="font-medium">{item.label}:</span>
                                    <span className={`font-bold ${item.color}`}>{item.value.toFixed(1)}t</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {comparisonData.length === 2 && (
                      <Card className="glass-premium">
                        <CardHeader>
                          <CardTitle className="text-2xl flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-primary" />
                            Difference Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
                            <div className="text-4xl font-bold gradient-text mb-2">
                              {Math.abs(comparisonData[0].total - comparisonData[1].total).toFixed(1)} tonnes CO₂e/year
                            </div>
                            <div className="text-lg text-muted-foreground">
                              {comparisonData[0].total > comparisonData[1].total
                                ? `${comparisonData[1].name} has ${Math.abs(comparisonData[0].total - comparisonData[1].total).toFixed(1)}t lower emissions`
                                : `${comparisonData[0].name} has ${Math.abs(comparisonData[0].total - comparisonData[1].total).toFixed(1)}t lower emissions`}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-surface relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-40 h-40 bg-primary/10 rounded-full animate-float blur-xl"></div>
        <div
          className="absolute top-40 right-20 w-32 h-32 bg-accent/10 rounded-full animate-float blur-xl"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-40 left-1/4 w-28 h-28 bg-chart-5/10 rounded-full animate-float blur-xl"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute bottom-20 right-1/3 w-36 h-36 bg-warning/10 rounded-full animate-float blur-xl"
          style={{ animationDelay: "6s" }}
        ></div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-5">
          <div
            className="w-full h-full rounded-full border border-primary/20 animate-spin"
            style={{ animationDuration: "30s" }}
          ></div>
          <div
            className="absolute inset-8 rounded-full border border-accent/20 animate-spin"
            style={{ animationDuration: "20s", animationDirection: "reverse" }}
          ></div>
        </div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-primary/20 rounded-full animate-float blur-sm`}
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 12}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i}s`,
            }}
          />
        ))}
      </div>

      <header className="border-b border-border/50 glass-premium sticky top-0 z-50 relative">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg animate-glow">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold gradient-text">CARBONWISE</span>
                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                  <span>by</span>
                  <span className="font-semibold text-foreground">Danny Zheng</span>
                  <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                </div>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewSaved}
                className="glass-premium hover-lift button-premium bg-transparent"
              >
                <History className="w-4 h-4 mr-2" />
                My Progress
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <section className="py-24 px-6 relative z-10">
        <div className="container mx-auto text-center">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="space-y-8 animate-slide-up">
              <h1 className="gradient-text animate-gradient-shift text-balance">
                Calculate your carbon footprint with scientific precision
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto text-pretty leading-relaxed">
                Get personalized recommendations to reduce your environmental impact and contribute to a sustainable
                future. Built with real EPA emission factors and advanced methodologies.
              </p>
            </div>

            <div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <Button
                size="lg"
                className="text-lg px-10 py-7 animate-pulse-premium button-premium shadow-2xl"
                onClick={handleStartCalculation}
              >
                <Calculator className="w-5 h-5 mr-3" />
                Calculate My Footprint
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-7 glass-premium hover-lift button-premium bg-transparent"
                onClick={handleViewSaved}
              >
                <History className="w-5 h-5 mr-3" />
                View My Progress
              </Button>
            </div>

            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              {[
                { value: "16.0", label: "US Average", sublabel: "tonnes CO₂e/year", color: "from-chart-1 to-chart-2" },
                {
                  value: "4.8",
                  label: "Global Average",
                  sublabel: "tonnes CO₂e/year",
                  color: "from-chart-2 to-chart-3",
                },
                {
                  value: "2.3",
                  label: "Paris Agreement",
                  sublabel: "Target by 2030",
                  color: "from-chart-3 to-chart-4",
                },
                { value: "50%", label: "Reduction Needed", sublabel: "by 2030", color: "from-chart-4 to-chart-5" },
              ].map((stat, index) => (
                <Card key={index} className="glass-card hover-lift text-center p-6">
                  <div
                    className={`text-4xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent mb-2`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-foreground mb-1">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.sublabel}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 relative z-10">
        <div className="container mx-auto">
          <div className="text-center mb-20 animate-slide-up">
            <h2 className="gradient-text mb-6">Advanced Carbon Calculation</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Built with real EPA emission factors and scientific methodologies for accurate, actionable insights that
              help you make informed decisions about your environmental impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Calculator,
                title: "Comprehensive Analysis",
                description:
                  "Track emissions across transportation, energy, diet, shopping, waste, and water usage with detailed breakdowns and unit labels.",
                color: "text-chart-1",
                delay: "0s",
              },
              {
                icon: TrendingDown,
                title: "What-If Scenarios",
                description:
                  "Interactive sliders let you preview the impact of different actions before making changes to your lifestyle.",
                color: "text-chart-2",
                delay: "0.1s",
              },
              {
                icon: Target,
                title: "Progress Tracking",
                description:
                  "Save calculations and view your timeline to track improvements and see your carbon reduction journey.",
                color: "text-chart-3",
                delay: "0.2s",
              },
              {
                icon: Globe,
                title: "Regional Accuracy",
                description:
                  "State-specific electricity grid factors and regional adjustments for precise local impact calculations.",
                color: "text-chart-4",
                delay: "0.3s",
              },
              {
                icon: Users,
                title: "Comparison Tools",
                description:
                  "Compare multiple calculations side-by-side to understand your progress and identify improvement opportunities.",
                color: "text-chart-5",
                delay: "0.4s",
              },
              {
                icon: Zap,
                title: "Privacy First",
                description:
                  "All calculations performed locally in your browser. No data collection, no tracking, complete privacy.",
                color: "text-success",
                delay: "0.5s",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="glass-card hover-lift animate-slide-up"
                style={{ animationDelay: feature.delay }}
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  >
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 gradient-primary text-white relative z-10 shadow-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-10 animate-slide-up">
            <h2 className="text-white mb-8">Start Your Climate Journey Today</h2>
            <p className="text-xl opacity-90 leading-relaxed text-pretty">
              Join thousands of individuals taking action on climate change. Calculate your footprint in under 5 minutes
              and discover your personalized path to carbon neutrality with science-backed recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-10 py-7 shadow-2xl hover:shadow-3xl button-premium"
                onClick={handleStartCalculation}
              >
                <Calculator className="w-5 h-5 mr-3" />
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
              <div className="flex items-center gap-2 text-sm opacity-80">
                <CheckCircle className="w-4 h-4" />
                <span>Free • No signup required • Privacy focused</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-16 px-6 glass-premium relative z-10">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">CARBONWISE</span>
          </div>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
            Advanced carbon footprint calculator built with scientific precision and privacy in mind. Empowering
            individuals to make informed decisions about their environmental impact.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span>&copy; 2025 CARBONWISE</span>
            <span>•</span>
            <span>Built for Congressional App Challenge</span>
            <span>•</span>
            <span>EPA 2024 Data</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

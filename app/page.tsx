"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CalculationWizard } from "@/components/calculation-wizard"
import { ResultsDashboard } from "@/components/results-dashboard"
import { SavedCalculations } from "@/components/saved-calculations"
import { calculateCarbonFootprint, type CarbonInputs, type CarbonResult } from "@/lib/carbon-calculator"
import { Leaf, Calculator, TrendingDown, Users, Globe, Target, History, Sparkles } from "lucide-react"

export default function Home() {
  const [currentView, setCurrentView] = useState<"landing" | "wizard" | "results" | "saved">("landing")
  const [result, setResult] = useState<CarbonResult | null>(null)
  const [currentInputs, setCurrentInputs] = useState<CarbonInputs | null>(null)

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
  }

  const handleLoadCalculation = (inputs: CarbonInputs) => {
    setCurrentInputs(inputs)
    setCurrentView("wizard")
  }

  const handleViewSaved = () => {
    setCurrentView("saved")
  }

  if (currentView === "wizard") {
    return <CalculationWizard onComplete={handleCalculationComplete} initialInputs={currentInputs || undefined} />
  }

  if (currentView === "results" && result && currentInputs) {
    return <ResultsDashboard result={result} onReset={handleReset} inputs={currentInputs} />
  }

  if (currentView === "saved") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 p-6 relative overflow-hidden">
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
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-8 flex items-center justify-between">
            <Button variant="outline" onClick={handleReset}>
              ← Back to Home
            </Button>
          </div>
          <SavedCalculations
            onLoadCalculation={handleLoadCalculation}
            onCompareCalculations={(calculations) => {
              // TODO: Implement comparison view
              console.log("Compare calculations:", calculations)
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 relative overflow-hidden">
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

        {/* Floating particles */}
        <div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-bounce"
          style={{ animationDelay: "0.5s", animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-3/4 right-1/4 w-3 h-3 bg-accent/20 rounded-full animate-bounce"
          style={{ animationDelay: "1.5s", animationDuration: "4s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/3 w-1 h-1 bg-success/30 rounded-full animate-pulse"
          style={{ animationDelay: "2.5s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 relative">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">CARBONWISE</span>
              <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Button
                variant="default"
                size="sm"
                onClick={handleViewSaved}
                className="bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border border-primary/20 shadow-md"
              >
                <History className="w-4 h-4 mr-2" />
                My Progress
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient">
                Track Your Carbon Impact
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance">
                Calculate your personal carbon footprint with scientific precision. Get personalized recommendations to
                reduce your environmental impact and contribute to a sustainable future.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8 py-6 animate-pulse-green shadow-lg"
                onClick={handleStartCalculation}
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calculate My Footprint
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 bg-transparent shadow-md hover:shadow-lg transition-shadow"
                onClick={handleViewSaved}
              >
                <History className="w-5 h-5 mr-2" />
                View My Progress
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
              <div className="text-center p-4 rounded-lg bg-white/30 backdrop-blur-sm border border-white/20 shadow-md">
                <div className="text-3xl font-bold text-primary">16.0</div>
                <div className="text-sm text-muted-foreground">US Average (tonnes CO₂e/year)</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/30 backdrop-blur-sm border border-white/20 shadow-md">
                <div className="text-3xl font-bold text-accent">4.8</div>
                <div className="text-sm text-muted-foreground">Global Average (tonnes CO₂e/year)</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/30 backdrop-blur-sm border border-white/20 shadow-md">
                <div className="text-3xl font-bold text-warning">2.3</div>
                <div className="text-sm text-muted-foreground">Paris Agreement Target</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/30 backdrop-blur-sm border border-white/20 shadow-md">
                <div className="text-3xl font-bold text-secondary">50%</div>
                <div className="text-sm text-muted-foreground">Reduction Needed by 2030</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50 relative z-10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Advanced Carbon Calculation</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with real EPA emission factors and scientific methodologies for accurate, actionable insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass animate-float shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <Calculator className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Comprehensive Analysis</h3>
                <p className="text-muted-foreground">
                  Track emissions across transportation, energy, diet, shopping, waste, and water usage with detailed
                  breakdowns and unit labels.
                </p>
              </CardContent>
            </Card>

            <Card
              className="glass animate-float shadow-lg hover:shadow-xl transition-shadow"
              style={{ animationDelay: "0.2s" }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <TrendingDown className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">What-If Scenarios</h3>
                <p className="text-muted-foreground">
                  Interactive sliders let you preview the impact of different actions before making changes to your
                  lifestyle.
                </p>
              </CardContent>
            </Card>

            <Card
              className="glass animate-float shadow-lg hover:shadow-xl transition-shadow"
              style={{ animationDelay: "0.4s" }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <Target className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
                <p className="text-muted-foreground">
                  Save calculations and view your timeline to track improvements and see your carbon reduction journey.
                </p>
              </CardContent>
            </Card>

            <Card
              className="glass animate-float shadow-lg hover:shadow-xl transition-shadow"
              style={{ animationDelay: "0.6s" }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <Globe className="w-6 h-6 text-warning" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Regional Accuracy</h3>
                <p className="text-muted-foreground">
                  State-specific electricity grid factors and regional adjustments for precise local impact
                  calculations.
                </p>
              </CardContent>
            </Card>

            <Card
              className="glass animate-float shadow-lg hover:shadow-xl transition-shadow"
              style={{ animationDelay: "0.8s" }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <Users className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Scientific Methodology</h3>
                <p className="text-muted-foreground">
                  Transparent calculations based on EPA 2024 data with detailed explanations of data sources and
                  methods.
                </p>
              </CardContent>
            </Card>

            <Card
              className="glass animate-float shadow-lg hover:shadow-xl transition-shadow"
              style={{ animationDelay: "1.0s" }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-chart-5/10 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <Leaf className="w-6 h-6 text-chart-5" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
                <p className="text-muted-foreground">
                  All calculations performed locally in your browser. No data collection, no tracking, complete privacy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-accent text-white relative z-10 shadow-2xl">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">Start Your Climate Journey Today</h2>
            <p className="text-xl opacity-90">
              Join thousands of individuals taking action on climate change. Calculate your footprint in under 5 minutes
              and discover your path to carbon neutrality.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-shadow"
              onClick={handleStartCalculation}
            >
              <Calculator className="w-5 h-5 mr-2" />
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-muted/50 relative z-10">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">CARBONWISE</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Advanced carbon footprint calculator built with scientific precision and privacy in mind.
          </p>
          <p className="text-xs text-muted-foreground">
            &copy; 2025 CARBONWISE. Built for the Congressional App Challenge. All emission factors from EPA 2024 data.
          </p>
        </div>
      </footer>
    </div>
  )
}

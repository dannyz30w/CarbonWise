"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CalculationWizard } from "@/components/calculation-wizard"
import { ResultsDashboard } from "@/components/results-dashboard"
import { SavedCalculations } from "@/components/saved-calculations"
import { calculateCarbonFootprint, type CarbonInputs, type CarbonResult } from "@/lib/carbon-calculator"
import { Leaf, Calculator, TrendingDown, Users, Globe, Target, History } from "lucide-react"

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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 p-6">
        <div className="max-w-7xl mx-auto">
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">CARBONWISE</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Button variant="ghost" onClick={handleViewSaved}>
                <History className="w-4 h-4 mr-2" />
                Saved Calculations
              </Button>
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
              <a href="#methodology" className="text-muted-foreground hover:text-foreground transition-colors">
                Methodology
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
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
              <Button size="lg" className="text-lg px-8 py-6 animate-pulse-green" onClick={handleStartCalculation}>
                <Calculator className="w-5 h-5 mr-2" />
                Calculate My Footprint
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 bg-transparent"
                onClick={handleViewSaved}
              >
                <History className="w-5 h-5 mr-2" />
                View Saved Calculations
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">16.0</div>
                <div className="text-sm text-muted-foreground">US Average (tonnes CO₂e/year)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">4.8</div>
                <div className="text-sm text-muted-foreground">Global Average (tonnes CO₂e/year)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-warning">2.3</div>
                <div className="text-sm text-muted-foreground">Paris Agreement Target</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">50%</div>
                <div className="text-sm text-muted-foreground">Reduction Needed by 2030</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Advanced Carbon Calculation</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with real EPA emission factors and scientific methodologies for accurate, actionable insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass animate-float">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Comprehensive Analysis</h3>
                <p className="text-muted-foreground">
                  Track emissions across transportation, energy, diet, shopping, waste, and water usage with detailed
                  breakdowns.
                </p>
              </CardContent>
            </Card>

            <Card className="glass animate-float" style={{ animationDelay: "0.2s" }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <TrendingDown className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Personalized Recommendations</h3>
                <p className="text-muted-foreground">
                  Get tailored suggestions ranked by impact and difficulty to maximize your carbon reduction efforts.
                </p>
              </CardContent>
            </Card>

            <Card className="glass animate-float" style={{ animationDelay: "0.4s" }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Science-Based Targets</h3>
                <p className="text-muted-foreground">
                  Compare your footprint against Paris Agreement targets and global averages with real-time
                  benchmarking.
                </p>
              </CardContent>
            </Card>

            <Card className="glass animate-float" style={{ animationDelay: "0.6s" }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-warning" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Regional Accuracy</h3>
                <p className="text-muted-foreground">
                  State-specific electricity grid factors and regional adjustments for precise local impact
                  calculations.
                </p>
              </CardContent>
            </Card>

            <Card className="glass animate-float" style={{ animationDelay: "0.8s" }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Household Optimization</h3>
                <p className="text-muted-foreground">
                  Household size adjustments and shared resource calculations for accurate per-person emissions.
                </p>
              </CardContent>
            </Card>

            <Card className="glass animate-float" style={{ animationDelay: "1.0s" }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-chart-5/10 flex items-center justify-center mx-auto mb-4">
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
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">Start Your Climate Journey Today</h2>
            <p className="text-xl opacity-90">
              Join thousands of individuals taking action on climate change. Calculate your footprint in under 5 minutes
              and discover your path to carbon neutrality.
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" onClick={handleStartCalculation}>
              <Calculator className="w-5 h-5 mr-2" />
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold">CARBONWISE</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Advanced carbon footprint calculator built with scientific precision and privacy in mind.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Carbon Calculator</li>
                <li>Impact Analysis</li>
                <li>Recommendations</li>
                <li>Comparisons</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Methodology</li>
                <li>Data Sources</li>
                <li>Climate Science</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">About</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Our Mission</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; 2025 CARBONWISE. Built for the Congressional App Challenge. All emission factors from EPA 2024
              data.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

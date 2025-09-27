export interface SavedCalculation {
  id: string
  name: string
  date: string
  inputs: any
  result: any
}

export class CalculationStorage {
  private static readonly STORAGE_KEY = "carbonwise_calculations"

  static saveCalculation(name: string, inputs: any, result: any): string {
    const calculations = this.getAllCalculations()
    const id = Date.now().toString()
    const newCalculation: SavedCalculation = {
      id,
      name,
      date: new Date().toISOString(),
      inputs,
      result,
    }

    calculations.push(newCalculation)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(calculations))
    return id
  }

  static getAllCalculations(): SavedCalculation[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  static getCalculation(id: string): SavedCalculation | null {
    const calculations = this.getAllCalculations()
    return calculations.find((calc) => calc.id === id) || null
  }

  static deleteCalculation(id: string): void {
    const calculations = this.getAllCalculations()
    const filtered = calculations.filter((calc) => calc.id !== id)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered))
  }

  static updateCalculation(id: string, updates: Partial<SavedCalculation>): void {
    const calculations = this.getAllCalculations()
    const index = calculations.findIndex((calc) => calc.id === id)
    if (index >= 0) {
      calculations[index] = { ...calculations[index], ...updates }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(calculations))
    }
  }
}

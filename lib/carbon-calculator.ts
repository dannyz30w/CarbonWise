import { EMISSION_FACTORS, DIET_PROFILES, HOUSEHOLD_ADJUSTMENTS } from "./emission-factors"

export interface CarbonInputs {
  // Profile
  householdSize: number
  state: string

  // Transportation (weekly)
  commute: {
    mode: string
    miles: number
    daysPerWeek: number
  }[]

  // Flights (annual)
  flights: {
    distance: number
    trips: number
    class: "economy" | "business" | "first"
  }[]

  // Diet
  dietProfile: keyof typeof DIET_PROFILES
  dietDetails?: {
    beefServingsPerWeek: number
    porkServingsPerWeek: number
    chickenServingsPerWeek: number
    fishServingsPerWeek: number
    lambServingsPerWeek: number
    dairyServingsPerDay: number
    eggsPerWeek: number
    localFoodPercent: number
    organicFoodPercent: number
    processedFoodPercent: number
    foodWastePercent: number
  }

  // Energy (monthly)
  energy: {
    electricityKwh: number
    naturalGasTherms: number
    heatingOilGallons: number
    propaneGallons: number
  }
  energyDetails?: {
    homeType: string
    homeSize: number
    heatingType: string
    coolingType: string
    waterHeaterType: string
    renewablePercent: number
    energyEfficiencyRating: string
  }

  // Shopping (annual)
  shopping: {
    clothingSpend: number
    electronicsSpend: number
    generalSpend: number
  }
  shoppingDetails?: {
    newClothingItems: number
    secondhandClothingPercent: number
    electronicsReplacementYears: number
    carReplacementYears: number
    repairVsReplacePercent: number
    packagesPerMonth: number
    localShoppingPercent: number
  }

  // Waste (weekly)
  waste: {
    totalKg: number
    recyclePercent: number
    compostPercent: number
  }

  // Water (daily)
  water: {
    tapLiters: number
    bottledLiters: number
    showerMinutes: number
  }
}

export interface CarbonResult {
  annual: {
    total: number
    transport: number
    flights: number
    diet: number
    energy: number
    shopping: number
    waste: number
    water: number
  }
  daily: {
    total: number
    transport: number
    flights: number
    diet: number
    energy: number
    shopping: number
    waste: number
    water: number
  }
  comparisons: {
    vsUSAverage: number // percentage
    vsGlobalAverage: number
    vsParisTarget: number
  }
  suggestions: {
    category: string
    action: string
    savingsKgPerYear: number
    difficulty: "easy" | "medium" | "hard"
  }[]
}

export function calculateCarbonFootprint(inputs: CarbonInputs): CarbonResult {
  // Transportation (weekly to annual)
  const transportAnnual = inputs.commute.reduce((total, commute) => {
    const factor = EMISSION_FACTORS.transport[commute.mode as keyof typeof EMISSION_FACTORS.transport] || 0.4
    return total + commute.miles * commute.daysPerWeek * 52 * factor
  }, 0)

  // Flights (annual)
  const flightsAnnual = inputs.flights.reduce((total, flight) => {
    let factor: number
    if (flight.distance <= 300) {
      factor = EMISSION_FACTORS.aviation.domestic_short
    } else if (flight.distance <= 2300) {
      factor = EMISSION_FACTORS.aviation.domestic_medium
    } else {
      factor = EMISSION_FACTORS.aviation.domestic_long
    }

    const classMultiplier = flight.class === "business" ? 2.0 : flight.class === "first" ? 3.0 : 1.0
    return total + flight.distance * flight.trips * factor * classMultiplier
  }, 0)

  // Diet (annual)
  const dietAnnual = DIET_PROFILES[inputs.dietProfile]

  // Energy (monthly to annual)
  const electricityFactor =
    EMISSION_FACTORS.electricity_by_state[inputs.state as keyof typeof EMISSION_FACTORS.electricity_by_state] ||
    EMISSION_FACTORS.energy.electricity_us_avg

  const renewableAdjustment = inputs.energyDetails?.renewablePercent
    ? (100 - inputs.energyDetails.renewablePercent) / 100
    : 1.0

  const energyAnnual =
    inputs.energy.electricityKwh * 12 * electricityFactor * renewableAdjustment +
    inputs.energy.naturalGasTherms * 12 * EMISSION_FACTORS.energy.natural_gas +
    inputs.energy.heatingOilGallons * 12 * EMISSION_FACTORS.energy.heating_oil +
    inputs.energy.propaneGallons * 12 * EMISSION_FACTORS.energy.propane

  // Shopping (annual)
  const shoppingAnnual =
    inputs.shopping.clothingSpend * 0.01 * EMISSION_FACTORS.consumption.clothing_cotton +
    inputs.shopping.electronicsSpend * 0.002 * EMISSION_FACTORS.consumption.smartphone +
    inputs.shopping.generalSpend * EMISSION_FACTORS.consumption.general_goods

  // Waste (weekly to annual)
  const wasteAnnual =
    inputs.waste.totalKg *
    52 *
    (EMISSION_FACTORS.waste.landfill * (1 - inputs.waste.recyclePercent / 100 - inputs.waste.compostPercent / 100) +
      EMISSION_FACTORS.waste.recycling_paper * (inputs.waste.recyclePercent / 100) +
      EMISSION_FACTORS.waste.composting * (inputs.waste.compostPercent / 100))

  // Water (daily to annual)
  const waterAnnual =
    365 *
    (inputs.water.tapLiters * EMISSION_FACTORS.water.tap_water +
      inputs.water.bottledLiters * EMISSION_FACTORS.water.bottled_water +
      inputs.water.showerMinutes * 10 * EMISSION_FACTORS.water.hot_water_shower) // ~10L per minute

  // Apply household size adjustment
  const householdAdjustment = HOUSEHOLD_ADJUSTMENTS[inputs.householdSize as keyof typeof HOUSEHOLD_ADJUSTMENTS] || 1.0

  const annual = {
    transport: transportAnnual * householdAdjustment,
    flights: flightsAnnual * householdAdjustment,
    diet: dietAnnual * householdAdjustment,
    energy: energyAnnual * householdAdjustment,
    shopping: shoppingAnnual * householdAdjustment,
    waste: Math.max(0, wasteAnnual * householdAdjustment), // Ensure non-negative
    water: waterAnnual * householdAdjustment,
    total: 0,
  }

  annual.total =
    annual.transport + annual.flights + annual.diet + annual.energy + annual.shopping + annual.waste + annual.water

  const daily = {
    transport: annual.transport / 365,
    flights: annual.flights / 365,
    diet: annual.diet / 365,
    energy: annual.energy / 365,
    shopping: annual.shopping / 365,
    waste: annual.waste / 365,
    water: annual.water / 365,
    total: annual.total / 365,
  }

  const comparisons = {
    vsUSAverage:
      ((annual.total - EMISSION_FACTORS.baselines.us_per_capita) / EMISSION_FACTORS.baselines.us_per_capita) * 100,
    vsGlobalAverage:
      ((annual.total - EMISSION_FACTORS.baselines.global_per_capita) / EMISSION_FACTORS.baselines.global_per_capita) *
      100,
    vsParisTarget:
      ((annual.total - EMISSION_FACTORS.baselines.paris_agreement_target) /
        EMISSION_FACTORS.baselines.paris_agreement_target) *
      100,
  }

  // Generate suggestions based on highest impact categories
  const suggestions = generateSuggestions(inputs, annual)

  return {
    annual,
    daily,
    comparisons,
    suggestions,
  }
}

function generateSuggestions(inputs: CarbonInputs, annual: any) {
  const suggestions = []

  // Transportation suggestions
  if (annual.transport > 2000) {
    suggestions.push({
      category: "Transportation",
      action: "Replace 2 car commute days with public transit or biking",
      savingsKgPerYear: Math.min(annual.transport * 0.4, 1500),
      difficulty: "medium" as const,
    })
  }

  // Flight suggestions
  if (annual.flights > 1000) {
    suggestions.push({
      category: "Travel",
      action: "Reduce one long-distance flight per year",
      savingsKgPerYear: Math.min(annual.flights * 0.3, 2000),
      difficulty: "hard" as const,
    })
  }

  // Diet suggestions
  if (inputs.dietProfile === "heavy_meat" || inputs.dietProfile === "average_omnivore") {
    suggestions.push({
      category: "Diet",
      action: 'Try "Meatless Monday" - go plant-based one day per week',
      savingsKgPerYear: 400,
      difficulty: "easy" as const,
    })
  }

  // Energy suggestions
  if (annual.energy > 3000) {
    suggestions.push({
      category: "Energy",
      action: "Switch to renewable energy plan or improve home insulation",
      savingsKgPerYear: Math.min(annual.energy * 0.5, 2500),
      difficulty: "medium" as const,
    })
  }

  // Sort by savings and return top 3
  return suggestions.sort((a, b) => b.savingsKgPerYear - a.savingsKgPerYear).slice(0, 3)
}

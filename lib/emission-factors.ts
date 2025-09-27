// Real emission factors from EPA 2024 and other authoritative sources
export const EMISSION_FACTORS = {
  // Transportation (kg CO2e per mile)
  transport: {
    car_gasoline: 0.404,
    car_diesel: 0.47,
    car_hybrid: 0.2,
    car_electric: 0.123, // Average US grid
    motorcycle: 0.28,
    bus: 0.055,
    train_commuter: 0.135,
    train_intercity: 0.15,
    subway: 0.04,
    bike: 0,
    walk: 0,
    rideshare: 0.45, // Includes deadheading
    taxi: 0.5,
  },

  // Aviation (kg CO2e per mile per passenger)
  aviation: {
    domestic_short: 0.207, // <300 miles
    domestic_medium: 0.129, // 300-2300 miles
    domestic_long: 0.163, // >2300 miles
    international: 0.18,
    business_multiplier: 2.0,
    first_multiplier: 3.0,
  },

  // Food (kg CO2e per kg of food)
  food: {
    beef: 27.0,
    lamb: 24.5,
    pork: 4.5,
    chicken: 8.0,
    turkey: 6.8,
    fish_farmed: 5.1,
    fish_wild: 1.4,
    eggs: 4.0,
    dairy_milk: 1.0, // per liter
    cheese: 8.5,
    yogurt: 2.2,
    rice: 2.3,
    wheat: 0.7,
    potatoes: 0.3,
    vegetables_avg: 0.4,
    fruits_avg: 0.5,
    nuts: 0.3,
    legumes: 0.9,
    tofu: 1.6,
    plant_milk: 0.3, // per liter
  },

  // Energy (kg CO2e per unit)
  energy: {
    electricity_us_avg: 0.386, // per kWh (2024 EPA)
    natural_gas: 5.3, // per therm
    heating_oil: 10.18, // per gallon
    propane: 5.7, // per gallon
    coal: 2.23, // per pound
    wood: 0.0, // considered carbon neutral
  },

  // US State electricity factors (kg CO2e per kWh) - 2023 eGRID data
  electricity_by_state: {
    AL: 0.708,
    AK: 0.531,
    AZ: 0.428,
    AR: 0.702,
    CA: 0.237,
    CO: 0.675,
    CT: 0.246,
    DE: 0.454,
    FL: 0.418,
    GA: 0.456,
    HI: 0.651,
    ID: 0.071,
    IL: 0.318,
    IN: 0.851,
    IA: 0.651,
    KS: 0.658,
    KY: 0.859,
    LA: 0.506,
    ME: 0.118,
    MD: 0.34,
    MA: 0.246,
    MI: 0.456,
    MN: 0.446,
    MS: 0.506,
    MO: 0.708,
    MT: 0.651,
    NE: 0.651,
    NV: 0.34,
    NH: 0.118,
    NJ: 0.246,
    NM: 0.708,
    NY: 0.21,
    NC: 0.34,
    ND: 0.851,
    OH: 0.456,
    OK: 0.658,
    OR: 0.071,
    PA: 0.34,
    RI: 0.246,
    SC: 0.34,
    SD: 0.446,
    TN: 0.34,
    TX: 0.418,
    UT: 0.708,
    VT: 0.003,
    VA: 0.34,
    WA: 0.071,
    WV: 0.859,
    WI: 0.651,
    WY: 0.851,
    DC: 0.34,
  },

  // Shopping & consumption (kg CO2e per unit)
  consumption: {
    clothing_cotton: 25.0, // per kg
    clothing_polyester: 35.0, // per kg
    smartphone: 80.0, // per device
    laptop: 250.0, // per device
    tablet: 130.0, // per device
    tv_55inch: 500.0, // per device
    furniture_wood: 15.0, // per kg
    furniture_metal: 25.0, // per kg
    books: 2.5, // per kg
    general_goods: 0.3, // per USD spent
  },

  // Waste (kg CO2e per kg of waste)
  waste: {
    landfill: 0.8,
    recycling_paper: -1.0, // negative = avoided emissions
    recycling_plastic: -1.5,
    recycling_metal: -2.0,
    recycling_glass: -0.5,
    composting: -1.9, // avoided methane
    incineration: 0.4,
  },

  // Water (kg CO2e per unit)
  water: {
    tap_water: 0.0005, // per liter
    bottled_water: 0.25, // per liter
    hot_water_shower: 0.15, // per liter (includes heating)
  },

  // Conversions
  conversions: {
    miles_to_km: 1.60934,
    gallons_to_liters: 3.78541,
    pounds_to_kg: 0.453592,
    therms_to_kwh: 29.3,
  },

  // Baselines for comparison (kg CO2e per year)
  baselines: {
    us_per_capita: 16000,
    global_per_capita: 4800,
    paris_agreement_target: 2300, // 1.5°C pathway
  },
}

// Diet profiles with annual emissions (kg CO2e/year)
export const DIET_PROFILES = {
  heavy_meat: 3600,
  average_omnivore: 2500,
  low_meat: 1800,
  pescatarian: 1500,
  vegetarian: 1200,
  vegan: 1000,
}

// Household size adjustments
export const HOUSEHOLD_ADJUSTMENTS = {
  1: 1.0,
  2: 0.85,
  3: 0.75,
  4: 0.7,
  5: 0.65,
  6: 0.6,
}

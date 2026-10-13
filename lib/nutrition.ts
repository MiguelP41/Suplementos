// lib/nutrition.ts

// lib/nutrition.ts

export interface UserMetrics {
  weightKg: number
  heightCm: number
  age: number
  gender: 'M' | 'F'
  goal: 'DEFICIT' | 'MAINTENANCE' | 'SURPLUS'
  activityLevel: number // 1.2 a 1.9
}

export interface MealPortions {
  carbs: number
  proteins: number
  fats: number
  dairy: number
  fruits: number
  veggies: number
}

export interface DailyPlan {
  totalKcal: number
  proteinGrams: number
  carbGrams: number
  fatGrams: number
  meals: {
    desayuno: MealPortions
    meriendaAm: MealPortions
    almuerzo: MealPortions
    meriendaPm: MealPortions
    cena: MealPortions
  }
}

export interface FoodEquivalent {
  id: string
  name: string
  category: 'PROTEIN' | 'CARB' | 'FAT' | 'FRUIT' | 'DAIRY' | 'VEGGIE'
  portionAmount: number // Cantidad que representa 1 porción
  unitLabel: string
  isSupplement?: boolean
}

// Calculadora Maestra basada en Conversión Directa de Macros a Bloques
export function calculateDailyPortions(metrics: UserMetrics): DailyPlan {
  const { weightKg, heightCm, age, gender, goal, activityLevel } = metrics

  // 1. Calorías Totales (Mifflin-St Jeor)
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age
  bmr = gender === 'M' ? bmr + 5 : bmr - 161

  let tdee = bmr * activityLevel

  if (goal === 'DEFICIT') tdee *= 0.8
  else if (goal === 'SURPLUS') tdee *= 1.15

  const totalKcal = Math.round(tdee)

  // 2. Definición de Macros limpios en gramos
  // Proteína: 2.0g por kg
  const proteinGrams = Math.round(weightKg * 2.0)
  // Grasa: 25% de las calorías totales / 9
  const fatGrams = Math.round((totalKcal * 0.25) / 9)
  // Carbohidratos: El resto de las calorías / 4
  const proteinKcal = proteinGrams * 4
  const fatKcal = fatGrams * 9
  const carbGrams = Math.max(100, Math.round((totalKcal - proteinKcal - fatKcal) / 4))

  // 3. Conversión estricta a porciones enteras (1 porción prot = 25g aprox, carb = 20g aprox, fat = 5g aprox)
  // Para que las porciones sumen un equivalente real y sensato al día:
  const totalProtPortions = Math.max(12, Math.round(proteinGrams / 25))
  const totalCarbPortions = Math.max(8, Math.round(carbGrams / 30))
  const totalFatPortions = Math.max(4, Math.round(fatGrams / 10))

  // 4. Reparto exacto en las 5 comidas (La suma de cada macro debe ser igual al total de arriba)
  // Dejamos la merienda PM con 3 porciones fijas de proteína para el scoop de whey.
  const pmProt = 3
  const remainingProt = Math.max(5, totalProtPortions - pmProt)

  const pDes = Math.round(remainingProt * 0.25)
  const pAm = 1
  const pAlm = Math.round(remainingProt * 0.35)
  const pCena = remainingProt - pDes - pAm - pAlm

  const cDes = Math.round(totalCarbPortions * 0.25)
  const cAlm = Math.round(totalCarbPortions * 0.45)
  const cCena = totalCarbPortions - cDes - cAlm

  const fDes = Math.round(totalFatPortions * 0.30)
  const fAlm = Math.round(totalFatPortions * 0.35)
  const fCena = totalFatPortions - fDes - fAlm

  return {
    totalKcal,
    proteinGrams,
    carbGrams,
    fatGrams,
    meals: {
      desayuno: {
        carbs: Math.max(1, cDes),
        proteins: Math.max(1, pDes),
        fats: Math.max(1, fDes),
        dairy: 0,
        fruits: 0,
        veggies: 0,
      },
      meriendaAm: {
        carbs: 0,
        proteins: pAm,
        fats: 0,
        dairy: 1,
        fruits: 1,
        veggies: 0,
      },
      almuerzo: {
        carbs: Math.max(1, cAlm),
        proteins: Math.max(1, pAlm),
        fats: Math.max(1, fAlm),
        dairy: 0,
        fruits: 0,
        veggies: 1,
      },
      meriendaPm: {
        carbs: 0,
        proteins: pmProt, // 3 porciones fijas para el scoop de proteína
        fats: 0,
        dairy: 0,
        fruits: 1,
        veggies: 0,
      },
      cena: {
        carbs: Math.max(1, cCena),
        proteins: Math.max(1, pCena),
        fats: Math.max(1, fCena),
        dairy: 0,
        fruits: 0,
        veggies: 1,
      },
    },
  }
}

// Base de datos de Equivalentes (Comida Venezolana y Suplementos)
export const FOOD_EQUIVALENTS: FoodEquivalent[] = [
  // PROTEÍNAS (1 porción)
  { id: 'egg', name: 'Huevo entero', category: 'PROTEIN', portionAmount: 1, unitLabel: 'ud' },
  { id: 'chicken', name: 'Pechuga de Pollo', category: 'PROTEIN', portionAmount: 30, unitLabel: 'g' },
  { id: 'beef', name: 'Carne Magra', category: 'PROTEIN', portionAmount: 30, unitLabel: 'g' },
  { id: 'white_cheese', name: 'Queso Blanco', category: 'PROTEIN', portionAmount: 50, unitLabel: 'g' },
  { id: 'whey', name: 'Whey Protein', category: 'PROTEIN', portionAmount: 0.33, unitLabel: 'scoop', isSupplement: true },

  // CARBOHIDRATOS (1 porción)
  { id: 'arepa', name: 'Arepa lista', category: 'CARB', portionAmount: 40, unitLabel: 'g' },
  { id: 'harina_pan', name: 'Harina PAN (seca)', category: 'CARB', portionAmount: 20, unitLabel: 'g' },
  { id: 'rice', name: 'Arroz cocido', category: 'CARB', portionAmount: 80, unitLabel: 'g' },
  { id: 'potato', name: 'Papa cocida', category: 'CARB', portionAmount: 100, unitLabel: 'g' },
  { id: 'oats', name: 'Avena en hojuelas', category: 'CARB', portionAmount: 20, unitLabel: 'g' },

  // GRASAS (1 porción)
  { id: 'oil', name: 'Aceite de Oliva / Aguacate', category: 'FAT', portionAmount: 5, unitLabel: 'ml (1 cdta)' },
  { id: 'avocado', name: 'Aguacate', category: 'FAT', portionAmount: 30, unitLabel: 'g' },
  { id: 'peanut_butter', name: 'Mantequilla de maní', category: 'FAT', portionAmount: 10, unitLabel: 'g (1 cda)' },

  // FRUTAS (1 porción)
  { id: 'banana', name: 'Cambur', category: 'FRUIT', portionAmount: 90, unitLabel: 'g (1/2 ud)' },
  { id: 'apple', name: 'Manzana / Mandarina', category: 'FRUIT', portionAmount: 1, unitLabel: 'ud' },

  // LÁCTEOS (1 porción)
  { id: 'milk', name: 'Leche descremada', category: 'DAIRY', portionAmount: 240, unitLabel: 'ml (1 taza)' },
  { id: 'greek_yogurt', name: 'Yogurt Griego', category: 'DAIRY', portionAmount: 150, unitLabel: 'g' },
]
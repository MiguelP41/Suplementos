// components/LegoMealBuilder.tsx
'use client'

import React, { useState } from 'react'
import { DailyPlan, FOOD_EQUIVALENTS, FoodEquivalent } from '@/lib/nutrition'

interface LegoMealBuilderProps {
  plan: DailyPlan
  onBack: () => void
}

type MealKey = 'desayuno' | 'meriendaAm' | 'almuerzo' | 'meriendaPm' | 'cena'

const MEAL_LABELS: Record<MealKey, { title: string; icon: string }> = {
  desayuno: { title: 'Desayuno', icon: '🍳' },
  meriendaAm: { title: 'Merienda AM', icon: '🍎' },
  almuerzo: { title: 'Almuerzo', icon: '🍗' },
  meriendaPm: { title: 'Merienda PM', icon: '🥤' },
  cena: { title: 'Cena', icon: '🥗' },
}

export default function LegoMealBuilder({ plan, onBack }: LegoMealBuilderProps) {
  const [activeMeal, setActiveMeal] = useState<MealKey>('desayuno')
  
  // Estado para rastrear equivalentes seleccionados por comida
  const [selectedFoods, setSelectedFoods] = useState<Record<MealKey, string[]>>({
    desayuno: [],
    meriendaAm: [],
    almuerzo: [],
    meriendaPm: ['whey'], // Por defecto sugerimos Whey en Merienda PM
    cena: [],
  })

  const currentMealData = plan.meals[activeMeal]

  const toggleFoodSelection = (foodId: string) => {
    setSelectedFoods((prev) => {
      const currentList = prev[activeMeal]
      const exists = currentList.includes(foodId)
      return {
        ...prev,
        [activeMeal]: exists
          ? currentList.filter((id) => id !== foodId)
          : [...currentList, foodId],
      }
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen rounded-2xl">
      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          ← Volver al resumen
        </button>
        <div className="text-right">
          <span className="text-xs text-slate-500 uppercase tracking-wider block font-bold">Meta Diaria</span>
          <span className="text-lg font-black text-orange-600">{plan.totalKcal} kcal</span>
        </div>
      </div>

      <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
        🧱 Armador de Comidas Legos
      </h1>
      <p className="text-slate-600 text-sm mb-6">
        Selecciona tus ingredientes favoritos para completar los bloques requeridos en cada comida.
      </p>

      {/* Selector de Comida (Tabs) */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
        {(Object.keys(MEAL_LABELS) as MealKey[]).map((key) => {
          const isActive = activeMeal === key
          const meal = MEAL_LABELS[key]
          return (
            <button
              key={key}
              onClick={() => setActiveMeal(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25 scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{meal.icon}</span>
              <span>{meal.title}</span>
            </button>
          )}
        )}
      </div>

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Requerimientos de la Comida Activa */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-extrabold text-slate-800 text-lg border-b pb-2 flex items-center justify-between">
            <span>Bloques a llenar</span>
            <span className="text-2xl">{MEAL_LABELS[activeMeal].icon}</span>
          </h2>

          <div className="space-y-3">
            {currentMealData.proteins > 0 && (
              <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-100 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-orange-500 inline-block"></span>
                  <span className="text-sm font-bold text-slate-700">Proteínas</span>
                </div>
                <span className="text-sm font-black text-orange-600">{currentMealData.proteins} porciones</span>
              </div>
            )}

            {currentMealData.carbs > 0 && (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                  <span className="text-sm font-bold text-slate-700">Carbohidratos</span>
                </div>
                <span className="text-sm font-black text-emerald-600">{currentMealData.carbs} porciones</span>
              </div>
            )}

            {currentMealData.fats > 0 && (
              <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                  <span className="text-sm font-bold text-slate-700">Grasas</span>
                </div>
                <span className="text-sm font-black text-amber-600">{currentMealData.fats} porciones</span>
              </div>
            )}

            {currentMealData.dairy > 0 && (
              <div className="flex items-center justify-between p-3 bg-sky-50 border border-sky-100 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-sky-500 inline-block"></span>
                  <span className="text-sm font-bold text-slate-700">Lácteos</span>
                </div>
                <span className="text-sm font-black text-sky-600">{currentMealData.dairy} porción</span>
              </div>
            )}

            {currentMealData.fruits > 0 && (
              <div className="flex items-center justify-between p-3 bg-rose-50 border border-rose-100 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                  <span className="text-sm font-bold text-slate-700">Frutas</span>
                </div>
                <span className="text-sm font-black text-rose-600">{currentMealData.fruits} porción</span>
              </div>
            )}
          </div>

          {/* Banner de Gancho Upsell en Merienda PM */}
          {activeMeal === 'meriendaPm' && (
            <div className="mt-4 p-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl shadow-md">
              <span className="bg-white/20 text-xs uppercase font-extrabold px-2 py-0.5 rounded-full text-white inline-block mb-1">
                Tip de Ahorro / Práctico
              </span>
              <p className="text-xs leading-relaxed font-medium mt-1">
                ¿Poco tiempo en la tarde? <strong className="underline">1 Scoop de Whey Protein</strong> equivale exactamente a tus <strong>3 porciones de proteína</strong>.
              </p>
              <button 
                onClick={() => alert('Redirigiendo a tiendas de suplementos con Cashea en Caracas...')}
                className="mt-3 w-full py-2 bg-slate-900 hover:bg-slate-950 text-white font-black text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1"
              >
                🛒 Comprar Whey en Caracas (Cashea)
              </button>
            </div>
          )}
        </div>

        {/* Opciones de Alimentos para Elegir */}
        <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-extrabold text-slate-800 text-lg border-b pb-2">
            Elige tus bloques para {MEAL_LABELS[activeMeal].title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FOOD_EQUIVALENTS.map((food) => {
              const isSelected = selectedFoods[activeMeal].includes(food.id)

              return (
                <div
                  key={food.id}
                  onClick={() => toggleFoodSelection(food.id)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50/50 shadow-sm'
                      : 'border-slate-100 bg-slate-50/50 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{food.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      1 porción = {food.portionAmount} {food.unitLabel}
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                    isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {isSelected && <span className="text-xs font-bold">✓</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
// app/asesor/page.tsx
'use client'

import { useState } from 'react'
import { calculateDailyPortions, DailyPlan, UserMetrics } from '@/lib/nutrition'
import DailyPortionsSummary from '@/components/DailyPortionsSummary'
import LegoMealBuilder from '@/components/LegoMealBuilder'

export default function AsesorPage() {
  const [step, setStep] = useState<'FORM' | 'SUMMARY' | 'LEGO'>('FORM')
  const [metrics, setMetrics] = useState<UserMetrics>({
    weightKg: 70,
    heightCm: 170,
    age: 25,
    gender: 'M',
    goal: 'DEFICIT',
    activityLevel: 1.55,
  })
  const [plan, setPlan] = useState<DailyPlan | null>(null)

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    const result = calculateDailyPortions(metrics)
    setPlan(result)
    setStep('SUMMARY')
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {step === 'FORM' && (
          <form onSubmit={handleCalculate} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5 max-w-md mx-auto">
            <h1 className="text-2xl font-black text-slate-950 text-center">Calcula tu Plan Nutricional</h1>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Peso (kg)</label>
                <input
                  type="number"
                  value={metrics.weightKg}
                  onChange={(e) => setMetrics({ ...metrics, weightKg: Number(e.target.value) })}
                  className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Altura (cm)</label>
                <input
                  type="number"
                  value={metrics.heightCm}
                  onChange={(e) => setMetrics({ ...metrics, heightCm: Number(e.target.value) })}
                  className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Objetivo</label>
              <select
                value={metrics.goal}
                onChange={(e) => setMetrics({ ...metrics, goal: e.target.value as any })}
                className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold cursor-pointer"
              >
                <option value="DEFICIT">🔥 Perder Grasa (Déficit)</option>
                <option value="MAINTENANCE">⚡ Mantener y Definir</option>
                <option value="SURPLUS">💪 Ganar Masa Muscular</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              Generar Mis Porciones Diarias
            </button>
          </form>
        )}

        {step === 'SUMMARY' && plan && (
          <div className="space-y-4">
            <button
              onClick={() => setStep('FORM')}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              ← Volver a calcular
            </button>
            <DailyPortionsSummary plan={plan} onStartLego={() => setStep('LEGO')} />
          </div>
        )}

        {step === 'LEGO' && plan && (
          <LegoMealBuilder
            plan={plan}
            onBack={() => setStep('SUMMARY')}
          />
        )}

      </div>
    </main>
  )
}
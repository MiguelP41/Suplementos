// components/DailyPortionsSummary.tsx
'use client'

import { DailyPlan } from '@/lib/nutrition'

interface Props {
  plan: DailyPlan
  onStartLego: () => void
}

export default function DailyPortionsSummary({ plan, onStartLego }: Props) {
  const { meals } = plan

  return (
    <div className="bg-amber-50/60 border border-amber-200/80 rounded-3xl p-6 md:p-8 max-w-lg mx-auto shadow-sm space-y-6 text-slate-900 font-sans">
      <div className="text-center space-y-1 border-b border-amber-200/60 pb-4">
        <h2 className="text-2xl font-black tracking-tight text-emerald-950 uppercase">
          Porciones Diarias
        </h2>
        <p className="text-xs font-bold text-slate-500">
          Objetivo Calculado: <span className="text-orange-600 font-black">{plan.totalKcal} kcal</span>
        </p>
      </div>

      <div className="space-y-5 text-sm">
        {/* DESAYUNO */}
        <div className="space-y-1.5">
          <h3 className="font-black text-emerald-900 text-base border-b border-emerald-900/10 pb-0.5">DESAYUNO</h3>
          <ul className="space-y-1 font-bold text-xs pl-1">
            {meals.desayuno.carbs > 0 && <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-teal-600" /> {meals.desayuno.carbs} PORCIÓN DE CARBOHIDRATO</li>}
            {meals.desayuno.proteins > 0 && <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-600" /> {meals.desayuno.proteins} PORCIONES DE PROTEÍNA</li>}
            {meals.desayuno.fats > 0 && <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> {meals.desayuno.fats} PORCIÓN DE GRASA</li>}
          </ul>
        </div>

        {/* MERIENDA AM */}
        <div className="space-y-1.5">
          <h3 className="font-black text-emerald-900 text-base border-b border-emerald-900/10 pb-0.5">MERIENDA AM</h3>
          <ul className="space-y-1 font-bold text-xs pl-1">
            {meals.meriendaAm.dairy > 0 && <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> {meals.meriendaAm.dairy} PORCIÓN DE LÁCTEO</li>}
            {meals.meriendaAm.proteins > 0 && <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-600" /> {meals.meriendaAm.proteins} PORCIÓN DE PROTEÍNA</li>}
            {meals.meriendaAm.fruits > 0 && <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> {meals.meriendaAm.fruits} PORCIÓN DE FRUTA</li>}
          </ul>
        </div>

        {/* ALMUERZO */}
        <div className="space-y-1.5">
          <h3 className="font-black text-emerald-900 text-base border-b border-emerald-900/10 pb-0.5">ALMUERZO</h3>
          <ul className="space-y-1 font-bold text-xs pl-1">
            {meals.almuerzo.carbs > 0 && <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-teal-600" /> {meals.almuerzo.carbs} PORCIONES DE CARBOHIDRATO</li>}
            {meals.almuerzo.proteins > 0 && <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-600" /> {meals.almuerzo.proteins} PORCIONES DE PROTEÍNA</li>}
            {meals.almuerzo.fats > 0 && <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> {meals.almuerzo.fats} PORCIÓN DE GRASA</li>}
            {meals.almuerzo.veggies > 0 && <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> {meals.almuerzo.veggies} PORCIÓN DE VEGETALES</li>}
          </ul>
        </div>

        {/* MERIENDA PM */}
        <div className="space-y-1.5">
          <h3 className="font-black text-emerald-900 text-base border-b border-emerald-900/10 pb-0.5">MERIENDA PM</h3>
          <ul className="space-y-1 font-bold text-xs pl-1">
            {meals.meriendaPm.fruits > 0 && <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> {meals.meriendaPm.fruits} PORCIÓN DE FRUTA</li>}
            {meals.meriendaPm.proteins > 0 && <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-600" /> {meals.meriendaPm.proteins} PORCIONES DE PROTEÍNA</li>}
          </ul>
          <p className="text-[10px] font-extrabold text-orange-700 bg-orange-100/80 p-2 rounded-xl mt-1">
            💡 NOTA: 1 scoop de proteína en polvo equivale a 3 porciones de proteína.
          </p>
        </div>

        {/* CENA */}
        <div className="space-y-1.5">
          <h3 className="font-black text-emerald-900 text-base border-b border-emerald-900/10 pb-0.5">CENA</h3>
          <ul className="space-y-1 font-bold text-xs pl-1">
            {meals.cena.carbs > 0 && <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-teal-600" /> {meals.cena.carbs} PORCIÓN DE CARBOHIDRATO</li>}
            {meals.cena.proteins > 0 && <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-600" /> {meals.cena.proteins} PORCIONES DE PROTEÍNA</li>}
            {meals.cena.fats > 0 && <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> {meals.cena.fats} PORCIONES DE GRASA</li>}
            {meals.cena.veggies > 0 && <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> {meals.cena.veggies} PORCIÓN DE VEGETALES</li>}
          </ul>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={onStartLego}
          className="w-full py-3.5 bg-slate-950 hover:bg-slate-900 active:scale-95 text-white font-bold rounded-2xl transition-all text-xs tracking-wide shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Armar mis comidas con Legos 🧱</span>
          <span>→</span>
        </button>
      </div>
    </div>
  )
}
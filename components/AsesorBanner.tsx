// components/AsesorBanner.tsx
import React from 'react'
import Link from 'next/link'

export default function AsesorBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
      <div className="bg-slate-100/80 rounded-[2.5rem] p-6 sm:p-10 md:p-16 border border-slate-200/80 relative overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Columna Izquierda: Vista previa de la UI */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-slate-200/60 space-y-5 relative z-10">
              
              <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-orange-500 text-slate-950 flex items-center justify-center font-black text-lg">
                    🤖
                  </span>
                  <div>
                    <h4 className="text-sm font-bold leading-none">Asesor Inteligente</h4>
                    <p className="text-[11px] text-slate-400 mt-1">Recomendación personalizada</p>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500">¿Cuál es tu meta principal?</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-orange-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm">
                    🏋️ Ganar masa muscular
                  </span>
                  <span className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1">
                    🔥 Quemar grasa
                  </span>
                  <span className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1">
                    ⚡ Rendimiento
                  </span>
                </div>
              </div>

              <div className="p-4 bg-orange-50/80 rounded-2xl border border-orange-200/60 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-extrabold uppercase bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md">
                    Pack Recomendado
                  </span>
                  <span className="text-xs font-bold text-slate-900">100% Personalizado</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <p className="font-bold text-sm text-slate-900">Creatina Monohidratada + Whey Protein</p>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-600 pt-2 border-t border-orange-200/50">
                  <span>Optimizado para tu ciudad y presupuesto</span>
                  <span className="text-orange-600 font-bold">100% Gratis</span>
                </div>
              </div>

              {/* Redirección directa al Asesor */}
              <Link
                href="/asesor"
                className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Iniciar diagnóstico ahora</span>
                <span>→</span>
              </Link>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Columna Derecha: Texto persuasivo y CTA */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-orange-500 text-slate-950 flex items-center justify-center font-black text-sm">
                ⚡
              </span>
              <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                IA & Nutrición Deportiva
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              Tu suplementación ideal en 30 segundos
            </h2>

            <p className="text-slate-600 text-base leading-relaxed font-medium">
              Obtén un stack de suplementos adaptado a tus metas, tolerancias alimentarias y presupuesto. Te mostramos los mejores combos disponibles en las tiendas de tu ciudad con financiamiento Cashea.
            </p>

            <ul className="space-y-3 text-sm font-semibold text-slate-800 pt-1">
              <li className="flex items-start gap-3">
                <span className="text-orange-500 font-bold text-base leading-none">✓</span>
                <span>Calcula combos según tu presupuesto exacto en USD</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 font-bold text-base leading-none">✓</span>
                <span>Filtra automáticamente opciones sin lactosa si lo necesitas</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 font-bold text-base leading-none">✓</span>
                <span>Calcula las cuotas e iniciales estimadas con Cashea</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 font-bold text-base leading-none">✓</span>
                <span>Haz el pedido directo de tu combo por WhatsApp</span>
              </li>
            </ul>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/asesor"
                className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black rounded-2xl transition-all shadow-lg shadow-orange-500/20 active:scale-95 text-center text-sm tracking-wide"
              >
                Consultar Asesor
              </Link>
              
              <div className="text-xs font-bold text-slate-500 text-center sm:text-left">
                <span>⚡ Stacks disponibles en Caracas, Valencia, Barquisimeto y Maracaibo</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
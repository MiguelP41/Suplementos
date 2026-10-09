'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Footer() {
  const [year, setYear] = useState<number | null>(null)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="bg-slate-100 text-slate-600 border-t border-slate-200/80 pt-16 pb-12 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Grid de Secciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 font-black text-2xl tracking-tighter text-slate-950">
              <span className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-sm">
                ⚡
              </span>
              <span>FitVoxel<span className="text-orange-500"></span></span>
            </Link>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm font-medium">
              El primer comparador de precios de suplementación deportiva en tiempo real. Encuentra la mejor oferta cerca de ti y paga con tu método favorito.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Precios verificados hoy
              </span>
            </div>
          </div>

          {/* Navegación rápida */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Plataforma</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <a href="#comparador-section" className="hover:text-orange-600 transition-colors">Comparador de Precios</a>
              </li>
              <li>
                <Link href="/asesor" className="hover:text-orange-600 transition-colors">Asesor IA Nutricional</Link>
              </li>
              <li>
                <a href="#" className="hover:text-orange-600 transition-colors">Tiendas Afiliadas</a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-600 transition-colors">Promociones Cashea</a>
              </li>
            </ul>
          </div>

          {/* Ciudades */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Cobertura</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-500">
              <li>📍 Caracas</li>
              <li>📍 Valencia</li>
              <li>📍 Barquisimeto</li>
              <li>📍 Maracaibo</li>
            </ul>
          </div>

          {/* Negocios & Legales */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Comercios</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <a href="#" className="hover:text-orange-600 transition-colors">Registra tu Tienda</a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-600 transition-colors">Portal Aliados</a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-600 transition-colors">Términos y Condiciones</a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-600 tra
                nsition-colors">Privacidad</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Separador y Copyright */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-semibold text-slate-500">
          <p>© {year ?? 2026} PinTechSolution Todos los derechos reservados.</p>
          <p>Diseñado para potenciar tu entrenamiento al mejor precio.</p>
        </div>

      </div>
    </footer>
  )
}
'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { generateWhatsAppLink } from '@/lib/whatsapp'
import Footer from '@/components/Footer'

interface StoreProduct {
  id: string
  price: number
  is_cashea_eligible: boolean
  products: {
    id: string
    name: string
    brand: string
    category: string
    format: string
  }
  stores: {
    name: string
    city: string
    is_flagship: boolean
  }
}

const CATEGORIES = [
  { id: 'ALL', label: 'Todos los productos', icon: '⚡' },
  { id: 'PROTEIN', label: 'Proteínas', icon: '🥛' },
  { id: 'CREATINE', label: 'Creatinas', icon: '💪' },
  { id: 'PRE_WORKOUT', label: 'Pre-Entrenos', icon: '🔥' },
  { id: 'AMINO', label: 'Aminoácidos', icon: '🧪' },
  { id: 'VITAMIN', label: 'Vitaminas', icon: '💊' },
]

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('Caracas')
  const [category, setCategory] = useState('ALL')
  const [products, setProducts] = useState<StoreProduct[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    setLoading(true)

    let req = supabase
      .from('store_products')
      .select(`
        id,
        price,
        is_cashea_eligible,
        products!inner ( id, name, brand, category, format ),
        stores!inner ( name, city, is_flagship )
      `)
      .eq('is_available', true)
      .eq('stores.city', city)

    if (category !== 'ALL') {
      req = req.eq('products.category', category)
    }

    const { data, error } = await req

    if (!error && data) {
      const sorted = (data as unknown as StoreProduct[]).sort((a, b) => {
        if (a.price !== b.price) {
          return a.price - b.price
        }
        return (b.stores.is_flagship ? 1 : 0) - (a.stores.is_flagship ? 1 : 0)
      })

      setProducts(sorted)
    } else {
      setProducts([])
    }

    setLoading(false)
  }, [city, category])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const filteredProducts = products.filter((item) => {
    if (!item?.products || !item?.stores) return false

    const q = query.toLowerCase().trim()
    if (!q) return true

    const nameMatch = item.products.name?.toLowerCase().includes(q) ?? false
    const brandMatch = item.products.brand?.toLowerCase().includes(q) ?? false
    const storeMatch = item.stores.name?.toLowerCase().includes(q) ?? false

    return nameMatch || brandMatch || storeMatch
  })

  const handleStartSearch = () => {
    document.getElementById('comparador-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-orange-500 selection:text-white font-sans">
      
      {/* 1. Menú Superior */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          
          <a href="#" className="flex items-center gap-2 font-black text-2xl tracking-tighter text-slate-950">
            <span className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-sm">
              ⚡
            </span>
            <span>suplementos<span className="text-orange-500">.</span></span>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-700">
            <a href="#" className="hover:text-orange-600 transition-colors">Para usuarios</a>
            <a href="#" className="hover:text-orange-600 transition-colors">¿Dónde comprar?</a>
            <a href="#" className="hover:text-orange-600 transition-colors">Para comercios</a>
            <a href="#" className="hover:text-orange-600 transition-colors">Generación Impulso</a>
            <a href="#" className="hover:text-orange-600 transition-colors">Preguntas Frecuentes</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/asesor"
              className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              Únete a nosotros
            </a>
          </div>

        </div>
      </header>

      {/* 2. Hero Header Naranja */}
      <section className="relative min-h-[500px] md:min-h-[550px] flex items-center justify-center bg-orange-500 text-slate-950 px-4 md:px-8 py-20 text-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 pointer-events-none"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1920&auto=format&fit=crop')` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/80 via-orange-500/60 to-orange-500/90 pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-block">
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-bold px-4 py-1.5 bg-slate-950/10 text-slate-950 border border-slate-950/20 rounded-full backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
              Comparador en tiempo real
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-slate-950 drop-shadow-sm whitespace-nowrap">
            Entrena más, gasta menos
          </h1>

          <p className="text-base md:text-xl text-slate-950/90 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-sm">
            Analizamos los precios en tiempo real de todas las tiendas de tu ciudad para que encuentres la mejor oferta.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleStartSearch}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-2xl transition-all shadow-xl shadow-slate-950/20 hover:scale-105 active:scale-95 text-sm md:text-base cursor-pointer"
            >
              <span>Explorar Ofertas</span>
              <span>↓</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Sección Informativa Directa */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <h2 className="text-3xl md:text-5xl font-black text-center text-slate-950 mb-12 md:mb-16 tracking-tight">
          Todo para tu rendimiento en un solo lugar.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 text-orange-600 font-extrabold text-xs tracking-widest uppercase bg-orange-50 px-3 py-1 rounded-lg border border-orange-200">
              ⚡ SUPLEMENTOS COMPARADOR
            </div>

            <h3 className="text-3xl md:text-4xl font-black text-slate-950 leading-tight">
              Lo que buscas, al mejor precio, en tu ciudad
            </h3>

            <p className="text-slate-600 text-base leading-relaxed font-medium">
              Proteínas, creatinas, aminoácidos y pre-entrenos con disponibilidad real. Compara precios entre tiendas físicas e hipermercados de tu zona al instante.
            </p>

            <ul className="space-y-3.5 text-sm font-bold text-slate-800 pt-2">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs">✓</span>
                Precios y stock actualizados diariamente
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs">✓</span>
                Filtra por Cashea y cuotas disponibles
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs">✓</span>
                Conexión directa por WhatsApp con las tiendas
              </li>
            </ul>

            <div className="pt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleStartSearch}
                className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-500/25 active:scale-95 text-sm cursor-pointer"
              >
                Buscar suplementos ahora
              </button>
            </div>

            <p className="text-xs font-semibold text-slate-400">
              +15 tiendas aliadas verificadas en Venezuela
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-orange-500/5 rounded-[2.5rem] p-6 md:p-10 border border-orange-500/15 relative overflow-hidden shadow-inner">
              <div className="bg-white rounded-3xl p-6 shadow-2xl shadow-orange-500/10 border border-slate-100 space-y-6 relative z-10 max-w-md mx-auto">
                <div 
                  onClick={handleStartSearch}
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-slate-400 text-xs font-medium cursor-pointer hover:bg-slate-100/80 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    🔍 ¿Qué suplemento buscas hoy?
                  </span>
                  <span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-md font-bold">Caracas</span>
                </div>

                <div className="flex gap-2 overflow-hidden">
                  <span className="px-3 py-1.5 bg-orange-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm">
                    🥛 Proteínas
                  </span>
                  <span className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1">
                    💪 Creatinas
                  </span>
                  <span className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1">
                    🔥 Pre-Entreno
                  </span>
                </div>

                <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200/60 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-extrabold uppercase bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md">
                        OPTIMUM NUTRITION
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">100% Whey Gold Standard 5Lbs</h4>
                    </div>
                    <span className="text-base font-black text-slate-900">$75.00</span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-600 pt-2 border-t border-orange-200/40">
                    <span>Disponible con <strong>Cashea</strong></span>
                    <span className="text-emerald-600 font-bold">Inicial $37.50</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleStartSearch}
                  className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Ver todas las ofertas en mi ciudad</span>
                  <span>→</span>
                </button>
              </div>

              <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-500/15 rounded-full blur-2xl pointer-events-none" />
            </div>
          </div>

        </div>
      </section>

      {/* 4. ¿Cómo funciona / Pasos del Comparador? */}
      <section className="bg-slate-100/80 border-y border-slate-200 py-16 md:py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-5 max-w-2xl mx-auto">
            <span className="inline-block mb-2 text-xs font-extrabold text-orange-600 uppercase tracking-widest bg-orange-100 px-4 py-1.5 rounded-full border border-orange-200">
              Proceso simple y transparente
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              ¿Cómo encontrar la oferta perfecta en 3 pasos?
            </h2>
            <p className="text-slate-600 text-sm font-medium">
              Eliminamos el desorden. Compara precios reales de establecimientos locales directamente desde tu celular.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm relative space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 font-black text-xl flex items-center justify-center">
                1
              </div>
              <h3 className="text-lg font-black text-slate-900">Selecciona tu Ciudad</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                Indica dónde te encuentras para ver exclusivamente las tiendas físicas e hipermercados disponibles cerca de ti.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm relative space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 font-black text-xl flex items-center justify-center">
                2
              </div>
              <h3 className="text-lg font-black text-slate-900">Compara Precios y Cashea</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                Ordenamos de forma transparente las opciones desde la más económica. Identifica fácilmente cuáles admiten pago a cuotas.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm relative space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 font-black text-xl flex items-center justify-center">
                3
              </div>
              <h3 className="text-lg font-black text-slate-900">Contacta Directo a la Tienda</h3>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                Abre un chat de WhatsApp precargado con el comercio para consultar disponibilidad inmediata o pedir tu delivery.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. SECCIÓN INSPIRADA EN LA IMAGEN (Redirige al Asesor Inteligente) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 border-b border-slate-200/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Mockup / Card Visual Izquierdo */}
          <div className="lg:col-span-6">
            <div className="bg-slate-100/80 rounded-[2.5rem] p-6 md:p-10 border border-slate-200/80 shadow-sm relative overflow-hidden min-h-[440px] flex flex-col justify-center">
              
              <div className="absolute -top-3 -left-2 text-6xl select-none pointer-events-none opacity-90">
                🏋️‍♂️
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100 space-y-2 mb-4 relative z-10 max-w-sm mx-auto w-full">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 text-orange-600 font-black text-xs px-2.5 py-1.5 rounded-xl uppercase text-center leading-tight">
                    IA <br />
                    <span className="text-[10px]">RECOM.</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Asesor Nutricional Inteligente</h4>
                    <p className="text-xs text-slate-500">Recomendaciones según tu objetivo de entrenamiento</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-2 mb-4 relative z-10 flex-wrap">
                <span className="px-3 py-1.5 bg-white text-slate-800 font-bold text-xs rounded-full shadow-sm border border-slate-200/60 flex items-center gap-1">
                  ⚡ Masa Muscular
                </span>
                <span className="px-3 py-1.5 bg-white text-slate-800 font-bold text-xs rounded-full shadow-sm border border-slate-200/60 flex items-center gap-1">
                  🔥 Pérdida de Grasa
                </span>
                <span className="px-3 py-1.5 bg-white text-slate-800 font-bold text-xs rounded-full shadow-sm border border-slate-200/60 flex items-center gap-1">
                  💪 Rendimiento
                </span>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100 space-y-3 relative z-10 max-w-sm mx-auto w-full">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">Kit Recomendado • 2 productos</span>
                    <span className="text-[10px] text-slate-400 font-medium">Creatina Monohidratada + Whey Protein</span>
                  </div>
                  <span className="text-base font-black text-slate-900">$58,00</span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Obtén tu recomendación gratis
                  </span>
                  <a
                    href="/asesor"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20"
                  >
                    Consultar
                  </a>
                </div>
              </div>

              <div className="absolute -bottom-2 -right-2 text-6xl select-none pointer-events-none opacity-90">
                🥤
              </div>

            </div>
          </div>

          {/* Información y Botón a la Derecha */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="inline-flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-sm">
                ⚡
              </span>
            </div>

            {/* Título con el mismo tamaño exacto de letra */}
            <h2 className="text-3xl md:text-4xl font-black text-slate-950 leading-tight">
              Tu guía de suplementación a un clic de distancia
            </h2>

            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
              ¿No sabes qué proteína o creatina elegir para tus metas? Nuestro asesor inteligente evalúa tus objetivos físicos y te orienta hacia la mejor suplementación disponible al mejor precio en tu ciudad.
            </p>

            <ul className="space-y-3 text-sm font-semibold text-slate-800">
              <li className="flex items-center gap-2.5">
                <span className="text-emerald-500 font-bold">✓</span>
                Proteínas, creatinas, pre-entrenos y vitaminas adaptadas a tu rutina
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-emerald-500 font-bold">✓</span>
                Reserva y consulta disponibilidad directa en tiendas físicas
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-emerald-500 font-bold">✓</span>
                Pago en cómodas cuotas con Cashea
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-emerald-500 font-bold">✓</span>
                Asesoría personalizada e inteligente al instante
              </li>
            </ul>

            <div className="pt-4 flex items-center gap-4 flex-wrap">
              <a
                href="/asesor"
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/25 text-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Ir al Asesor Inteligente</span>
                <span>→</span>
              </a>

              <span className="text-xs font-bold text-slate-500">
                Atención rápida y personalizada
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* 6. SECCIÓN DEL COMPARADOR Y PRODUCTOS */}
      <section id="comparador-section" className="bg-slate-950 text-white py-20 px-4 md:px-8 relative overflow-hidden">
        
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-12 relative z-10">
          
          {/* Encabezado */}
          <div className="text-center space-y-4 max-w-5xl mx-auto px-4">
            <p className="text-xs md:text-sm font-bold text-orange-400 uppercase tracking-widest">
              ¿Por qué comparar con nosotros?
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Encuentra la mejor opción de compra <br className="hidden sm:block" />
              para llevarte lo que necesitas hoy.
            </h2>
            <p className="text-slate-400 text-sm md:text-base font-medium max-w-2xl mx-auto">
              Filtra por tu ciudad, compara precios al instante y encuentra tiendas físicas con disponibilidad de Cashea.
            </p>
          </div>

          {/* Barra de Filtros y Buscador */}
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-2xl backdrop-blur-md space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2 relative">
                <input
                  type="text"
                  placeholder="Buscar por producto o marca (ej: Creatina, Whey, Optimum)..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all font-medium"
                />
                <svg className="w-5 h-5 absolute left-3.5 top-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <div className="relative">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full appearance-none px-4 py-3.5 bg-slate-950 border border-slate-800 focus:border-orange-500 rounded-2xl text-sm font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all cursor-pointer"
                >
                  <option value="Caracas">📍 Caracas</option>
                  <option value="Valencia">📍 Valencia</option>
                  <option value="Barquisimeto">📍 Barquisimeto</option>
                  <option value="Maracaibo">📍 Maracaibo</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar border-t border-slate-800/80">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    category === cat.id
                      ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                      : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

          </div>

          {/* Resultados Directos: Cards / Productos */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-pulse">
                  <div className="h-4 bg-slate-800 rounded w-1/3" />
                  <div className="h-6 bg-slate-800 rounded w-3/4" />
                  <div className="h-4 bg-slate-800 rounded w-1/2" />
                  <div className="h-10 bg-slate-800/50 rounded-2xl" />
                  <div className="h-10 bg-slate-800/50 rounded-2xl" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((sp, idx) => {
                const priceNum = Number(sp.price)
                const casheaInitial = priceNum * 0.5
                const casheaInstallment = casheaInitial / 3

                return (
                  <article
                    key={sp.id}
                    className="group relative p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 transition-all duration-300 flex flex-col justify-between space-y-5 shadow-xl hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                    {idx === 0 && !query && (
                      <div className="absolute top-0 right-0 bg-emerald-500 text-white font-black text-[10px] px-3.5 py-1 rounded-bl-2xl uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <span>🥇</span> Mejor Oferta
                      </div>
                    )}

                    <div className="space-y-3 pt-1">
                      <div className="flex items-center gap-2 pr-16 flex-wrap">
                        <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg">
                          {sp.products.brand}
                        </span>
                        {sp.stores.is_flagship && (
                          <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-lg border border-orange-500/30 flex items-center gap-1">
                            <span className="text-xs">⭐</span> Flagship
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-base text-white leading-snug group-hover:text-orange-400 transition-colors">
                        {sp.products.name}
                      </h3>

                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <span>Tienda:</span>
                        <strong className="text-slate-200 font-semibold">{sp.stores.name}</strong>
                      </p>
                    </div>

                    <div className="space-y-3.5 pt-4 border-t border-slate-800">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs font-semibold text-slate-400">Precio contado:</span>
                        <div className="text-right">
                          <span className="text-3xl font-black text-white tracking-tight">
                            ${priceNum.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {sp.is_cashea_eligible && (
                        <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-xs flex justify-between items-center text-slate-300">
                          <div className="flex items-center gap-1.5 font-extrabold text-orange-400">
                            <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                            <span>Cashea</span>
                          </div>
                          <span className="text-slate-200 font-bold font-mono text-[11px]">
                            Inicial ${casheaInitial.toFixed(2)} + 3x${casheaInstallment.toFixed(2)}
                          </span>
                        </div>
                      )}

                      <a
                        href={generateWhatsAppLink(
                          [{ name: sp.products.name, storeName: sp.stores.name, price: priceNum, quantity: 1 }],
                          city
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-2xl transition-all duration-200 text-xs tracking-wide shadow-md shadow-emerald-600/20 group/btn"
                      >
                        <svg className="w-4 h-4 fill-current group-hover/btn:scale-110 transition-transform" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                        </svg>
                        <span>Pedir por WhatsApp</span>
                      </a>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-slate-900/50 rounded-3xl border border-slate-800 text-slate-400 space-y-3">
              <div className="text-4xl">🔍</div>
              <h3 className="text-base font-bold text-white">No encontramos ofertas disponibles</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Prueba modificando el término de búsqueda o cambiando la ciudad seleccionada.
              </p>
            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  )
}
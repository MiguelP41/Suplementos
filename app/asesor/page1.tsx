'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { generateWhatsAppLink } from '@/lib/whatsapp'

interface StackRecommendation {
  type: 'ECONOMICO' | 'RECOMENDADO' | 'PRO'
  title: string
  items: { name: string; storeName: string; price: number }[]
  totalPrice: number
  casheaInitial: number
  casheaInstallment: number
}

export default function AsesorPage() {
  const [step, setStep] = useState(1)
  const [goal, setGoal] = useState<'MASS' | 'DEFINITION' | 'PERFORMANCE' | 'HEALTH'>('MASS')
  const [budget, setBudget] = useState<number>(80)
  const [city, setCity] = useState('Caracas')
  const [lactoseFree, setLactoseFree] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stacks, setStacks] = useState<StackRecommendation[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const handleCalculate = async () => {
    setLoading(true)

    // 1. Consultar productos disponibles en la ciudad desde Supabase
    const { data: storeProducts, error } = await supabase
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

    if (error || !storeProducts || storeProducts.length === 0) {
      generateDynamicMockStacks()
      setLoading(false)
      setStep(3)
      return
    }

    // Filtrar nulos de forma segura
    let available = (storeProducts as any[]).filter(
      (sp) => sp?.products && sp?.stores
    )

    // 2. Filtrar por intolerancia a la lactosa
    if (lactoseFree) {
      available = available.filter(
        (sp) => !sp.products.name?.toLowerCase().includes('concentrate')
      )
    }

    // 3. Ordenar: Prioridad a la Tienda Insignia (is_flagship) y luego menor precio
    available.sort((a, b) => {
      if (a.stores.is_flagship !== b.stores.is_flagship) {
        return a.stores.is_flagship ? -1 : 1
      }
      return Number(a.price) - Number(b.price)
    })

    const proteins = available.filter((sp) => sp.products.category === 'PROTEIN')
    const creatines = available.filter((sp) => sp.products.category === 'CREATINE')
    const others = available.filter((sp) => !['PROTEIN', 'CREATINE'].includes(sp.products.category))

    const calculatedStacks: StackRecommendation[] = []

    // --- COMBO 1: ECONÓMICO ---
    const cheapItem1 = creatines[0] || proteins[0] || available[0]
    const cheapItems = cheapItem1 ? [cheapItem1] : []

    if (cheapItem1 && Number(cheapItem1.price) < budget) {
      const cheapItem2 = proteins.find((p) => p.id !== cheapItem1.id) || others[0]
      if (cheapItem2 && (Number(cheapItem1.price) + Number(cheapItem2.price)) <= budget) {
        cheapItems.push(cheapItem2)
      }
    }

    if (cheapItems.length > 0) {
      const total = cheapItems.reduce((sum, item) => sum + Number(item.price), 0)
      calculatedStacks.push({
        type: 'ECONOMICO',
        title: 'Combo Esencial Básico',
        items: cheapItems.map((i) => ({
          name: i.products.name,
          storeName: i.stores.name,
          price: Number(i.price)
        })),
        totalPrice: total,
        casheaInitial: total * 0.5,
        casheaInstallment: (total * 0.5) / 3
      })
    }

    // --- COMBO 2: RECOMENDADO ---
    const recItems: any[] = []

    if (goal === 'MASS' || goal === 'DEFINITION') {
      if (proteins[0]) recItems.push(proteins[0])
      if (creatines[0]) recItems.push(creatines[0])
    } else {
      if (creatines[0]) recItems.push(creatines[0])
      if (others[0]) recItems.push(others[0])
      if (proteins[0] && recItems.length < 2) recItems.push(proteins[0])
    }

    const recTotal = recItems.reduce((sum, item) => sum + Number(item.price), 0)
    if (recItems.length > 0) {
      calculatedStacks.push({
        type: 'RECOMENDADO',
        title: goal === 'MASS' ? 'Stack Construcción Muscular' : 'Stack Alto Rendimiento',
        items: recItems.map((i) => ({
          name: i.products.name,
          storeName: i.stores.name,
          price: Number(i.price)
        })),
        totalPrice: recTotal,
        casheaInitial: recTotal * 0.5,
        casheaInstallment: (recTotal * 0.5) / 3
      })
    }

    // --- COMBO 3: PRO ---
    const proItems: any[] = []
    if (proteins[0]) proItems.push(proteins[0])
    if (creatines[0]) proItems.push(creatines[0])
    if (others[0]) proItems.push(others[0])

    const proTotal = proItems.reduce((sum, item) => sum + Number(item.price), 0)
    if (proItems.length >= 2) {
      calculatedStacks.push({
        type: 'PRO',
        title: 'Elite Performance Stack 🏆',
        items: proItems.map((i) => ({
          name: i.products.name,
          storeName: i.stores.name,
          price: Number(i.price)
        })),
        totalPrice: proTotal,
        casheaInitial: proTotal * 0.5,
        casheaInstallment: (proTotal * 0.5) / 3
      })
    }

    setStacks(calculatedStacks)
    setLoading(false)
    setStep(3)
  }

  const generateDynamicMockStacks = () => {
    const proteinName = lactoseFree ? 'Iso Whey Zero 2lb (Sin Lactosa)' : 'Whey Gold Standard 2lb'
    const proteinPrice = lactoseFree ? 55.0 : 45.0

    const mockResults: StackRecommendation[] = []

    if (budget < 60) {
      mockResults.push({
        type: 'ECONOMICO',
        title: 'Combo Básico de Entrada',
        items: [{ name: 'Creatina Monohidratada 300g', storeName: 'Central Fitness Store', price: 25.0 }],
        totalPrice: 25.0,
        casheaInitial: 12.5,
        casheaInstallment: 4.16
      })
    } else {
      mockResults.push({
        type: 'ECONOMICO',
        title: 'Combo Esencial',
        items: [
          { name: 'Creatina Monohidratada 300g', storeName: 'Central Fitness Store', price: 25.0 },
          { name: 'Multivitamínico Sports', storeName: 'Central Fitness Store', price: 15.0 }
        ],
        totalPrice: 40.0,
        casheaInitial: 20.0,
        casheaInstallment: 6.66
      })
    }

    if (goal === 'MASS') {
      mockResults.push({
        type: 'RECOMENDADO',
        title: 'Stack Aumento de Masa Muscular',
        items: [
          { name: proteinName, storeName: 'Central Fitness Store', price: proteinPrice },
          { name: 'Creatina Monohidratada 300g', storeName: 'Central Fitness Store', price: 25.0 }
        ],
        totalPrice: proteinPrice + 25.0,
        casheaInitial: (proteinPrice + 25.0) * 0.5,
        casheaInstallment: ((proteinPrice + 25.0) * 0.5) / 3
      })
    } else {
      mockResults.push({
        type: 'RECOMENDADO',
        title: 'Stack Definición & Energía',
        items: [
          { name: 'Pre-Entreno Nitro Pump', storeName: 'Central Fitness Store', price: 30.0 },
          { name: 'Creatina Monohidratada 300g', storeName: 'Central Fitness Store', price: 25.0 }
        ],
        totalPrice: 55.0,
        casheaInitial: 27.5,
        casheaInstallment: 9.16
      })
    }

    mockResults.push({
      type: 'PRO',
      title: 'Elite Performance Stack 🏆',
      items: [
        { name: proteinName, storeName: 'Central Fitness Store', price: proteinPrice },
        { name: 'Creatina Monohidratada 300g', storeName: 'Central Fitness Store', price: 25.0 },
        { name: 'Pre-Entreno Nitro Pump', storeName: 'Central Fitness Store', price: 30.0 }
      ],
      totalPrice: proteinPrice + 55.0,
      casheaInitial: (proteinPrice + 55.0) * 0.5,
      casheaInstallment: ((proteinPrice + 55.0) * 0.5) / 3
    })

    setStacks(mockResults)
  }

  // Filtrado seguro en tiempo real
  const filteredStacks = stacks.filter((stack) => {
    const q = searchQuery.toLowerCase()
    const matchesTitle = stack.title?.toLowerCase().includes(q) ?? false
    const matchesType = stack.type?.toLowerCase().includes(q) ?? false
    const matchesItems = stack.items?.some(
      (item) =>
        item.name?.toLowerCase().includes(q) || item.storeName?.toLowerCase().includes(q)
    ) ?? false
    return matchesTitle || matchesType || matchesItems
  })

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 md:p-8 flex items-center justify-center">
      <div className={`w-full transition-all duration-300 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl ${
        step === 3 ? 'max-w-6xl' : 'max-w-xl'
      }`}>
        
        {/* Header con Botón de Regreso */}
        <div className="relative text-center mb-6 pt-2">
          <Link
            href="/"
            className="absolute left-0 top-0 text-xs text-slate-400 hover:text-white flex items-center gap-1 transition py-1.5 px-3 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50"
          >
            ← Volver al Inicio
          </Link>

          <span className="inline-block text-xs font-semibold px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full mt-8 sm:mt-0">
            Asesor Técnico de Stacks ⚡
          </span>
          <h1 className="text-2xl font-bold mt-3">Tu Combo Ideal en 30 Segundos</h1>
        </div>

        {/* Paso 1: Objetivo */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-300 font-medium">1. ¿Cuál es tu objetivo principal?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'MASS', label: '💪 Ganar Masa Muscular' },
                { id: 'DEFINITION', label: '🔥 Perder Grasa / Definir' },
                { id: 'PERFORMANCE', label: '⚡ Rendimiento y Fuerza' },
                { id: 'HEALTH', label: '🌿 Salud General' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setGoal(item.id as any)}
                  className={`p-4 rounded-xl border text-left text-sm font-medium transition ${
                    goal === item.id
                      ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                      : 'border-slate-800 bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="pt-4 flex justify-between items-center">
              <Link
                href="/"
                className="text-xs text-slate-400 hover:text-slate-200 transition"
              >
                ← Salir al Inicio
              </Link>
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 transition"
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* Paso 2: Presupuesto y Ciudad */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300">Presupuesto Máximo:</span>
                <span className="text-amber-400 font-bold">${budget} USD</span>
              </div>
              <input
                type="range"
                min="30"
                max="200"
                step="5"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">Ciudad en Venezuela:</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Caracas">Caracas</option>
                <option value="Valencia">Valencia</option>
                <option value="Barquisimeto">Barquisimeto</option>
                <option value="Maracaibo">Maracaibo</option>
              </select>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={lactoseFree}
                onChange={(e) => setLactoseFree(e.target.checked)}
                className="w-5 h-5 accent-amber-500 bg-slate-800 border-slate-700 rounded"
              />
              <span className="text-sm text-slate-300">Intolerante a la lactosa (Solo proteínas Isolate)</span>
            </label>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition text-sm"
              >
                ← Atrás
              </button>
              <button
                onClick={handleCalculate}
                disabled={loading}
                className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 transition disabled:opacity-50 text-sm"
              >
                {loading ? 'Calculando Stacks...' : 'Generar Recomendación ✨'}
              </button>
            </div>
          </div>
        )}

        {/* Paso 3: Resultados */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-100">Combos Diseñados para ti:</h2>
                <p className="text-xs text-slate-400">Filtrados para {city} con presupuesto de ${budget}</p>
              </div>

              {/* Controles del Paso 3 */}
              <div className="w-full sm:w-auto flex items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Filtrar resultado..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  />
                  <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="whitespace-nowrap px-3 py-2 text-xs bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition border border-slate-700"
                >
                  🔄 Opciones
                </button>
              </div>
            </div>

            {/* Grid Horizontal en PC (3 cols) y Vertical en Móvil (1 col) */}
            {filteredStacks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStacks.map((stack, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between space-y-4 hover:border-slate-600 transition">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded">
                          {stack.type}
                        </span>
                        <span className="text-2xl font-black text-amber-400">${stack.totalPrice.toFixed(2)}</span>
                      </div>

                      <h3 className="font-bold text-lg text-white leading-snug">{stack.title}</h3>

                      <ul className="text-sm text-slate-300 space-y-2 pt-2 border-t border-slate-700/50">
                        {stack.items.map((item, i) => (
                          <li key={i} className="flex justify-between items-start text-xs sm:text-sm">
                            <span>✓ {item.name}</span>
                            <span className="text-[10px] text-slate-400 ml-2 whitespace-nowrap">({item.storeName})</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="p-3 bg-slate-900 rounded-xl border border-yellow-500/20 text-xs flex flex-col gap-1 text-slate-300">
                        <span>Estimación <b>Cashea 🟡</b>:</span>
                        <span className="text-amber-400 font-bold">
                          ${stack.casheaInitial.toFixed(2)} inicial + 3 cuotas de${stack.casheaInstallment.toFixed(2)}
                        </span>
                      </div>

                      <a
                        href={generateWhatsAppLink(
                          stack.items.map((i) => ({ name: i.name, storeName: i.storeName, price: i.price, quantity: 1 })),
                          city
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition text-sm shadow-lg shadow-emerald-950/50"
                      >
                        Pedir este Stack por WhatsApp 💬
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <p>No se encontraron combos o productos que coincidan con "<b>{searchQuery}</b>"</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-xs text-amber-400 hover:underline"
                >
                  Limpiar filtro de búsqueda
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  )
}
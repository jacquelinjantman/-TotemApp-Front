'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setTimeout(() => setShow(true), 100)
  }, [])

  const style = (delay: string) => ({
    opacity: show ? 1 : 0,
    transform: show ? 'translateY(0)' : 'translateY(-40px)',
    transition: `all 0.6s cubic-bezier(.34,1.56,.64,1) ${delay}`,
  })

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: 'linear-gradient(135deg, #F97316 0%, #84CC16 100%)' }}>

      <div className="flex flex-col items-center gap-8 text-center max-w-xs w-full">

        {/* Totem SVG animado */}
        <svg width="140" height="280" viewBox="0 0 140 280">
          {/* Bloque 1 - corona */}
          <g style={style('0.1s')}>
            <ellipse cx="50" cy="28" rx="12" ry="20" fill="#7C3AED" opacity="0.85" transform="rotate(-18,50,28)"/>
            <ellipse cx="70" cy="20" rx="11" ry="24" fill="#6D28D9"/>
            <ellipse cx="90" cy="28" rx="12" ry="20" fill="#7C3AED" opacity="0.85" transform="rotate(18,90,28)"/>
            <rect x="44" y="28" width="52" height="28" rx="7" fill="#4C1D95"/>
            <circle cx="60" cy="42" r="6" fill="#A78BFA"/>
            <circle cx="70" cy="42" r="3.5" fill="#EDE9FE"/>
            <circle cx="80" cy="42" r="6" fill="#A78BFA"/>
          </g>

          {/* Bloque 2 - cara búho */}
          <g style={style('0.35s')}>
            <ellipse cx="24" cy="92" rx="22" ry="12" fill="#15803D" opacity="0.9" transform="rotate(-15,24,92)"/>
            <ellipse cx="116" cy="92" rx="22" ry="12" fill="#15803D" opacity="0.9" transform="rotate(15,116,92)"/>
            <rect x="40" y="56" width="60" height="54" rx="10" fill="#059669"/>
            <circle cx="58" cy="74" r="10" fill="white"/>
            <circle cx="82" cy="74" r="10" fill="white"/>
            <circle cx="58" cy="74" r="6" fill="#1E3A5F"/>
            <circle cx="82" cy="74" r="6" fill="#1E3A5F"/>
            <circle cx="60" cy="72" r="2" fill="white"/>
            <circle cx="84" cy="72" r="2" fill="white"/>
            <polygon points="70,88 63,99 77,99" fill="#F59E0B"/>
          </g>

          {/* Bloque 3 - pecho */}
          <g style={style('0.6s')}>
            <rect x="42" y="110" width="56" height="40" rx="8" fill="#B45309"/>
            <line x1="42" y1="124" x2="98" y2="124" stroke="#FDE68A" strokeWidth="2" opacity="0.6"/>
            <line x1="42" y1="136" x2="98" y2="136" stroke="#FDE68A" strokeWidth="2" opacity="0.6"/>
            <circle cx="70" cy="130" r="9" fill="#F59E0B"/>
            <circle cx="70" cy="130" r="4" fill="#FEF3C7"/>
          </g>

          {/* Bloque 4 - cuerpo */}
          <g style={style('0.85s')}>
            <rect x="16" y="152" width="26" height="16" rx="5" fill="#0369A1"/>
            <rect x="98" y="152" width="26" height="16" rx="5" fill="#0369A1"/>
            <rect x="44" y="150" width="52" height="36" rx="8" fill="#0284C7"/>
            <path d="M70 162 C70 162 60 155 60 163 C60 168 70 174 70 174 C70 174 80 168 80 163 C80 155 70 162 70 162 Z" fill="#F43F5E"/>
          </g>

          {/* Bloque 5 - base */}
          <g style={style('1.1s')}>
            <rect x="46" y="186" width="48" height="34" rx="7" fill="#065F46"/>
            <line x1="46" y1="198" x2="94" y2="198" stroke="#6EE7B7" strokeWidth="2" opacity="0.5"/>
            <line x1="46" y1="210" x2="94" y2="210" stroke="#6EE7B7" strokeWidth="2" opacity="0.5"/>
            <rect x="48" y="220" width="18" height="12" rx="4" fill="#047857"/>
            <rect x="74" y="220" width="18" height="12" rx="4" fill="#047857"/>
            <rect x="42" y="228" width="12" height="7" rx="3" fill="#059669"/>
            <rect x="51" y="228" width="12" height="7" rx="3" fill="#059669"/>
            <rect x="77" y="228" width="12" height="7" rx="3" fill="#059669"/>
            <rect x="86" y="228" width="12" height="7" rx="3" fill="#059669"/>
          </g>
        </svg>

        {/* Título */}
        <div style={{
          opacity: show ? 1 : 0,
          transform: show ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.7s ease 1.4s'
        }}>
          <h1 className="text-4xl font-black text-green-900 tracking-tight drop-shadow">
            TOTEM FAMILY
          </h1>
          <p className="text-base text-green-800 font-semibold mt-2">
            Organizá tu familia en un click
          </p>
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-3 w-full" style={{
          opacity: show ? 1 : 0,
          transform: show ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.7s ease 1.7s'
        }}>
          <Link href="/login"
            className="w-full bg-green-900 text-white rounded-2xl py-4 text-base font-bold text-center hover:bg-green-800 active:scale-95 transition-all shadow-xl">
            Iniciar sesión
          </Link>
          <Link href="/register"
            className="w-full bg-white text-green-900 rounded-2xl py-4 text-base font-bold text-center hover:bg-green-50 active:scale-95 transition-all shadow-xl border-2 border-green-900">
            Crear cuenta
          </Link>
        </div>

      </div>
    </main>
  )
}
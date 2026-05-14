'use client'

import { useState } from 'react'

function getFamilyIdFromToken(token: string): string {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.familyId ?? ''
  } catch {
    return ''
  }
}

export default function NuevoHijoPage() {
  const [name, setName] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [doctorName, setDoctorName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
      return
    }

    if (!name || !birthdate) {
      setError('Nombre y fecha de nacimiento son obligatorios')
      return
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/children`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name,
        birthdate,
        schoolName,
        doctorName,
        familyId: getFamilyIdFromToken(token)
      })
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Error al agregar el hijo')
      return
    }

    setSuccess(`¡${name} fue agregado/a a la familia!`)
    setName('')
    setBirthdate('')
    setSchoolName('')
    setDoctorName('')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-xl shadow p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Agregar hijo</h1>
          <a href="/dashboard" className="text-sm text-blue-600 hover:underline">← Volver</a>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del hijo/a"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Escuela (opcional)</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="Nombre de la escuela"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Doctor/a (opcional)</label>
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              placeholder="Nombre del médico"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600 font-medium">{success}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Agregar hijo/a
          </button>
        </form>
      </div>
    </main>
  )
}
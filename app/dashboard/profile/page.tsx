'use client'

import{useState, useEffect} from 'react'
import {Eye, EyeOff} from 'lucide-react'

function getDataFromToken(token:string){
    try{
        const payload = JSON.parse(atob(token.split('.')[1]))
        return{
            userId: payload.userId ?? '',
            role: payload.role ?? '',
            firstName: payload.firstName ?? '',
        }
    }catch{
            return{userId:'', role:'', firstName:''}
        }
    }

    export default function ProfilePage(){
        const [email, setEmail]= useState('')
        const [newPassword, setNewPassword]= useState('')
        const[showPassword, setShowPassword]= useState(false)
        const[userData, setUserData]= useState({firstName : '', role:'', email:'' })
        const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
      return
    }
     const { role, firstName } = getDataFromToken(token)

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setUserData({ firstName: firstName || data.firstName, role: role || data.role, email: data.email })
        setEmail(data.email)
      })
  }, [])

async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/
      if (!passwordRegex.test(newPassword)) {
        setError('La contraseña debe tener al menos una mayúscula y un número')
        return
      }
    }

    const token = localStorage.getItem('token')
    if (!token) return

    const body: Record<string, string> = {}
    if (email !== userData.email) body.email = email
    if (newPassword) body.password = newPassword

    if (Object.keys(body).length === 0) {
      setError('No hay cambios para guardar')
      return
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Error al actualizar')
      return
    }

    setSuccess('Perfil actualizado correctamente')
    setNewPassword('')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-xl shadow p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Mi perfil</h1>
          <a href="/dashboard" className="text-sm text-blue-600 hover:underline">← Volver</a>
        </div>

        {/* Datos no editables */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
          <div>
            <p className="text-xs text-gray-400">Nombre</p>
            <p className="text-sm font-medium text-gray-800">{userData.firstName || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Rol</p>
            <p className="text-sm font-medium text-gray-800 capitalize">{userData.role || '—'}</p>
          </div>
        </div>

        {/* Datos editables */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Dejá vacío para no cambiar"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Mínimo una mayúscula y un número</p>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600 font-medium">{success}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Guardar cambios
          </button>
        </form>
      </div>
    </main>
  )
}

    


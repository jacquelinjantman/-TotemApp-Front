'use client'

import {useState} from 'react'
import {Eye, EyeOff} from 'lucide-react'

export default function RegistAccount(){
    const [tipoRegistro, setTipoRegistro] = useState<'family' | 'invitado'| null>(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [birthdate, setBirthdate] = useState('')
    const [firstName, setFirstName] = useState('')
  const [familyLastName, setFamilyLastName] = useState('')
  const [role, setRole] = useState('mama')
  const [inviteCode, setInviteCode] = useState('')
  const [roleInvitado, setRoleInvitado] = useState('abuela')
  const [phone, setPhone] = useState('')
  const [joinFamily, setJoinFamily] = useState(false)
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleRegister(e: React.FormEvent){
    e.preventDefault()
    setError('')
    setSuccess('')

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/
    if(!passwordRegex.test(password)) {
        setError('La contraseña debe contener al menos una letra mayúscula y un número')
        return
    }
    const isParent = tipoRegistro === 'family'
    const body = isParent
    ? joinFamily
    ? { email, password, birthdate, firstName, role, inviteCode: joinCode }
    : { email, password, birthdate, firstName, familyLastName, role }
  : { email, password, birthdate, phone, role: roleInvitado, inviteCode }

    const res = await fetch (`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })
    
    const data= await res.json()

    if(!res.ok){
        setError(data.error || 'Error al registrar la cuenta')
            return
    }

    setSuccess(
        isParent
        ? `¡Bienvenida ${data.familyName}! Tu cuenta fue creada.`
        : '¡Tu cuenta fue creada! Ya podés iniciar sesión.'
       )
  }

  const PasswordInput = (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mín. 1 mayúscula y 1 número"
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
      <p className="text-xs text-gray-400 mt-1">Debe tener al menos una mayúscula y un número</p>
    </div>
  )

    return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 py-10">
      <div className="w-full max-w-sm bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Crear Cuenta</h1>
        <p className="text-sm text-gray-500 mb-6">¿Cómo vas a usar la app?</p>

        {!tipoRegistro && (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setTipoRegistro('family')}
              className="w-full border-2 border-blue-200 rounded-xl p-4 text-left hover:border-blue-500 transition-colors"
            >
              <p className="font-medium text-gray-900">👨‍👩‍👧 Soy mamá o papá</p>
              <p className="text-xs text-gray-400 mt-1">Creá la cuenta principal de tu familia</p>
            </button>
            <button
              onClick={() => setTipoRegistro('invitado')}
              className="w-full border-2 border-gray-100 rounded-xl p-4 text-left hover:border-gray-300 transition-colors"
            >
              <p className="font-medium text-gray-900">👵 Soy niñera, tía o abuela</p>
              <p className="text-xs text-gray-400 mt-1">Necesitás un código de invitación</p>
            </button>
          </div>
        )}

        {tipoRegistro === 'family' && (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <button type="button" onClick={() => setTipoRegistro(null)} className="text-xs text-gray-400 hover:text-gray-600 text-left">← Volver</button>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Soy</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="mama">Mamá</option>
                <option value="papa">Papá</option>
              </select>
            </div>
            <div className="flex gap-2">
  <button
    type="button"
    onClick={() => setJoinFamily(false)}
    className={`flex-1 text-xs py-2 rounded-lg border transition-colors ${
      !joinFamily ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200'
    }`}
  >
    Crear familia
  </button>
  <button
    type="button"
    onClick={() => setJoinFamily(true)}
    className={`flex-1 text-xs py-2 rounded-lg border transition-colors ${
      joinFamily ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200'
    }`}
  >
    Unirme a una familia
  </button>
</div>

{joinFamily && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Código de invitación</label>
    <input
      type="text"
      value={joinCode}
      onChange={(e) => setJoinCode(e.target.value)}
      placeholder="Ej: AB234"
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
)}

{!joinFamily && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido familiar</label>
    <input
      type="text"
      value={familyLastName}
      onChange={(e) => setFamilyLastName(e.target.value)}
      placeholder="Apellido"
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
)}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Tu nombre completo" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido familiar</label>
              <input type="text" value={familyLastName} onChange={(e) => setFamilyLastName(e.target.value)} placeholder="García" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
              <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {PasswordInput}

            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-600 font-medium">{success}</p>}

            <button type="submit" className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors">
              Crear cuenta familiar
            </button>
          </form>
        )}

        {tipoRegistro === 'invitado' && (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <button type="button" onClick={() => setTipoRegistro(null)} className="text-xs text-gray-400 hover:text-gray-600 text-left">← Volver</button>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Soy</label>
              <select value={roleInvitado} onChange={(e) => setRoleInvitado(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="abuela">Abuela/o</option>
                <option value="tia">Tía/o</option>
                <option value="ninera">Niñera</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código de invitación</label>
              <input type="text" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} placeholder="Ej: AB234" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+54 11 1234-5678" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
              <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {PasswordInput}

            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-600 font-medium">{success}</p>}

            <button type="submit" className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors">
              Unirme a la familia
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          ¿Ya tenés cuenta?{' '}
          <a href="/login" className="text-blue-600 hover:underline">Iniciar sesión</a>
        </p>
      </div>
    </main>
  )
}




'use client'

import {useState} from 'react'


export default function RegistAccount(){

    const [tipoRegistro, setTipoRegistro] = useState<'family'| 'invitado'|null>(null)

    //campo comun
    const [email, setEmail] = useState('')
const [password, setPassword]= useState('')
const [ birthdate, setBirthdate] = useState('')
    
    //campo rol principal
    const [firstName, setFirstName] = useState('')
    const [familyLastName, setFamilyLastName] = useState('')
    const [role, setRole]= useState('mama')

    const[inviteCode, setInviteCode]=useState('')
    const [roleInvitado, setRoleInvitado] = useState('abuela')
    const [ phone, setPohone] = useState('')

    const [error, setError]=useState('')
    const [success, setSuccess] = useState('')
    
    async function handleRegister(e:React.FormEvent){
        e.preventDefault()
        setError('')
        setSuccess('')

       const isParent = tipoRegistro === 'family'

       const body = isParent
       ? {email, password, birthdate, firstName, familyLastName, role}
       : { email, password, birthdate, phone, role: roleInvitado, inviteCode}

    
    const res = await fetch ('http://localhost:4000/auth/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify(body),
    })

    const data = await res.json()

    if(!res.ok){
        setError(data.error || 'error al registrarse')
        return
    }

    setSuccess(
        isParent
        ? `Bienvenida ${data.familyName}! Tu cuenta fue creada.`
        : `Tu cuenta fue creada! Ya podes iniciar sesion.`

    )
}

return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 py-10">
       <div className="w-full max-w-sm bg-white rounded-xl shadow p-8" >
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Crear Cuenta</h1>
        <p className="text-sm text-gray-500 mb-6"> Como vas a usar la app? </p>

        {!tipoRegistro && (
            <div className =" flex flex-col gap-3">
                <button
                onClick={() => setTipoRegistro('family')}
                className=" w-full border-2 border-blue-200 rounded-xl p-4 text-left hover:border-blue-500 transition-colors"
                >
                    <p className = "font-medium text-gray-900">Soy mama o papa</p>
                    <p className = "text-xs text-gray-400 mt-1">Crea la cuenta principal</p>

                </button>
                <button
                onClick={() => setTipoRegistro ('invitado')}
                className=" w-full border-2 border-blue-200 rounded-xl p-4 text-left hover:border-blue-500 transition-colors"
                >
                    <p className = "font-medium text-gray-900">Soy ninera, tia/o o abuela/o</p>
                    <p className = "text-xs text-gray-400 mt-1">Necesitas un codigo de invitacion</p>
                </button>
                </div>
        )}

        {tipoRegistro === 'family' && (
            <form onSubmit = {handleRegister} className=" flex flex-col gap-4">
                <button type="button" onClick={() => setTipoRegistro(null)} className="text-xs text-gry-400 hover:text-gray-600 text-left"> Volver </button>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Soy</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="mama">Mama</option>
                        <option value="papa">Papa</option>
                        </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                    <input type= "text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Tu nombre completo" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido familiar</label>
                    <input type="text" value={familyLastName} onChange={(e)=> setFamilyLastName(e.target.value)} placeholder="Diaz" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
                    <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Tu contraseña" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}
                {success && <p className="text-sm text-green-500">{success}</p>}

              
                <button type="submit" className="w-full bg-blue-500 text-white rounded-lg px-3 py-2 text-sm hover:bg-blue-600 transition-colors">Crear Cuenta

                </button>
            </form>
  )}

             { /*form del invitado*/}

             {tipoRegistro === 'invitado' && (
                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <button type="button" onClick={() => setTipoRegistro(null)} className="text-xs text-gray-400 hover:text-gray-600 text-left">Volver</button>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mg-1">Soy</label>
                        <select value={roleInvitado} onChange={(e) => setRoleInvitado(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="abuela">Abuela/o</option>
                            <option value="tia">Tia/o</option>
                            <option value="ninera">Niñera</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Codigo de invitacion</label>
                        <input type="text" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} placeholder="Codigo que te dio tu familiar" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">email</label>
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/> 
                        </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">telefono</label>
                        <input type="text" value={phone} onChange={(e) => setPohone(e.target.value)} placeholder="Tu numero de telefono" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
                        <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Tu contraseña" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>

                    <div> 
                        <label className=" block text-sm font-medium text-gray-700 mb-1">Codigo de invitacion</label>
                        <input type="text" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} placeholder="ej:AB234" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />

                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}
                    {success && <p className="text-sm text-green-500">{success}</p>}

                    <button type="submit" className="w-full bg-blue-500 text-white rounded-lg px-3 py-2 text-sm hover:bg-blue-600 transition-colors">Unirme a la familia</button>
                    
                    </form>
             )}
                        
             <p className="mt-6 text-center text-sm text-gray-500">
                Ya tenes una cuenta? <a href="/login" className="text-blue-500 hover:text-blue-700">Iniciar Sesion</a>
             </p>
        </div>
       </main>
)}



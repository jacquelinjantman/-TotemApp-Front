'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'

export default  function LoginPage(){
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [error,setError] = useState ('')
    const router =useRouter()

    async function handleSubmit (e: React.FormEvent){
        e.preventDefault()
        setError('')

        const res = await fetch('${process.env.NEXT_PUBLIC_API_URL}', {
            method:'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({email,password})

        })
        const data = await res.json()

        if(!res.ok){
            setError(data.error|| 'error al iniciar sesion')
            return
            
        }
        localStorage.setItem('token',data.token)
        router.push('/dashboard')


    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-sm bg-white rounded-xl shadow p-8">
            <h1 className="tex-2x1 font-semibold text-gray-900 mb-g">Login</h1>
    
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focues:ring-2 focus:ring-blue-500"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paassword</label>
            <input type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus-ring-blue-500"
            />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
        type="submit"
        className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
       >
        Iniciar
       </button>
       <p className="mt-4 text-center text-sm text-gray-500">
         ¿No tenés cuenta?{' '}
  <a href="/register" className="text-blue-600 hover:underline">Registrate</a>
</p>
       </form>
       </div>
</main>

    )
}


              
'use client'
import {useState} from 'react'

export default function NuevoEventoPage(){
    const [title, setTitle]=useState('')
    const [type, setType]= useState('medical')
    const [startAt, setStartAt]=useState('')
    const [location, setLocation]=useState('')
    const [assignedTo, setAssignedTo]= useState('')
    const [error, setError]= useState('')
    const [success, setSuccess]= useState('')

    async function handleSubmit (e: React.FormEvent){
        e.preventDefault()
        setError('')
        setSuccess('')

        const token= localStorage.getItem('token')
        if(!token){
            window.location.href= '/login'
            return
        }
        const res = await fetch ('https://totemapp.onrender.com/events',{
            method:'POST' ,
            headers:{
                'Content-type':'application/json',
                Authorization:`Bearer ${token}`
            },
            body: JSON.stringify({
                title,
                type,
                startAt,
                location,
                assignedTo,
                familyId: 'cmnxiux0700007kuaf30pdfft'

            })
        })

        const data= await res.json()

        if(!res.ok){
            setError(data.error || 'error al crear el evento')
            return
        }

        setSuccess('evento creado')
        setTitle('')
        setStartAt('')
        setLocation('')
        setAssignedTo('')

        }
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className=" w-full max-w-sm bg-white rounded-xl shadow p-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className=" text-2x1 font-semibold text-gray-900">Nuevo Evento</h1>
                    <a href="/dashboard" className="text-sm text-blue-600 hover:underline"> Volver</a>
                 </div>

                 <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className=" bloci text-sm font-medium text-gray-700 mb-1">Titulo</label>
                        <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle (e.target.value)}
                        placeholder="turno pediatra.."
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                        <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value ="medical">Salud</option>
                            <option value="school">Escuela</option>
                            <option value="birthday">cumpleanos</option>
                            <option value= "activity">Actividad</option>
                            <option value="other">otro</option>
                        </select>
                    </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y hora </label>
                <input
                type="datetime-local"
                value={startAt}
                onChange={(e)=> setStartAt(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ouline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Responsable (op)</label>
                        <input
                        type="text"
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        placeholder="Mama, Papa ..."
                        className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {error && <p className= "text-sm text-red-500">{error}</p>}
                    {success && <p className="text-sm text-green-500">{success}</p>}


                    <button
                    type="submit"
                    className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        Crear evento
                    </button>
                 </form>
            </div>
        </main>
        )}

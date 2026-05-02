'use client'

import {useEffect, useState} from 'react'

interface Event{
    id: string
    title:string
    type: string
    starAt: string
    location: string |null
    assignedTo: string | null

}

export default function DashboardPage(){
  
    const [events, setEvents] = useState<Event[]>([])
    

    useEffect(() =>{
         const token = localStorage.getItem ('token')
        if (!token){
         window.location.href = '/login'
        return
        }
        fetch('${process.env.NEXT_PUBLIC_API_URL}', {
            headers: {Authorization: `Bearer ${token}`}
        })
        .then((res) => res.json())
        .then ((data) => {
            if (Array.isArray(data)){
                setEvents(data)
            }
        })

    }, [])
   

    return(
        <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Centro de mando familiar</h1>
        <button
        onClick={()=>{
            localStorage.removeItem('token')
            window.location.href ='/login'
        }}
        className="text-sm text-red-500 hover:text-red-700 transition-colors"
        >
            Cerrar sesion
        </button>

        <div className= "bg-white rounded-x1 shadow pp-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Proximos eventos</h2>
            <div className="flex gap-3">

          <a  href="/dashboard/new-event"
            className="text-sm text-blue-600 hover:underline">
                + New </a>

                <button
                onClick={()=> window.location.reload()}
                className='="text-sm text-gray-400 hover:text-gray-600'>
                    Actualizar
                </button>
            </div>

{events.length ===0?(
    <p className= "text-gray-400 text-sm"> sin eventos</p>
) : (
    <div className= "flex flex-col gap-3">
        {events.map((event) => (
            <div key= {event.id} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg">
                <div className="flex-1">
                    <p className=" text-sm font-medium text-gray-900"> {event.title}</p>
        <p className= "text-xs text-gray-400 mt-0.5">
            {event.type}
            {event.location && '. ${event.location}'}
            {event.assignedTo && ` · ${event.assignedTo}`}

        </p>
        </div>
        </div>
        ))}
        </div>

)}
        </div>
      </div>
    </main>
    )
}
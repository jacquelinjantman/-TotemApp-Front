'use client'

import { useEffect, useState } from 'react'

interface Child {
  id: string
  name: string
  birthdate: string
}

interface Event {
  id: string
  title: string
  type: string
  startAt: string
  location: string | null
  assignedTo: string | null
  child: Child | null
}

interface DashboardData {
  family: {
    id: string
    name: string
    inviteCode: string
  }
  children: Child[]
  members: { id: string; firstName: string; role: string }[]
  events: Event[]
  stats: {
    totalEvents: number
    unassigned: number
  }
}

const EVENT_TYPE_COLORS: Record<string, string> = {
  medical:  'bg-red-500',
  school:   'bg-green-500',
  birthday: 'bg-blue-500',
  activity: 'bg-amber-500',
  other:    'bg-gray-400',
}

const TODAY= new Date()

 function getAge(birthdate: string) {
    return Math.floor((TODAY.getTime() - new Date(birthdate).getTime()) / (365.25 * 24 * 3600 * 1000))
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr)
    return d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
  }

 function getRoleFromToken(token: string): string {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role ?? ''
  } catch {
    return ''
  }
}

function getFirstNameFromToken(token: string):string{
  try{
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.firstName ?? 'Yo'
  } catch {
    return 'Yo'
  }
}

function getCountdown(dateStr: string, from:Date){
  const diff = new Date(dateStr).getTime() - from.getTime()
  if(diff <=0) return 'Ya paso'
  const days = Math.floor(diff/ (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
   if (days > 0) return `${days}d ${hours}h ${minutes}m`
   if (hours > 0) return  `${hours}h ${minutes}m`
   return `${minutes}m`
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedChild, setSelectedChild] = useState<string>('todos')
  const [showInviteCode, setShowInviteCode] = useState(false)
  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const userRole = storedToken ? getRoleFromToken(storedToken) : ''
  const isParent = userRole === 'mama' || userRole === 'papa'
  const userName = storedToken ? getFirstNameFromToken(storedToken) : 'Yo'
  const [toast, setToast] = useState<string>('')
  const [now, setNow] = useState(new Date())
const[showMenu, setShowMenu]= useState(false)

  useEffect(() => {
  const token = localStorage.getItem('token')
  if (!token) {
    window.location.href = '/login'
    return
  }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then((res) => res.json())
    .then((d) => {
      setData(d)
      setLoading(false)
    })
}, [])

  useEffect(() => {
  const interval = setInterval(() => {
    setNow(new Date())
  }, 60000)
  return () => clearInterval(interval)
}, [])
 
  
 async function handleAssign(eventId: string, name: string) {
  const token = localStorage.getItem('token')
  if (!token) return

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ assignedTo: name })
  })

   if (res.ok) {
    setData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        events: prev.events.map((e) =>
          e.id === eventId ? { ...e, assignedTo: name } : e
        )
      }
    })
    setToast('¡Te asignaste al evento!')
    setTimeout(() => setToast(''), 3000)
  }
}

 if (loading) return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <p className="text-gray-400 text-sm">Cargando...</p>
  </div>
) 
  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-400 text-sm">Sin datos</p>
    </div>
  )

  const filteredEvents = selectedChild === 'todos'
    ? data.events
    : data.events.filter((e) => e.child?.id === selectedChild)

  
const myEvents = data.events.filter((e) => e.assignedTo === userName)
  
  return (
    <div className="min-h-screen bg-gray-50">

{toast && (
  <div className="fixed top-4 right-4 z-50 bg-green-600 text-white text-sm px-4 py-3 rounded-xl shadow-lg animate-bounce">
    {toast}
  </div>
)}
      {/* Navbar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs">🏠</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">{data.family.name}</span>
        </div>

        <div className="relative">
          <button
          onClick={()=>setShowMenu (!showMenu)}
          className="flex flex-col gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="w-5 h-0.5 bg-gray-600 block" />
            <span className="w-5 h-0.5 bg-gray-600 block" />
            <span className="w-5 h-0.5 bg-gray-600 block" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-10 bg-white border border-gray-100 rounded-xl shadow-lg p-2 w-48 z-40">
               {isParent && (
                <button
                  onClick={() => { setShowInviteCode(!showInviteCode); setShowMenu(false) }}
                  className="w-full text-left text-sm text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                >
                    👥 Invitar familiar
                </button>
          )}

         <a href="/dashboard/perfil"
          className="w-full text-left text-sm text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors block"
          >
          ✏️ Editar perfil
              </a>
       <button
                onClick={() => { localStorage.removeItem('token'); window.location.href = '/login' }}
                className="w-full text-left text-sm text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
              >
                🚪 Cerrar sesión
              </button>
         </div>
        )}
          
        </div>
      </div>

      {/* Código de invitación */}
      {showInviteCode && (
        <div className="bg-blue-50 border-b border-blue-100 px-4 py-3">
          <p className="text-xs text-blue-700 mb-1">Compartí este código para invitar a tu familia:</p>
          <div className="flex items-center gap-2">
            <code className="text-sm font-mono font-bold text-blue-900 bg-white px-3 py-1.5 rounded-lg border border-blue-200">
              {data.family.inviteCode}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(data.family.inviteCode)}
              className="text-xs text-blue-600 hover:underline"
            >
              Copiar
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto p-4 space-y-4">

        {/* Selector de hijos */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedChild('todos')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              selectedChild === 'todos'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            ★ Todos
          </button>
          {data.children.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChild(child.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                selectedChild === child.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {child.name}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                selectedChild === child.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {getAge(child.birthdate)} años
              </span>
            </button>
          ))}
           {isParent && (

           <a href="/dashboard/new-children"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs text-gray-400 border border-dashed border-gray-200 hover:border-gray-400 transition-colors"
        >
            + Agregar hijo
          </a>
           )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-3 border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Eventos próximos</p>
            <p className="text-2xl font-semibold text-gray-900">{data.stats.totalEvents}</p>
            <p className="text-[11px] text-gray-400">en 14 días</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Sin asignar</p>
            <p className={`text-2xl font-semibold ${data.stats.unassigned > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {data.stats.unassigned}
            </p>
            <p className="text-[11px] text-gray-400">requieren responsable</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Hijos</p>
            <p className="text-2xl font-semibold text-gray-900">{data.children.length}</p>
            <p className="text-[11px] text-gray-400">registrados</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Miembros</p>
            <p className="text-2xl font-semibold text-gray-900">{data.members.length}</p>
            <p className="text-[11px] text-gray-400">en la familia</p>
          </div>
        </div>

        {/* Próximos eventos */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Próximos eventos</h2>
            {isParent &&(
            <a href="/dashboard/new-event" className="text-xs text-blue-600 hover:underline">+ Nuevo</a>
            )}
            </div>

          {filteredEvents.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Sin eventos próximos</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3 py-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${EVENT_TYPE_COLORS[event.type] ?? 'bg-gray-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(event.startAt)} · {formatTime(event.startAt)}
                      {event.child && ` · ${event.child.name}`}
                      {event.location && ` · ${event.location}`}
                    </p>
                  </div>
                 <div className="flex flex-col items-end gap-1 shrink-0">
  {event.assignedTo ? (
    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
      {event.assignedTo}
    </span>
  ) : (
    <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
      Sin asignar
    </span>
  )}
  <button
    onClick={() => handleAssign(event.id, userName)}
    className="text-[10px] text-gray-400 hover:text-blue-600 transition-colors"
  >
    {event.assignedTo === userName ? '✓ Asignado' : 'Asignarme'}
  </button>
</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mis eventos asignados */}
{myEvents.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">⏰ Mis eventos</h2>
            <div className="flex flex-col gap-3">
              {myEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(event.startAt)} · {formatTime(event.startAt)}</p>
                    <p className="text-xs text-blue-500 mt-0.5">¡No te olvides de tu evento asignado!</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-xs text-gray-400 mb-0.5">Faltan</p>
                    <p className="text-sm font-bold text-blue-700">{getCountdown(event.startAt, now)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


      </div>
    </div>
  )
}
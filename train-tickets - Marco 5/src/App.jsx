import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Login from './components/Login'
import Purchase from './components/Purchase'
import Tickets from './components/Tickets'
import Validate from './components/Validate'

export default function App() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('purchase')

  useEffect(() => {
    const session = supabase.auth.getSession().then(r => {
      if (r?.data?.session?.user) setUser(r.data.session.user)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener?.subscription?.unsubscribe()
  }, [])

  const path = window.location.pathname || '/'

  if (!user) return <Login onAuth={setUser} />

  // If the url is /validate show the validator page (use same auth)
  if (path.startsWith('/validate')) return <Validate user={user} />

  return (
    <div className="app">
      <header className="header">
        <h1>Train Tickets</h1>
        <nav>
          <button onClick={() => setView('purchase')}>Comprar</button>
          <button onClick={() => setView('tickets')}>Mis Tickets</button>
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              setUser(null)
            }}
          >
            Salir
          </button>
        </nav>
      </header>

      <main>
        {view === 'purchase' && <Purchase user={user} />}
        {view === 'tickets' && <Tickets user={user} />}
      </main>
    </div>
  )
}

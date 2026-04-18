import React, { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Login({ onAuth }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSignUp(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
    else onAuth(data.user ?? null)
    setLoading(false)
  }

  async function handleSignIn(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else onAuth(data.user ?? null)
    setLoading(false)
  }

  return (
    <div className="auth">
      <h2>Iniciar sesión / Registrarse</h2>
      <form className="form">
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <div className="error">{error}</div>}
        <div className="actions">
          <button onClick={handleSignIn} disabled={loading}>Entrar</button>
          <button onClick={handleSignUp} disabled={loading}>Registrarse</button>
        </div>
      </form>
    </div>
  )
}

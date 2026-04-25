import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import './Login.css'

export default function Login({ onAuth }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Registro: crea usuario en Auth y perfil en profiles
  async function handleSignUp(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    // 1. Crear usuario en Auth
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }
    // 2. Crear perfil en tabla profiles
    const user = data.user
    if (user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { id: user.id, email, nickname, password }
        ])
      if (profileError) {
        setError('Usuario creado, pero error al guardar perfil: ' + profileError.message)
      } else {
        onAuth(user)
      }
    } else {
      setError('Usuario creado, revisa tu correo para confirmar el registro.')
    }
    setLoading(false)
  }

  // Login: autentica y obtiene perfil
  async function handleSignIn(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    if (!email || !password) {
      setError('Por favor completa email y contraseña.')
      setLoading(false)
      return
    }
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }
    const user = data.user
    if (user) {
      // Buscar perfil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      if (profileError || !profile) {
        setError('No existe un perfil asociado a este usuario. Regístrate primero.')
      } else {
        onAuth({ ...user, profile })
      }
    } else {
      setError('No se pudo iniciar sesión. Verifica tus datos.')
    }
    setLoading(false)
  }

  return (
    <div className="auth">
      <h2>Iniciar sesión / Registrarse</h2>
      <form className="form">
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <input placeholder="Nickname" value={nickname} onChange={e => setNickname(e.target.value)} required />
        {error && <div className="error">{error}</div>}
        <div className="actions">
          <button onClick={handleSignIn} disabled={loading}>Entrar</button>
          <button onClick={handleSignUp} disabled={loading}>Registrarse</button>
        </div>
      </form>
    </div>
  )
}

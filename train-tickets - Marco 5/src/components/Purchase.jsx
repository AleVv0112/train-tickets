import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import { toDataURL } from 'qrcode'

export default function Purchase({ user }) {
  const [fullName, setFullName] = useState('')
  const [time, setTime] = useState('')
  const [destination, setDestination] = useState('')
  const [station, setStation] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState(null)
  const [qr, setQr] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage(null)
    setQr(null)
    const { data, error } = await supabase.from('tickets').insert([{
      nombre_completo: fullName,
      horario_tren: time,
      destino_ruta: destination,
      estacion_salida: station,
      monto_pagado: parseFloat(amount),
      user_id: user.id
    }]).select().single()
    if (error) setMessage({ type: 'error', text: error.message })
    else {
      setMessage({ type: 'success', text: 'Ticket comprado y guardado.' })
      setFullName('')
      setTime('')
      setDestination('')
      setStation('')
      setAmount('')
      try {
        const site = typeof window !== 'undefined' ? window.location.origin : ''
        const payload = `${site}/validate?id=${data.id}`
        const url = await toDataURL(payload)
        setQr(url)
      } catch (e) {
        console.error('QR generation failed', e)
      }
    }
  }

  return (
    <div className="purchase">
      <section className="info-image">
        <img src="/info.jpg" alt="info" />
      </section>

      <section className="form-section">
        <h2>Comprar Ticket</h2>
        <form onSubmit={handleSubmit} className="form">
          <input placeholder="Nombre Completo" value={fullName} onChange={e => setFullName(e.target.value)} required />
          <input placeholder="Horario de tren" value={time} onChange={e => setTime(e.target.value)} required />
          <input placeholder="Destino de la ruta" value={destination} onChange={e => setDestination(e.target.value)} required />
          <input placeholder="Estacion donde toma el tren" value={station} onChange={e => setStation(e.target.value)} required />
          <input placeholder="Monto Pagado" type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required />
          <button type="submit">Pagar y Guardar Ticket</button>
        </form>
        {message && <div className={"msg " + message.type}>{message.text}</div>}
        {qr && (
          <div style={{marginTop:12}}>
            <h4>QR del Ticket</h4>
            <img src={qr} alt="QR" style={{width:180}} />
          </div>
        )}
      </section>
    </div>
  )
}

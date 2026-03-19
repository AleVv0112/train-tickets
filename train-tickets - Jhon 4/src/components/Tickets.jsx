import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { toDataURL } from 'qrcode'

export default function Tickets({ user }) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      const { data, error } = await supabase.from('tickets').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      if (mounted) {
        setTickets(data ?? [])
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [user])

  return (
    <div className="tickets">
      <h2>Mis Tickets</h2>
      {loading && <div>Cargando...</div>}
      {!loading && tickets.length === 0 && <div>No hay tickets.</div>}
      <ul>
        {tickets.map(t => (
          <li key={t.id} className="ticket">
            <TicketWithQR ticket={t} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function TicketWithQR({ ticket }) {
  const [qr, setQr] = useState(null)

  useEffect(() => {
    let mounted = true
    const site = typeof window !== 'undefined' ? window.location.origin : ''
    const payload = `${site}/validate?id=${ticket.id}`
    toDataURL(payload).then(url => { if (mounted) setQr(url) }).catch(() => {})
    return () => { mounted = false }
  }, [ticket])

  return (
    <div>
      <strong>{ticket.nombre_completo}</strong>
      <div>Horario: {ticket.horario_tren}</div>
      <div>Destino: {ticket.destino_ruta}</div>
      <div>Estación: {ticket.estacion_salida}</div>
      <div>Monto: ${ticket.monto_pagado}</div>
      {qr && <img src={qr} alt="QR" style={{width:120,marginTop:8}} />}
    </div>
  )
}

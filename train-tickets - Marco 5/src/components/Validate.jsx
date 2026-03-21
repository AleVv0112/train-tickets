import React, { useEffect, useState } from 'react'

export default function Validate() {
  const [ticket, setTicket] = useState(null)
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')
    if (!id) return setStatus({ ok: false, text: 'No se proporcionó id en la URL' })
    fetchTicket(id)
  }, [])

  async function fetchTicket(id) {
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch(`/.netlify/functions/verify?id=${encodeURIComponent(id)}`)
      const json = await res.json()
      if (!json.ok || !json.ticket) {
        setStatus({ ok: false, text: 'Ticket no encontrado o inválido' })
        setLoading(false)
        return
      }
      setTicket(json.ticket)
      setStatus({ ok: !json.ticket.used, text: json.ticket.used ? 'Ticket ya usado' : 'Ticket válido' })
    } catch (err) {
      setStatus({ ok: false, text: 'Error al validar: ' + err.message })
    }
    setLoading(false)
  }

  async function markUsed() {
    if (!ticket) return
    setLoading(true)
    try {
      const res = await fetch(`/.netlify/functions/verify?id=${encodeURIComponent(ticket.id)}&markUsed=1`)
      const json = await res.json()
      if (!json.ok) setStatus({ ok: false, text: 'No se pudo marcar como usado' })
      else {
        setTicket(json.ticket)
        setStatus({ ok: false, text: 'Ticket marcado como usado' })
      }
    } catch (err) {
      setStatus({ ok: false, text: 'Error al marcar: ' + err.message })
    }
    setLoading(false)
  }

  return (
    <div style={{padding:20,display:'flex',flexDirection:'column',alignItems:'center'}}>
      <h2>Validador de Tickets</h2>
      {loading && <div>Cargando...</div>}
      {!loading && status && (
        <div style={{padding:20,borderRadius:8,background: status.ok ? '#d4edda' : '#f8d7da',color: status.ok ? '#155724' : '#721c24',width:'100%',maxWidth:600,textAlign:'center'}}>
          <h3>{status.text}</h3>
          {ticket && (
            <div style={{marginTop:12}}>
              <div><strong>{ticket.nombre_completo}</strong></div>
              <div>Horario: {ticket.horario_tren}</div>
              <div>Destino: {ticket.destino_ruta}</div>
              <div>Estación: {ticket.estacion_salida}</div>
              <div>Monto: ${ticket.monto_pagado}</div>
            </div>
          )}
        </div>
      )}

      {ticket && !ticket.used && (
        <div style={{marginTop:16}}>
          <button onClick={markUsed} style={{padding:'10px 18px',background:'#1e88e5',color:'#fff',border:'none',borderRadius:6}}>Marcar como usado</button>
        </div>
      )}

      {!ticket && !loading && <div style={{marginTop:12}}>Escanea un QR que apunte a /validate?id=&lt;id&gt; o abre la URL directamente</div>}
    </div>
  )
}

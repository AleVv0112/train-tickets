import React, { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import './TicketCard.css'

function classLabel(value) {
  if (value === 'primera') return 'Primera Clase'
  if (value === 'ejecutiva') return 'Ejecutiva'
  return 'Economica'
}

export default function TicketCard({ ticket, showActions = false }) {
  const [qrImage, setQrImage] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [showQr, setShowQr] = useState(true)

  // QR apunta a la URL absoluta del ticket aprobado
  const qrPayload = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return baseUrl + '/ticket-aprobado/' + ticket.ticketNumber;
  }, [ticket])

  useEffect(() => {
    let active = true

    QRCode.toDataURL(qrPayload, {
      width: 220,
      margin: 1,
      color: {
        dark: '#0b1f3a',
        light: '#ffffff'
      }
    }).then(url => {
      if (active) setQrImage(url)
    })

    return () => {
      active = false
    }
  }, [qrPayload])

  function downloadTicket() {
    const content = [
      'RailTicket Pro',
      `Ticket: ${ticket.ticketNumber}`,
      `Pasajero: ${ticket.passengerName}`,
      `Ruta: ${ticket.origin} - ${ticket.destination}`,
      `Fecha: ${ticket.date}`,
      `Hora: ${ticket.time}`,
      `Asiento: ${ticket.seat}`,
      `Clase: ${classLabel(ticket.travelClass)}`,
      `Pasajeros: ${ticket.passengers}`,
      `Precio: USD ${ticket.price}`
    ].join('\n')

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${ticket.ticketNumber}.txt`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <article className="ticket-card">
      <div className="ticket-main">
        <div className="ticket-heading">
          <h4>{ticket.ticketNumber}</h4>
          <span className="ticket-pill">{classLabel(ticket.travelClass)}</span>
        </div>

        <div className="ticket-route">
          <strong>{ticket.origin}</strong>
          <span>{' -> '}</span>
          <strong>{ticket.destination}</strong>
        </div>

        <div className="ticket-grid">
          <p>
            <span>Pasajero</span>
            {ticket.passengerName}
          </p>
          <p>
            <span>Fecha</span>
            {ticket.date}
          </p>
          <p>
            <span>Hora</span>
            {ticket.time}
          </p>
          {/* <p>
            <span>Asiento</span>
            {ticket.seat}
          </p> */}
          <p>
            <span>Pasajeros</span>
            {ticket.passengers}
          </p>
          <p>
            <span>Precio</span>
            USD {ticket.price}
          </p>
        </div>

        {showActions ? (
          <div className="ticket-actions">
            <button type="button" onClick={downloadTicket}>
              Descargar
            </button>
            <button type="button" onClick={() => setExpanded(prev => !prev)}>
              {expanded ? 'Ocultar Detalles' : 'Ver Detalles'}
            </button>
            <button type="button" onClick={() => setShowQr(prev => !prev)}>
              {showQr ? 'Ocultar QR' : 'Mostrar QR'}
            </button>
          </div>
        ) : null}

        {expanded ? (
          <p className="ticket-extra">
            Compra registrada en {new Date(ticket.createdAt).toLocaleString()} con validacion digital
            para acceso rapido en estaciones habilitadas.
          </p>
        ) : null}
      </div>

      {showQr ? (
        <aside className="ticket-qr-pane">
          <p>QR de acceso</p>
          {qrImage ? <img src={qrImage} alt={`QR ${ticket.ticketNumber}`} /> : <span>Cargando...</span>}
        </aside>
      ) : null}
    </article>
  )
}

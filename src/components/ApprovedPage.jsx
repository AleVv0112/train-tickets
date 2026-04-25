import React from 'react'
import { useNavigate } from 'react-router-dom'
import './ApprovedPage.css'

export default function ApprovedPage({ ticket, onRemoveTicket }) {
  const navigate = useNavigate()

  if (!ticket) {
    return (
      <section className="approved-shell section-shell section-spacing">
        <h2>Ticket no encontrado</h2>
        <p>El ticket solicitado no existe o aun no fue generado.</p>
        <button className="approved-link-btn" onClick={() => navigate('/mis-tickets')}>
          Ir a Mis Tickets
        </button>
      </section>
    )
  }

  // Handlers para borrar ticket y navegar
  async function handleAndNavigate(to) {
    if (onRemoveTicket) await onRemoveTicket()
    navigate(to)
  }

  return (
    <section className="approved-shell section-shell section-spacing">
      <div className="approved-icon" aria-hidden="true">
        <span />
      </div>
      <h1>Ticket Aprobado</h1>
      <p className="approved-subtitle">Acceso autorizado. Buen viaje.</p>

      <div className="approved-ticket-details">
        <p>
          <span>Numero de ticket</span>
          {ticket.ticketNumber}
        </p>
        <p>
          <span>Pasajero</span>
          {ticket.passengerName}
        </p>
        <p>
          <span>Ruta</span>
          {`${ticket.origin} - ${ticket.destination}`}
        </p>
        <p>
          <span>Fecha y hora</span>
          {ticket.date} | {ticket.time}
        </p>
        {/* <p>
          <span>Asiento</span>
          {ticket.seat}
        </p> */}
      </div>

      <div className="approved-actions">
        <button className="approved-link-btn" onClick={() => handleAndNavigate('/mis-tickets')}>
          Ver Mis Tickets
        </button>
        <button className="approved-link-btn secondary" onClick={() => handleAndNavigate('/comprar')}>
          Comprar Otro Ticket
        </button>
      </div>
    </section>
  )
}

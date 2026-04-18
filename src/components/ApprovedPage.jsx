import React from 'react'
import { Link } from 'react-router-dom'
import './ApprovedPage.css'

export default function ApprovedPage({ ticket }) {
  if (!ticket) {
    return (
      <section className="approved-shell section-shell section-spacing">
        <h2>Ticket no encontrado</h2>
        <p>El ticket solicitado no existe o aun no fue generado.</p>
        <Link to="/mis-tickets" className="approved-link-btn">
          Ir a Mis Tickets
        </Link>
      </section>
    )
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
        <p>
          <span>Asiento</span>
          {ticket.seat}
        </p>
      </div>

      <div className="approved-actions">
        <Link to="/mis-tickets" className="approved-link-btn">
          Ver Mis Tickets
        </Link>
        <Link to="/comprar" className="approved-link-btn secondary">
          Comprar Otro Ticket
        </Link>
      </div>
    </section>
  )
}

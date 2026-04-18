import React from 'react'
import TicketCard from './TicketCard'
import './TicketList.css'

export default function TicketList({ tickets }) {
  return (
    <section className="section-shell section-spacing">
      <header className="section-header">
        <h2>Mis Tickets</h2>
        <p>Visualiza todos tus tickets comprados, consulta detalles y descarga cada comprobante.</p>
      </header>

      {tickets.length === 0 ? (
        <div className="empty-ticket-state">
          <h3>Aun no compraste tickets</h3>
          <p>Dirigete a la seccion Comprar Ticket para generar tu primer viaje.</p>
        </div>
      ) : (
        <div className="ticket-list-grid">
          {tickets.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} showActions />
          ))}
        </div>
      )}
    </section>
  )
}

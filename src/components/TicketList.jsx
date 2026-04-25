import React from 'react'
import TicketCard from './TicketCard'
import './TicketList.css'

export default function TicketList({ tickets }) {
  // Mapea los campos de la base de datos a los que espera TicketCard
  const mapTicket = (ticket) => ({
    id: ticket.id,
    ticketNumber: ticket.id || '',
    passengerName: ticket.nombre_completo || '',
    date: ticket.created_at ? ticket.created_at.slice(0, 10) : '',
    time: ticket.horario_tren || '',
    origin: ticket.estacion_salida || '',
    destination: ticket.destino_ruta || '',
    seat: ticket.seat || '-', // Si no hay asiento, muestra '-'
    travelClass: ticket.travelClass || 'economica', // Default
    passengers: ticket.passengers || 1,
    price: ticket.monto_pagado || '',
  })

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
            <TicketCard key={ticket.id} ticket={mapTicket(ticket)} showActions />
          ))}
        </div>
      )}
    </section>
  )
}

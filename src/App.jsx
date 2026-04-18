import React, { useEffect, useMemo, useState } from 'react'
import { Route, Routes, useNavigate, useParams } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TicketForm from './components/TicketForm'
import TicketCard from './components/TicketCard'
import TicketList from './components/TicketList'
import QRScanner from './components/QRScanner'
import ApprovedPage from './components/ApprovedPage'
import Footer from './components/Footer'
import './App.css'

const STORAGE_KEY = 'railticketpro_tickets'

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function generateTicket(formData) {
  const classPrice = {
    economica: 35,
    ejecutiva: 60,
    primera: 95
  }
  const seats = ['A', 'B', 'C', 'D']
  const wagon = Math.floor(Math.random() * 10) + 1
  const seat = `${wagon}${randomFrom(seats)}${Math.floor(Math.random() * 20) + 1}`
  const ticketNumber = `RTP-${Date.now().toString().slice(-7)}-${Math.floor(
    100 + Math.random() * 900
  )}`
  const unitPrice = classPrice[formData.travelClass]
  const passengers = Number(formData.passengers)

  return {
    id: crypto.randomUUID(),
    ticketNumber,
    passengerName: formData.passengerName,
    origin: formData.origin,
    destination: formData.destination,
    date: formData.date,
    time: formData.time,
    passengers,
    travelClass: formData.travelClass,
    seat,
    price: unitPrice * passengers,
    createdAt: new Date().toISOString()
  }
}

function HomePage() {
  return (
    <>
      <Hero />
      <section className="features-section section-shell">
        <article>
          <h3>Compra instantanea</h3>
          <p>Reserva en segundos y recibe tu ticket digital con codigo QR listo para abordar.</p>
        </article>
        <article>
          <h3>Rutas en tiempo real</h3>
          <p>Explora rutas nacionales con horarios optimizados para viajes de negocio o turismo.</p>
        </article>
        <article>
          <h3>Validacion segura</h3>
          <p>Escaneo rapido y verificacion al instante para accesos confiables en cada estacion.</p>
        </article>
      </section>
    </>
  )
}

function BuyTicketPage({ onGenerate, latestTicket }) {
  return (
    <section className="section-shell section-spacing">
      <header className="section-header">
        <h2>Comprar Ticket</h2>
        <p>Completa los datos del viaje para generar tu ticket digital de RailTicket Pro.</p>
      </header>

      <TicketForm onGenerate={onGenerate} />

      {latestTicket ? (
        <div className="latest-ticket-wrapper">
          <h3>Ticket generado</h3>
          <TicketCard ticket={latestTicket} showActions />
        </div>
      ) : null}
    </section>
  )
}

function ApprovedRoute({ tickets }) {
  const { ticketId } = useParams()
  const ticket = tickets.find(item => item.id === ticketId)

  return <ApprovedPage ticket={ticket} />
}

export default function App() {
  const [tickets, setTickets] = useState([])
  const [latestTicketId, setLatestTicketId] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) setTickets(parsed)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
  }, [tickets])

  const latestTicket = useMemo(
    () => tickets.find(item => item.id === latestTicketId) ?? null,
    [tickets, latestTicketId]
  )

  function handleGenerateTicket(formData) {
    const newTicket = generateTicket(formData)
    setTickets(prev => [newTicket, ...prev])
    setLatestTicketId(newTicket.id)
  }

  function handleGoToTicket(ticketId) {
    navigate(`/ticket-aprobado/${ticketId}`)
  }

  return (
    <div className="app-root">
      <Navbar />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/comprar"
            element={<BuyTicketPage onGenerate={handleGenerateTicket} latestTicket={latestTicket} />}
          />
          <Route path="/mis-tickets" element={<TicketList tickets={tickets} />} />
          <Route
            path="/escanear-qr"
            element={<QRScanner tickets={tickets} onValidate={handleGoToTicket} />}
          />
          <Route path="/ticket-aprobado/:ticketId" element={<ApprovedRoute tickets={tickets} />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

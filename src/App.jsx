import React, { useEffect, useState } from 'react'
import { Route, Routes, useNavigate, useParams } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TicketForm from './components/TicketForm'
import TicketCard from './components/TicketCard'
import TicketList from './components/TicketList'
import QRScanner from './components/QRScanner'
import ApprovedPage from './components/ApprovedPage'
import Footer from './components/Footer'
import Login from './components/Login'
import { supabase } from './supabaseClient'
import './App.css'

// Eliminado uso de localStorage para tickets

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function generateTicket(formData, userId) {
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
    user_id: userId,
    nombre_completo: formData.passengerName,
    horario_tren: formData.time,
    destino_ruta: formData.destination,
    estacion_salida: formData.origin,
    monto_pagado: unitPrice * passengers,
    created_at: new Date().toISOString(),
    used: false
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

function mapTicketDBToCard(ticket) {
  if (!ticket) return null;
  return {
    id: ticket.id,
    ticketNumber: ticket.id || '',
    passengerName: ticket.nombre_completo || '',
    date: ticket.created_at ? ticket.created_at.slice(0, 10) : '',
    time: ticket.horario_tren || '',
    origin: ticket.estacion_salida || '',
    destination: ticket.destino_ruta || '',
    travelClass: ticket.travelClass || 'economica',
    passengers: ticket.passengers || 1,
    price: ticket.monto_pagado || '',
  }
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
          <TicketCard ticket={mapTicketDBToCard(latestTicket)} showActions />
        </div>
      ) : null}
    </section>
  )
}




function ApprovedRoute({ tickets, onTicketValidated }) {
  const { ticketId } = useParams()
  const ticketRaw = tickets.find(item => item.id === ticketId)
  const ticket = mapTicketDBToCard(ticketRaw)

  // Función para borrar el ticket solo cuando el usuario lo decida
  async function handleRemoveTicket() {
    if (ticketRaw) {
      await supabase.from('tickets').delete().eq('id', ticketRaw.id)
      if (onTicketValidated) onTicketValidated(ticketRaw.id)
    }
  }

  return <ApprovedPage ticket={ticket} onRemoveTicket={handleRemoveTicket} />
}


function App() {
  const [tickets, setTickets] = useState([])
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // Detectar usuario autenticado al cargar la app
  useEffect(() => {
    async function getCurrentUser() {
      const { data } = await supabase.auth.getUser()
      if (data && data.user) {
        // Buscar perfil
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
        setUser({ ...data.user, profile })
      }
    }
    getCurrentUser()
  }, [])

  // Cargar tickets del usuario autenticado
  useEffect(() => {
    async function fetchTickets() {
      if (user && user.id) {
        const { data, error } = await supabase
          .from('tickets')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        if (!error) setTickets(data)
      } else {
        setTickets([])
      }
    }
    fetchTickets()
  }, [user])

  async function handleGenerateTicket(formData) {
    if (!user || !user.id) return
    const newTicket = generateTicket(formData, user.id)
    const { data, error } = await supabase
      .from('tickets')
      .insert([newTicket])
      .select('*')
    if (!error && data && data.length > 0) {
      setTickets(prev => [data[0], ...prev])
    }
  }

  function handleGoToTicket(ticketId) {
    navigate(`/ticket-aprobado/${ticketId}`)
  }

  function handleAuth(user) {
    setUser(user)
    navigate('/')
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    setTickets([])
    navigate('/')
  }

  // Eliminar ticket del estado local tras validación
  function handleTicketValidated(ticketId) {
    setTickets(prev => prev.filter(t => t.id !== ticketId))
  }

  return (
    <div className="app-root">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/comprar"
            element={<BuyTicketPage onGenerate={handleGenerateTicket} latestTicket={tickets[0] || null} />}
          />
          <Route path="/mis-tickets" element={<TicketList tickets={tickets} />} />
          <Route
            path="/escanear-qr"
            element={<QRScanner tickets={tickets} onValidate={handleGoToTicket} />}
          />
          <Route path="/ticket-aprobado/:ticketId" element={<ApprovedRoute tickets={tickets} onTicketValidated={handleTicketValidated} />} />
          <Route path="/login" element={<Login onAuth={handleAuth} />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App

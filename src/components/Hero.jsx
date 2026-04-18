import React from 'react'
import { Link } from 'react-router-dom'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero-section section-shell">
      <div className="hero-content">
        <p className="hero-eyebrow">Movilidad inteligente para ciudades conectadas</p>
        <h1>Compra Tickets de Tren en Segundos</h1>
        <p>
          Reservas rapidas, rutas disponibles en toda la red y acceso digital seguro con QR para
          abordar sin filas.
        </p>
        <div className="hero-actions">
          <Link to="/comprar" className="hero-btn hero-btn-primary">
            Comprar Ahora
          </Link>
          <Link to="/mis-tickets" className="hero-btn hero-btn-outline">
            Ver Mis Tickets
          </Link>
        </div>
      </div>
      <div className="hero-visual" aria-hidden="true" />
    </section>
  )
}

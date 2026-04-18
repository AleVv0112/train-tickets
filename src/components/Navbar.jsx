import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/comprar', label: 'Comprar Ticket' },
  { to: '/mis-tickets', label: 'Mis Tickets' },
  { to: '/escanear-qr', label: 'Escanear QR' },
  { to: '/soporte', label: 'Soporte', fallback: true }
]

export default function Navbar() {
  return (
    <header className="navbar-shell">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span className="brand-text">RailTicket Pro</span>
        </Link>

        <nav className="nav-links" aria-label="Navegacion principal">
          {links.map(link =>
            link.fallback ? (
              <a key={link.label} href="#footer" className="nav-item">
                {link.label}
              </a>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </NavLink>
            )
          )}
        </nav>

        <button className="login-btn" type="button">
          Iniciar Sesion
        </button>
      </div>
    </header>
  )
}

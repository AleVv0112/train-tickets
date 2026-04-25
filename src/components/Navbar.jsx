import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/comprar', label: 'Comprar Ticket' },
  { to: '/mis-tickets', label: 'Mis Tickets' },
  { to: '/escanear-qr', label: 'Escanear QR' }
]

export default function Navbar({ user, onLogout }) {
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
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {user && user.profile ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="login-btn" style={{pointerEvents: 'none', userSelect: 'none'}}>
              {user.profile.nickname}
            </span>
            <button type="button" className="login-btn" onClick={onLogout} style={{marginLeft: 0}}>
              Cerrar sesión
            </button>
          </div>
        ) : (
          <NavLink to="/login" className="login-btn">
            Iniciar Sesion
          </NavLink>
        )}
      </div>
    </header>
  )
}

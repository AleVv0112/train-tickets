import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer-shell" id="footer">
      <div className="footer-grid">
        <article>
          <h4>RailTicket Pro</h4>
          <p>Plataforma moderna para compra y validacion digital de tickets de tren.</p>
        </article>

        <article>
          <h4>Enlaces Rapidos</h4>
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/comprar">Comprar Ticket</Link>
            </li>
            <li>
              <Link to="/mis-tickets">Mis Tickets</Link>
            </li>
            <li>
              <Link to="/escanear-qr">Escanear QR</Link>
            </li>
          </ul>
        </article>

        <article>
          <h4>Contacto</h4>
          <ul>
            <li>soporte@railticketpro.com</li>
            <li>+54 11 4321 2300</li>
            <li>Centro de Atencion 24/7</li>
          </ul>
        </article>

        <article>
          <h4>Redes</h4>
          <ul>
            <li>
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://www.x.com" target="_blank" rel="noreferrer">
                X
              </a>
            </li>
          </ul>
        </article>
      </div>
      <p className="footer-copy">2026 RailTicket Pro. Todos los derechos reservados.</p>
    </footer>
  )
}

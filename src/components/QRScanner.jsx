import React, { useEffect, useRef, useState } from 'react'
import './QRScanner.css'

export default function QRScanner({ tickets, onValidate }) {
  const [selectedId, setSelectedId] = useState(tickets[0]?.id || '')
  const [scanning, setScanning] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!selectedId && tickets[0]) {
      setSelectedId(tickets[0].id)
    }
  }, [tickets, selectedId])

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    []
  )

  function validateNow() {
    if (!selectedId) return
    onValidate(selectedId)
  }

  function simulateDetection() {
    if (!selectedId) return
    setScanning(true)

    timerRef.current = setTimeout(() => {
      onValidate(selectedId)
    }, 1600)
  }

  return (
    <section className="section-shell section-spacing">
      <header className="section-header">
        <h2>Escanear QR</h2>
        <p>
          Lector de validacion visual para comprobar la autenticidad de tickets y habilitar el
          acceso.
        </p>
      </header>

      {tickets.length === 0 ? (
        <div className="scanner-empty">
          <h3>No hay tickets para validar</h3>
          <p>Primero compra un ticket para probar el flujo de escaneo QR.</p>
        </div>
      ) : (
        <div className="scanner-grid">
          <div className={`scanner-box ${scanning ? 'is-scanning' : ''}`}>
            <div className="scanner-frame" aria-hidden="true">
              <span className="scanner-line" />
            </div>
            <p>{scanning ? 'Detectando QR...' : 'Area de validacion QR'}</p>
          </div>

          <div className="scanner-controls">
            <label>
              Ticket a validar
              <select value={selectedId} onChange={event => setSelectedId(event.target.value)}>
                {tickets.map(ticket => (
                  <option key={ticket.id} value={ticket.id}>
                    {`${ticket.ticketNumber} | ${ticket.origin} - ${ticket.destination}`}
                  </option>
                ))}
              </select>
            </label>

            <div className="scanner-actions">
              <button type="button" onClick={simulateDetection}>
                Detectar QR
              </button>
              <button type="button" onClick={validateNow} className="scanner-validate-btn">
                Validar QR
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

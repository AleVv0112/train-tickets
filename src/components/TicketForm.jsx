import React, { useMemo, useState } from 'react'
import './TicketForm.css'

const stations = [
  'San José',
  'Alajuela',
  'Cartago',
  'Heredia',
  'Guanacaste',
  'Puntarenas',
  'Limón'
]

const times = ['06:00', '08:30', '11:10', '13:45', '16:20', '19:00', '21:40']

const initialForm = {
  passengerName: '',
  origin: 'San José',
  destination: 'Alajuela',
  date: new Date().toISOString().slice(0, 10),
  time: '08:30',
  passengers: '1',
  travelClass: 'economica'
}

export default function TicketForm({ onGenerate }) {
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')

  const destinations = useMemo(
    () => stations.filter(station => station !== form.origin),
    [form.origin]
  )

  function handleChange(event) {
    const { name, value } = event.target
    setForm(prev => ({ ...prev, [name]: value }))

    if (name === 'origin' && value === form.destination) {
      const firstAlternative = stations.find(station => station !== value) || ''
      setForm(prev => ({ ...prev, destination: firstAlternative }))
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!form.passengerName.trim()) {
      setMessage('Ingresa el nombre del pasajero para generar el ticket.')
      return
    }

    onGenerate(form)
    setMessage('Ticket generado con exito.')
    setForm(prev => ({ ...prev, passengerName: '', passengers: '1' }))
  }

  return (
    <section className="ticket-form-shell">
      <form className="ticket-form-grid" onSubmit={handleSubmit}>
        <label>
          Pasajero
          <input
            type="text"
            name="passengerName"
            value={form.passengerName}
            onChange={handleChange}
            placeholder="Nombre completo"
            required
          />
        </label>

        <label>
          Origen
          <select name="origin" value={form.origin} onChange={handleChange}>
            {stations.map(station => (
              <option key={station} value={station}>
                {station}
              </option>
            ))}
          </select>
        </label>

        <label>
          Destino
          <select name="destination" value={form.destination} onChange={handleChange}>
            {destinations.map(station => (
              <option key={station} value={station}>
                {station}
              </option>
            ))}
          </select>
        </label>

        <label>
          Fecha
          <input type="date" name="date" value={form.date} onChange={handleChange} required />
        </label>

        <label>
          Hora
          <select name="time" value={form.time} onChange={handleChange}>
            {times.map(slot => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </label>

        <label>
          Cantidad de pasajeros
          <input
            type="number"
            name="passengers"
            min="1"
            max="8"
            value={form.passengers}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Clase
          <select name="travelClass" value={form.travelClass} onChange={handleChange}>
            <option value="economica">Economica</option>
            <option value="ejecutiva">Ejecutiva</option>
            <option value="primera">Primera Clase</option>
          </select>
        </label>

        <button type="submit" className="ticket-submit-btn">
          Generar Ticket
        </button>
      </form>

      {message ? <p className="ticket-form-message">{message}</p> : null}
    </section>
  )
}

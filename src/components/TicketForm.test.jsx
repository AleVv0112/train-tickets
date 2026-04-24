import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TicketForm from './TicketForm'

describe('TicketForm', () => {
  it('renderiza los campos principales del formulario', () => {
    render(<TicketForm onGenerate={() => {}} />)

    expect(screen.getByLabelText('Pasajero')).toBeInTheDocument()
    expect(screen.getByLabelText('Origen')).toBeInTheDocument()
    expect(screen.getByLabelText('Destino')).toBeInTheDocument()
    expect(screen.getByLabelText('Fecha')).toBeInTheDocument()
    expect(screen.getByLabelText('Hora')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Generar Ticket' })).toBeInTheDocument()
  })

  it('muestra mensaje y no envia si el nombre de pasajero esta vacio', async () => {
    const user = userEvent.setup()
    const onGenerate = vi.fn()

    render(<TicketForm onGenerate={onGenerate} />)

    await user.type(screen.getByLabelText('Pasajero'), '   ')
    await user.click(screen.getByRole('button', { name: 'Generar Ticket' }))

    expect(onGenerate).not.toHaveBeenCalled()
    expect(
      screen.getByText('Ingresa el nombre del pasajero para generar el ticket.')
    ).toBeInTheDocument()
  })

  it('envia los datos al generar un ticket valido', async () => {
    const user = userEvent.setup()
    const onGenerate = vi.fn()

    render(<TicketForm onGenerate={onGenerate} />)

    await user.type(screen.getByLabelText('Pasajero'), 'Ana Perez')
    await user.selectOptions(screen.getByLabelText('Origen'), 'Mendoza')
    await user.selectOptions(screen.getByLabelText('Destino'), 'Rosario')
    await user.clear(screen.getByLabelText('Cantidad de pasajeros'))
    await user.type(screen.getByLabelText('Cantidad de pasajeros'), '2')
    await user.selectOptions(screen.getByLabelText('Clase'), 'ejecutiva')
    await user.click(screen.getByRole('button', { name: 'Generar Ticket' }))

    expect(onGenerate).toHaveBeenCalledTimes(1)
    expect(onGenerate).toHaveBeenCalledWith(
      expect.objectContaining({
        passengerName: 'Ana Perez',
        origin: 'Mendoza',
        destination: 'Rosario',
        passengers: '2',
        travelClass: 'ejecutiva'
      })
    )
    expect(screen.getByText('Ticket generado con exito.')).toBeInTheDocument()
  })
})

describe('Pruebas intencionalmente fallidas', () => {
  it.skip('deberia fallar a proposito', () => {
    expect(2 + 2).toBe(5)
  })

  it.skip('deberia fallar porque el texto no existe', () => {
    expect(screen.getByText('Este texto no existe')).toBeInTheDocument()
  })
})

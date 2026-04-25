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
    await user.selectOptions(screen.getByLabelText('Origen'), 'San José')
    await user.selectOptions(screen.getByLabelText('Destino'), 'Alajuela')
    await user.clear(screen.getByLabelText('Cantidad de pasajeros'))
    await user.type(screen.getByLabelText('Cantidad de pasajeros'), '2')
    await user.selectOptions(screen.getByLabelText('Clase'), 'ejecutiva')
    await user.click(screen.getByRole('button', { name: 'Generar Ticket' }))

    expect(onGenerate).toHaveBeenCalledTimes(1)
    expect(onGenerate).toHaveBeenCalledWith(
      expect.objectContaining({
        passengerName: 'Ana Perez',
        origin: 'San José',
        destination: 'Alajuela',
        passengers: '2',
        travelClass: 'ejecutiva'
      })
    )
    expect(screen.getByText('Ticket generado con exito.')).toBeInTheDocument()
  })

  it('limpia el campo pasajero tras enviar un ticket', async () => {
    const user = userEvent.setup()
    render(<TicketForm onGenerate={() => {}} />)

    const pasajeroInput = screen.getByLabelText('Pasajero')
    await user.type(pasajeroInput, 'Juan Test')
    await user.click(screen.getByRole('button', { name: 'Generar Ticket' }))
    expect(pasajeroInput).toHaveValue('')
  })

  it('cambia el destino si el origen cambia a la misma provincia', async () => {
    const user = userEvent.setup()
    render(<TicketForm onGenerate={() => {}} />)

    // Cambia origen a "Alajuela" y luego destino a "San José"
    await user.selectOptions(screen.getByLabelText('Origen'), 'Alajuela')
    await user.selectOptions(screen.getByLabelText('Destino'), 'San José')
    // Ahora cambia origen a "San José", destino debería cambiar automáticamente
    await user.selectOptions(screen.getByLabelText('Origen'), 'San José')
    expect(screen.getByLabelText('Destino')).not.toHaveValue('San José')
  })


  it('el botón está habilitado por defecto', () => {
    render(<TicketForm onGenerate={() => {}} />)
    expect(screen.getByRole('button', { name: 'Generar Ticket' })).toBeEnabled()
  })
})

describe('Pruebas intencionalmente fallidas', () => {
  it.skip('falla porque el botón no existe', () => {
    render(<TicketForm onGenerate={() => {}} />)
    // El botón con este texto no existe
    expect(screen.getByRole('button', { name: 'Botón que no existe' })).toBeInTheDocument()
  })

  it.skip('falla porque el campo no está en el formulario', () => {
    render(<TicketForm onGenerate={() => {}} />)
    // El campo con esta etiqueta no existe
    expect(screen.getByLabelText('Correo Electrónico')).toBeInTheDocument()
  })
})

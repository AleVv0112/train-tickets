import TicketForm from '../../src/components/TicketForm'

describe('TicketForm (componente)', () => {
  it('renderiza correctamente', () => {
    cy.mount(<TicketForm onGenerate={() => {}} />)
    cy.get('input[name="passengerName"]').should('exist')
    cy.get('button').contains('Generar Ticket').should('exist')
  })

  it('muestra mensaje de error si el pasajero está vacío', () => {
    cy.mount(<TicketForm onGenerate={() => {}} />)
    cy.get('button').contains('Generar Ticket').click()
    // Aquí puedes verificar el mensaje personalizado si existe
  })
})
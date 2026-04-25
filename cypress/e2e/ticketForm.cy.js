describe('TicketForm E2E', () => {
  it('debe mostrar error nativo si el pasajero está vacío', () => {
    cy.visit('http://localhost:5173/comprar') // Cambia el puerto si tu app usa otro
    cy.get('button').contains('Generar Ticket').click()
    cy.get('input[name="passengerName"]').then($input => {
      expect($input[0].validationMessage).to.eq('Please fill out this field')
    })
  })

  it('debe generar ticket correctamente', () => {
    cy.visit('http://localhost:5173/comprar')
    cy.get('input[name="passengerName"]').type('Ana Perez')
    cy.get('select[name="origin"]').select('San José')
    cy.get('select[name="destination"]').select('Alajuela')
    cy.get('input[name="passengers"]').clear().type('2')
    cy.get('select[name="travelClass"]').select('ejecutiva')
    cy.get('button').contains('Generar Ticket').click()
    cy.contains('Ticket generado con exito.').should('exist')
  })
})
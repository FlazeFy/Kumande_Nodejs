// Test Case ID : TC-C001
// Related FR : FR-004
// Modules : Consume

// Components
import '../../packages/builders/test'

describe('Kumande Cases - TC-C001', () => {
    // Template
    const methodCaseOne = 'get'
    const ord = 'desc'
    const is_paginate = true
    const mainUrl = '/api/v1/consume/'+ord

    it(methodCaseOne.toUpperCase() + ' - Get all consume', () => {
        cy.request({
            method: methodCaseOne, 
            url: mainUrl + '?page=1',
        }).then(dt => {
            cy.templateGet(dt, is_paginate)
            cy.templatePagination(mainUrl, dt.body.data.last_page)
        })
    })
})
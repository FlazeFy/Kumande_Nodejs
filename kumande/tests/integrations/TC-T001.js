// Test Case ID : TC-T001
// Related FR : FR-005
// Modules : Tag

// Components
import '../../packages/builders/test'

describe('Kumande Cases - TC-T001', () => {
    // Template
    const methodCaseOne = 'get'
    const ord = 'desc'
    const is_paginate = true
    const mainUrl = '/api/v1/tag/'+ord

    it(methodCaseOne.toUpperCase() + ' - Get all tag', () => {
        cy.request({
            method: methodCaseOne, 
            url: mainUrl + '?page=1',
        }).then(dt => {
            cy.templateGet(dt, is_paginate)
            cy.templatePagination(mainUrl, dt.body.data.last_page)
        })
    })
})
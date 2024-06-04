// Test Case ID : TC-C002
// Related FR : ...
// Modules : Consume

// Components
import '../../packages/builders/test'

describe('Kumande Cases - TC-C002', () => {
    // Template
    const methodCaseOne = 'get'
    const ord = 'desc'
    const is_paginate = false
    const mainUrl = '/api/v1/stats/'

    it(methodCaseOne.toUpperCase() + ' - Get total consume by type', () => {
        cy.request({
            method: methodCaseOne, 
            url: mainUrl + 'consume_type/'+ord,
        }).then(dt => {
            cy.templateGet(dt, is_paginate)
        })
    })
    it(methodCaseOne.toUpperCase() + ' - Get total consume by from', () => {
        cy.request({
            method: methodCaseOne, 
            url: mainUrl + 'consume_from/'+ord,
        }).then(dt => {
            cy.templateGet(dt, is_paginate)
        })
    })
    it(methodCaseOne.toUpperCase() + ' - Get total consume by provide', () => {
        cy.request({
            method: methodCaseOne, 
            url: mainUrl + 'consume_provide/'+ord,
        }).then(dt => {
            cy.templateGet(dt, is_paginate)
        })
    })
    it(methodCaseOne.toUpperCase() + ' - Get total consume by main ingredient', () => {
        cy.request({
            method: methodCaseOne, 
            url: mainUrl + 'consume_main_ing/'+ord,
        }).then(dt => {
            cy.templateGet(dt, is_paginate)
        })
    })
})
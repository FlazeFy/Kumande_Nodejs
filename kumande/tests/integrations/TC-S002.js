// Test Case ID : TC-S002
// Related FR : ...
// Modules : Schedyle

// Components
import '../../packages/builders/test'

describe('Kumande Cases - TC-S002', () => {
    // Template
    const methodCaseOne = 'get'
    const is_paginate = false
    const year = new Date().getFullYear()
    const month_number = new Date().getMonth()

    it(methodCaseOne.toUpperCase() + ' - Get total daily consume cal in a month', () => {
        cy.request({
            method: methodCaseOne, 
            url: `/api/v1/consume/total/day/cal/month/${month_number}/year/${year}`,
        }).then(dt => {
            cy.templateGet(dt, is_paginate)
        })
    })
    it(methodCaseOne.toUpperCase() + ' - Get total spend monthly', () => {
        cy.request({
            method: methodCaseOne, 
            url: `/api/v1/payment/total/monthly/${year}`,
        }).then(dt => {
            cy.templateGet(dt, is_paginate)
        })
    })
    it(methodCaseOne.toUpperCase() + ' - Get all budget in a year', () => {
        cy.request({
            method: methodCaseOne, 
            url: `/api/v1/payment/budget/${year}`,
        }).then(dt => {
            cy.templateGet(dt, is_paginate)
        })
    })
})
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

    function templateColumnValidateCases(resultItem){
        expect(resultItem).to.have.property('data')
        const dataArr = resultItem.data
        expect(dataArr).to.be.an('array')

        const stringFields = ['context']
        const integerFields = ['total']

        // Validate column
        cy.templateValidateColumn(dataArr, stringFields, 'string', false)
        cy.templateValidateColumn(dataArr, integerFields, 'number', false)
    }

    it(methodCaseOne.toUpperCase() + ' - Get total daily consume cal in a month', () => {
        cy.request({
            method: methodCaseOne, 
            url: `/api/v1/consume/total/day/cal/month/${month_number}/year/${year}`,
        }).then(dt => {
            cy.templateGet(dt, is_paginate)
            const resultItem = dt.body
            templateColumnValidateCases(resultItem)
        })
    })
    it(methodCaseOne.toUpperCase() + ' - Get total spend monthly', () => {
        cy.request({
            method: methodCaseOne, 
            url: `/api/v1/payment/total/monthly/${year}`,
        }).then(dt => {
            cy.templateGet(dt, is_paginate)
            const resultItem = dt.body
            templateColumnValidateCases(resultItem)
        })
    })
    it(methodCaseOne.toUpperCase() + ' - Get all budget in a year', () => {
        cy.request({
            method: methodCaseOne, 
            url: `/api/v1/payment/budget/${year}`,
        }).then(dt => {
            cy.templateGet(dt, is_paginate)
            const resultItem = dt.body
            templateColumnValidateCases(resultItem)
        })
    })
})
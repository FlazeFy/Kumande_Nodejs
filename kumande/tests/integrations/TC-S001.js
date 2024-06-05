// Test Case ID : ...
// Related FR : ...
// Modules : Schedule

// Components
import '../../packages/builders/test'

describe('Kumande Cases - TC-S001', () => {
    // Template
    const methodCaseOne = 'get'
    const is_paginate = false
    const mainUrl = '/api/v1/schedule'

    it(methodCaseOne.toUpperCase() + ' - Get my schedule', () => {
        cy.request({
            method: methodCaseOne, 
            url: mainUrl,
        }).then(dt => {
            cy.templateGet(dt, is_paginate)
            const resultItem = dt.body
            expect(resultItem).to.have.property('data')
            const dataArr = resultItem.data
            expect(dataArr).to.be.an('array')

            const stringFields = ['day','time','schedule_consume']

            // Validate column
            cy.templateValidateColumn(dataArr, stringFields, 'string', false)
        })
    })
})
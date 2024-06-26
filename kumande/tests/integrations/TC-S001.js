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
    const userId = '2d98f524-de02-11ed-b5ea-0242ac120002'

    it(methodCaseOne.toUpperCase() + ' - Get my schedule', () => {
        cy.request({
            method: methodCaseOne, 
            url: mainUrl,
            headers: {
                'X-Custom-Header': userId
            }
        }).then(dt => {
            cy.templateGet(dt, is_paginate)
            const resultItem = dt.body
            expect(resultItem).to.have.property('data')
            const dataArr = resultItem.data
            expect(dataArr).to.be.an('array')
            
            const typeDay = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat','Sun']
            const typeTime = ['Breakfast','Lunch','Dinner']
            const stringFields = ['day','time','schedule_consume']

            // Validate column
            cy.templateValidateContain(dataArr, typeDay, 'day')
            cy.templateValidateContain(dataArr, typeTime, 'time')
            cy.templateValidateColumn(dataArr, stringFields, 'string', false)
        })
    })
})
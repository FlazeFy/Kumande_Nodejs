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
            const resultItem = dt.body.data
            
            expect(resultItem).to.have.property('data')
            const dataArr = resultItem.data
            expect(dataArr).to.be.an('array')

            const stringFields = ['id','firebase_id','slug_name','consume_type','consume_name','consume_from','created_at','created_by']
            const integerFields = ['is_favorite']
            const integerNullableFields = ['payment_price']
            const stringNullableFields = ['consume_comment','payment_method','updated_at','deleted_at']

            // Validate column
            cy.templateValidateColumn(dataArr, stringFields, 'string', false)
            cy.templateValidateColumn(dataArr, stringNullableFields, 'string', true)
            cy.templateValidateColumn(dataArr, integerFields, 'number', false)
            cy.templateValidateColumn(dataArr, integerNullableFields, 'number', true)

        })
    })
})
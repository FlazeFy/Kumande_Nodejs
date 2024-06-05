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
            const resultItem = dt.body.data
            expect(resultItem).to.have.property('data')
            const dataArr = resultItem.data
            expect(dataArr).to.be.an('array')

            const stringFields = ['tag_slug','tag_name','created_at']
            const stringNullableFields = ['created_by']
            const integerFields = ['total_used']

            // Validate column
            cy.templateValidateColumn(dataArr, stringFields, 'string', false)
            cy.templateValidateColumn(dataArr, stringNullableFields, 'string', true)
            cy.templateValidateColumn(dataArr, integerFields, 'number', false)

            cy.templatePagination(mainUrl, dt.body.data.last_page)
        })
    })
})
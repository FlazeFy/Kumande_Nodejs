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
    const userId = '2d98f524-de02-11ed-b5ea-0242ac120002'

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

    it(methodCaseOne.toUpperCase() + ' - Get total consume by type', () => {
        cy.request({
            method: methodCaseOne, 
            url: mainUrl + 'consume_type',
            headers: {
                'X-Custom-Header': userId
            }
        }).then(dt => {
            cy.templateGet(dt, is_paginate)
            const resultItem = dt.body
            templateColumnValidateCases(resultItem)
        })
    })
    it(methodCaseOne.toUpperCase() + ' - Get total consume by from', () => {
        cy.request({
            method: methodCaseOne, 
            url: mainUrl + 'consume_from',
            headers: {
                'X-Custom-Header': userId
            }
        }).then(dt => {
            cy.templateGet(dt, is_paginate)
            const resultItem = dt.body
            templateColumnValidateCases(resultItem)
        })
    })
    it(methodCaseOne.toUpperCase() + ' - Get total consume by provide', () => {
        cy.request({
            method: methodCaseOne, 
            url: mainUrl + 'consume_provide',
            headers: {
                'X-Custom-Header': userId
            }
        }).then(dt => {
            cy.templateGet(dt, is_paginate)
            const resultItem = dt.body
            templateColumnValidateCases(resultItem)
        })
    })
    it(methodCaseOne.toUpperCase() + ' - Get total consume by main ingredient', () => {
        cy.request({
            method: methodCaseOne, 
            url: mainUrl + 'consume_main_ing',
            headers: {
                'X-Custom-Header': userId
            }
        }).then(dt => {
            cy.templateGet(dt, is_paginate)
            const resultItem = dt.body
            templateColumnValidateCases(resultItem)
        })
    })
})
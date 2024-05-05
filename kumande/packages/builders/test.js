Cypress.Commands.add('templateGet', (obj, is_paginate) => {
    let dataType

    // Builder
    if(is_paginate){
        dataType = 'object'
    } else {
        dataType = 'array'
    }

    // Test
    expect(obj.status).to.equal(200)
    expect(obj.body.message).to.be.a('string')

    if(is_paginate == false){
        expect(obj.body.data).to.be.a(dataType)
    }

    if(is_paginate == true){
        expect(obj.body.data.data).to.be.a('array')
    }
});

Cypress.Commands.add('templatePagination', (url, max) => {
    for (let index = 1; index <= max; index++) {
        cy.request({
            method: 'GET', 
            url: url + '?page='+index,
        }).then(dt => {
            expect(dt.status).to.equal(200)
        })
    }
});
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Kumande API Docs (NodeJS)',
            version: '1.0.0',
            description: 'API Documentation for Kumande Bot & Desktop Apps',
            contact: {
                name: 'Developer Support',
                email: 'flazen.edu@gmail.com',
            },
        },
    },
    apis: [
        './modules/analyze/http_handlers/*.js',
        './modules/auth/http_handlers/*.js',
        './modules/consume/http_handlers/*.js',
        './modules/payment/http_handlers/*.js',
        './modules/schedule/http_handlers/*.js',
        './modules/stats/http_handlers/*.js',
        './modules/tags/http_handlers/*.js'
    ],
};

const specs = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    specs
};

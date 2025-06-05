const swaggerJsdoc = require('swagger-jsdoc');


const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Dinner Hosting API Documentation',
            version: '1.0.0',
            description: 'API documentation for the Dinner Hosting application',
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'api server',
            }
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'jwt'
                }
            }
        }
    },
    apis: [
        './docs/swagger/routes/*.yaml',    // Route documentation
        './docs/swagger/schemas/*.yaml'     // Schema definitions
    ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec; 
import swaggerJsdoc from "swagger-jsdoc";

const options = {

    definition: {

        openapi: "3.0.0",

        info: {

            title:
                "Real-Time Job Market Insight API",

            version: "1.0.0",

            description:
                "API documentation for the Real-Time Job Market Insight System"

        },

        servers: [

            {

                url: "http://localhost:8000",

                description:
                    "Development server"

            }

        ],

        components: {

            securitySchemes: {

                bearerAuth: {

                    type: "http",

                    scheme: "bearer",

                    bearerFormat: "JWT"

                }

            }

        }

    },

    apis: [

        "./routes/*.js",

        "./routes/**/*.js",

        "../routes/*.js"

    ]

};

const swaggerSpec =
    swaggerJsdoc(options);

export default swaggerSpec;
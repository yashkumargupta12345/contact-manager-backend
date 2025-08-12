import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Contact Manager API',
      version: '1.0.0',
      description: 'A simple Contact Manager API with CRUD operations',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Contact: {
          type: 'object',
          required: ['name', 'email', 'phone'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated contact ID',
            },
            name: {
              type: 'string',
              description: 'Contact name',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Contact email',
              example: 'john.doe@example.com',
            },
            phone: {
              type: 'string',
              description: 'Contact phone number',
              example: '+1234567890',
            },
          },
        },
        ContactInput: {
          type: 'object',
          required: ['name', 'email', 'phone'],
          properties: {
            name: {
              type: 'string',
              description: 'Contact name',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Contact email',
              example: 'john.doe@example.com',
            },
            phone: {
              type: 'string',
              description: 'Contact phone number',
              example: '+1234567890',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
            },
            data: {
              oneOf: [
                { $ref: '#/components/schemas/Contact' },
                { type: 'array', items: { $ref: '#/components/schemas/Contact' } }
              ]
            },
            count: {
              type: 'number',
              description: 'Number of contacts (for get all contacts)',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
            },
            message: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js', './controllers/*.js'],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
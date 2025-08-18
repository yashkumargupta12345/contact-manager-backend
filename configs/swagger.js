import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Contact Manager API',
      version: '1.0.0',
      description: 'A simple Contact Manager API with CRUD operations and authentication',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token in the format: your_token_here (without Bearer prefix)'
        },
      },
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
            isFavorite: {
              type: 'boolean',
              description: 'Whether contact is marked as favorite',
              example: false,
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of tag IDs associated with contact'
            }
          },
        },
        Tag: {
          type: 'object',
          required: ['name'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated tag ID',
            },
            name: {
              type: 'string',
              description: 'Tag name',
              example: 'Work',
            },
            color: {
              type: 'string',
              description: 'Tag color in hex format',
              example: '#FF5733',
            },
            createdBy: {
              type: 'string',
              description: 'User ID who created the tag',
            },
            usageCount: {
              type: 'number',
              description: 'Number of times tag is used',
              example: 5,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Tag creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Tag last update timestamp',
            }
          },
        },
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated user ID',
            },
            name: {
              type: 'string',
              description: 'User name',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
              example: 'john.doe@example.com',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp',
            }
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Login successful'
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User'
                },
                token: {
                  type: 'string',
                  description: 'JWT token for authentication',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                }
              }
            }
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
                { $ref: '#/components/schemas/Tag' },
                { $ref: '#/components/schemas/User' },
                { type: 'array', items: { $ref: '#/components/schemas/Contact' } },
                { type: 'array', items: { $ref: '#/components/schemas/Tag' } }
              ]
            },
            count: {
              type: 'number',
              description: 'Number of items returned',
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
    // Add global security requirement
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js'],
};

const specs = swaggerJsdoc(options);

// Custom Swagger UI options
const swaggerOptions = {
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true, // Keep authorization after page refresh
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true
  }
};

export { specs, swaggerUi, swaggerOptions };
module.exports = {
  params: {
    type: 'object',
    properties: {
      name: {
        type: 'object',
        properties: {
          firstName: {
            type: 'string',
            required: true,
          },
          middleName: {
            type: 'string',
          },
          lastName: {
            type: 'string',
          }
        }
      },
      email: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            emailId: {
              type: 'string',
              format: 'email',
            },
            tag: {
              type: 'string',
              enum: ['work', 'personal']
            }
          }
        }
      },
      phoneNumber: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            number: {
              type: 'integer',
            },
            tag: {
              type: 'string',
              enum: ['work', 'personal']
            }
          }
        }
      },
    },
    required: ['email'],
  },
};

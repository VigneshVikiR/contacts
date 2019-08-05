module.exports = {
  params: {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      contacts: {
        type: 'array',
        minItems: 1,
        items: {
          _id: {
            type: 'string'
          }
        }
      }
    }
  }
};

module.exports = {
  params: {
    type: 'object',
    index: {
      type: 'integer',
      default: 10,
    },
    limit: {
      type: 'integer',
      default: 10,
    },
    searchValue: {
      type: 'string'
    }
  }
};

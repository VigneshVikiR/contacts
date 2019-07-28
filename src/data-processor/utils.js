const mongoose = require('mongoose');
const _ = require('lodash');

let ObjectId = mongoose.Types.ObjectId;

module.exports.validateObjectId = (_id) => ObjectId.isValid(_id);

module.exports.getAddedItems = (data) => {
  let lineItems = _.filter(data, function (lineItem) {
    return (!lineItem.isDeleted && !lineItem._id);
  });
  return {
    lineItems
  }
};
module.exports.getEditedItems = (data) => {
  let lineItems = _.filter(data, function (lineItem) {
    return (!lineItem.isDeleted && lineItem._id);
  });
  return {
    _ids: _.map(lineItems, '_id'),
    lineItems
  }
};
module.exports.getDeletedItems = (data) => {
  let lineItems = _.filter(data, function (lineItem) {
    return lineItem.isDeleted;
  });
  return {
    _ids: _.map(lineItems, '_id')
  }
};

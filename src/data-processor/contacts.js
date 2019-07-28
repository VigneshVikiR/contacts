const _ = require('lodash');

const ContactsModel = require('../models/contacts');
const { getAddedItems, getEditedItems, getDeletedItems } = require('./utils');

const contactsDataProcessor = {
  createContact: async (data) => {
    try {
      let newContact = new ContactsModel(data);
      return newContact.save();
    } catch (err) {
      throw err;
    }
  },
  deleteContact: async _id => {
    try {
      let result = await ContactsModel.updateOne({ _id }, { isActive: false });
      logger.log({
        level: 'info',
        message: 'deleteContact-Success',
      });
      return result;
    } catch (err) {
      logger.log({
        level: 'error',
        message: `viewContact-${err.message}`,
      });
      throw err;
    }
  },
  getContact: async _id => {
    try {
      let result = await ContactsModel.findOne({ _id, isActive: true });
      logger.log({
        level: 'info',
        message: 'viewContact-Success',
      });
      return result;
    } catch (err) {
      logger.log({
        level: 'error',
        message: `viewContact-${err.message}`,
      });
      throw err;
    }
  },
  editContact: async (_id, data) => {
    try {
      let doUpdate = false;
      let updateQuery = {
        _id
      };

      const updateData = {};
      if (data.name) {
        doUpdate = true;
        updateData.name = data.name;
      }
      if (data.email) {
        let addedItems = getAddedItems(data.email);
        if (addedItems.lineItems && addedItems.lineItems.length) {
          doUpdate = true;
          updateData['$push'] = updateData['$push'] || {};
          updateData['$push'].email = {
            $each: addedItems.lineItems
          };
        }
      }
      if (data.phone) {
        let addedItems = getAddedItems(data.phone);
        if (addedItems.lineItems && addedItems.lineItems.length) {
          doUpdate = true;
          updateData['$push'] = updateData['$push'] || {};
          updateData['$push'].phone = {
            '$each': addedItems.lineItems
          };
        }
      }
      let result = {};
      if (doUpdate) {
        result = await ContactsModel.updateOne(updateQuery, updateData, { new: true });
        delete updateData['$push']
      }

      if (data.email) {
        let deletedItems = getDeletedItems(data.email);
        if (deletedItems._ids && deletedItems._ids.length) {
          doUpdate = true;
          updateData['$pull'] = updateData['$pull'] || {};
          updateData['$pull'].email = {
            _id: {
              $in: deletedItems._ids
            }
          };
        }
      }
      if (data.phone) {
        let deletedItems = getDeletedItems(data.phone);
        if (deletedItems._ids && deletedItems._ids.length) {
          doUpdate = true;
          updateData['$pull'] = updateData['$pull'] || {};
          updateData['$pull'].phone = {
            _id: {
              $in: deletedItems._ids
            }
          };
        }
      }
      if (doUpdate)
        result = await ContactsModel.updateOne(updateQuery, updateData, { new: true });

      if (data.email) {
        let editedItems = getEditedItems(data.email);
        _.each(editedItems.lineItems, async (lineItem) => {
          let updateQuery = {
            _id,
            email: {
              $elemMatch: {
                _id: lineItem._id
              }
            }
          };

          const updateData = { $set: { "email.$": lineItem } };
          result = await ContactsModel.updateOne(updateQuery, updateData, { new: true });
        })
      }
      if (data.phone) {
        let editedItems = getEditedItems(data.phone);
        _.each(editedItems.lineItems, async (lineItem) => {
          let updateQuery = {
            _id,
            phone: {
              $elemMatch: {
                _id: lineItem._id
              }
            }
          };

          const updateData = { $set: { "phone.$": lineItem } };
          result = await ContactsModel.updateOne(updateQuery, updateData, { new: true });
        })
      }
      logger.log({
        level: 'info',
        message: 'editContact-Success',
      });
      return result;
    }
    catch (err) {
      logger.log({
        level: 'error',
        message: `editContact-${err.message}`,
      });
      throw err;
    }
  },
  listContact: async (data = {}) => {
    try {
      let index = data.index || 0,
        limit = data.limit || 10,
        updateQuery = {
          isActive: data.isActive || true
        };
      if (data.searchValue) {
        updateQuery = buildSearchQuery(data.searchValue)
      }
      return ContactsModel.find(updateQuery).limit(limit).skip(index).sort({ createdAt: 1 });
    } catch (err) {
      throw err;
    }
  },
  getCount: async (data) => {
    try {
      let updateQuery = {};
      if (data.searchValue) {
        updateQuery = buildSearchQuery(data.searchValue)
      }
      return ContactsModel.countDocuments(updateQuery);
    } catch (err) {

    }
  }
};

const buildSearchQuery = (searchValue) => {
  let updateQuery = [];
  let searchKeys = [
    {
      key: "name.firstName",
      isArrayElement: false
    }, {
      key: "name.middleName",
      isArrayElement: false
    }, {
      key: "name.lastName",
      isArrayElement: false
    }, {
      path: "phone",
      key: "phoneNo",
      isArrayElement: true
    }, {
      path: "email",
      key: "emailId",
      isArrayElement: true
    }
  ];
  _.each(searchKeys, (searchKey) => {
    if (searchKey.isArrayElement) {
      updateQuery.push({
        [path]: {
          $elemMatch: {
            [key]: new RegExp("^" + '.*' + searchValue + '.*', "i")
          }
        }
      })
    } else {
      updateQuery.push({
        [searchKey]: new RegExp("^" + '.*' + searchValue + '.*', "i")
      })
    }
  });
  return { '$or': updateQuery };
};

module.exports.contactsDataProcessor = contactsDataProcessor;

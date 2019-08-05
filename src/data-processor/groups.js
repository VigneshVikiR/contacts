const _ = require('lodash');

const GroupsModel = require('../models/groups');
const { getAddedItems, getDeletedItems } = require('./utils');

module.exports = {
  createGroup: async data => {
    try {
      let newGroup = new GroupsModel(data);
      let groupInfo = await newGroup.save();
      logger.log({
        level: 'info',
        message: 'createGroup-Success',
      });
      return groupInfo;
    } catch (err) {
      logger.log({
        level: 'error',
        message: `createGroup-${err.message}`,
      });
      throw err;
    }
  },
  editGroup: async (_id, data) => {
    try {
      let doUpdate = false;
      let criteria = {
        _id,
      };
      const updateData = {};
      if (data.name) {
        doUpdate = true;
        updateData.name = data.name;
      }
      if (data.contacts) {
        let addedItems = getAddedItems(data.contacts);
        if (addedItems.lineItems && addedItems.lineItems.length) {
          doUpdate = true;
          updateData['$push'] = updateData['$push'] || {};
          updateData['$push'].contacts = {
            $each: addedItems.lineItems
          };
        }
      }

      let result = {};
      if (doUpdate) {
        result = await GroupsModel.findOneAndUpdate(criteria, updateData, { new: true })
          .populate('contacts', 'name');
        delete updateData['$push']
      }

      if (data.contacts) {
        let deletedItems = getDeletedItems(data.contacts);
        if (deletedItems._ids && deletedItems._ids.length) {
          doUpdate = true;
          updateData['$pull'] = updateData['$pull'] || {};
          updateData['$pull'].contacts = {
            $in: deletedItems._ids
          };
        }
      }
      if (doUpdate)
        result = await GroupsModel.findOneAndUpdate(criteria, updateData, { new: true })
          .populate('contacts', 'name');
      logger.log({
        level: 'info',
        message: 'editGroup-Success',
      });
      return result
    }
    catch (err) {
      logger.log({
        level: 'error',
        message: `editGroup-${err.message}`,
      });
      throw err;
    }
  },
  getGroup: async _id => {
    try {
      let result = await GroupsModel.findOne({ _id, isActive: true }).populate('contacts', 'name');
      logger.log({
        level: 'info',
        message: 'viewGroup-Success',
      });
      return result;
    } catch (err) {
      logger.log({
        level: 'error',
        message: `viewGroup-${err.message}`,
      });
      throw err;
    }
  },
  deleteGroup: async _id => {
    try {
      let result = await GroupsModel.findByIdAndUpdate(_id, { isActive: false }, { new: true });
      logger.log({
        level: 'info',
        message: 'deleteGroup-Success',
      });
      return result;
    }
    catch (err) {
      logger.log({
        level: 'error',
        message: `deleteGroup-${err.message}`,
      });
      throw err;
    }
  },
  listOrSearchGroup: async data => {
    try {
      let index = parseInt(data.index) || 0,
        limit = parseInt(data.limit) || 10,
        criteria = {};
      if (data.searchValue)
        criteria = await buildSearchQuery(data.searchValue);
      criteria.isActive = data.isActive || true;
      const result = await GroupsModel.find(criteria)
        .sort({
          createdAt: 1
        })
        .populate('contactsList', 'name')
        .limit(limit)
        .skip(index);
      logger.log({
        level: 'info',
        message: 'listOrSearchGroup-Success',
      });
      return result;
    } catch (err) {
      logger.log({
        level: 'error',
        message: `listOrSearchGroup-${err.message}`,
      });
      throw err;
    }
  },
  countGroup: async (data = {}) => {
    try {
      let criteria = {};
      if (data.searchValue)
        criteria = buildSearchQuery(data.searchValue);
      criteria.isActive = data.isActive || true;
      return GroupsModel.countDocuments(criteria);
    } catch (err) {
      logger.log({
        level: 'error',
        message: `countGroup-${err.message}`,
      });
      throw err;
    }
  }
};

const buildSearchQuery = (searchValue) => {
  let criteria = [];
  let searchKeys = [
    {
      key: "name",
      isArrayElement: false
    }
  ];
  _.each(searchKeys, (searchKey) => {
    criteria.push({
      [searchKey.key]: new RegExp("^" + '.*' + searchValue + '.*', "i")
    })
  });
  return { '$or': criteria };
};

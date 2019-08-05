const boom = require('boom');
const _ = require('lodash');
const {
  getGroup,
  createGroup,
  deleteGroup,
  editGroup,
  listOrSearchGroup,
  countGroup,
} = require('../data-processor/groups');

module.exports.groupHandler = {
  createGroup: async (req, res, next) => {
    try {
      const { body } = req;
      body.contacts = _.map(body.contacts, 'id');
      let result = await createGroup(body);
      res.status(200).send({
        message: 'group created successfully',
        contactInfo: result,
      });
      logger.log({
        level: 'error',
        message: `createGroup-success-handler`,
      });
      next();
    } catch (err) {
      logger.log({
        level: 'error',
        message: `createGroup-${err.message}-handler`,
      });
      next(err)
    }
  },
  deleteGroup: async (req, res, next) => {
    try {
      const { params: { id } } = req;
      const groupInfo = await getGroup(id);
      if (!groupInfo) {
        throw boom.badRequest('group not fond');
      }
      await deleteGroup(id);
      res.status(200).send({
        message: 'group deleted successfully'
      });
      logger.log({
        level: 'error',
        message: `deleteGroup-success-handler`,
      });
      next();
    } catch (err) {
      logger.log({
        level: 'error',
        message: `deleteGroup-${err.message}-handler`,
      });
      next(err);
    }
  },
  getGroup: async (req, res, next) => {
    try {
      const { params: { id } } = req;
      let groupInfo = await getGroup(id);
      if (!groupInfo) {
        throw boom.badRequest('group not fond');
      }
      const result = { data: { groupInfo } };
      res.status(200).send(result);
      logger.log({
        level: 'error',
        message: `viewGroup-success-handler`,
      });
      next();
    } catch (err) {
      logger.log({
        level: 'error',
        message: `viewGroup-${err.message}-handler`,
      });
      next(err);
    }
  },
  listOrSearchGroup: async (req, res, next) => {
    try {
      const { query } = req;
      const result = await listOrSearchGroup(query);
      const total = await countGroup();
      console.log(total);
      res.status(200).send({
        index: parseInt(query.index),
        limit: result.length,
        total,
        groupList: result
      });
      logger.log({
        level: 'error',
        message: `listOrSearchGroup-success-handler`,
      });
      next();
    } catch (err) {
      logger.log({
        level: 'error',
        message: `listOrSearchGroup-${err.message}-handler`,
      });
      next(err);
    }
  },
  editGroup: async (req, res, next) => {
    try {
      const { params: { id }, body } = req;
      let groupInfo = await getGroup(id);
      if (!groupInfo) {
        throw boom.badRequest('group not found');
      }
      let result = await editGroup(id, body);
      res.status(200).send({ message: 'group updated successfully', groupInfo: result });
      logger.log({
        level: 'error',
        message: `editGroup-success-handler`,
      });
      next();
    } catch (err) {
      logger.log({
        level: 'error',
        message: `editGroup-${err.message}-handler`,
      });
      next(err);
    }
  },
};

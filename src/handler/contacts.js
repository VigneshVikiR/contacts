const boom = require('boom');

const {
  contactsDataProcessor: {
    deleteContact,
    getContact,
    createContact,
    listContact,
    getCount,
  }
} = require('../data-processor/contacts');

const { validateObjectId } = require('../data-processor/utils');

module.exports.contactHandler = {
  createContact: async (req, res, next) => {
    try {
      let { body } = req;
      let result = await createContact(body);
      result = Object.assign({ data: { contactInfo: result } }, {});
      res.status(200).send({ contact: result });
      next();
    } catch (err) {
      logger.log({
        level: 'error',
        message: `contactHandler-createContact-${err.message}`,
      });
      next(err)
    }
  },
  deleteContact: async (req, res, next) => {
    try {
      const { params: { id } } = req;

      // check the contact exists
      const contact = await getContact(id);
      if (!contact) {
        throw boom.badRequest('contact not found');
      }

      // delete contact if exists
      await deleteContact(id);
      logger.log({
        level: 'error',
        message: `contactHandler-deleteContact-success`,
      });

      res.status(200).send({ message: 'contact deleted successfully' });
      next();
    } catch (err) {
      logger.log({
        level: 'error',
        message: `contactHandler-deleteContact-${err.message}`,
      });
      next(err);
    }
  },
  editContact: async (req, res, next) => {
    let apiId = (req.method + req.route.path).toLowerCase();
    try {
      const { params: { id }, body } = req;
      let isValidObejctId = validateObjectId(id);
      if (!isValidObejctId) {
        req.result = 'Invalid Object Id';
        next();
      }
      let contactInfo = await contactsAccessor.getContact(id);
      if (!contactInfo) {
        req.result = 'contact not found';
        next();
      }
      const getUpdateData = await editContact(contactInfo, body);
      let result = await contactsAccessor.editContact(id, body);
      req.result = 'success';
      logger.log({
        level: 'error',
        message: `contactHandler-editContact-success`,
      });
      next();
    } catch (err) {
      logger.log({
        level: 'error',
        message: `contactHandler-editContact-${err.message}`,
      });
      next(err);
    }
  },
  listContact: async (req, res, next) => {
    try {
      let body = req.body;
      let result = await listContact(body);
      let total = await getCount();
      result = Object.assign({
        data: {
          index: body.index,
          limit: result.length,
          total,
          contactList: result
        }
      });
      res.status(200).send({ contacts: result });
      logger.log({
        level: 'error',
        message: `contactsController-listOrSearchContact-success`,
      });
      next();
    } catch (err) {
      logger.log({
        level: 'error',
        message: `contactsController-listOrSearchContact-${err.message}`,
      });
      next(err);
    }
  },
  viewContact: async (req, res, next) => {
    try {
      const { params: { id } } = req;

      // check the contact exists
      const contact = await getContact(id);
      if (!contact) {
        throw boom.badRequest('contact not found');
      }
      res.status(200).send(contact);
      next();
    } catch (err) {
      next(err);
    }
  }
};

const boom = require('boom');

const {
  contactsDataProcessor: {
    deleteContact,
    getContact,
    createContact,
    listContact,
    getCount,
    editContact,
  }
} = require('../data-processor/contacts');

/**
 * collection of the contact handlers
 * createContact : used to create a new contact
 * deleteContact : used to delete an existing contact
 * editContact : used to update an existing contact
 * listContact : get list of contacts
 * viewContact : view contact
 * @type {{createContact: createContact, deleteContact: deleteContact, editContact: editContact, listContact: listContact, viewContact: viewContact}}
 */
module.exports.contactHandler = {
  createContact: async (req, res, next) => {
    try {
      let { body } = req;
      let result = await createContact(body);
      res.status(200).send({ contact: result });
      next();
    } catch (err) {
      logger.log({
        level: 'error',
        message: `createContact-${err.message}-handler`,
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
        message: `deleteContact-success-handler`,
      });

      res.status(200).send({ message: 'contact deleted successfully' });
      next();
    } catch (err) {
      logger.log({
        level: 'error',
        message: `deleteContact-${err.message}-handler`,
      });
      next(err);
    }
  },
  editContact: async (req, res, next) => {
    try {
      const { params: { id }, body } = req;
      let contactInfo = await getContact(id);
      if (!contactInfo) {
        req.result = 'contact not found';
        next();
      }
      await editContact(id, body);
      res.status(200).send({ message: 'contact updated successfully' });
      logger.log({
        level: 'error',
        message: `editContact-success-handler`,
      });
      next();
    } catch (err) {
      logger.log({
        level: 'error',
        message: `editContact-${err.message}-handler`,
      });
      next(err);
    }
  },
  listContact: async (req, res, next) => {
    try {
      const { query } = req;
      let result = await listContact(query);
      let total = await getCount();
      result = Object.assign({
        data: {
          index: query.index,
          limit: result.length,
          total,
          contactList: result
        }
      });
      res.status(200).send({ contacts: result });
      logger.log({
        level: 'error',
        message: `listOrSearchContact-success-handler`,
      });
      next();
    } catch (err) {
      logger.log({
        level: 'error',
        message: `listOrSearchContact-${err.message}-handler`,
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
      res.status(200).send({ contact });
      next();
    } catch (err) {
      next(err);
    }
  }
};

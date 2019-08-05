const {
  contactHandler,
} = require('../handler/contacts');

const { create_contact, edit_contact, delete_contact, get_contact, list_contact } = require('../schemas');
const { validateParams } = require('../utils');
const router = require('express').Router();

const contactRoutes = () => {
  router.post('/contacts',
    validateParams(create_contact),
    contactHandler.createContact,
  );
  router.get('/contacts',
    validateParams(list_contact),
    contactHandler.listContact,
  );
  router.put('/contacts/:id',
    validateParams(edit_contact),
    contactHandler.editContact,
  );
  router.get('/contacts/:id',
    validateParams(get_contact),
    contactHandler.viewContact,
  );
  router.delete('/contacts/:id',
    validateParams(delete_contact),
    contactHandler.deleteContact,
  );

  return router;
};

module.exports = contactRoutes;

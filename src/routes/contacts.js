const {
  contactHandler,
} = require('../handler/contacts');

const { create_contact } = require('../schemas');
const { validateParams } = require('../utils');
const router = require('express').Router();

const routes = () => {
  router.post('/contacts',
    validateParams(create_contact),
    contactHandler.createContact,
  );
  router.get('/contacts',
    validateParams(create_contact),
    contactHandler.listContact,
  );
  router.put('/contacts/:id',
    validateParams(create_contact),
    contactHandler.editContact,
  );
  router.get('/contacts/:id',
    validateParams(create_contact),
    contactHandler.viewContact,
  );
  router.delete('/contacts/:id',
    validateParams(create_contact),
    contactHandler.deleteContact,
  );

  return router;
};

module.exports = routes;

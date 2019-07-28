const {
  addContact,
} = require('../handler/contacts');

const {
  create, update, remove, list
} = require('../schemas/contacts');

const routes = [
  {
    path: '/contacts',
    methods: [
      {
        name: 'ADD_CONTACT',
        methodName: 'POST',
        validate: create,
        handler: addContact,
      },
    ],
  },
];

module.exports = () => routes;

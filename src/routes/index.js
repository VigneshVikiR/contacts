const contacts = require('./contacts');

module.exports = () =>
  [].concat(
    contacts(),
  );

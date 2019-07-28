const mongoose = require('mongoose');
const { database } = require('../../config');

module.exports.connect = () =>
  new Promise(resolve => {
    console.log(`${database.hosts}/${database.name}`, '2323')
    mongoose.connect(`mongodb://${database.hosts}/${database.name}`, { useNewUrlParser: true }).catch(error => {
      console.error('Database error', error);
    });
    const db = mongoose.connection;
    db.once('open', () => {
      console.log('Database Connected');
      return resolve();
    });
    db.on('error', error => {
      console.log('Database error', error);
    });
  });

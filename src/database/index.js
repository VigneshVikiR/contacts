const mongoose = require('mongoose');
const { database } = require('../../config');

module.exports.connect = () =>
  new Promise((resolve, reject) => {
    mongoose.connect(`mongodb://${database.hosts}/${database.name}`, {
      useNewUrlParser: true,
      autoReconnect: true
    }).catch(error => {
      console.error('Database error', error);
    });
    const db = mongoose.connection;
    db.once('open', () => {
      console.log('Database Connected');
      return resolve();
    });
    db.on('error', error => {
      console.log('Database error', error);
      return reject(error)
    });
  });

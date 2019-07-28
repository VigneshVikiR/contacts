const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const routes = (router) => {
  _.each(fs.readdirSync(__dirname), (fileName) => {
    if (fileName != 'index.js') {
      router = require(path.join(__dirname, fileName))();
    }
  });
  return router;
};

module.exports = routes;

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const config = require('../config');
const routes = require('../src/routes');
const { connect } = require('../src/database');

const app = express();
const { server } = config;

const methodMapping = {
  DELETE: 'del',
  POST: 'post',
  PUT: 'put',
  GET: 'get',
};

const corsOptions = {
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  allowHeaders: [
    'authorization',
    'content-type',
    'access-control-allow-origin',
    'X-Requested-With',
  ],
  origin: true,
};

module.exports = () => {
  console.log('candhucuua', routes())
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.options('*', cors(corsOptions));

  //assigning routes
  for (let route of routes()) {
    for (let method of route.methods) {
      const handlers = [];
      if (method.validate) {
        const validateKeys = Object.keys(method.validate);
        validateKeys.forEach(validateKey => {
          handlers.push((request, response, next) => {
            if (
              request[validateKey].order_direction &&
              typeof request[validateKey].order_direction === 'string'
            ) {
              request[validateKey].order_direction = request[validateKey].order_direction.split(
                ',',
              );
            }
            return utils
              .validateParams(request[validateKey], method.validate[validateKey])
              .then(() => next())
              .catch(error => next(error));
          });
        });
      }
      app[methodMapping[method.methodName]](path.join(config.apiBasePath, route.path), [...handlers])
    }
  }

  // db connect
  connect();

  //Initialising server
  app.listen(server.port, () => {
    console.log('server connected with the specified port', server.port);
  })
};

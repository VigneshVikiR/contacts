const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('../config');
const routes = require('../src/routes');
const { connect } = require('../src/database');
const logger = require('./utils/logger');

// assigning the global variable
global.logger = logger;

const router = express.Router();
const app = express();
const { server } = config;

// definition of cors options
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

module.exports = async () => {
  try {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.options('*', cors(corsOptions));
    app.use(cors(corsOptions));

    //assigning routes
    app.use(routes(router));
    app.use((error, req, res, next) => {
      if (error.isBoom) {
        res.status(error.output.statusCode).json({ message: error.output.payload.message });
      } else {
        next(error);
      }
      if (res) {
        next(res);
      }
    });
    // db connect
    await connect();

    //Initialising server
    app.listen(server.port, () => {
      logger.log({
        level: 'info',
        message: `server connected with the specified port, ${server.port}`
      })
    })
  } catch (e) {
    throw e;
  }

};

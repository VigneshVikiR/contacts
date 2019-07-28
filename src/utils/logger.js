const Winston = require('winston');

module.exports = Winston.createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    silly: 5
  },
  defaultMeta: { service: 'contacts' },
  transports: [
    new Winston.transports.File({ filename: 'user_log' })
  ]
});

const app = require('./src/app');

Promise.resolve(app()).then(() => {
  console.log('server intialised');
}).catch(error => console.log('error in server initialising', error));

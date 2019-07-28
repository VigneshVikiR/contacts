const configDocuments = {
  development: {
    server: {
      host: 'localhost',
      port: 3000,
    },
    database: {
      name: 'contactDemo',
      user: 'user',
      pass: '123456',
      hosts: 'localhost:27017',
      ssl: false,
    },
    apiBasePath: '/api',
  },
  production: {
    server: {
      host: 'localhost',
      port: 3000,
    },
    database: {}
  },
};

let loadedDocument = null;
if (process.env === 'production') {
  loadedDocument = configDocuments.production;
} else {
  loadedDocument = configDocuments.development;
}

module.exports = loadedDocument;

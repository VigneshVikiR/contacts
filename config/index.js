const { env } = process;

const configDocuments = {
  development: {
    server: {
      host: 'localhost',
      port: 3001,
    },
    database: {
      name: env.DB_NAME,
      user: env.DB_USER,
      pass: env.DB_PASS,
      hosts: env.DB_HOST_URL,
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

const path = require('path');

module.exports = {
  cluster: {
    name: 'vinhdo',
  },
  helmRepositories: [
    {
      name: 'bitnami',
      url: 'https://charts.bitnami.com/bitnami',
    },
  ],
  helmInfrastructures: [
    {
      name: 'redis',
      location: 'bitnami/redis',
      namespace: 'core',
      version: '16.10.0',
      valueFile: path.resolve(__dirname, 'infrastructure/redis/values.yaml'),
    },
    {
      name: 'postgresql',
      location: 'bitnami/postgresql',
      namespace: 'core',
      version: '11.6.3',
      valueFile: path.resolve(
        __dirname,
        'infrastructure/postgresql/values.yaml',
      ),
    },
  ],
};

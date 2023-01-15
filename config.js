const path = require('path');

module.exports = {
  cluster: {
    name: 'vinhdo',
    cpu: 4,
    memory: '8192m',
    kubernetesVersion: 'v1.22.9',
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
      version: '17.4.2',
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

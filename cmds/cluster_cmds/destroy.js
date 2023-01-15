const { cluster } = require('../../config');
const { destroy } = require('../../services/cluster');

module.exports = {
  command: 'destroy',
  desc: 'Completely destroy the minikube cluster with all of its resources',
  builder: {
    clusterName: {
      default: cluster.name,
      description: 'Name of the cluster',
    },
  },
  handler: destroy,
};

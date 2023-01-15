const { update } = require('../../services/cluster');
const { cluster } = require('../../config');

module.exports = {
  command: 'update',
  desc: 'Update a minikube cluster with necessary infrastructure',
  builder: {
    clusterName: {
      default: cluster.name,
      description: 'Name of cluster to bootstrap with minikube',
    },
    cpu: {
      default: cluster.cpu,
      description: 'Amount of CPU allocated to minikube cluster',
    },
    memory: {
      default: cluster.memory,
      description: 'Amount of memory allocated to minikube cluster',
    },
    kubernetesVersion: {
      default: cluster.kubernetesVersion,
      description: 'Kubernetes version',
    },
  },
  handler: update,
};

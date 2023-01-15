const { resume } = require('../../services/cluster');
const { cluster } = require('../../config');

module.exports = {
  command: 'resume',
  desc: 'Resume temporarily paused minikube cluster',
  builder: {
    clusterName: { default: cluster.name },
  },
  handler: resume,
};

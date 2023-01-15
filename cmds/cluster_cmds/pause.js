const { pause } = require('../../services/cluster');
const { cluster } = require('../../config');

module.exports = {
  command: 'pause',
  desc: 'Temporary pause minikube cluster',
  builder: {
    clusterName: { default: cluster.name },
  },
  handler: pause,
};

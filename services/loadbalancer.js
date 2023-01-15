const { getIpRange } = require('../tools/minikube');
const { templateAndApply, rollout } = require('../tools/kubectl');
const { getRoot } = require('../utils');
const path = require('path');

const configureMetallb = async (clusterName) => {
  const ipRange = await getIpRange(clusterName);
  await templateAndApply(
    path.resolve(getRoot(), 'infrastructure/manifests/metallb/01-cm.yaml.tpl'),
    {
      IP_RANGE: ipRange,
    },
  );
  await rollout('deployment', 'controller', 'metallb-system');
  await rollout('daemonset', 'speaker', 'metallb-system');
};

const updateHostFile = async () => {};

module.exports = {
  configureMetallb,
  updateHostFile,
};

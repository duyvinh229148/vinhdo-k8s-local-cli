const {
  startCluster,
  deleteCluster,
  pauseCluster,
  resumeCluster,
} = require('../tools/minikube');
const path = require('path');
const { sudoExecAsync } = require('../utils');

const { apply } = require('../tools/kubectl');
const { updateSecrets } = require('./secrets');
const { updateHostFile } = require('./host');

const { updateHelmRepos, installCharts } = require('./helm');
const { configureMetallb } = require('./loadbalancer');
const { delay } = require('../utils');

const preboot = async () => {
  await sudoExecAsync('sysctl -w net.netfilter.nf_conntrack_max=524288');
};

const destroy = async (argv) => {
  await deleteCluster(argv.clusterName);
};

const bootstrap = async (argv) => {
  await preboot();

  await deleteCluster(argv.clusterName);
  await startCluster({
    clusterName: argv.clusterName,
    cpu: argv.cpu,
    memory: argv.memory,
    kubernetesVersion: argv.kubernetesVersion,
  });

  await update(argv);
};

const pause = async (argv) => {
  await pauseCluster(argv.clusterName);
};

const resume = async (argv) => {
  await preboot();
  await resumeCluster(argv.clusterName);
  await delay(30 * 1000);
  await update(argv);
};

const update = async (argv) => {
  await updateSecrets();

  await updateHelmRepos();

  await installCharts();
  // // Wait for charts to be updated

  await apply(
    path.resolve(
      __dirname,
      '../infrastructure/manifests/knative/serving-crds.yaml',
    ),
  );
  await apply(
    path.resolve(
      __dirname,
      '../infrastructure/manifests/knative/serving-core.yaml',
    ),
  );
  await apply(
    path.resolve(__dirname, '../infrastructure/manifests/knative/istio.yaml'),
    '-l knative.dev/crd-install=true',
  ).catch(() => null);
  await apply(
    path.resolve(__dirname, '../infrastructure/manifests/knative/istio.yaml'),
  );
  await apply(
    path.resolve(
      __dirname,
      '../infrastructure/manifests/knative/net-istio.yaml',
    ),
  );

  await delay(30 * 1000);

  await configureMetallb(argv.clusterName);

  await updateHostFile();
};

module.exports = {
  bootstrap,
  destroy,
  pause,
  resume,
  update,
};

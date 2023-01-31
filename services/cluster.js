const {
  startCluster,
  deleteCluster,
  pauseCluster,
  resumeCluster,
} = require('../tools/minikube');
const path = require('path');
const { sudoExecAsync } = require('../utils');

const { apply, createNamespace } = require('../tools/kubectl');
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
  await createNamespace('core');

  // await updateSecrets();

  await updateHelmRepos();

  await installCharts();
  // // Wait for charts to be updated

  console.log('Install serving-crds');
  await apply(
    path.resolve(
      __dirname,
      '../infrastructure/manifests/knative/serving-crds.yaml',
    ),
  );

  console.log('Install serving-core');
  await apply(
    path.resolve(
      __dirname,
      '../infrastructure/manifests/knative/serving-core.yaml',
    ),
  );

  console.log('Install istio');
  await apply(
    path.resolve(__dirname, '../infrastructure/manifests/knative/istio.yaml'),
    '-l knative.dev/crd-install=true',
  ).catch(() => null);
  await apply(
    path.resolve(__dirname, '../infrastructure/manifests/knative/istio.yaml'),
  );

  console.log('Install net-istio');
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

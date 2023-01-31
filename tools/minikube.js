const { execPromise } = require('../utils');

const getClusters = async () => {
  const stdout = await execPromise('minikube profile list --output json');
  return JSON.parse(stdout).valid;
};

const deleteCluster = async (clusterName) => {
  const stdout = await execPromise(`minikube delete --profile=${clusterName}`);

  console.log(stdout);
};

const startCluster = async (optionsWithoutDefault) => {
  const options = {
    clusterName: 'vinhdo',
    kubernetesVersion: 'v1.25.0',
    cpu: 4,
    memory: '8192m',
    driver: 'docker',
    addons: ['metallb', 'metrics-server'],
    ...optionsWithoutDefault,
  };

  const stdout = await execPromise(
    `minikube start ` +
      `--profile=${options.clusterName} ` +
      `--kubernetes-version=${options.kubernetesVersion} ` +
      `--cpus=${options.cpu} ` +
      `--memory=${options.memory} ` +
      `--driver=${options.driver} ` +
      `--addons=${options.addons.join(',')}`,
  );

  console.log(stdout);
};

const resumeCluster = async (clusterName = 'yourrentals') => {
  const clusters = await getClusters();

  const currentCluster = clusters.find(
    (cluster) => cluster.Name === clusterName,
  );

  if (!currentCluster) {
    console.log(`${clusterName} does not exists. Please create the cluster`);
  }

  if (currentCluster.Status === 'Running') {
    console.log(`Cluster ${clusterName} is currently running.`);
  } else {
    const stdout = await execPromise(`minikube start --profile=${clusterName}`);
    console.log(stdout);
  }
};

const stopCluster = async (clusterName) => {
  const clusters = await getClusters();

  const currentCluster = clusters.find(
    (cluster) => cluster.Name === clusterName,
  );

  if (!currentCluster) {
    console.log(`${clusterName} does not exists.`);
  }

  if (currentCluster.Status === 'Running') {
    const stdout = await execPromise(`minikube stop --profile=${clusterName}`);
    console.log(stdout);
  } else {
    console.log(`Cluster ${clusterName} is not running`);
  }
};

const pauseCluster = async (clusterName) => {
  const clusters = await getClusters();

  const currentCluster = clusters.find(
    (cluster) => cluster.Name === clusterName,
  );

  if (!currentCluster) {
    console.log(`${clusterName} does not exists.`);
  }

  if (currentCluster.Status === 'Running') {
    const stdout = await execPromise(`minikube pause --profile=${clusterName}`);
    console.log(stdout);
  } else {
    console.log(`Cluster ${clusterName} is not running`);
  }
};

const getIpRange = async (clusterName) => {
  const response = await execPromise(`minikube ip --profile=${clusterName}`);

  const parts = response.split('.');

  const first = `${parts[0]}.${parts[1]}.${parts[2]}`;

  return `${first}.100-${first}.105`;
};

const enableAddon = async (clusterName, addon) => {
  await execPromise(`minikube addons enable ${addon} --profile=${clusterName}`);
};

module.exports = {
  getClusters,
  startCluster,
  resumeCluster,
  pauseCluster,
  stopCluster,
  deleteCluster,
  getIpRange,
  enableAddon,
};

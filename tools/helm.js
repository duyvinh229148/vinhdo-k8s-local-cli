const { execPromise } = require('../utils');

const installRepository = async (
  repoName,
  repoLocation,
  username,
  password,
) => {
  console.log(`Adding repository ${repoName}`);

  let command = `helm repo add ${repoName} ${repoLocation}`;

  if (username && password) {
    command += ` --username ${username} --password ${password}`;
  }
  await execPromise(command);
};

const updateRepositories = async () => {
  console.log(`Updating helm repositories`);
  await execPromise(`helm repo update`);
};

const installChart = async (
  chartName,
  chartLocation,
  namespace,
  version,
  valueFileLocation,
) => {
  console.log(
    `Installing helm chart ${chartName} in namespace ${namespace || 'default'}`,
  );
  let command = `helm upgrade --install ${chartName} ${chartLocation}`;
  if (namespace) {
    command += ` --namespace ${namespace} --create-namespace`;
  }
  if (version) {
    command += ` --version ${version}`;
  }
  if (valueFileLocation) {
    command += ` -f ${valueFileLocation}`;
  }
  await execPromise(command);
};

module.exports = {
  installChart,
  installRepository,
  updateRepositories,
};

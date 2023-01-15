const {
  installChart,
  installRepository,
  updateRepositories,
} = require('../tools/helm');
const { apply } = require('../tools/kubectl');
const { helmRepositories, helmInfrastructures } = require('../config');
const { eachSeries } = require('async');

const updateHelmRepos = async () => {
  await Promise.all(
    helmRepositories.map(async (repository) => {
      await installRepository(repository.name, repository.url);
    }),
  );
  await updateRepositories();
};

const installManifests = async (manifestFiles) => {
  await eachSeries(manifestFiles, async (manifestFile) => {
    await apply(manifestFile);
  });
};

const installCharts = async () => {
  await eachSeries(helmInfrastructures, async (infrastructure) => {
    await installChart(
      infrastructure.name,
      infrastructure.location,
      infrastructure.namespace,
      infrastructure.version,
      infrastructure.valueFile,
    );
    if (infrastructure.manifestFiles) {
      await installManifests(infrastructure.manifestFiles);
    }
  });
};

module.exports = {
  updateHelmRepos,
  installCharts,
};

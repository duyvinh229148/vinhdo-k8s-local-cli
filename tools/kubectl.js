const { execPromise } = require('../utils');
const fs = require('fs');
const { getRoot } = require('../utils');
const path = require('path');

const createSecret = async (vaultItem) => {
  if (vaultItem.type === 'tls') {
    await execPromise(
      `kubectl create secret tls ${vaultItem.name} --key ${vaultItem.data.key} --cert ${vaultItem.data.certificate} --namespace ${vaultItem.namespace}`,
    );
  } else {
    const literal = vaultItem.isFile
      ? Object.entries(vaultItem.data)
          .map(
            ([key, value]) =>
              `--from-file=${key}=${path.resolve(getRoot(), value)}`,
          )
          .join(' ')
      : Object.entries(vaultItem.data)
          .map(
            ([key, value]) =>
              `--from-literal=${key}="${value.trim().split('\n').join('\\n')}"`,
          )
          .join(' ');

    await execPromise(
      `kubectl create secret generic ${vaultItem.name} --namespace ${vaultItem.namespace} ${literal}`,
    );
  }
};

const deleteSecret = async (vaultItem) => {
  await execPromise(
    `kubectl delete secrets ${vaultItem.name} --namespace ${vaultItem.namespace}`,
  );
};

const updateSecret = async (vaultItem) => {
  try {
    await deleteSecret(vaultItem);
  } catch (err) {}

  await createSecret(vaultItem);
};

const createNamespace = async (namespace) => {
  try {
    await execPromise(`kubectl create namespace ${namespace}`);
  } catch (err) {}
};

const templateAndApply = async (templateLocation, replaceMap) => {
  let templateFile = fs.readFileSync(templateLocation, 'utf-8');

  Object.entries(replaceMap).forEach(([key, value]) => {
    templateFile = templateFile.replace(`{{ ${key} }}`, value);
  });

  const fileName = path.basename(templateLocation);
  const dirName = path.dirname(templateLocation);

  const final = path.resolve(dirName, `${fileName}.yaml`);

  fs.writeFileSync(final, templateFile);

  await execPromise(`kubectl apply -f ${final}`);
};

const apply = async (yamlFile, flags = '') => {
  await execPromise(`kubectl apply -f ${yamlFile} ${flags}`);
};

const getLoadBalancerIp = async (service, namespace) => {
  const output = await execPromise(
    `kubectl get svc --namespace ${namespace} ${service} --output=jsonpath="{.status.loadBalancer.ingress[0].ip}"`,
  );

  return output;
};

const rollout = async (type, name, namespace) => {
  await execPromise(
    `kubectl rollout restart ${type} ${name} --namespace ${namespace}`,
  );
};

module.exports = {
  createSecret,
  deleteSecret,
  updateSecret,
  createNamespace,
  templateAndApply,
  getLoadBalancerIp,
  rollout,
  apply,
};

const { vault } = require('../secret');
const { updateSecret, createNamespace } = require('../tools/kubectl');

const updateSecrets = async () => {
  await createNamespace('core');
  await Promise.all(
    vault.map(async (vaultItem) => {
      await updateSecret(vaultItem);
    }),
  );
};

module.exports = {
  updateSecrets,
};

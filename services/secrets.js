const { vault } = require('../secret');
const { updateSecret } = require('../tools/kubectl');

const updateSecrets = async () => {
  await Promise.all(
    vault.map(async (vaultItem) => {
      await updateSecret(vaultItem);
    }),
  );
};

module.exports = {
  updateSecrets,
};

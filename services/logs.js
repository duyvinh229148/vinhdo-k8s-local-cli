const { spawn } = require('child_process');

const logs = async () => {
  const options = {
    shell: true,
  };

  const childProcess = spawn(
    `stern "." -c user-container --namespace local --output raw`,
    options,
  );

  childProcess.stderr.on('data', (data) => {
    console.log(`${data}`.trim());
  });

  childProcess.stdout.on('data', (data) => {
    console.log(`${data}`.trim());
  });

  ['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, async () => {
      childProcess.kill('SIGINT');
    });
  });
};

module.exports = { logs };

const { exec } = require('child_process');
const path = require('path');
const sudo = require('sudo-prompt');

const getRoot = () => path.resolve(__dirname);

const execPromise = (command, options = {}) => {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        return reject(error);
      }

      console.log(stdout);
      console.log(stderr);

      return resolve(stdout.trim());
    });
  });
};

const delay = async (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

const sudoExecAsync = (command, options = {}) => {
  return new Promise((resolve, reject) => {
    sudo.exec(command, options, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }

      return resolve(stdout);
    });
  });
};

module.exports = {
  getRoot,
  execPromise,
  delay,
  sudoExecAsync,
};

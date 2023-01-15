const fs = require('fs');
const path = require('path');
const { getRoot, sudoExecAsync } = require('../utils');
const { getLoadBalancerIp } = require('../tools/kubectl');

const _parseHostFile = () => {
  const file = fs.readFileSync('/etc/hosts', 'utf-8');

  return file.split('\n').filter((line) => !(line.trim() === ''));
};

const getGatewayIP = async () => {
  return getLoadBalancerIp('istio-ingressgateway', 'istio-system');
};

const getNewHostFile = (hostMap) => {
  let currentHosts = _parseHostFile();

  // Remove existing host file
  Object.entries(hostMap).forEach(([ip, hosts]) => {
    hosts.forEach((host) => {
      const found = currentHosts.findIndex((element) => element.includes(host));
      if (found !== -1) {
        currentHosts[found] = '';
      }
    });
  });

  // Remove MANAGED BY line
  currentHosts.forEach((hostLine, index) => {
    if (hostLine.includes('MANAGED BY YR')) {
      currentHosts[index] = '';
    }
  });

  // Update records
  currentHosts.push('\n# MANAGED BY YR');
  Object.entries(hostMap).forEach(([ip, hosts]) => {
    currentHosts.push(`${ip}    ${hosts.join(' ')}`);
  });
  currentHosts.push('# END MANAGED BY YR');

  return currentHosts.filter((line) => line.trim() !== '').join('\n');
};

const updateHostFile = async () => {
  console.log('Updating hosts file');
  const gatewayIP = await getGatewayIP();

  const hostMap = {
    [gatewayIP]: ['api-internal-v2-local.your.rentals'],
  };

  const newHostFile = getNewHostFile(hostMap);
  fs.writeFileSync(path.resolve(getRoot(), 'hosts.txt'), newHostFile);
  await sudoExecAsync(
    `cat ${path.resolve(getRoot(), 'hosts.txt')} > /etc/hosts`,
  );

  fs.rmSync(path.resolve(getRoot(), 'hosts.txt'));
};

module.exports = {
  updateHostFile,
};

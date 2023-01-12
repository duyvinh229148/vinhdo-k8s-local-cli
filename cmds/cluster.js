module.exports = {
  command: 'cluster <command>',
  desc: 'Cluster commands',
  builder: (yargs) => yargs.commandDir('cluster_cmds').strict().demandCommand(),
  handler: (argv) => {},
};

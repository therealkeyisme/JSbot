module.exports.checkCommandModule = (cmdName: any, cmdModule: any) => {
  if (!cmdModule.hasOwnProperty('run')) {
    throw new Error(`${cmdName} command module does not have property 'run'`);
  }
  if (!cmdModule.hasOwnProperty('description')) {
    throw new Error(`${cmdName} does not have property 'description'`);
  }
  if (!cmdModule.hasOwnProperty('aliases')) {
    throw new Error(`${cmdName} does not have property 'aliases'`);
  }
  return true;
};

module.exports.checkProperties = (cmdModule: any) => {
  if (typeof cmdModule.run !== 'function') {
    throw new Error(`${cmdModule}.run is not a function`);
  }
  if (typeof cmdModule.description !== 'string')
    throw new Error(`${cmdModule}.description is not a string`);
  if (!Array.isArray(cmdModule.aliases))
    throw new Error(`${cmdModule}.aliases is not an Array`);
  return true;
};

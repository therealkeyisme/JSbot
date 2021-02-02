const c = require('ansi-colors');
const fs = require('fs').promises;
const path = require('path');
const { checkCommandModule, checkProperties } = require('./validate');
export const commandStatus = [
  [
    `${c.bold.magenta('Command')}`,
    `${c.bold.magenta('Status')}`,
    `${c.bold.magenta('Description')}`,
  ],
];
export const eventStatus = [
  [
    `${c.bold.magenta('Event')}`,
    `${c.bold.magenta('Status')}`,
    `${c.bold.magenta('Description')}`,
  ],
];
export async function registerCommands(client: any, dir: string) {
  // Read the directory/file.
  let files = await fs.readdir(path.join(__dirname, dir));
  // Loop through each file.
  for (let file of files) {
    let stat = await fs.lstat(path.join(__dirname, dir, file));
    if (stat.isDirectory())
      // If file is a directory, recursive call recurDir
      registerCommands(client, path.join(dir, file));
    else {
      // Check if file is a .js file.
      if (file.endsWith('.js')) {
        let cmdName = file.substring(0, file.indexOf('.js'));
        try {
          let cmdModule = require(path.join(__dirname, dir, file));
          if (checkCommandModule(cmdName, cmdModule)) {
            if (checkProperties(cmdModule)) {
              let { aliases } = cmdModule;
              client.commands.set(cmdName, cmdModule.run);
              if (aliases.length !== 0) {
                aliases.forEach((alias: string) =>
                  client.commands.set(alias, cmdModule.run),
                );
              }
              commandStatus.push([
                `${c.green(`${cmdName}`)}`,
                `${c.green('Success!')}`,
                `${c.green(`${cmdModule.description}`)}`,
              ]);
            }
          }
        } catch (err) {
          commandStatus.push([
            `${c.red(`${cmdName}`)}`,
            `${c.red(`Failed!`)}`,
            `${c.red(`${err}`)}`,
          ]);
        }
      }
      if (file.endsWith('.ts')) {
        let cmdName = file.substring(0, file.indexOf('.ts'));
        try {
          let cmdModule = require(path.join(__dirname, dir, file));
          if (checkCommandModule(cmdName, cmdModule)) {
            if (checkProperties(cmdModule)) {
              let { aliases } = cmdModule;
              client.commands.set(cmdName, cmdModule.run);
              if (aliases.length !== 0) {
                aliases.forEach((alias: string) =>
                  client.commands.set(alias, cmdModule.run),
                );
              }
              commandStatus.push([
                `${c.green(`${cmdName}`)}`,
                `${c.green('Success!')}`,
                `${c.green(`${cmdModule.description}`)}`,
              ]);
            }
          }
        } catch (err) {
          commandStatus.push([
            `${c.red(`${cmdName}`)}`,
            `${c.red(`Failed!`)}`,
            `${c.red(`${err}`)}`,
          ]);
        }
      }
    }
  }
}

export async function registerEvents(client: any, dir: string) {
  let files = await fs.readdir(path.join(__dirname, dir));
  // Loop through each file.
  for (let file of files) {
    let stat = await fs.lstat(path.join(__dirname, dir, file));
    if (stat.isDirectory())
      // If file is a directory, recursive call recurDir
      registerEvents(client, path.join(dir, file));
    else {
      // Check if file is a .js file.
      if (file.endsWith('.js')) {
        let eventName = file.substring(0, file.indexOf('.js'));
        try {
          let eventModule = require(path.join(__dirname, dir, file));
          client.on(eventName, eventModule.bind(null, client));
          eventStatus.push([
            `${c.cyan(`${eventName}`)}`,
            `${c.bgGreenBright('Success')}`,
            `${eventModule.description}`,
          ]);
        } catch (err) {
          eventStatus.push([
            `${c.red(`${eventName}`)}`,
            `${c.red(`Failed!`)}`,
            `${c.red(`${err}`)}`,
          ]);
        }
      }
    }
  }
}

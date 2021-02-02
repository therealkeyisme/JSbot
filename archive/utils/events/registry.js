"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerEvents = exports.registerCommands = exports.eventStatus = exports.commandStatus = void 0;
const c = require('ansi-colors');
const fs = require('fs').promises;
const path = require('path');
const { checkCommandModule, checkProperties } = require('./validate');
exports.commandStatus = [
    [
        `${c.bold.magenta('Command')}`,
        `${c.bold.magenta('Status')}`,
        `${c.bold.magenta('Description')}`,
    ],
];
exports.eventStatus = [
    [
        `${c.bold.magenta('Event')}`,
        `${c.bold.magenta('Status')}`,
        `${c.bold.magenta('Description')}`,
    ],
];
function registerCommands(client, dir) {
    return __awaiter(this, void 0, void 0, function* () {
        // Read the directory/file.
        let files = yield fs.readdir(path.join(__dirname, dir));
        // Loop through each file.
        for (let file of files) {
            let stat = yield fs.lstat(path.join(__dirname, dir, file));
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
                                    aliases.forEach((alias) => client.commands.set(alias, cmdModule.run));
                                }
                                exports.commandStatus.push([
                                    `${c.green(`${cmdName}`)}`,
                                    `${c.green('Success!')}`,
                                    `${c.green(`${cmdModule.description}`)}`,
                                ]);
                            }
                        }
                    }
                    catch (err) {
                        exports.commandStatus.push([
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
                                    aliases.forEach((alias) => client.commands.set(alias, cmdModule.run));
                                }
                                exports.commandStatus.push([
                                    `${c.green(`${cmdName}`)}`,
                                    `${c.green('Success!')}`,
                                    `${c.green(`${cmdModule.description}`)}`,
                                ]);
                            }
                        }
                    }
                    catch (err) {
                        exports.commandStatus.push([
                            `${c.red(`${cmdName}`)}`,
                            `${c.red(`Failed!`)}`,
                            `${c.red(`${err}`)}`,
                        ]);
                    }
                }
            }
        }
    });
}
exports.registerCommands = registerCommands;
function registerEvents(client, dir) {
    return __awaiter(this, void 0, void 0, function* () {
        let files = yield fs.readdir(path.join(__dirname, dir));
        // Loop through each file.
        for (let file of files) {
            let stat = yield fs.lstat(path.join(__dirname, dir, file));
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
                        exports.eventStatus.push([
                            `${c.cyan(`${eventName}`)}`,
                            `${c.bgGreenBright('Success')}`,
                            `${eventModule.description}`,
                        ]);
                    }
                    catch (err) {
                        exports.eventStatus.push([
                            `${c.red(`${eventName}`)}`,
                            `${c.red(`Failed!`)}`,
                            `${c.red(`${err}`)}`,
                        ]);
                    }
                }
            }
        }
    });
}
exports.registerEvents = registerEvents;

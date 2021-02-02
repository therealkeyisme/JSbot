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
const tableConfig = require('../../utils/events/tableConfig');
const { createStream } = require('table');
const database = require('../../database/database');
const { commandStatus, eventStatus } = require('../../utils/events/registry');
module.exports = (client) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`${client.user.tag} has logged in.`);
    database
        .then(() => console.log('Connected to MongoDB.'))
        .catch((err) => console.log(err));
    yield loadTable(commandStatus, 50);
    console.log('\n');
    yield loadTable(eventStatus, 50);
});
function loadTable(arr, interval) {
    let fn, i = 0, stream = createStream(tableConfig);
    return new Promise((resolve, reject) => {
        fn = setInterval(() => {
            if (i === arr.length) {
                clearInterval(fn);
                resolve();
            }
            else {
                stream.write(arr[i]);
                i++;
            }
        }, interval);
    });
}

const tableConfig = require('../../utils/events/tableConfig');
const { createStream, table } = require('table');
const database = require('../../database/database');
const {
    commandStatus,
    eventStatus,
} = require('../../utils/events/registry');

module.exports = async (client) => {
    console.log(`${client.user.tag} has logged in.`);
    database
        .then(() => console.log('Connected to MongoDB.'))
        .catch((err) => console.log(err));
    await loadTable(commandStatus, 50);
    console.log('\n');
    await loadTable(eventStatus, 50);
};
function loadTable(arr, interval) {
    let fn,
        i = 0,
        stream = createStream(tableConfig);
    return new Promise((resolve, reject) => {
        fn = setInterval(() => {
            if (i === arr.length) {
                clearInterval(fn);
                resolve();
            } else {
                stream.write(arr[i]);
                i++;
            }
        }, interval);
    });
}

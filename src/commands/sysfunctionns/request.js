const fs = require('fs');
const { jsonReader } = require('../../utils/jsonreader')

module.exports = {
    run: async(client, message, args, DEVID) => {
        let returnMessage = "We have informed someone of your request. If you are reporting a bug, please see https://github.com/therealkeyisme/JSbot/issues and start a new issue."

        
        let devMessage = "Req/Iss:  ```" + args + "```";
        let devUser = client.users.fetch(DEVID)
            .then(value => {
                value.send(devMessage)
            })
        

        jsonReader('src/data/botdata.json', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                data.requests.push(args);

                fs.writeFile('src/data/botdata.json', JSON.stringify(data, null, 2), err => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        message.channel.send(returnMessage);
                    }
                })
            }
        })  
        // !
    },
    aliases: ['report', 'issue'],
    description: "Makes a request for a feature or reports a bug"
}
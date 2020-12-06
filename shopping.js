const pd = require('node-pandas');

module.exports = {
    run: async(client, message, args) => {
//     let guildId = message.guild.id;
        console.log(args);
//     let items = args.split(', ');
//     let mainCsv = "shopping" + guildId + ".csv";
//     let backupCsv = "backup" + guildId + ".csv";
//     let mainColumns = ['Shopping List'];
//     let backupColumns = ['Shopping List', 'Date and Time of entry'];

//     fs.exists(mainCsv, (exists) => {
//         if (!exists) {
//             let mdf = pd.DataFrame(backupColumns);
//             mdf.to_csv(backupCsv);

//         }
//     })
    },
    aliases: []
}
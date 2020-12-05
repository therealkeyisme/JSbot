module.exports.run = async(client, message, args) => {
    let roleNames = args.split(", ");
    let roleSet = new Set(roleNames);
    let { cache } = message.guild.roles;

    roleSet.forEach(roleName => {
        let role = cache.find(role => role.name.toLowerCase() === roleName.toLowerCase());
        if(role) {
            if(message.member.roles.cache.has(role.id)) {
                message.member.roles.remove(role.id)
                    .then(member => message.channel.send("You were removed from the role"))
                    .catch(err => {
                        console.log(err)
                        message.channel.send("Something went wrong")
                    })
            }
        }
        else {
            message.channel.send("Role not found");
        }
    })
}
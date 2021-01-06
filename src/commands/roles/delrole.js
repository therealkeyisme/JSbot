module.exports = {
    run: async (client, message, args) => {
        let roleNames = args.split(', ');
        let roleSet = new Set(roleNames);
        let { cache } = message.guild.roles;
        message.delete({ timeout: 5000 });
        roleSet.forEach((roleName) => {
            let role = cache.find(
                (role) => role.name.toLowerCase() === roleName.toLowerCase(),
            );
            if (role) {
                if (message.member.roles.cache.has(role.id)) {
                    message.member.roles
                        .remove(role.id)
                        .then((member) =>
                            message.channel.send(
                                'You were removed from the role',
                            ),
                        )
                        .then((message) => message.delete({ timeout: 5000 }))
                        .catch((err) => {
                            throw err;
                        })
                        .catch((err) => {
                            console.log(err);
                            message.channel.send('Something went wrong');
                        });
                }
            } else {
                message.channel
                    .send('Role not found')
                    .then((message) => message.delete({ timeout: 5000 }))
                    .catch((err) => {
                        throw err;
                    });
            }
        });
    },
    aliases: ['roledelete'],
    description: 'Removes a role to a Guild Member',
};

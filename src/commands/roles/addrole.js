const checkPermissionRole = (role) =>
    role.permissions.has('ADMINISTRATOR') ||
    role.permissions.has('KICK_MEMBERS') ||
    role.permissions.has('BAN_MEMBERS') ||
    role.permissions.has('MANAGE_GUILD') ||
    role.permissions.has('MANAGE_CHANNELS');

module.exports = {
    run: async (client, message, args) => {
        // ! Use this for the shopping command
        let roleNames = args.split(', ');
        let roleSet = new Set(roleNames);
        let { cache } = message.guild.roles;
        message.delete({ timeout: 5000 });

        roleSet.forEach((roleName) => {
            let role = cache.find(
                (role) =>
                    role.name.toLowerCase() ===
                    roleName.toLowerCase(),
            );
            if (role) {
                if (message.member.roles.cache.has(role.id)) {
                    message.channel
                        .send('You already have this role')
                        .then((message) =>
                            message.delete({ timeout: 5000 }),
                        )
                        .catch((err) => {
                            throw err;
                        });
                    return;
                }
                if (checkPermissionRole(role)) {
                    message.channel
                        .send('You cannot add yourself to this role')
                        .then((message) =>
                            message.delete({ timeout: 5000 }),
                        )
                        .catch((err) => {
                            throw err;
                        });
                } else {
                    message.member.roles
                        .add(role.id)
                        .then((member) =>
                            message.channel.send(
                                'You were added to the role',
                            ),
                        )
                        .then((message) =>
                            message.delete({ timeout: 5000 }),
                        )
                        .catch((err) => {
                            throw err;
                        })
                        .catch((err) => {
                            console.log(err);
                            message.channel
                                .send('Something went wrong')
                                .then((message) =>
                                    message.delete({ timeout: 5000 }),
                                )
                                .catch((err) => {
                                    throw err;
                                });
                        });
                }
            } else {
                message.channel.send('Role not found');
            }
        });
    },
    aliases: ['roleadd'],
    description: 'adds a role to a Guild Member',
};

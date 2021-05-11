var lang = require('../../src/lang.json'),
    Discord = require('discord.js');

/**
*
* @param {Discord.Client} client
* @param {Discord.Message} message
*/
module.exports = (client, message) => {
    if (message.author.bot || message.content.indexOf(client.prefix) !== 0) return;

    var args = message.content.slice(client.prefix.length).trim().split(/ +/g),
        command = args.shift().toLowerCase(),
        cmd = client.commands.get(command);

    if (!cmd) return;
    if (message.channel.type != "text") return;

    var permissionsMissing = {
        global: {
            user: [],
            client: []
        },
        channel: {
            user: [],
            client: []
        }
    }, missingSomeOne = false;

    for (const optionName of Object.keys(cmd.options.permissions_required)) {
        const permsOption = cmd.options.permissions_required[optionName],
            userPerms = permsOption.user,
            clientPerms = permsOption.client

        switch (optionName) {
            case "global":
                if (clientPerms) for (const perm of clientPerms) if (!message.guild.me.hasPermission(perm)) {
                    missingSomeOne = true;
                    permissionsMissing.global.client.push(perm);
                }
                if (userPerms) for (const perm of userPerms) if (!message.member.guild.me.hasPermission(perm)) {
                    missingSomeOne = true;
                    permissionsMissing.global.user.push(perm);
                }
                break;

            case "channel":
                if (clientPerms) for (const perm of clientPerms) if (!message.guild.me.permissionsIn(message.channel).has(perm)) {
                    missingSomeOne = true;
                    permissionsMissing.channel.client.push(perm);
                }
                if (userPerms) for (const perm of userPerms) if (!message.member.guild.me.permissionsIn(message.channel).has(perm)) {
                    missingSomeOne = true;
                    permissionsMissing.channel.user.push(perm);
                }
                break;
        }
    }

    if (missingSomeOne) {
        var embed = new Discord.MessageEmbed()
            .setTitle('<Erreur de permission/>')
            .setColor('#e534eb')
            .setDescription(`Il semblerait qu'une personne manque de permission dans le serveur \`${message.guild.name}\` !\nVoici la liste des permission(s) manquante(s)`)

        if (permissionsMissing.global.user.length > 0) embed.addField("Dans le serveur pour l'utilisateur", permissionsMissing.global.user);
        if (permissionsMissing.global.client.length > 0) embed.addField('Dans le serveur pour le bot', permissionsMissing.global.client);

        if (permissionsMissing.channel.user.length > 0) embed.addField("Dans le channel pour l'utilisateur", permissionsMissing.channel.user);
        if (permissionsMissing.channel.client.length > 0) embed.addField('Dans le channel pour le bot', permissionsMissing.channel.client);

        message.author.send(embed);
    } else cmd.run(client, message, args, lang, lang.cmds[command]);

}
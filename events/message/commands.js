var lang = require('../../src/lang.json'),
    Discord = require('discord.js');

/**
* @param {Discord.Client} client
* @param {Discord.Message} message
*/
module.exports = async (client, message) => {
    if (message.author.bot || message.content.indexOf(client.prefix) !== 0) return;

    var args = message.content.slice(client.prefix.length).trim().split(/ +/g),
        command = args.shift().toLowerCase(),
        cmd = client.commands.get(command);

    if (!cmd) return;
    if (message.channel.type != "text") return;
    if (cmd.options.channelAllowed && cmd.options.channelAllowed.some(chanAllowed => message.channel.id != chanAllowed)) return;

    var permissionsMissing = {
        global: {
            user: [],
            client: []
        },
        channel: {
            user: [],
            client: []
        }
    }, missingSomePerm = false;

    for (const optionName of Object.keys(cmd.options.permissions_required)) {
        const permsOption = cmd.options.permissions_required[optionName],
            userPerms = permsOption.user,
            clientPerms = permsOption.client

        switch (optionName) {
            case "global":
                if (clientPerms) for (const perm of clientPerms) if (!message.guild.me.hasPermission(perm)) {
                    missingSomePerm = true;
                    permissionsMissing.global.client.push(perm);
                }
                if (userPerms) for (const perm of userPerms) if (!message.member.guild.me.hasPermission(perm)) {
                    missingSomePerm = true;
                    permissionsMissing.global.user.push(perm);
                }
                break;

            case "channel":
                if (clientPerms) for (const perm of clientPerms) if (!message.guild.me.permissionsIn(message.channel).has(perm)) {
                    missingSomePerm = true;
                    permissionsMissing.channel.client.push(perm);
                }
                if (userPerms) for (const perm of userPerms) if (!message.member.guild.me.permissionsIn(message.channel).has(perm)) {
                    missingSomePerm = true;
                    permissionsMissing.channel.user.push(perm);
                }
                break;
        }
    }

    if (missingSomePerm) {
        // Send log to Author of message
        var embedLog = new Discord.MessageEmbed()
            .setAuthor('<Erreur de permission/>', client.user.avatarURL(), null)
            .setColor('#f59e42')
            .setDescription(`Il semblerait qu'une personne manque de permission dans le serveur !\nVoici la liste des permission(s) manquante(s)\n[Message concerné](${message.url})`)

        if (permissionsMissing.global.user.length > 0) embedLog.addField(`- Dans le \`serveur\` pour l'utilisateur`, permissionsMissing.global.user, true);
        if (permissionsMissing.global.client.length > 0) embedLog.addField(`- Dans le \`serveur\` pour le bot`, permissionsMissing.global.client, true);

        if (permissionsMissing.channel.user.length > 0) embedLog.addField(`- Dans \`${message.channel.name}\` pour l'utilisateur`, permissionsMissing.channel.user, true);
        if (permissionsMissing.channel.client.length > 0) embedLog.addField(`- Dans \`${message.channel.name}\` pour le bot`, permissionsMissing.channel.client, true);

        await message.author.send(embedLog);

        // Send log to Owner of guild
        await embedLog.addField('- Utilisateur', `${message.author.tag}\n${message.author.id}`, true)

        await message.guild.owner.send(embedLog);
        return;
    }

    var argCount = 0;

    for (const [arg, param] of Object.entries(cmd.options.usage.args)) {
        args[arg] = args[argCount];

        if (param.required && !args[argCount]) {
            var embed = new Discord.MessageEmbed()
                .setTitle('<Erreur d\'arguments/>')
                .setColor('#fc0303')
                .setDescription(`Il semblerait qu'il manque un argument dans votre commande !\nUtilisation: ${client.prefix}${client.libs.boldText(cmd.options.usage.template, arg)}\n[Message concerné](${message.url})`)
            return message.reply(embed);
        }

        argCount++;
    }
    cmd.run(client, message, args, lang, lang.cmds[command]);

}
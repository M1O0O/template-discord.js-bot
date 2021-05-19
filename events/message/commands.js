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
                if (clientPerms) for (const perm of clientPerms) if (!message.guild.me.hasPermission(perm)) permissionsMissing.global.client.push(perm);
                if (userPerms) for (const perm of userPerms) if (!message.member.guild.me.hasPermission(perm)) permissionsMissing.global.user.push(perm);
                break;

            case "channel":
                if (clientPerms) for (const perm of clientPerms) if (!message.guild.me.permissionsIn(message.channel).has(perm)) permissionsMissing.channel.client.push(perm);
                if (userPerms) for (const perm of userPerms) if (!message.member.guild.me.permissionsIn(message.channel).has(perm)) permissionsMissing.channel.user.push(perm);
                break;
        }
    }

    if (permissionsMissing.global.user.length > 0 || permissionsMissing.global.client.length > 0) missingSomePerm = true;
    if (permissionsMissing.channel.user.length > 0 || permissionsMissing.channel.client.length > 0) missingSomePerm = true;

    if (missingSomePerm) {
        // Send log to Author of message
        var embedLog = new Discord.MessageEmbed()
            .setAuthor('<Erreur de permission/>', client.user.avatarURL(), null)
            .setColor('#f59e42')
            .setDescription(`Il semblerait qu'une personne manque de permission dans le serveur !\nVoici la liste des permission(s) manquante(s)\n[Message concerné](${message.url})`)

        if (permissionsMissing.global.user.length > 0) embedLog.addField(`- Dans le \`serveur\` pour l'utilisateur`, permissionsMissing.global.user, true);
        if (permissionsMissing.global.client.length > 0) embedLog.addField(`- Dans le \`serveur\` pour le bot`, permissionsMissing.global.client, true);

        if (permissionsMissing.channel.user.length > 0) embedLog.addField(`- Dans le channel pour l'utilisateur`, permissionsMissing.channel.user, true);
        if (permissionsMissing.channel.client.length > 0) embedLog.addField(`- Dans le channel pour le bot`, permissionsMissing.channel.client, true);

        await message.author.send(embedLog).catch(err => console.log(`Erreur lors de l'envoie du message des manque de permissions a l'auteur \n${err.message}`));

        // Send log to Owner of guild
        await embedLog.addField('- Utilisateur', `${message.author.tag}\n${message.author.id}`, true)

        await message.guild.owner.send(embedLog).catch(err => console.log(`Erreur lors de l'envoie du message des manque de permissions a l'owner' \n${err.message}`));
        return;
    }

    var argCount = 0;
    var missingArgs = [];

    for (var [arg, param] of Object.entries(cmd.options.usage.args)) {
        args[arg] = args[argCount];
        if (param.required && !args[argCount]) missingArgs.push(arg);
        argCount++;
    }

    if (missingArgs.length > 0) {
        var missingArgsText = `> Utilisation :\n > ${client.prefix}`;

        missingArgsText += `${client.libs.missingArgRequired(client.libs.boldText(cmd.options.usage.template, missingArgs), missingArgs)}`;

        var missingArgEmbed = new Discord.MessageEmbed()
            .setTitle('<Erreur d\'arguments/>')
            .setColor('#fc0303')
            .setDescription(`Il semblerait qu'il manque un/des argument(s) dans votre commande !\n${missingArgsText}\n\n* : Argument obligatoire\n\n[Message concerné](${message.url})`)

        return message.reply(missingArgEmbed);
    }

    cmd.run(client, message, args, lang, lang.cmds[command]);
}
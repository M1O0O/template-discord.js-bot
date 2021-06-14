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
                if (userPerms) for (const perm of userPerms) if (!message.member.hasPermission(perm)) permissionsMissing.global.user.push(perm);
                break;

            case "channel":
                if (clientPerms) for (const perm of clientPerms) if (!message.guild.me.permissionsIn(message.channel).has(perm)) permissionsMissing.channel.client.push(perm);
                if (userPerms) for (const perm of userPerms) if (!message.member.permissionsIn(message.channel).has(perm)) permissionsMissing.channel.user.push(perm);
                break;
        }
    }

    if (permissionsMissing.global.user.length > 0 || permissionsMissing.global.client.length > 0) missingSomePerm = true;
    if (permissionsMissing.channel.user.length > 0 || permissionsMissing.channel.client.length > 0) missingSomePerm = true;

    if (missingSomePerm) {
        // Send log to Author of message
        var langOfThis = lang.default.embed.errorPermissions;

        var embedLog = new Discord.MessageEmbed()
            .setAuthor(langOfThis.title, client.user.avatarURL(), null)
            .setColor(langOfThis.color)
            .setDescription(client.libs.replaceWithObject(langOfThis.description, { "$messageUrl": message.url }))

        if (permissionsMissing.global.user.length > 0) embedLog.addField(langOfThis.Fields.missingGlobalUser, permissionsMissing.global.user, true);
        if (permissionsMissing.global.client.length > 0) embedLog.addField(langOfThis.Fields.missingGlobalClient, permissionsMissing.global.client, true);

        if (permissionsMissing.channel.user.length > 0) embedLog.addField(langOfThis.Fields.missingChannelUser, permissionsMissing.channel.user, true);
        if (permissionsMissing.channel.client.length > 0) embedLog.addField(langOfThis.Fields.missingChannelClient, permissionsMissing.channel.client, true);

        await message.author.send(embedLog).catch(err => console.log(client.libs.replaceWithObject(langOfThis.logs.cannotSendToUser, { "$message": err.message })));

        // Send log to Owner of guild
        await embedLog.addField(`- ${lang.default.user}`, `${message.author.tag}\n${message.author.id}`, true)

        await message.guild.owner.send(embedLog).catch(err => console.log(client.libs.replaceWithObject(langOfThis.logs.cannotSendToUser, { "$message": err.message })));
        return;
    }

    langOfThis = lang.default.embed.errorArgument;

    var argCount = 0;
    var missingArgs = [];

    for (var [arg, param] of Object.entries(cmd.options.usage.args)) {
        args[arg] = args[argCount];
        if (param.required && !args[argCount]) missingArgs.push(arg);
        argCount++;
    }

    if (missingArgs.length > 0) {
        var missingArgsText = `> ${lang.default.user} :\n > ${client.prefix}`;

        missingArgsText += `${client.libs.missingArgRequired(client.libs.boldText(cmd.options.usage.template, missingArgs), missingArgs)}`;

        var missingArgEmbed = new Discord.MessageEmbed()
            .setTitle(langOfThis.title)
            .setColor(langOfThis.color)
            .setDescription(client.libs.replaceWithObject(langOfThis.description, {
                "$text": missingArgsText,
                "$url": message.url
            }));

        return message.reply(missingArgEmbed);
    }

    cmd.run(client, message, args, lang, lang.cmds[command]);
}
